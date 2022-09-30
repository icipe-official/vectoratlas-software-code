# React app stories

## Stories covered
- [63. (Bug) Help Site Navigation](https://github.com/icipe-official/vectoratlas-software-code/issues/63) MAIN
- [66. Update source entity to be more generic](https://github.com/icipe-official/vectoratlas-software-code/issues/66) Either
- [75. Load overlay map in the tile server](https://github.com/icipe-official/vectoratlas-software-code/issues/75) MAIN
- [71. Update docker environment so config files mounted from volume](https://github.com/icipe-official/vectoratlas-software-code/issues/71) MAIN
- [74. Add a filter and layers component to the map](https://github.com/icipe-official/vectoratlas-software-code/issues/74) feature/add-...

## Demo Setup
1. Check out `main`
1. docker compose build. docker compose up
1. Open db tab showing source entity update - citations
1. Open tile server data folder where blobStore and an_gambiae tiles are found
1. Open docker.compose file, and API public folder to highlight mounted files
1. Make sure you have access to an can run feature/add-filter-layers-component-to-map-#74

## Demo

1. To kick off the sprint we had a small bug with our help documentation page. We found that the url simply as "/help", would return a 404. This is not ideal behaviour. It is not consistent with our other pages, and so could cause routing mishaps down the line. Adding a rewrite as part of our nginx config file returned desired behaviour.

1. Navigate to the home page.
1. The docker environment was also updated so that some local configuration files can be changed without necessitating a rebuild - a rebuild that takes time. Change the version.txt file in the API/public folder
1. We have now reached the stage where we are starting to build up our map component. This meant creating another bash script, to live alongside our data and tools scripts, in order to generate the relevant mbtiles depending on the *.tif overlays present in our blob store. Currently we just have an_gambiae.tif - which has been used to generate the overlay we can now see on the map page of our website.
1. Navigate to the map page
1. Show off the overlay. Explain that it is greyscale so that we can style it independently of our colourised .tif file which is used to generate the mbtile. Though this currently requires an investigation as it is not as straightforward as simply applying styles as with vector tile layers.
1. We are also using some javascript to hook into the tile layer overlay component - and from here we able to start interacting with our layers. Firstly, we are able to change the properties of our layer - here we have an initial opacity slider. It won't be in this location in the final version as this is simply for demonstration. We also have a hover interaction with the layer that allows us to cast the rgba values to a data read out. Currently, it is just an arbitrary function as it is simply meant to demonstrate direct mouse interaction with the layer.
1. Now we can move to the updating our database.
1. So as we move onto the penultimate issue, this is just a bit of setup to hopefully smooth the review process for when we look at the final and most recent task - which is still being worked on.
1. Return to VSC. Change branch. Kill docker. docker compose build. Return to review
1. It was also required that we update the database. Previously it relied solely on article title and journal title. We needed to make it more generic by including a source text field to handle unpublished field data. The idea being that we can include this as a list of citations for the user to download. I set the field to be of greater length to reflect the nature of the input.
1. Check build has finished. Docker compose up
1. The final ticket for this sprint was to start adding components to our map page. Accessing the overlays within our API and creating a component for them. I remind you this is not finished. But the idea is that we have this drawer, which will be on the side of this map, which we can pull out to configure our layers. Opacity, colour, toggle on and off etc. And this is not currently wired up - just the interface to present here at the demo
1. And that concludes all the tickets I have completed this sprint


