# GitHub Actions Workflows

This document describes the GitHub Actions workflows configured in `.github/workflows/` for the Vector Atlas project.

## Overview

The project uses a multi-environment deployment strategy with two branches mapped to two GitHub environments:

| Git Branch | GitHub Environment | Deployment Target |
|------------|-------------------|-------------------|
| `test`     | `test`            | Test/Staging      |
| `main`     | `production`      | Production        |

All workflows automatically detect the target environment based on the git branch (for push and pull request events) or allow manual selection via workflow inputs.

---

## Workflow Files

### 1. `pr-ci.yml` - Pull Request CI

**Purpose:** Runs continuous integration checks on pull requests targeting `main` or `test` branches.

**Trigger:**
- Pull request opened or updated targeting `main` or `test` branches

**Behavior:**
- Detects the target environment based on the base branch
- Runs change detection to identify which services (API, UI, OccurrenceGeoJob) have been modified
- For each changed service:
  - Sets up Node.js with appropriate version
  - Installs dependencies with `npm ci`
  - Builds the service
  - Runs linting
- Skips unchanged services to optimize CI time

**Jobs:**
- `set-environment` - Determines environment (test/production) from branch
- `detect-changes` - Identifies changed services using dorny/paths-filter
- `build-occurrencegeojob` - Builds & tests OccurrenceGeoJob (Node 20.x)
- `build-api` - Builds & tests API (Node 22.x)
- `build-ui` - Builds & tests UI (Node 18.x)
- `skip-*` - Skip messages for unchanged services

---

### 2. `docker-build-push.yml` - Docker Build and Push

**Purpose:** Builds Docker images for changed services, pushes them to GitHub Container Registry (ghcr.io), and updates helm values in the configuration repository.

**Triggers:**
- Push to `test` or `main` branches
- Pull request merged to `test` or `main` branches
- Manual workflow dispatch (with optional branch and services parameters)

**Behavior:**
- Detects the target environment based on the branch
- Runs change detection to identify which services have been modified
- For each changed service:
  - Builds Docker image with appropriate tags (`latest` and commit SHA)
  - For UI service: injects `NEXT_PUBLIC_TOKEN_KEY` from secrets
  - Pushes both tags to ghcr.io
- Updates the appropriate helm values file in `icipe-official/VA-Cube-Configs`:
  - **default** → updates `values.yaml` (SHA written as-is)
  - **test** → updates `app/helm-values.yaml` (SHA prefixed with `test-`)
  - **production** → updates `app-prod/helm-values.yaml` (SHA prefixed with `production-`)
- Commits and pushes changes to the `main` branch of VA-Cube-Configs repository

**Jobs:**
- `set-environment` - Determines environment (test/production) from branch
- `detect-changes` - Identifies changed services via git diff
- `api-ci` - CI checks for API service
- `ui-ci` - CI checks for UI service
- `occurrencegeojob-ci` - CI checks for OccurrenceGeoJob service
- `build-and-push` - Builds and pushes Docker images to ghcr.io
- `update-configs` - Updates helm values with new image SHA tags

**Repository Secrets Required:**
- `GITHUB_TOKEN` - Auto-provided by GitHub Actions
- `TOKEN_KEY_UAT` - Token key for UI build
- `REPO_ACCESS_TOKEN` - PAT with write access to VA-Cube-Configs repository

---

### 3. `exportsecretstocluster.yml` - Sync Secrets to K3s

**Purpose:** Manually syncs GitHub secrets to the Kubernetes cluster as a Secret.

**Trigger:**
- Manual workflow dispatch (via GitHub Actions UI)

**Behavior:**
- Requires manual selection of environment: `test` or `production`
- Uses the `NAMESPACE` secret to determine the Kubernetes namespace
- Creates/updates a Kubernetes Secret named `<environment>-secrets`:
  - **test** → creates `test-secrets`
  - **production** → creates `production-secrets`
- All secrets use the original `_UAT` suffix naming convention

**Inputs:**
- `environment` (required, choice: test/production, default: test)

**Repository Secrets Required:**
- `KUBECONFIG_B64` - Base64-encoded kubeconfig for K3s cluster access
- `NAMESPACE` - Kubernetes namespace to deploy secrets to
- All application secrets (AUTH0_*, POSTGRES_*, etc.) with `_UAT` suffix

**Note:** After running this workflow, restart the affected workloads:
```bash
kubectl -n <namespace> rollout restart deploy/<deployment>
```

---

## Environment Mapping Logic

All workflows use the same environment detection logic:

```bash
if [ "$BRANCH_OR_INPUT" = "main" ]; then
  ENV_TARGET="production"
elif [ "$BRANCH_OR_INPUT" = "test" ]; then
  ENV_TARGET="test"
fi
```

