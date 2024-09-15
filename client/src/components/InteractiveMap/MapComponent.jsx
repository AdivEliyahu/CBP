import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { useGoogleMaps } from './GoogleMapsProvider';



const containerStyle = {
  width: '100%',
  height: '700px',
};

const center = {
  lat: 31.251,
  lng: 34.786,
};

const mapStyles = [
  {
    featureType: 'poi',
    stylers: [{ visibility: 'off' }],
  },
];


  

const MapComponent = ({ markers }) => {
  const { isLoaded } = useGoogleMaps();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={13.5}
      options={{ styles: mapStyles }}
    >
      {markers.map((marker, index) => (
        <Marker 
        key={index} 
        position={{ lat: marker.lat, lng: marker.lng }} 
        />
      ))}
    </GoogleMap>
  );
};

export default MapComponent;
