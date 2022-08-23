chmod +x ./installTools.sh
chmod +x ./getMapData.sh
sudo apt-get install unzip
sudo apt-get update
sudo apt-get install gdal-bin
sudo apt-get install -y make
sudo apt-get install g++
sudo apt-get install libsqlite3-dev
sudo apt-get install libz-dev
sudo apt install libpcap-dev
sudo git clone https://github.com/mapbox/tippecanoe.git
cd tippecanoe
sudo make -j
sudo make install
