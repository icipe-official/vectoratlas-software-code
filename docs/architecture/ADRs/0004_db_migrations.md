# Database Migrations

Date - 01/08/22

## Status
In progress

## Context
It is currently unclear what the best process for managing the database migrations is. We should investigate the standard options, are SQL scripts enough? TypeORM also offers a migration method in code but this may be more complicated than needed. Whatever method is chosen it needs to be scriptable to aid automation.

The two options investigated were raw SQL scripts and TypeORM's migration tool. Postgres does not have any built-in migration tool that I could find.

Raw SQL scripts are the simplest way of handling migrations, but would be hard to track manually, and would involve a lot of overhead in writing both up and down migrations. It would be challenging to ensure that the databases are in-sync with the code, and we would have to manage the db migrations table ourselves.

TypeORM's migration tool seems to be a useful way of migrating - it automatically creates the migration files, with SQL statements for up and down operations. It creates a `migrations` table in the db, where it stores a list of the migrations run on that db, to ensure that migrations are not run twice. This seems to be a more robust way of tracking migrations than doing it ourselves with SQL statements, and it will ensure that the database remains in-sync with the code.

## Decision
It has been decided to use the TypeORM migration method, as it is simple to use and provides the SQL needed to migrate a database.

## Consequences
With the current config, new migrations will be saved in the `src/API/src/db/migrations` folder. When the schema has changed, run `npm run migrations:create <name_of_migration>` to create a new migration in this folder, using an appropriate name. Then run `npm run migrations:runall` to run all migrations on your local database. This will create a `migrations` table in the db, storing a list of all migrations already run on the db.