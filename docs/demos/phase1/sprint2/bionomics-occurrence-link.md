# Bionomics Occurrence link

## Stories covered

- [76. Link Bionomics and Occurrence entities in db](https://github.com/icipe-official/vectoratlas-software-code/issues/76)

# Demo
1. Check out the `feature/add-roles-68` branch
1. Start the local environment with the `docker-compose.dev.yml` file
1. Clear the local db using the `clear_tables.sql` script
1. Start the api
1. Upload a single row of bionomics data from the csv in this folder - `bionomics.csv` - to the uploadBionomics endpoint
1. Show the bionomics row in the db
1. Upload the `occurence.csv` file to the uploadOccurrence endpoint
1. Show the two occurrence rows in the db, one being linked to a bionomics row