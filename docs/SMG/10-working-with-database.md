# PSQL Database

## Migrations
Whenever the TypeORM schema changes in the code, a migration must be created to keep the database in-sync with the schema.

With the current config, new migrations will be saved in the `src/API/src/db/migrations` folder.

When the schema has changed, run `npm run migrations:create <name_of_migration>` to create a new migration in this folder, using an appropriate name.

Then run `npm run migrations:runall` to run all migrations on your local database.

This will create a `migrations` table in the db, storing a list of all migrations already run on the db.

## Data load
There currently exists two endpoints on the API for data ingest:
- `/vector-api/ingest/uploadBionomics` for bionomics data. The template file for this upload can be found at `src/API/public/templates/bionomics.csv`
- `/vector-api/ingest/uploadOccurrence` for occurrence data. The template file for this upload can be found at `src/API/public/templates/occurrence.csv`

The csv file should be included in the body of the request, as form-data, with `file` as the key. The endpoints are not currently secured, but eventually will be secured against the `uploader` role.
