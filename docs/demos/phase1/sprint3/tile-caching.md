# Improving map performance

## Stories covered

- [#111 Add tile caching to improve performance](https://github.com/icipe-official/vectoratlas-software-code/issues/111)

## Demo
1. Demonstrate the UI changes by showing the example from OpenLayers here https://openlayers.org/en/latest/examples/preload.html
1. Explain how it's difficult to show that on ours as we've already deployed the fix.
1. Run the full test stack locally.
1. Explain how we've also added browser side caching. Open the dev tools and show the map tiles being loaded from the browser cache - it will say `(disk cache)`.
1. Also show the cache control header with an expiry of 1 hour.
   ```
   Cache-Control: max-age=3600
   ```
1. Secondly, describe how we've added caching to the tile server by caching files in the nginx layer.
1. Open the dev tools and go to the network tab, disable the cache to force it to reload in the browser.
1. Show the cache header for the map tiles - a lot of them will initially be either a `MISS` or `EXPIRED`
   ```
   X-Cache-Status: EXPIRED
   ```
1. Refresh the page and show that the cache header is a hit.
1. Explain how this doesn't necessarily speed up the load for an individual but instead for other calls - the tile server isn't having to recalculated the tiles each time.
1. Show the logs for the system and point to the fact they are all for the `nginx-proxy` rather than going to the `tileserver`. This shows it's being cached by the nginx layer.