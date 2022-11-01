# Fix displaying lakes and rivers on map

## Stories covered

- [160. Fix the display of lakes on the map](https://github.com/icipe-official/vectoratlas-software-code/issues/160)

## Demo
1. Go to https://vectoratlas.icipe.org/map
1. Show that rivers and lakes appear at the top level of the map
1. Specifically zoom in to Lake Victoria and Lake Malawi to show they are present.
1. Explain that the missing parts were stored as multi-polygons because of the islands inside them, this was just a style rendering issue and by bringing the lakes up in the z order then it was rendered correctly. 