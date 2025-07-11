import React, { useEffect, useState, useRef } from 'react';
import Map, { Marker, Popup, Source, Layer } from 'react-map-gl';
import type { ItineraryItem } from '../types/itinerary';
import { getAllRoutes, formatDuration, formatDistance, RouteInfo } from '../services/mapboxDirections';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapProps {
  items: ItineraryItem[];
  selectedItem: string | null;
}

export const MapboxMap: React.FC<MapProps> = ({ items, selectedItem }) => {
  const [routes, setRoutes] = useState<RouteInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [popupInfo, setPopupInfo] = useState<{ item: ItineraryItem; index: number } | null>(null);
  const mapRef = useRef<any>(null);
  
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

  useEffect(() => {
    if (selectedItem && mapRef.current) {
      const item = items.find(i => i.id === selectedItem);
      if (item) {
        mapRef.current.flyTo({
          center: [item.location.lng, item.location.lat],
          zoom: 15,
          duration: 1000
        });
      }
    }
  }, [selectedItem, items]);

  // Convert routes to GeoJSON for rendering
  const routeGeoJSON = {
    type: 'FeatureCollection' as const,
    features: routes.map((route, index) => ({
      type: 'Feature' as const,
      properties: {
        isTransit: items[index + 1].transport === 'train'
      },
      geometry: {
        type: 'LineString' as const,
        coordinates: route.geometry.coordinates
      }
    }))
  };

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={MAPBOX_TOKEN}
      initialViewState={{
        longitude: -71.0589,
        latitude: 42.3601,
        zoom: 13
      }}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/outdoors-v12"
    >
      {/* Route lines */}
      <Source id="routes" type="geojson" data={routeGeoJSON}>
        <Layer
          id="route-walking"
          type="line"
          filter={['!', ['get', 'isTransit']]}
          paint={{
            'line-color': '#27ae60',
            'line-width': 4,
            'line-opacity': 0.8
          }}
        />
        <Layer
          id="route-transit"
          type="line"
          filter={['get', 'isTransit']}
          paint={{
            'line-color': '#e74c3c',
            'line-width': 4,
            'line-opacity': 0.8,
            'line-dasharray': [2, 1]
          }}
        />
      </Source>

      {/* Markers */}
      {items.map((item, index) => (
        <Marker
          key={item.id}
          longitude={item.location.lng}
          latitude={item.location.lat}
          anchor="center"
          onClick={e => {
            e.originalEvent.stopPropagation();
            setPopupInfo({ item, index });
          }}
        >
          <div
            style={{
              background: selectedItem === item.id ? '#e74c3c' : '#3498db',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '14px',
              border: '2px solid white',
              boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
              cursor: 'pointer'
            }}
          >
            {index + 1}
          </div>
        </Marker>
      ))}

      {/* Popup */}
      {popupInfo && (
        <Popup
          anchor="bottom"
          longitude={popupInfo.item.location.lng}
          latitude={popupInfo.item.location.lat}
          onClose={() => setPopupInfo(null)}
          closeButton={true}
          closeOnClick={false}
        >
          <div style={{ padding: '5px' }}>
            <strong style={{ fontSize: '16px' }}>{popupInfo.item.title}</strong>
            <br />
            {popupInfo.item.time}
            {popupInfo.item.description && (
              <>
                <br />
                {popupInfo.item.description}
              </>
            )}
            {popupInfo.index < items.length - 1 && routes[popupInfo.index] && (
              <>
                <br />
                <div style={{ fontSize: '12px', color: '#666', marginTop: '8px', borderTop: '1px solid #eee', paddingTop: '8px' }}>
                  <strong>To next stop:</strong><br />
                  {items[popupInfo.index + 1].transport === 'train' ? '🚊 Transit' : '🚶 Walking'}<br />
                  {formatDuration(routes[popupInfo.index].duration)} • {formatDistance(routes[popupInfo.index].distance)}
                </div>
              </>
            )}
          </div>
        </Popup>
      )}

      {/* Loading indicator */}
      {loading && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'white',
          padding: '10px 15px',
          borderRadius: '5px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
        }}>
          Loading routes...
        </div>
      )}
    </Map>
  );
};