# PSQL Database

## Migrations
Whenever the TypeORM schema changes in the code, a migration must be created to keep the database in-sync with the schema.

With the current config, new migrations will be saved in the `src/API/src/db/migrations` folder.

When the schema has changed, run `npm run migrations:create <name_of_migration>` to create a new migration in this folder, using an appropriate name.

Then run `npm run migrations:runall` to run all migrations on your local database.

This will create a `migrations` table in the db, storing a list of all migrations already run on the db.