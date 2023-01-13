echo "Running transformation script for $1$2"

cp $1$2.tif /tmp/$2.tif
gdaldem color-relief /tmp/$2.tif ./colormap.txt /tmp/$2_colorized.tif -alpha
gdal_translate -scale 0 $4 0 1 -of MBTiles -ot Byte /tmp/$2_colorized.tif /tmp/$2.mbtiles
gdaladdo -r nearest /tmp/$2.mbtiles 2 4 8 16 32
mv /tmp/$2.mbtiles $3$2.mbtiles
rm /tmp/$2.tif
rm /tmp/$2_colorized.tif