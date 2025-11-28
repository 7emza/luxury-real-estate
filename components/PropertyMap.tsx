'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface PropertyMapProps {
  location: string;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export default function PropertyMap({ location, address, coordinates }: PropertyMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  // Default to Morocco center if no coordinates provided
  const defaultCoordinates = { lat: 33.5731, lng: -7.5898 }; // Casablanca
  const position: [number, number] = coordinates
    ? [coordinates.lat, coordinates.lng]
    : [defaultCoordinates.lat, defaultCoordinates.lng];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-48 sm:h-64 md:h-80 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-48 sm:h-64 md:h-80 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <div className="text-sm">
              <div className="font-bold mb-1">{location}</div>
              {address && <div className="text-gray-600">{address}</div>}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
