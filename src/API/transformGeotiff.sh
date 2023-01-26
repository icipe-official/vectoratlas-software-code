echo "Running transformation script for $1$2"
set -e
cp $1$2.tif /tmp/$2.tif
gdaldem color-relief /tmp/$2.tif ./colormap.txt /tmp/$2_colorized.tif -alpha || exit 1
gdal_translate -scale 0 $4 0 1 -of MBTiles -ot Byte /tmp/$2_colorized.tif /tmp/$2.mbtiles || exit 1
gdaladdo -r nearest /tmp/$2.mbtiles 2 4 8 16 32 || exit 1
mv /tmp/$2.mbtiles $3$2.mbtiles || exit 1
rm /tmp/$2.tif || exit 1
rm /tmp/$2_colorized.tif || exit 1
