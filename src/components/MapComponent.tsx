'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Composant pour mettre à jour la vue de la carte
function MapUpdater({ points }: { points: any[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points.map(point => [
        parseFloat(point.Latitude) / 100000,
        parseFloat(point.Longitude) / 100000
      ]));
      map.fitBounds(bounds);
    }
  }, [points, map]);

  return null;
}

interface MapComponentProps {
  pointsRelais: any[];
  onSelectPoint: (point: any) => void;
}

export default function MapComponent({ pointsRelais, onSelectPoint }: MapComponentProps) {
  const mapRef = useRef<L.Map>(null);

  useEffect(() => {
    // Fix pour le style de Leaflet en SSR
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Fix pour les icônes Leaflet
  const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
  });

  L.Marker.prototype.options.icon = defaultIcon;

  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <MapContainer
      center={[46.603354, 1.888334]}
      zoom={6}
      style={{ height: '100%', width: '100%' }}
      ref={mapRef}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapUpdater points={pointsRelais} />
      {pointsRelais.map((point) => (
        <Marker
          key={point.ID}
          position={[parseFloat(point.Latitude) / 100000, parseFloat(point.Longitude) / 100000]}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-medium">{point.Nom}</p>
              <p>{point.Adresse1}</p>
              <p>{point.CP} {point.Ville}</p>
              <button
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                onClick={() => onSelectPoint(point)}
              >
                Sélectionner
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
