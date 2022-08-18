# Authentication/Authorisation

Date - 15/08/22

## Status
In progress

## Context
The upload pages and the news editing pages need to be secured, it would be good to make it easy for users to log in by using their GitHub or Gmail accounts. This investigation is to determine if we can do that using something like https://www.passportjs.org/ and what the authorisation process might be - they might be able to log in but then there needs to be some process of making them an uploader or news editor. Does this mean we need admin pages for setting roles or would this be done directly in the database?

## Decision
We will use Auth0 to handle the authentication within the Next frontend, using the `@auth0/nextjs-auth0` library, and pass the bearer token to the backend for authorisation against certain endpoints, using passportjs to decode the bearer token.

Auth0 is free to use up to 7000 users, which we are very unlikely to hit.

Auth0 manages all the user data, including roles. We will initially use the manage.auth0.com site to manage users, with a view to adding an admin page for this functionality in the future. We can use the [Auth0 user management](https://auth0.com/docs/api/management/v2#!/Users/post_user_roles) API to do this.

## Consequences
New stories will be added to the board covering implementing the auth workflow.