### Automatic Detection (pr-ci.yml, docker-build-push.yml)

For workflows triggered by git events (push, pull_request), the environment is determined from `github.ref_name`:

```yaml
- id: determine-env
  run: |
    if [ "${{ github.ref_name }}" = "main" ]; then
      echo "ENV_TARGET=production" >> $GITHUB_OUTPUT
    elif [ "${{ github.ref_name }}" = "test" ]; then
      echo "ENV_TARGET=test" >> $GITHUB_OUTPUT
    fi
```

### Manual Selection (exportsecretstocluster.yml)

For manual workflows, the environment is selected via input:

```yaml
workflow_dispatch:
  inputs:
    environment:
      description: 'Environment to sync secrets for'
      required: true
      default: 'test'
      type: choice
      options:
      - test
      - production
```

---

## Helms Values Update Strategy

The `docker-build-push.yml` workflow updates different helm values files based on the environment, but always pushes to the `main` branch of the `icipe-official/VA-Cube-Configs` repository:

| Environment | Helm Values File | SHA Prefix | Target Branch |
|-------------|------------------|-------------|---------------|
| default     | `values.yaml` | (none) | `main` |
| test        | `app/helm-values.yaml` | `test-` | `main` |
| production  | `app-prod/helm-values.yaml` | `production-` | `main` |

This allows both test and production configurations to coexist in the same repository branch.

---

## Workflow Dependencies

```
┌─────────────────┐     ┌─────────────────────────────┐
│   Pull Request   │────▶│     pr-ci.yml                 │
│   (test/main)    │     │  - Detects changes            │
└─────────────────┘     │  - Runs CI for changed svcs   │
                      └──────────────┬───────────────┘
                                     │
                    ┌────────────────┴────────────────┐
                    │                                 │
┌─────────────────┐ │   ┌─────────────────────────────┐│
│   Merge/Push     │ │   │  docker-build-push.yml        ││
│   (test/main)    │─┼───▶│  - Detects changes            ││
└─────────────────┘ │   │  - Builds & pushes images     ││
                    │   │  - Updates helm values         ││
                    │   └──────────────┬───────────────┘│
                    │                  │                │
                    │     ┌────────────▼────────────┐  │
                    │     │  VA-Cube-Configs repo         │  │
                    │     │  - app/helm-values.yaml      │◀─┘
                    │     │  - app-prod/helm-values.yaml│
                    │     └───────────────────────────┘  
                    │
┌─────────────────┐ │
│  Manual Trigger  │ │   ┌─────────────────────────────┐
│  (GitHub UI)     │─┼───▶│  exportsecretstocluster.yml   │
└─────────────────┘ │   │  - Selects environment         │
                    │   │  - Creates k8s Secret           │
                    │   └─────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────────┐
│                    K3s Cluster                         │
│  - Namespace: ${NAMESPACE}                           │
│  - Secrets: test-secrets, production-secrets         │
└──────────────────────────────────────────────────────┘
```

---

## Maintenance Notes

### Adding a New Service

To add a new service to the CI/CD pipeline:

1. **pr-ci.yml**: Add the service to the `paths-filter` configuration
2. **docker-build-push.yml**:
   - Add the service to the `SERVICES` associative array
   - Add a corresponding CI job (or update existing ones)
   - Add to the `detect-changes` logic

### Rotating Secrets

1. Update the secret in GitHub: Settings → Secrets and variables → Actions
2. For secrets used in the UI: Run `docker-build-push.yml` to rebuild the UI image
3. For Kubernetes secrets: Run `exportsecretstocluster.yml` for the appropriate environment
4. Restart affected workloads

### Environment-Specific Configuration

- Test environment secrets use `_UAT` suffix
- Both test and production workflows use the same secret names
- The `NAMESPACE` secret controls which Kubernetes namespace is used

---

## Troubleshooting

### Workflow Failures

- **Kubernetes connectivity issues**: Verify `KUBECONFIG_B64` secret is valid
- **Permission denied on VA-Cube-Configs**: Verify `REPO_ACCESS_TOKEN` has `contents:write` permission
- **Docker push failures**: Verify `GITHUB_TOKEN` has appropriate permissions

### Common Commands

```bash
# Check workflow runs
gh run list

# View workflow logs
gh run view --log

# Manually trigger workflow
gh workflow run exportsecretstocluster.yml --field environment=production
```

---

## File Locations

- Workflows: `.github/workflows/`
- This documentation: `.github/README.md`
- External config: `icipe-official/VA-Cube-Configs` (separate repository)

---

*Last updated: 2026-07-29*
