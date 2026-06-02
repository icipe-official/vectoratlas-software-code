# Deployment

Vector Atlas is deployed via **GitOps**. There are no manual `ssh` + `docker compose` steps in the normal flow — merging to the `test` branch is what causes a deployment.

The source of truth for what is running in the cluster lives in a separate repository:

- **GitOps config repo:** [icipe-official/VA-Cube-Configs](https://github.com/icipe-official/VA-Cube-Configs)

That repo holds the Helm `values.yaml` with the image tags currently deployed. A GitOps controller running in the cluster watches it and reconciles the cluster to match.

## How a deployment happens

```
merge PR → test branch
        ↓
docker-build-push.yml (this repo)
   - detects which services changed
   - runs API/UI CI on the changed code
   - builds Docker images for the changed services
   - pushes to ghcr.io with two tags: `:latest` and `:<short-sha>`
        ↓
   - checks out icipe-official/VA-Cube-Configs
   - updates `.images.<service>.tag` in `values.yaml` to the new short SHA
   - commits and pushes to `main` of VA-Cube-Configs
        ↓
GitOps controller in the cluster
   - sees the change in VA-Cube-Configs
   - rolls the affected Deployments to the new image tags
```

So in practice:

1. Open a PR against `test`.
2. Once merged, the `Build and Push Docker Images` workflow runs against the merge commit.
3. Only the services whose source directories changed are rebuilt.
4. A bot commit appears in `VA-Cube-Configs` updating image tags.
5. The cluster picks up the new tags and rolls the pods.

You do not need to run any deployment workflow by hand for the regular path.

### Which services are tracked

The workflow detects changes against these source paths and maps them to image names:

| Service       | Source path             | Image name (`ghcr.io/icipe-official/<name>`) |
|---------------|-------------------------|-----------------------------------------------|
| `ui`          | `src/UI`                | `ui`                                          |
| `api`         | `src/API`               | `api`                                         |
| `help`        | `src/Help`              | `help`                                        |
| `tileserver`  | `src/TileServer`        | `tileserver`                                  |
| `umami`       | `src/Docker/umami`      | `umami`                                       |
| `ingestionapi`| `src/IngestionAPI`      | `ingestionapi`                                |
| `nginx`       | `src/Docker/nginx`      | `nginx`                                       |

If a PR only touches `src/UI`, only the `ui` image is rebuilt and only `images.ui.tag` is updated in `VA-Cube-Configs/values.yaml`.

### Where to watch a deployment

- **Build/push:** Actions tab → `Build and Push Docker Images` run for the merge commit.
- **Config update:** the bot commit in `icipe-official/VA-Cube-Configs` (commit message `chore(deps): Update image tags to latest SHAs`).
- **Cluster rollout:** the GitOps controller's UI/CLI in the cluster.

## Building an individual image manually

If you need to rebuild and push one or more images without merging code (for example to roll forward a service that was skipped, or to retag), use the workflow's manual trigger.

1. Go to the **Actions** tab in `icipe-official/vectoratlas-software-code`.
2. Pick **Build and Push Docker Images** in the left column.
3. Click **Run workflow** on the right.
4. Fill in the inputs:
   - **Branch to check for changes** — usually `test`. The workflow runs against this branch's HEAD.
   - **Services** — comma-separated list from `ui,api,help,tileserver,umami,ingestionapi,nginx`, or `all` to build everything.
5. Click **Run workflow**.

Behaviour notes for the manual run:

- The CI gates (`api-ci`, `ui-ci`) only run if `api` or `ui` is in the selected services or you chose `all`. Other services skip CI.
- The build job ignores the change-detection step and builds exactly what you asked for.
- Each built image is tagged `:latest` and `:<short-sha>` of the selected branch's HEAD.
- After the build job, the `update-configs` job will rewrite `images.<service>.tag` in `VA-Cube-Configs/values.yaml` for each service it built, then commit and push. Selecting `all` will therefore re-pin every tag to the same SHA.
- **Do not** run a manual build off a feature branch and expect the cluster to pull it unless you also intend the resulting `values.yaml` commit in `VA-Cube-Configs` to be deployed.

### Building a single service: example

To rebuild only the API:

- Branch: `test`
- Services: `api`

To rebuild UI and ingestion API together:

- Branch: `test`
- Services: `ui,ingestionapi`

To force a full rebuild and re-pin everything:

- Branch: `test`
- Services: `all`

## Rolling back

Because the deployed tags live in `VA-Cube-Configs/values.yaml`, a rollback is a config change in that repo:

1. Open `icipe-official/VA-Cube-Configs`.
2. Edit `values.yaml` and set `.images.<service>.tag` to the previous known-good short SHA. The image must already exist in `ghcr.io/icipe-official/<service>` at that tag — list the package's tags on GHCR if you need to look it up.
3. Commit to `main` (PR or direct, per that repo's policy).
4. The GitOps controller will reconcile the cluster to the older image.

Code does not need to be reverted in this repo for a rollback — the SHA pin is sufficient.

## Database migrations

Migrations are baked into the API image and run on container start in the deployed environment, so they ride along with a normal `api` deploy.

If a migration ever needs to be applied out-of-band (in `src/API/src/db/migrations`), exec into the API pod and run:

```
npm run migrations:runallprod
```

The pod already has the right `POSTGRES_*` environment variables wired in by Helm, so no extra env is needed when running it from inside.

## Managing the test/UAT secrets

The merge-to-`test` pipeline depends on GitHub Actions secrets stored on this repository. There are two workflows that read them:

- **`.github/workflows/docker-build-push.yml`** — runs automatically on merge to `test`. Builds images and updates `VA-Cube-Configs`.
- **`.github/workflows/exportsecretstocluster.yml`** — manual (`workflow_dispatch`). Syncs the UAT secret bundle into the K3s cluster as the `uat-secrets` Kubernetes Secret, which the deployed pods mount.

A new secret value (e.g. rotated Auth0 client secret, rotated DB password) only reaches the cluster after `exportsecretstocluster.yml` is re-run. Updating the GitHub secret alone is not enough.

### Where to edit them

1. Go to `icipe-official/vectoratlas-software-code` → **Settings** → **Secrets and variables** → **Actions**.
2. Find the secret under **Repository secrets** and click **Update**, or click **New repository secret** to add one.
3. Paste the new value and save. Values are write-only — GitHub will not show the existing value.

You need the **Admin** role on the repository to edit secrets.

### After updating a secret

| Secret used by | What to do next |
|----------------|-----------------|
| `docker-build-push.yml` only (`TOKEN_KEY_UAT`, `REPO_ACCESS_TOKEN`) | Re-run the workflow against `test` (manual dispatch with `services: all`, or merge an empty commit). The new value is baked into the next image build. |
| `exportsecretstocluster.yml` (all `*_UAT` secrets, `KUBECONFIG_B64`) | Go to **Actions** → **Sync Prod Secrets to K3s** → **Run workflow**. Then restart the affected pods so they pick up the new Secret values (`kubectl -n vectoratlas rollout restart deploy/<name>`). |

### Secrets consumed by `docker-build-push.yml`

| Secret | Purpose |
|--------|---------|
| `GITHUB_TOKEN` | Provided automatically by Actions. Used to push images to `ghcr.io`. Do not set manually. |
| `TOKEN_KEY_UAT` | Baked into the `ui` image as `NEXT_PUBLIC_TOKEN_KEY` at build time. Rotating this requires a UI rebuild. |
| `REPO_ACCESS_TOKEN` | Personal access token with `contents:write` on `icipe-official/VA-Cube-Configs`. Used by the `update-configs` job to push the new image-tag commit. Rotate from the PAT owner's GitHub account; the token must not expire mid-pipeline. |

### Secrets consumed by `exportsecretstocluster.yml`

These all land in the `uat-secrets` Kubernetes Secret in the `vectoratlas` namespace. The names below are the GitHub secret names; the Kubernetes keys use the `_UAT` suffix shown.

| Secret | Used for |
|--------|----------|
| `KUBECONFIG_B64` | Base64-encoded kubeconfig the workflow uses to reach the K3s API server. Rotate when the cluster's serving cert or the service-account token used in the kubeconfig is regenerated. |
| `ANALYTICS_ADMIN_PASSWORD_UAT` | Umami analytics admin password. |
| `AUTH0_AUDIENCE`, `AUTH0_BASE_URL`, `AUTH0_CLIENT_ID_UAT`, `AUTH0_CLIENT_ID_API_UAT`, `AUTH0_CLIENT_SECRET_UAT`, `AUTH0_CLIENT_SECRET_API_UAT`, `AUTH0_ISSUER_BASE_URL_UAT`, `AUTH0_ISSUER_URL_UAT`, `AUTH0_ISSUER_URL_API_UAT`, `AUTH0_SECRET_UAT` | Auth0 tenant config for UI (`*_UAT`) and API (`*_API_UAT`). Note `AUTH0_AUDIENCE`/`AUTH0_BASE_URL` are stored without the `_UAT` suffix in the repo but mapped to the `_UAT` keys at sync time. |
| `AZURE_STORAGE_CONNECTION_STRING_UAT` | Azure blob storage for uploads / file storage. |
| `BASE_URL_UAT` | Public base URL of the UAT site, used by API for absolute links. |
| `POSTGRES_DB_UAT`, `POSTGRES_HOST_UAT`, `POSTGRES_PORT_UAT`, `POSTGRES_USER_UAT`, `POSTGRES_PASSWORD_UAT` | Primary database connection. |
| `DATABASE_URL_ANALYTICS_UAT` | Connection string for the analytics (Umami) database. |
| `DATACITE_URL_UAT`, `DATACITE_PREFIX_UAT`, `DATACITE_USER_UAT`, `DATACITE_PASSWORD_UAT`, `DOI_PUBLISHER_UAT`, `DOI_RESOLVER_BASE_URL`, `DOI_ENVIRONMENT_UAT` | DataCite / DOI minting credentials and config. `DOI_RESOLVER_BASE_URL` is stored without `_UAT` and mapped at sync time. |
| `DATA_INGESTION_URL_UAT`, `DATA_VALIDATION_URL_UAT` | Internal service URLs the API calls. |
| `EMAIL_HOST_UAT`, `EMAIL_PORT_UAT`, `EMAIL_FROM_UAT`, `EMAIL_PASSWORD_UAT`, `EMAIL_SECURE_UAT`, `IMAP_HOST` → `IMAP_SERVER_UAT`, `IMAP_PORT_UAT`, `SENT_EMAIL_FOLDER_UAT` | SMTP/IMAP credentials for outbound email and the sent-mail mirror. |
| `DEPLOYMENT_SERVER_UAT`, `SSH_USER_UAT`, `SSH_PRIVATE_KEY_UAT` | SSH credentials for the legacy VM `deploy.yml` path. Still synced into the cluster for any pod that shells out. |
| `TEMP_DIR_UAT` | Temp directory path used by the ingestion API on disk. |
| `TOKEN_KEY_UAT` | JWT signing key. Also baked into the UI image at build time — see `docker-build-push.yml` above. |
| `FILE_STORAGE_TYPE_UAT` | Selects between blob/disk storage backend in the API. |

If you add a new entry to the workflow's `env:` block and to the `kubectl create secret generic` command, also add a row here so the next operator knows what it controls.

### Rotation checklist

When rotating a credential that lives in `uat-secrets`:

1. Update the value in the upstream system (Auth0 dashboard, Azure portal, DB user, etc.).
2. Update the matching GitHub repository secret (Settings → Secrets and variables → Actions).
3. Manually dispatch **Sync Prod Secrets to K3s**.
4. Restart pods that read the rotated key:
   ```
   kubectl -n vectoratlas rollout restart deploy/<deployment>
   ```
   For an Auth0 or DB credential, restart `api` and `ui`. For email credentials, restart the services that send mail.
5. Verify the rollout: `kubectl -n vectoratlas get pods -w` until all are `Running` and `READY`.

If the rotation also requires a code/image change (e.g. `TOKEN_KEY_UAT` change), trigger **Build and Push Docker Images** with `services: ui` after step 2 so the new key is baked in, then continue with step 3.

## What changed from the old VM-based flow

Earlier versions of this guide described an SSH-based deployment (`Deploy Vector Atlas to test environment`) that ran `docker compose` on a single VM, plus a one-off `First time set up for a new environment` walkthrough for that VM. That flow is **no longer the deployment path** — it is preserved below for historical reference only and should not be used for routine deploys.

---

## Legacy / historical: VM-based deployment

> The sections below describe the original single-VM, `docker compose` deployment. Kept for historical context only. The cluster-based GitOps flow above supersedes it.

### Logging into the base machine

You will need to get access to the certificate file for ssh access to the test machine. With that then you can ssh to the machine from a WSL terminal (you may also need to remove permissions on the certificate file with `chmod og-rwx {certificate file name}`) using the following:
```
ssh -i {certificate pem file here} vectoratlasadmin@20.87.47.170
```

The certificate and other credentials are stored in the Hybrid Intelligence Notes Project Database under technical notes for the project. ICIPE ICT also maintains access to the system.

### Manually updating the system
If a deployment is more complex than is possible with the automated deployment then log into the virtual machine and run:
```
cd ~/vector-atlas/vectoratlas-software-code/src/Docker
docker-compose down
git fetch
git checkout --force [sha of the desired commit]

cd ..
chmod +x buildVersionFiles.sh
./buildVersionFiles.sh

cd Docker
docker-compose build
docker-compose up --detach
```

#### Running database migrations on a VM
```
docker run -it -e POSTGRES_USER=$VA_DB_USER -e POSTGRES_PASSWORD=$VA_DB_PASSWORD -e POSTGRES_HOST=vectoratlas-db.postgres.database.azure.com -e POSTGRES_DB=postgres -e DB_ENCRYPT_CONNECTION=true docker-api npm run migrations:runallprod
```

### First time set up for a new VM environment
#### Configuring the base machine
Once logged into a new virtual machine some basic software for the environment needs to be installed. These include git:
```
sudo apt install git
```
and docker:
```
sudo apt update
sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
apt-cache policy docker-ce
sudo apt install docker-ce
sudo systemctl status docker
sudo usermod -aG docker ${USER}
```
Full guide here
https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04

Log out and in again to apply groups.

Install docker compose
```
sudo curl -L "https://github.com/docker/compose/releases/download/v2.11.0/docker-compose-linux-x86_64" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```
Check for a later release here https://github.com/docker/compose/releases - we are currently using 2.11.0.


#### Clone the repo
```
mkdir vector-atlas
cd vector-atlas
git clone https://github.com/icipe-official/vectoratlas-software-code.git
cd vectoratlas-software-code/
```

#### Initialising the database
From the Vector Atlas virtual machine, run:
```
sudo apt install postgresql postgresql-contrib postgis
cd ~/vector-atlas/vectoratlas-software-code/src/Database
psql -U [admin users] -d postgres -h vectoratlas-db.postgres.database.azure.com -a -f init_db.sql
```
Then enter the admin user password when prompted to run the script.

#### Set up the tile server
```
cd ~/vector-atlas/vectoratlas-software-code/src/TileServer
chmod +x installTools.sh
chmod +x getMapData.sh
chmod +x generateTiles.sh
sudo ./installTools.sh
./getMapData.sh

cd data/
mkdir blobStore
cd blobStore/
wget https://github.com/icipe-official/vectoratlas-software-code/files/9478888/an_gambiae_map.zip
unzip an_gambiae_map.zip
rm -rf an_gambiae_map.zip
cd ../..
./generateTiles.sh
```

#### Adding the version numbers
```
cd ~/vector-atlas/vectoratlas-software-code/src
chmod +x buildVersionFiles.sh
./buildVersionFiles.sh
```

#### Generating the token key
```
cd ~/vector-atlas/vectoratlas-software-code/src
chmod +x generateTokenKey.sh
./generateTokenKey.sh
```

#### Adding the configuration
```
cd ~/vector-atlas/vectoratlas-software-code/src/UI
cp .env.production.template .env.production
```
Then the `.env.production` files needs to be edited to insert the Auth0 secrets.

Secondly edit the `~/.bashrc` file to add additional environment variables at the end. Insert the lines:
```
export VA_DB_USER=[db user here]
export VA_DB_PASSWORD=[db password here]
export AZURE_STORAGE_CONNECTION_STRING=[blob storage connection string here]
```
Also configure the token secret with:
```
key=`head -c 20 /dev/random | base64`
echo "export VA_TOKEN_SECRET=\"$key\"" >> ~/.bashrc
```
then run `source ~/.bashrc` to load the changes or log out and in again (both will reload the contents of the file).

Create a folder in `/etc` for the API config and copy the config files in.
```
mkdir -p /etc/vector-atlas/api
cp ~/vector-atlas/vectoratlas-software-code/src/API/public/*.json /etc/vector-atlas/api
```
then edit any flags or settings that are different in the environment.

#### Start the system
```
cd ~/vector-atlas/vectoratlas-software-code/src/Docker
docker-compose build
docker-compose up --detach
```

#### Setting up certificates

Install nginx
```
sudo apt install nginx
sudo systemctl start nginx
```
Then edit `/etc/nginx/sites-available/default` to replace the sections:
```
location / {
    # First attempt to serve request as file, then
    # as directory, then fall back to displaying a 404.
    try_files $uri $uri/ =404;
}
```
with
```
location / {
    proxy_set_header x-original-ip $remote_addr;
    proxy_pass http://127.0.0.1:3000;
}
```
> Note that the `x-original-ip` header is needed for country usage statistics in Umami.

Install and run certbot to create and update the configuration of the nginx server to use ssl.
```
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
sudo certbot --nginx
```

Certificates are stored here
```
/etc/letsencrypt/live/vectoratlas.icipe.org/fullchain.pem
/etc/letsencrypt/live/vectoratlas.icipe.org/privkey.pem
```

#### Setting up analytics
These are the steps to set up analytics:
1. Navigate to `http://vectoratlas.icipe.org/analytics`, and log in to the server with the username `admin` and password `umami`
1. Once logged in, click on `Settings` then `Accounts`. Edit the admin account and change the password to something sensible, making a note of it somewhere secure.
1. Click on `Websites` under `Settings`. This should display the `You don't have any websites configured` message. Click on `Add website`.
1. In the dialog box, enter `vector-atlas` as the name and `vectoratlas.icipe.org` as the domain. Click on `Save`.
1. The new website should be displayed on the screen. Click the `</>` icon and copy the `data-website-id` and `src` parameters.
1. Navigate to the UI code, and paste the `data-website-id` as the `NEXT_PUBLIC_ANALYTICS_ID` in both `.env.local` and `.env.production`. Paste the `src` value as `NEXT_PUBLIC_ANALYTICS_URL` in these files too.
1. Navigate to the Docker folder, and run the following to restart the ui container:
```
docker compose stop ui
docker compose build ui
docker compose up ui
```
1. Once the UI is running again, navigate to the UI homepage. This visit should appear in the dashboard of the analytics site.
