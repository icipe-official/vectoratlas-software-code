# Map markers filters

## Stories covered
- [106. Add filters to the map markers API route](https://github.com/icipe-official/vectoratlas-software-code/issues/106)

## Demo
1. Check out the relevant branch (feature/add-filters-api-106 if not merged, main if merged)
1. Start the db server and the api
1. Ensure the test data is loaded into the db, with a manually-linked bionomics and occurrence record
1. Show the following filters:
 - None
 - Country: {country: "Sudan"}
 - Species: {species: "pharoensis"}
 - Date range: {startTimestamp: 657114109000} (<1990), {endTimestamp: 657114109000} (>1990), {startTimestamp: 657114109000, endTimestamp: 751808509000} (1990-1993)
 - Larval data: {isLarval: true}
 - Adult data: {isAdult: true}
 - Control: {control: true}
 - Season: {season: "rainy"}
 - Combined: {country: "Sudan", species: "gambiae", startTimestamp:846502909000} (1996)