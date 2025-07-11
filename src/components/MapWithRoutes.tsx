import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { ItineraryItem } from '../types/itinerary';
import { getAllRoutes, formatDuration, formatDistance } from '../services/mapboxDirections';
import type { RouteInfo } from '../services/mapboxDirections';
import 'leaflet/dist/leaflet.css';

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

export const MapWithRoutes: React.FC<MapProps> = ({ items, selectedItem }) => {
  const [routes, setRoutes] = useState<RouteInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const center: [number, number] = [42.3601, -71.0589]; // Boston center
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
  
  useEffect(() => {
    const fetchRoutes = async () => {
      setLoading(true);
      const routeData = await getAllRoutes(items);
      setRoutes(routeData);
      setLoading(false);
    };
    
    fetchRoutes();
  }, [items]);

  return (
    <MapContainer 
      center={center} 
      zoom={13} 
      className="map-container"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`}
        tileSize={512}
        zoomOffset={-1}
      />
      
      <MapController selectedItem={selectedItem} items={items} />
      
      {/* Draw actual routes from Mapbox */}
      {routes.map((route, index) => (
        <Polyline
          key={index}
          positions={route.geometry.coordinates.map(coord => [coord[1], coord[0]] as [number, number])}
          color={items[index + 1].transport === 'train' ? '#e74c3c' : '#27ae60'}
          weight={4}
          opacity={0.8}
          dashArray={items[index + 1].transport === 'train' ? '10, 5' : undefined}
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
              {index < items.length - 1 && routes[index] && (
                <>
                  <br />
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                    <strong>To next stop:</strong><br />
                    {items[index + 1].transport === 'train' ? '🚊 Transit' : '🚶 Walking'}<br />
                    {formatDuration(routes[index].duration)} • {formatDistance(routes[index].distance)}
                  </div>
                </>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
      
      {loading && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'white',
          padding: '10px',
          borderRadius: '5px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
          zIndex: 1000
        }}>
          Loading routes...
        </div>
      )}
    </MapContainer>
  );
};