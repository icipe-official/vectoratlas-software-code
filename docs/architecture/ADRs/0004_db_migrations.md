# Database Migrations

Date - 01/08/22

## Status
In progress

## Context
It is currently unclear what the best process for managing the database migrations is. We should investigate the standard options, are SQL scripts enough? TypeORM also offers a migration method in code but this may be more complicated than needed. Whatever method is chosen it needs to be scriptable to aid automation.

## Decision
It has been decided to use the TypeORM migration method, as it is simple to use and provides the SQL needed to migrate a database.

## Consequences
With the current config, new migrations will be saved in the `src/API/src/db/migrations` folder. When the schema has changed, run `npm run migrations:create <name_of_migration>` to create a new migration in this folder, using an appropriate name. Then run `npm run migrations:runall` to run all migrations on your local database. This will create a `migrations` table in the db, storing a list of all migrations already run on the db.