# User roles

## Stories covered

- [68. Add roles to the system](https://github.com/icipe-official/vectoratlas-software-code/issues/68)

# Demo
1. Check out the `feature/add-roles-68` branch
1. Start the local environment with the `docker-compose.dev.yml` file
1. Start the API and UI as normal
1. Ensure there is a record in the user_role db table with your auth0 id and a few roles set
1. Log in in the UI
1. Show the devtools, showing the redux store and the roles listed in the auth slice
1. Change the roles in the db table
1. Reload the UI, show the changed roles in the store
1. Delete your row from the db table
1. Reload the UI, show the store