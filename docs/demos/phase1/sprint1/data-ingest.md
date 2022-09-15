# Data ingest stories

## Stories covered

- [59. Create intial tables from data model](https://github.com/icipe-official/vectoratlas-software-code/issues/59)
- [60. Load initial data in to new tables from spreadsheetsl](https://github.com/icipe-official/vectoratlas-software-code/issues/60)

# Demo
1. Check out the `demo/sprint1-kita` branch
1. Start whole docker stack as usual
1. Ensure the database is empty
1. Open pgadmin, and show the tables and columns exist in the database
1. Use Postman or equivalent to post the `bionomics.csv` file to the `http://localhost:3001/ingest/uploadBionomics` endpoint
1. Show that the data now exists in the db
1. Change the csv file to remove data for endoExophily (EL onwards). Upload to the same endpoint.
1. Show the second row in the bionomics table. Show that the EndoExophily id is blank, and that the reference/site/species ids are identical to the first record.
