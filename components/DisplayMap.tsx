import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
let DefaultIcon = L.icon({
  iconUrl: '/images/marker-icon.png',
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface DisplayMapProps {
  location: number[] | { lat: number; lng: number } | null | undefined;
}

const DisplayMap: React.FC<DisplayMapProps> = ({ location }) => {
  // Default location (e.g., center of your city or country)
  const defaultLocation: [number, number] = [-1.2921, 36.8219]; // Nairobi, Kenya

  // Function to parse location data
  const parseLocation = (loc: DisplayMapProps['location']): [number, number] => {
    if (Array.isArray(loc) && loc.length === 2) {
      return [loc[0], loc[1]];
    } else if (loc && typeof loc === 'object' && 'lat' in loc && 'lng' in loc) {
      return [loc.lat, loc.lng];
    }
    return defaultLocation;
  };

  const mapLocation = parseLocation(location);

  return (
    <MapContainer center={mapLocation} zoom={13} style={{ height: '300px', width: '100%', borderRadius: '20px' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={mapLocation} />
    </MapContainer>
  );
};

export default DisplayMap;