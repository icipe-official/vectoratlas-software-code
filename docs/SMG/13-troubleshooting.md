# Troubleshooting

## Initial setup

- When first installing and configuring the wsl and the assosciated Linux distributions, avoid using the cmd. Using PowerShell will help you avoid a number of problems during intial setup.

- If you encounter permission problems when running docker on Ubuntu/wsl, you will have to manually add group and user. One would assume it does this automatically but apparently this is a doc issue. For reference: https://github.com/rancher-sandbox/rancher-desktop/issues/1156 - See below:

   ```
   sudo addgroup --system docker
   sudo adduser $USER docker
   newgrp docker
   # And something needs to be done so $USER always runs in group `docker` on the `Ubuntu` WSL
   sudo chown root:docker /var/run/docker.sock
   sudo chmod g+w /var/run/docker.sock
   ```

- If you encounter a node error, such as:

   ```
   node: /lib/x86_64-linux-gnu/libc.so.6: version `GLIBC_2.28' not found (required by node)
   ```

   Refer to the documentation and ensure you are running the correct version of node. For example, my install defaulted to node.js 18.7.0. Refering to the README.md in `~src/API`, you will need Node v16.16.0 and npm v8.11.0 to run this project.

- If you encounter further problems when onboarding, feel free to create a PR to add and amend to this troubleshooting section

## User roles

There are a lot of steps in configuring the auth process. If you are not getting any roles assigned to your user, please check the following:
 - The `user_role` table exists in your database
 - There is a row in this table with your auth0 id, with some roles checked. This id can be retrieved by inspecting the return object of the `/api/auth/me` call in the UI when you are logged in - it is the `sub` property, and will start with `auth0|`
  - The `.env.local` and `.env.production` files in the UI project contain `AUTH0_AUDIENCE='https://www.vectoratlas.org'`
 - The `.env.local` and `.env.production` files in the UI project contain `NEXT_PUBLIC_AUTH_ENDPOINT='http://localhost:3001/auth/token'` and `NEXT_PUBLIC_AUTH_ENDPOINT='http://api:3001/auth/token'` respectively
 - The value of `NEXT_PUBLIC_TOKEN_KEY` in `.env.local` and `.env.production` match the value of `TOKEN_KEY` in the API `.envrc` file for local development, and in the api section of the respective docker-compose file for full stack development.

Once all of these steps have been confirmed, rebuild and run the API and UI projects. You should now be able to see your roles in the redux state of the UI.