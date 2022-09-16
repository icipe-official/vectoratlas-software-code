# TileServer: Interactive Map Build Scripts

## Before running scripts

Ensure that you have updated permissions so you can run the scripts. In the bash terminal, within the TileServer directory:

```
chmod +x ./installTools.sh
chmod +x ./getMapData.sh
chmod +x ./generateTiles.sh
```
## Order

Again, using the bash terminal in the TileServer folder, first run installTools.sh to download and install the packages required for getMapData.sh:

```
sudo ./installTools.sh
```

followed by:

```
./getMapData.sh
```

You should see that the tippecanoe package will now be set up in the TileServer directory. The relevant .mbt files should be present within the data/geojson folder.

Now, in the TileServer/data/ directory, add a folder named "blobStore" - this is temporary until our final blob storage
solution is up and running. Within this blobStore folder, insert the an_gambiae_map.tif file. This can be found [here](https://github.com/icipe-official/vectoratlas-software-code/files/9478888/an_gambiae_map.zip).

Finally, run:
```
./generateTiles.sh
```
This will convert all .tif files in the blobStore into mbtiles and store them in the TileSever/overlays directory. Check that these are present.