# React app stories

## Stories covered
- [74. Add a filters and layers component to the map](https://github.com/icipe-official/vectoratlas-software-code/issues/74)
- [98. Add and API route to load occurrence data for the map](https://github.com/icipe-official/vectoratlas-software-code/issues/98)
- [99. Load occurrence data on map](https://github.com/icipe-official/vectoratlas-software-code/issues/99)
- [109. Add download everything button](https://github.com/icipe-official/vectoratlas-software-code/issues/109)

## Demo Setup
1. Check out `demos/sanc-sprint3`
1. Following docker build and up, ensure you are ready to upload occurrence data into the db. Upload at least 2 points for now - more will be uploaded during the demo to show them loading in a paginated fashion. For the purposes of this demo, the stories are best reviewed with 4+ rows. For quick reference:
    -  http://localhost:3001/ingest/uploadOccurrence

    -  Data files found in src/Database/test_data
    -  If you wish to create additional points for this demo. Varying n_all, year_start and location are the fields with the greatest visual effect. Others can remain identical and it will not affect the demo.

1. Locate getOccurrenceData() in the UI/.../mapSlice file. The response value should show 100. For this demo, it is more reasonable to have values of 1 or 2 simply to highlight functionality.
1. Depending on decisions made prior to the demo, you may require a sleep function within the the while loop to imitate latency or implement this is in the browser.

    - const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    - (within loop) await sleep(1500)
1. View the map page on the website and ensure that it responds as expected.
1. Open up the graphql playground on http://localhost:3001/graphql
1. Familiarise yourself with the schema

## Demo
## Load occurrence data on map
1. Finally, view the map page and push some more data into the db via Postman. Refresh the map page and watch the data load on the map in paginated fashion. 

1. In the graphql playground, insert and run this query:

    `query Occurrence {
    OccurrenceData(skip:0, take:2)
    {
    items{
            year_start
            site{
            location
            }
        sample{
            n_all
        }
        }
        total
    }
    }`

    Show the response as evidence that we are accessing the data from the api. Open up the docs tab on the far right, and open up the OccurrenceData(), items: [Occurrence]!, and then either site or sample. Show all the data we can now access and inject into our marker layer with a highlight on Sample and Site. The pagination implementation is to ensure that we are able to display data the moment we have it, so even with a slower connection you should still be able interact with the map as soon as it is loaded (though reloading may require some refinement)

    If presenting to more technical staff it may be worth navigating to the UI/.../map.utils file to show how the incoming data is built into GeoJSON that serves as the source for our marker/point layer.

## Add and API route to load occurrence data for the map
1. On the map page, open up the drawer. Display the functionality when drawer is open. The drop down lists react as expected and show the layers/overlay. When closed with lists still open, the dropdowns are collapsed. When opened by clicking on an individual tab, the drawer opens along with the relevant list. Explain the reasoning for having the drawer push the map as opposed to overlaying. (The primary consideration being the covering of data on the map)

1. Add download everything button to the homepage. This is still a work in progress. Don't be switching branches. Explain the steps required for the ticket and approximately where we are in that:
-   Want to have a prebuilt csv of all data
- On ingest, the csv must be updated with the new data
- Pull data from repo and rebuild
- Also, must manage upload/ingest so that these are not occuring during the rebuild, and if they are, then they should be handled accordingly.
