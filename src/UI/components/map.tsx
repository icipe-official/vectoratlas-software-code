import { MapContainer, Marker, Popup, GeoJSON } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet'
import icon from 'leaflet/dist/images/marker-icon.png';
import { gql, useLazyQuery } from "@apollo/client";
import type { GeoJsonObject } from 'geojson';
import { VectorPoint } from '../data_types/vector_point';
import { useEffect, useState } from 'react';
const myIcon = (prev: any) => new Icon({
 iconUrl: icon.src,
 iconSize: [prev,prev]
});

const QUERY = gql`
  query GeoData {
    allGeoData { location, prevalence, species }
  }
`;

const onEachCountry = (country: any, layer: any) => {
  const countryName = country.properties.admin;
  layer.bindPopup(countryName);
};

function MapComponent(): JSX.Element | null {
  const [getPoints, { data, loading, error }] = useLazyQuery(QUERY);

  const [mapData, setMapData] = useState<GeoJsonObject | null>(null);
  const [loadingMap, setLoadingMap] = useState<boolean | null>(null);

  useEffect(() => {
    setLoadingMap(true);
    console.log("here")
    fetch('/GeoJSON/geoJSON.json')
    .then((res) => res.json())
    .then((data) => {
      setMapData(data);
      setLoadingMap(false);
      getPoints();
    })
  }, [getPoints])

  if (loading || loadingMap) {
    return <h2>Loading map...</h2>;
  }

  if (error) {
    console.error(error);
    return null;
  }

  const points = data?.allGeoData || [];

  return (
    <MapContainer center={[1.7918005, 21.6689152]}
      zoom={3}
      style={{ height: "60vh", width: "30vw" }}>
      <GeoJSON data={mapData as GeoJsonObject}
        onEachFeature={onEachCountry}
        style={() => ({
          color: 'black',
          weight: 0.8,
          fillColor: "white",
          fillOpacity: 1,
        })} />
      {points.map((p: VectorPoint, i: number) => (<Marker key={i} position={[p.location.coordinates[0], p.location.coordinates[1]]} icon={myIcon(p.prevalence)}>
        <Popup>
          Species: {p.species} <br /> Prevalence: {p.prevalence}
        </Popup>
      </Marker>))}
    </MapContainer>
  );
}

export default MapComponent;