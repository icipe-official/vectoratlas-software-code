# PostgreSQL database

## Introduction

This project contains code to run the PostgreSQL database, which contains the data for the Vector Atlas project.

## Getting started

To install PostgreSQL on Ubuntu 18.04, run the following:
```
sudo apt update
sudo apt install postgresql postgresql-contrib
```

To then start the PostgreSQL service, run
```
sudo service postgresql start
```

To connect to the service, run
```
sudo -u postgres psql
```

This will log you into the PostgreSQL prompt, and from here you are free to interact with the database management system right away.

To set the database up for local development, first run in the PostgreSQL prompt:

```
CREATE DATABASE vector_atlas;
GRANT ALL PRIVILEGES ON DATABASE vector_atlas TO postgres;
```

Exit out of the PostgreSQL prompt with
```
\q
```

and then run the [mva_dump.sql](./mva_dump.sql) SQL file with:
```
sudo su - postgres
cd {to database folder of this repo}
psql -U postgres -d vector_atlas -a -f mva_dump.sql
```

That should initialise the vector_atlas database, and insert some dummy data for local development.
