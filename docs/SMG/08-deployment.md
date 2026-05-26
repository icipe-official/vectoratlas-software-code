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
