# Deployment View

This section details the System architecture from the view-point of its deployment.

* **[Overall approach](#overall-approach)**
* **[Container packaging design](#container-packaging-design)**
* **[Cloud deployment](#cloud-deployment)**
* **[Environment handling](#environment-handling)**

[Return to overview](./01-architecture-overview.md)

## Overall approach

The Vector Atlas is deployed as a set of Docker images running on a Kubernetes cluster ("VA-Cube") hosted by ICIPE. The deployment is driven entirely by **GitOps**: the code in this repository builds images and pushes them to GitHub Container Registry, and a separate configuration repository — [icipe-official/VA-Cube-Configs](https://github.com/icipe-official/VA-Cube-Configs) — holds the Helm `values.yaml` that pins which image tag is deployed for each service. A GitOps controller running in the cluster watches that config repo and reconciles the cluster to match.

There is no manual `ssh` step in the deployment path. Merging to the `test` branch of this repository is what triggers a deployment:

1. The `Build and Push Docker Images` workflow detects which service directories changed in the merge commit (`src/UI`, `src/API`, `src/Help`, `src/TileServer`, `src/Docker/umami`, `src/IngestionAPI`, `src/Docker/nginx`).
2. CI gates run for `api` and `ui` if they changed.
3. Each changed service is built and pushed to `ghcr.io/icipe-official/<service>` with two tags: `:latest` and `:<short-sha>`.
4. The workflow then checks out `VA-Cube-Configs`, rewrites `.images.<service>.tag` in `values.yaml` to the new short SHA for each service it built, and commits to `main` of that repo.
5. The cluster's GitOps controller observes the change and rolls the affected Deployments to the new image tags.

Rollback is therefore also a config change in `VA-Cube-Configs` — re-pinning a service's tag to a prior short SHA causes the controller to roll back, with no code revert required in this repository.

The database and persistent storage live outside the cluster so that pod restarts and image upgrades do not affect data. Map tiles are served from storage attached to the tile server so they can be updated independently of the code.

For developer-facing operational steps (how merging to `test` triggers a deploy, how to manually rebuild a single image via `workflow_dispatch`, and how to roll back), see the [Deployment SMG](../../SMG/08-deployment.md).

## Container packaging design

Containers should make use of [multi-stage builds](https://docs.docker.com/develop/develop-images/multistage-build/) to optimise the final image size as well as reducing security attack vectors in the deployed system.

## Cloud deployment

The system runs on a Kubernetes cluster operated by ICIPE. Image artifacts are pulled from `ghcr.io/icipe-official/*`. The Helm chart and its `values.yaml` (the GitOps source of truth) live in [icipe-official/VA-Cube-Configs](https://github.com/icipe-official/VA-Cube-Configs); the in-cluster GitOps controller reconciles the cluster against the `main` branch of that repo.

The cost analysis below is preserved for historical context — the original investigation compared single-VM and managed-PaaS options before the move to a shared Kubernetes cluster.

### Cost Analysis

The cost analysis of the deployment was done as part of the [deployment investigation](https://github.com/icipe-official/vectoratlas-software-code/issues/45) and is summarised below.

#### Multi-container support
Multi-container support with an individual Azure App Service is possible but still in preview (https://docs.microsoft.com/en-us/azure/app-service/tutorial-multi-container-app) and therefore not recommended without risk at this time. It is potentially a cost effective mechanism at £720/year but this would depend on whether it is used alongside a managed database. Note we wouldn't be able to connect directly to the container stack to take back ups and we'd have to work out what the logging and debugging process would be.

#### Host in Kubernetes
The docker compose stack could be encapsulated within a Kubernetes pod and run as part of a Kubernetes cluster. This would allow compute costs to be shared across many different apps and make the most efficient use of resources. There isn't an existing Kubernetes cluster at either Oxford or ICIPE and so this isn't an option for now - using Kubernetes only works if there are many applications sharing the hardware and the cost.

#### Azure virtual machine with managed database
An Azure virtual machine could be used to host the docker-compose stack, potentially with or without a managed postgres database. A D4a machine with 4 CPUs, 16GB RAM in South Africa North would cost £1850/year (alternatively a D2a v4 would be £940/year if an external database is used). A managed postgres instance with 50GB of data would be £870/year

There is an option to reserve machines for 3 years which significantly reduces the cost, the D4a machine would come down to £720/year and the D2a would be £360/year.

There would also be additional costs around Azure storage for hosting some small amounts of data as well as the costs of public IPs and networking but these should all be minor.

#### Virtual machine within the Oxford data centre
The University of Oxford provides an internal data centre for projects to use where at the moment a 4 CPU, 4GB RAM costs £350/year.

Additionally there is the ability to get 1TB of storage for a one off cost of £350 to the project.

#### Summary:
- Azure app service: £720/year for the VM, £870/year for the database (£1590/year)
- Azure VM and self-hosted DB: £1850/year
- Azure VM with managed DB: £940/year, £870/year for DB (£1810/year)
- 3 yr reserved Azure VM self-hosted DB: £720/year
- 3 yr reserved Azure VM with managed DB: £360/year, £870/year for DB (£1230/year)
- Oxford VM: £350/year + £350

## Environment handling

We build deployment artifacts once and then promote them (subject to passing test gates) through environments to PRODUCTION. In the GitOps model this promotion is the act of writing the same image SHA tag into the corresponding environment's section of `VA-Cube-Configs/values.yaml`.

All services must allow runtime configuration of all dependencies and settings. These are read from environment variables on load (injected by Helm in the cluster), and missing configuration will cause the service to exit with an error and description of its required configuration.

Default values may not be used for any required settings since, whilst convenient, this hides the dependency and may result in silent misconfiguration.
