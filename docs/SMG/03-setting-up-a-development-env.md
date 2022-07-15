# Setting up a development environment

## Code Development

The guide below describes how to work with the Vector Atlas code base - it should be updated and expanded over time so feel free to make changes if inconsistencies are spotted or new development technologies added.

### Setting up a WSL2 environment
All development for MSKS relies on a Linux based environment or at least compatible with bash scripts. On a Windows machine this can be done using WSL2, installation instructions can be found [here](https://docs.microsoft.com/en-us/windows/wsl/install) (if running an older version of Windows 10 then you may still be able to install it using these [manual instructions](https://docs.microsoft.com/en-us/windows/wsl/install-manual))

Current development environments use an Ubuntu 18.04 distribution but there should be no reason a 20.04 won't work either.


### Setting up a Docker environment
The local development environment makes use of Docker containers and uses docker-compose to orchestrate the environment. The easiest way to do this is using Rancher. Instructions for installation can be found [here](https://rancher.com/docs/rancher/v2.5/en/installation/)

### Setting up Direnv

This tool adds environments variables and other things when entering directories (using the `.envrc` files).

- See [direnv](https://direnv.net/)
  ```bash
  sudo apt-get install direnv
  ```
- Add this configuration (or equivalent) to `~/.bashrc` or other favourite shell
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

## Documentation Development

The documentation is all in MarkDown and can be edited in any text editor, some editors (e.g. VS Code) provide better preview support for writing MarkDown.

MarkDown documentation should be treated like any other code and should be written in a branch and a pull request created to merge it back in to the main branch.
