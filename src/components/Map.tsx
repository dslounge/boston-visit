import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { ItineraryItem } from '../types/itinerary';
import 'leaflet/dist/leaflet.css';

// Simple distance calculation for estimated walking time
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function estimateWalkingTime(distance: number): string {
  // Average walking speed: 5 km/h
  const hours = distance / 5;
  const minutes = Math.round(hours * 60);
  return `~${minutes} min walk`;
}

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Function to create numbered markers
const createNumberedIcon = (number: number, isSelected: boolean) => {
  const color = isSelected ? '#e74c3c' : '#3498db';
  const textColor = '#ffffff';
  
  return new L.DivIcon({
    className: 'numbered-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${textColor};
        font-weight: bold;
        font-size: 14px;
        border: 2px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      ">
        ${number}
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
};

interface MapProps {
  items: ItineraryItem[];
  selectedItem: string | null;
}

const MapController: React.FC<{ selectedItem: string | null; items: ItineraryItem[] }> = ({ selectedItem, items }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedItem) {
      const item = items.find(i => i.id === selectedItem);
      if (item) {
        map.flyTo([item.location.lat, item.location.lng], 15, {
          duration: 1
        });
      }
    }
  }, [selectedItem, items, map]);

  return null;
};

export const Map: React.FC<MapProps> = ({ items, selectedItem }) => {
  const center: [number, number] = [42.3601, -71.0589]; // Boston center
  
  // Create polyline points from itinerary locations
  const polylinePoints: [number, number][] = items.map(item => [
    item.location.lat,
    item.location.lng
  ]);

  // Different colors for walking vs train segments
  const segments: { points: [number, number][]; color: string }[] = [];
  for (let i = 0; i < items.length - 1; i++) {
    segments.push({
      points: [
        [items[i].location.lat, items[i].location.lng],
        [items[i + 1].location.lat, items[i + 1].location.lng]
      ],
      color: items[i + 1].transport === 'train' ? '#e74c3c' : '#27ae60'
    });
  }

  return (
    <MapContainer 
      center={center} 
      zoom={13} 
      className="map-container"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CartoDB</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
      />
      
      <MapController selectedItem={selectedItem} items={items} />
      
      {/* Draw trail segments */}
      {segments.map((segment, index) => (
        <Polyline
          key={index}
          positions={segment.points}
          color={segment.color}
          weight={3}
          opacity={0.7}
          dashArray={segment.color === '#FF6B6B' ? '10, 5' : undefined}
        />
      ))}
      
      {/* Place markers */}
      {items.map((item, index) => (
        <Marker 
          key={item.id} 
          position={[item.location.lat, item.location.lng]}
          icon={createNumberedIcon(index + 1, selectedItem === item.id)}
        >
          <Popup>
            <div>
              <strong>{item.title}</strong>
              <br />
              {item.time}
              {item.description && (
                <>
                  <br />
                  {item.description}
                </>
              )}
              {index < items.length - 1 && (
                <>
                  <br />
                  <em style={{ fontSize: '12px', color: '#666' }}>
                    {items[index + 1].transport === 'train' ? 'Transit' : 
                     estimateWalkingTime(calculateDistance(
                       item.location.lat, item.location.lng,
                       items[index + 1].location.lat, items[index + 1].location.lng
                     ))} to next stop
                  </em>
                </>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};