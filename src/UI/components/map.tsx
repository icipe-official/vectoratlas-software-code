import { MapContainer, Marker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { useQuery, gql } from "@apollo/client";
import type { GeoJsonObject } from 'geojson';
import geoJSON from '../public/GeoJSON/geoJSON.json';
import { VectorPoint } from '../data_types/vector_point';
const myIcon = (prev: any) => new Icon({
  iconUrl: '../public/marker.svg',
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

const MapComponent = () => {
  const { data, loading, error } = useQuery(QUERY);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  let points = [];

  if (error) {
    console.error(error);
  } else {
    points = data.allGeoData;
  }


  return (
    <MapContainer center={[1.7918005,21.6689152]}
      zoom={3}
      style={{ height: "60vh", width: "30vw" }}>
      <GeoJSON data={geoJSON as GeoJsonObject}
        onEachFeature={onEachCountry}
        style={() => ({
          color: 'black',
          weight: 0.8,
          fillColor: "white",
          fillOpacity: 1,
        })} />
      {points.map((p: VectorPoint, i: number) =>
        (<Marker key={i} position={[p.location.coordinates[0], p.location.coordinates[1]]} icon={myIcon(p.prevalence)}>
          <Popup>
                  Species: {p.species} <br /> Prevalence: {p.prevalence}
          </Popup>
        </Marker>))}
    </MapContainer>
  );
};

export default MapComponent;