# Building lakes data from Open Street Map

The lake data from Natural Earth is incomplete for Africa - the data from OSM is much better but harder to get hold of.

To build a new lake mbtiles file run:
```bash
chmod +x build-lake-data.sh
./build-lake-data.sh
```
Note that querying the OSM data from the overpass API takes a while (about 30 minutes) and produces about 300MB of GeoJSON data.

After running this, copy the new version of `lakes.mbtiles` in to `TileServer/data` so it can be used by the getMapData script.

```bash
cp lakes.mbtiles ../lakes.mbtiles
```

## Explaining the overpass API queries

The queries in `query.ql`, `query2.ql` and `query3.ql` all look for data tagged as `["natural"="water"]` where their boundary is more than 50km long so we only pick up large features.

The overpass API also has resource limits so the three queries cover three south to north rectangular zones over Africa

Eventually we may want to build more features from OSM data in the same way so all of our data comes from there.