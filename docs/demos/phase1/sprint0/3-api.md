# API stories

## Stories covered

- [3. Create a basic api with Nest.js and GraphQL](https://github.com/icipe-official/vectoratlas-software-code/issues/3)
- [17. Set up a new PostgreSQL database with the PostGIS extension](https://github.com/icipe-official/vectoratlas-software-code/issues/17)
- [18. Configure a basic model for the database and integrate with the API](https://github.com/icipe-official/vectoratlas-software-code/issues/18)

## Demo
1. Check out the `feature/demo/18-08-andrew` branch
1. Navigate to the Docker folder, and run `docker-compose up` (do this before the demo)
1. 3 - Show the API in the docker compose logs. Navigate to `localhost:1234/api/config/featureFlags` to show the api working
1. 17 - Show the db in the docker compose logs. Show the `Starting a local development environment` section of `03-setting-up-a-development-env.md` in the SMG
1. 18 - Navigate to `localhost:1234/api/graphql`. Run the query `{allGeoData {id, location, prevalence, species}}`
