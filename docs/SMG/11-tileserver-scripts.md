# TileServer: Interactive Map Build Scripts

## Before running scripts

Ensure that you have updated permissions so you can run the scripts. In the bash terminal, within the TileServer directory:

```
chmod +x ./installTools.sh
chmod +x ./getMapData.sh
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

You should see that the tippecanoe package will now be set up in the TileServer directory. The relevant .json and .mbt folders should be present within the data folder.
