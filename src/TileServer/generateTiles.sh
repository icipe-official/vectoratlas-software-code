get_mbtiles () {
    gdaldem color-relief $1.tif ../colormap.txt ../overlays/$1_colorized.tif -alpha
    cd ../overlays
    gdal_translate -of MBTiles -ot Byte $1_colorized.tif $1.mbtiles
    gdaladdo -r nearest $1.mbtiles 2 4 8 16 32
    rm -r $1_colorized.tif
    cd ../../
}

cd ./data/blobStore/
for tif in *.tif; do
    get_mbtiles "${tif%.*}";
    done