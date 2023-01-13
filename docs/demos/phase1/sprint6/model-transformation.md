# Map Updates

## Stories covered
- [299. Generate tile server layer from file](https://github.com/icipe-official/vectoratlas-software-code/issues/299)
- [300. Update tile server config and reload somehow](https://github.com/icipe-official/vectoratlas-software-code/issues/300)

## Demo

1. Show the blob storage container with a model overlay in it (this demo has to follow on from Andrew's upload demo).
1. Go to the graphql API at http://localhost:3001/graphql and send the query:
    ```
    query {
      postProcessModel(
        modelName: "an_gambiae_map10", 
        displayName: "Anopheles Gambia 10",
        maxValue: 1.0,
        blobLocation: "models/an_gambiae_map/1671455121181_an_gambiae_map.tif"
      ) {
        status
      }
    }
    ```
1. Show the output from the API where the transformation is running, then from the tile server where it reloads.
1. Go to the map and refresh the page to load the new config. Show that the new layer is there and can be turned on.
