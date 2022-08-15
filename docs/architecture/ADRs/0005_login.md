# Authentication/Authorisation

Date - 15/08/22

## Status
In progress

## Context
The upload pages and the news editing pages need to be secured, it would be good to make it easy for users to log in by using their GitHub or Gmail accounts. This investigation is to determine if we can do that using something like https://www.passportjs.org/ and what the authorisation process might be - they might be able to log in but then there needs to be some process of making them an uploader or news editor. Does this mean we need admin pages for setting roles or would this be done directly in the database?

## Decision
We will use passport.js to handle the authentication within the Nest backend server, with GitHub/Google as the initial auth providers. It plays nicely with nest, as seen in [this guide](https://docs.nestjs.com/security/authentication). We will have to hash passwords, and will use [bcrypt](https://www.npmjs.com/package/bcrypt) to do so, as it is the industry standard.

We will have a `users` table in the database, storing the username of all users, and a hash of the passwords of users who sign up with email & password. We will also store the role(s) associated with the users, with a set of flags (e.g. `isAdmin`, `isUploader`). User roles will be managed initially directly in the database itself, with a view to adding an admin page or API endpoint for this functionality in the future.

## Consequences
New stories will be added to the board covering implementing the auth workflow.
