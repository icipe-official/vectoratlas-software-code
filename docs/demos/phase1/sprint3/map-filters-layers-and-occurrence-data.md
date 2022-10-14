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

    "I will start off with the most visual story this sprint. We now have markers present on our main map page - and it is a good place to point out that these markers are just placeholders and used only to further development on our end. It is very simple for us to change this out and tailor the user experience to yoru specifications. Currently we have 6 rows or items in our database. As displayed here - with n_sample and location being identified by the random numbers and locations from our dummy data, respectively. Most importantly, we want our users to be able to interact with the site as soon as possible, minimising the hindrance of a slow connection. And so, we are implementing pagination for the loading of our points. In this instance, pagination refers to the loading of our markers in chunks. As I will demonstrate now. To imitate latency I will use a sleep function in how we load the data to artificially slow it down. Currently we are loading 100 points at a timem which is much greater than our current test data - hence, why the load is so fast, given our good connection. But when we artificialy slow this down and change the items per load to say 2. We see how the data loads groups of the number specified - for this demo I am keeping it small to minimise the required test data and for clarity, but as stated it before, in the final build it is more likely to be towards 100. Notice also, that the map reloads each time the marker layer is updated. This is something that will be fixed in future. Again, the whole purpose of this pagination is to benefit our end users with a slow connection to ultimately imporve their performance, and in turn, their experience using Vector Atlas. And this leads me on to my next story..."

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
    "For my second story this sprint, I was required to add an API route to load occurrence data onto the map, and to do so in a paginated fashion - again, in our instance this means loading our markers in chunks. This is important as we wish to ensure that even with a slower connection, when you have data, you can start working with it as soon as it's available.
    
     Site location and sample: n_all were selected as this would put us in a good place to start adding visual markers to the map at the culmination of this story. I will show the result of this work. Using this query in our graphql playground we see that we are able to query data. But not only that, but we can do so in the paginated manner seen in the story prior. Say I want to grab 2 items - I vary the take parameter. If I want more items after that, I need to be aware of what I have already taken. So, we update our skip to 2 - and so we take our next chunk of data. This is what is going on behind the scenes of the map marker demo. We also have access to all our data within the database from these minimal queries. 

     If I open up the docs here, you can see that within our pagination handler object. Maybe I want to include more data in a marker popup - I can easily amend the query here. So tailoring the markers to your needs is not an issue. Furthermore, this highlights why our choice to use GraphQL was so important to the end user. We only request what we need from the database. Packages sent are minimised and performance on slower networks is optimised. Ultimately, providing a richer experience to our end users."

1. On the map page, open up the drawer. Display the functionality when drawer is open. The drop down lists react as expected and show the layers/overlay. When closed with lists still open, the dropdowns are collapsed. When opened by clicking on an individual tab, the drawer opens along with the relevant list. Explain the reasoning for having the drawer push the map as opposed to overlaying. (The primary consideration being the covering of data on the map)

    - "For the final story this sprint, we have the addition of a filter and layers component on the map page. This required that a list of overlays, including those present within the base map, should be queriable from the API. It is configured within the config controller of our API, and so with the apprporiate query we are able to call on these overlays. Navigating to the network tab... We see the API serving up the overlays that we wish to generate. And so, it is straightforward for us to change which overlays are loaded in, according to the selection of the user, and we can serve up the types of layers you would like them to have access to. But how do we handle this information... how do we handle this data? How do we make it interactive?

     If you look to the left of the screen, you will see the map menu. We have gone with a minimal design when minismised so as to allow the map to occupy the majority of the screen - but we have retained the icons  as we still wish for it to be clear to our users. If I click the menu button, you see that the menu slides the map over as opposed to running over it. This decision was made in the interests of avoiding the potential for covering data points. If we extend our investigation of the menu more, we should see that its interaction is intuitive and tidy. Pressing the main menu button will extend the whole drawer and allow us to click the overlay lists below. The design of these lists isn't finalised as we have layer settings to implement. Clicking the menu button again we see the lists collpase neatly back into their icons. And say we are a seasoned user of this page, maybe we want to open one of the section straight away - we navigate to the icon and click. This will open up the drawer and the assosciated section"

1. Add download everything button to the homepage. This is still a work in progress. Don't be switching branches. Explain the steps required for the ticket and approximately where we are in that:
-   Want to have a prebuilt csv of all data
- On ingest, the csv must be updated with the new data
- Pull data from repo and rebuild
- Also, must manage upload/ingest so that these are not occuring during the rebuild, and if they are, then they should be handled accordingly. 

 "Finally, I am currently working on the download all button present on the homepage. It is in state where we can create and download a csv file when clicked. This csv file is created when new data is ingested, so that the users always have access to the most up to date data in a timely fashion, and they don't have to wait for it to build. We handle that behind the scenes whenever more data is added. Triggering the update on ingest still requires a small amount of work; hence, why I don't feel it is in a state to demo effectively. However, it also begs the question of how you would like the data output to look. Should it recreate the ingest file completely or would do you have something else in mind? This is more Andrew's field as he has been in charge of mapping data but I think it is a good time to ask this question...
 
 But with that, I can conclude my demos for this sprint. Thank you" 



