# Colouring map layers and various fixes

## Stories covered
- [160. Fix the display of lakes](https://github.com/icipe-official/vectoratlas-software-code/issues/160)
- Fix map flickering on data load
- Fix layer toggles not remembering state
- [88. Investigate the best method to incorporate colour styling in overlay maps](https://github.com/icipe-official/vectoratlas-software-code/issues/88)
- [167. Allow users to change the opacity and colour of layers](https://github.com/icipe-official/vectoratlas-software-code/issues/167)
- Added the latest news item.

## Demo
1. Go to https://vectoratlas.icipe.org/map
1. Zoom in on the missing lakes around lake Malawi.
1. Describe how the data is missing from Natural Earth data, I had to download 300MB of lake data for Africa from the Open Street Map Overpass API and then process it through tippecanoe to reduce the size.
1. Also describe that there are some missing wetlands which are gaps in the overlay map.
1. Describe the issue where the map would flicker every time the data updated, show it doesn't now.
1. Layer toggle states weren't remembered, show they are now when you open and close the drawer.
1. Show changing the colours of each layer. Describe how the raster layer is harder as you have to change the pixel renderer so it's transforming the whole layer at once (this is why is chops parts off). We can potentially make it more responsive with fixed colour maps and pre-rendering the tiles on the server but we'd have to create all of these colour maps for each overlay.
