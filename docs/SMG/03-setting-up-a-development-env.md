# Setting up a development environment

## Code Development

The guide below describes how to work with the Vector Atlas code base - it should be updated and expanded over time so feel free to make changes if inconsistencies are spotted or new development technologies added.

### Setting up a WSL2 environment

All development for Vector Atlas relies on a Linux based environment or at least compatible with bash scripts. On a Windows machine this can be done using WSL2, installation instructions can be found [here](https://docs.microsoft.com/en-us/windows/wsl/install) (if running an older version of Windows 10 then you may still be able to install it using these [manual instructions](https://docs.microsoft.com/en-us/windows/wsl/install-manual))

Current development environments use an Ubuntu 18.04 distribution but there should be no reason a 20.04 won't work either.

### Setting up data files for tileserver
In order to generate the required map, you must have the required data stored locally. Please follow the steps as laid out in the SMG under the 11-tileserver-scripts.md. section

### Setting the .env files in the UI project
Running the UI project depends on the existance of `.env` files at the root of the `UI` folder - `.env.local` for local development, and `.env.production` for docker.

To create these files, copy the existing `.env.local.template` and `.env.production.template` files and rename to remove the `.production` suffixes. There are three secret values present in these files - the `<auth0-secret>` and `<auth0-client-secret>` and `<token-key>`. The auth0 values will have to be replaced with the real secret values, and the `<token-key>` value will be replaced by the generateTokenKey script.

### Generating the token key

To generate the token key for UI-API communication, navigate to the `src` folder and run
```
./generateTokenKey.sh
```
This will replace the `<token-key>` values in the UI and API env files.

### Setting up a Docker environment

The local development environment makes use of Docker containers and uses docker-compose to orchestrate the environment. The easiest way to do this is using Rancher. Instructions for installation can be found [here](https://rancher.com/docs/rancher/v2.5/en/installation/).

In order to pull images, you will also need a docker account in order to login. This can be done here https://hub.docker.com/. Following account creation you should login from the bash terminal

```
docker login
```

To run the whole system with docker, first build the version files by navigating to the `src` folder and running
```
./buildVersionFiles.sh
```
then navigate to the [Docker folder](/src/Docker/) in WSL, with Rancher running. Run

```
docker-compose up
```

and navigate to `http://localhost:1234` in the browser. This should start the Vector Atlas UI, which should be connected to a running API and db.

### Setting up Direnv

This tool adds environments variables and other things when entering directories (using the `.envrc` files).

- See [direnv](https://direnv.net/)
  ```bash
  sudo apt-get install direnv
  ```
- Add this configuration (or equivalent) to the `~/.bashrc` file. For example,`\\wsl$\Ubuntu-18.04\home\user\.bashrc`. Ensure a blank line remains at the bottom of this file. If this code block is not added then you will receive db authentication errors.

  ```bash
  eval "$(direnv hook bash)"

  ```

- You'll be prompted to type `direnv allow` when you navigate to directories that need to
  apply `direnv` config. Do it.

### Setting up a node development environment

Install the node version manager (NVM) first, instructions [here](https://github.com/nvm-sh/nvm) but should be something along the lines of:

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

Then install the current stable version of node (17.6.0 at the time of writing):

```
nvm install stable
```

Activate this version, note this will have to be done each time you start a terminal unless you configure the default version to start:

```
nvm use stable
```

### Working with a JavaScript service

Both the API and UI are JavaScript-based services. On initial start up you will need to navigate into the folder that contains the `package.json` file with a bash terminal and run:

```
npm install
```

and this will install all the dependencies needed for that service. It's important that the `node_modules` folder is gitignored because there are thousands of files that do not need to be tracked. The only files that should be checked in should be the `package.json` file and the `package-lock.json` file.

The services usually have the follow targets that can be used with the command `npm run {target}`:

- `start:dev`: used to start a local instance of the service, possibly with local data being loaded and configured to use a local environment. This should live update with changes to the code.
- `start`: start a local instance of the service but can be potentially directed to cloud infrastructure.
- `build`: build a production version of the service
- `lint`: run the static code analysis linting on the code for this service.
- `lint:fix`: run the linter but also fix anything the linter is able to automatically.
- `test`: run and watch the unit tests
- `test:ci`: run the tests with coverage as they would be done on the build server as part of continuous integration.

### Starting a local development environment

This is the suggested approach for local development.

The local development environment starts a database within a container to provide isolation.

1. Ensure direnv is set up, this will load environment variables needed. Ensure Docker is installed and running too.
1. Run the database from the `src/Docker` folder with:
   ```
   docker-compose -f docker-compose.dev.yml up
   ```
1. If you need to you can connect to the database locally using pgAdmin then use the connection details `127.0.0.1` and port 5432 with the credentials specified in the development docker-compose file.
1. From the `src/API` folder run
   ```
   npm run start:dev
   ```
   to start the API.
1. From the `src/UI` folder run
   ```
   npm run start:dev
   ```
   to start the web app.

## Documentation Development

The documentation is all in MarkDown and can be edited in any text editor, some editors (e.g. VS Code) provide better preview support for writing MarkDown.

MarkDown documentation should be treated like any other code and should be written in a branch and a pull request created to merge it back in to the main branch.
