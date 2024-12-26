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
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [points, map]);

  return null;
}

interface MapComponentProps {
  pointsRelais: any[];
  onSelectPoint: (point: any) => void;
  selectedPointId?: string;
}

export default function MapComponent({ pointsRelais, onSelectPoint, selectedPointId }: MapComponentProps) {
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

  // Création d'une icône personnalisée pour les points relais
  const createRelayIcon = (isSelected: boolean) => L.divIcon({
    className: 'bg-transparent',
    html: `<div class="w-6 h-6 ${isSelected ? 'bg-rose-600' : 'bg-gray-600'} rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-lg transform ${isSelected ? 'scale-125' : ''} transition-transform">PR</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });

  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      <MapContainer
        center={[46.603354, 1.888334]}
        zoom={6}
        style={{ height: '400px', width: '100%' }}
        ref={mapRef}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={20}
        />
        <MapUpdater points={pointsRelais} />
        {pointsRelais.map((point) => (
          <Marker
            key={point.ID}
            position={[parseFloat(point.Latitude) / 100000, parseFloat(point.Longitude) / 100000]}
            icon={createRelayIcon(point.ID === selectedPointId)}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-medium">{point.Nom}</p>
                <p>{point.Adresse1}</p>
                <p>{point.CP} {point.Ville}</p>
                <button
                  className="mt-2 px-3 py-1 bg-rose-600 text-white rounded text-xs hover:bg-rose-700 transition-colors"
                  onClick={() => onSelectPoint(point)}
                >
                  Sélectionner
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
