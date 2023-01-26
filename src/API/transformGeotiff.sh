echo "Running transformation script for $1$2"
set -e
cp $1$2.tif /tmp/$2.tif
gdaldem color-relief /tmp/$2.tif ./colormap.txt /tmp/$2_colorized.tif -alpha
[[ $? -ne 0 ]] && exit
gdal_translate -scale 0 $4 0 1 -of MBTiles -ot Byte /tmp/$2_colorized.tif /tmp/$2.mbtiles
[[ $? -ne 0 ]] && exit
gdaladdo -r nearest /tmp/$2.mbtiles 2 4 8 16 32
[[ $? -ne 0 ]] && exit
mv /tmp/$2.mbtiles $3$2.mbtiles
[[ $? -ne 0 ]] && exit
rm /tmp/$2.tif
[[ $? -ne 0 ]] && exit
rm /tmp/$2_colorized.tif
[[ $? -ne 0 ]] && exit
