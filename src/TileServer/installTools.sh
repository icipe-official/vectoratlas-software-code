apt-get update
apt-get install -y unzip gdal-bin make g++ libsqlite3-dev libz-dev libpcap-dev

git clone https://github.com/mapbox/tippecanoe.git
cd tippecanoe
make -j
make install
