# Auth0 Setup

The Vector Atlas system uses Auth0 to manage the login process and store user details. This guide covers setting up the apps within Auth0.

## Setting up the UI auth
1. Navigate to `manage.auth0.com`. You will have to create an account if you don't have one already.
1. Click on the `Create Application` button. Give the application a suitable name (e.g. `vector-atlas-ui`), and select `Regular Web Applications`. Click `Create`.
1. On the `What technology are you using for your project?` page, click on `Next.js`.
1. The application is now created. Navigate to the `Settings` tab. Here you will find the Domain, Client ID and Client Secret, all of which should be used in the `.env.*` files in the UI project.
1. Find the `Application URIs` section of the settings tab. In the `Allowed Callback URLs` box, add the following:
```
http://localhost:3002/api/auth/callback, http://localhost:1234/api/auth/callback, http://localhost:3000/api/auth/callback
```
1. In the `Allowed Logout URLs` box, add the following:
```
http://localhost:3002/, http://localhost:1234/, http://localhost:3000/
```
1. Click `Save Changes` at the bottom of the page.

## Setting up the API auth
1. Navigate to `manage.auth0.com`. You will have to create an account if you don't have one already.
1. Under `Applications` on the left of the screen, click `APIs` and then `Create API`.
1. Give the API a suitable name (e.g. `vector-atlas-api`), and set the Identifier as `https://www.vectoratlas.org`. Click 'Create`.
1. Under the `Quick Start` tab, from the code box, choose `Node.js`. Copy the value of the `issuer` parameter shown.
1. In the API folder in the source code, navigate to the `.envrc` file. Change the `AUTH0_ISSUER_URL` value to be tha copied in the above step.
1. Click on the `Machine To Machine Applications` tab. Make sure that the recently created UI application is authorized here.