# PSQL Database

## Migrations
Whenever the TypeORM schema changes in the code, a migration must be created to keep the database in-sync with the schema.

With the current config, new migrations will be saved in the `src/API/src/db/migrations` folder.

When the schema has changed, run `npm run migrations:create <name_of_migration>` to create a new migration in this folder, using an appropriate name.

Then run `npm run migrations:runall` to run all migrations on your local database.

This will create a `migrations` table in the db, storing a list of all migrations already run on the db.

## Data load
There currently exists two endpoints on the API for data ingest:
- `/vector-api/ingest/uploadBionomics` for bionomics data. A file containing test data for this endpoint can be found at `src/Database/test_data/bionomics.csv`
- `/vector-api/ingest/uploadOccurrence` for occurrence data. A file containing test data for this endpoint can be found at `src/Database/test_data/occurrence.csv`

The test data is currently nonsensical, but it should upload. You are welcome to add further data to the csv files if more realistic data is needed.

The csv file should be included in the body of the request, as form-data, with `file` as the key. If using postman, this is the configuration needed:

![postman file upload](./images/PostmanFile.png)

The endpoints are not currently secured, but eventually will be secured against the `uploader` role.

## Connecting to Azure database
It is possible to connect to the Azure database with pgAdmin, following the steps below:
1. Start pgAdmin. Right-click on the `Servers` object and select `Register -> Server...`:
![pgAdmin 1](./images/pgAdmin1.png)
1. Give the server an appropriate name on the `General` tab (e.g. va-azure)
1. In the `Connection` tab, enter `vectoratlas-db.postgres.database.azure.com` as the Host name/address, `dbadmin` as the Username and the password of the dbadmin user as Password (found in a Technical Note in NPD). Ensure `Save password` is checked.
![pgAdmin 2](./images/pgAdmin2.png)
1. In the `SSH Tunnel` tab, check `Use SSH tunneling`. Enter `20.87.47.170` as the `Tunnel host` and `vectoratlasadmin` as the `Username`. Select the `Identity file` Authentication option, and select the .pem file used to connect to the `20.87.47.170` server as the `Identity file`:
![pgAdmin 3](./images/pgAdmin3.png)
1. Click `Save`. The connection should be created.

It is also possible to connect via command line:
1. Run `ssh -i <path-to-pem-file> -L 5432:vectoratlas-db.postgres.database.azure.com:5432 vectoratlasadmin@20.87.47.170 -N` in one terminal
1. In another terminal, run `psql -p 5432 -h localhost -U dbadmin -d postgres`, and enter the password of the dbadmin user.
1. You should now be connected to the azure db.

# Blob Storage
## Connecting to blob store
To connect to the vector atlas blob store, do the following:
1. Download and install the Azure storage explorer (https://azure.microsoft.com/en-us/products/storage/storage-explorer/#overview)
1. On the storage explorer, add a new connection. Select `Storage account or service`, then `Connection string (Key or SAS)` and click `Next`
1. Enter a sensible display name, and paste in the connection string (currently saved in a technical note in NPD). Click Next.
1. You should be able to browse the blob storage account.
