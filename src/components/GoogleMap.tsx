import React, { useEffect, useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Polyline, InfoWindow, MarkerF } from '@react-google-maps/api';
import type { ItineraryItem } from '../types/itinerary';
import { getAllGoogleRoutes, formatDuration, formatDistance } from '../services/googleDirections';
import type { GoogleRouteInfo } from '../services/googleDirections';

// Define libraries outside component to prevent reloading
const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = ['places'];

interface MapProps {
  items: ItineraryItem[];
  selectedItem: string | null;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 42.3601,
  lng: -71.0589
};

const mapOptions: google.maps.MapOptions = {
  styles: [
    {
      featureType: "transit.station",
      elementType: "labels.icon",
      stylers: [{ visibility: "on" }]
    }
  ],
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true
};

export const GoogleMapComponent: React.FC<MapProps> = ({ items, selectedItem }) => {
  const [routes, setRoutes] = useState<GoogleRouteInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState<{ item: ItineraryItem; index: number } | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_TOKEN,
    libraries
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    directionsServiceRef.current = new google.maps.DirectionsService();
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  useEffect(() => {
    const fetchRoutes = async () => {
      if (directionsServiceRef.current && isLoaded) {
        setLoading(true);
        try {
          const routeData = await getAllGoogleRoutes(directionsServiceRef.current, items);
          console.log('Fetched routes:', routeData);
          setRoutes(routeData);
        } catch (error) {
          console.error('Error fetching routes:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchRoutes();
  }, [items, isLoaded]);

  useEffect(() => {
    if (selectedItem && map) {
      const item = items.find(i => i.id === selectedItem);
      if (item) {
        map.panTo({ lat: item.location.lat, lng: item.location.lng });
        map.setZoom(15);
      }
    }
  }, [selectedItem, items, map]);

  if (!isLoaded) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>Loading map...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={13}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={mapOptions}
    >
      {/* Route polylines */}
      {routes.map((route, index) => (
        <Polyline
          key={index}
          path={route.polyline}
          options={{
            strokeColor: route.mode === google.maps.TravelMode.TRANSIT ? '#e74c3c' : '#27ae60',
            strokeOpacity: 0.8,
            strokeWeight: 5,
            geodesic: true
          }}
        />
      ))}

      {/* Markers - Using MarkerF to avoid deprecation warning */}
      {items.map((item, index) => (
        <MarkerF
          key={item.id}
          position={{ lat: item.location.lat, lng: item.location.lng }}
          label={{
            text: (index + 1).toString(),
            color: 'white',
            fontWeight: 'bold'
          }}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: selectedItem === item.id ? '#e74c3c' : '#3498db',
            fillOpacity: 1,
            strokeColor: 'white',
            strokeWeight: 2,
            scale: 15
          }}
          onClick={() => setSelectedMarker({ item, index })}
        />
      ))}

      {/* Info Window */}
      {selectedMarker && (
        <InfoWindow
          position={{ lat: selectedMarker.item.location.lat, lng: selectedMarker.item.location.lng }}
          onCloseClick={() => setSelectedMarker(null)}
        >
          <div style={{ padding: '5px', maxWidth: '300px' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{selectedMarker.item.title}</h3>
            <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#666' }}>
              {selectedMarker.item.time}
            </p>
            {selectedMarker.item.description && (
              <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
                {selectedMarker.item.description}
              </p>
            )}
            {selectedMarker.index < items.length - 1 && routes[selectedMarker.index] && (
              <div style={{ 
                borderTop: '1px solid #eee', 
                paddingTop: '8px', 
                marginTop: '8px',
                fontSize: '13px'
              }}>
                <strong>To next stop:</strong><br />
                {routes[selectedMarker.index].mode === google.maps.TravelMode.TRANSIT ? (
                  <>
                    🚊 Transit • {formatDuration(routes[selectedMarker.index].duration)}<br />
                    {routes[selectedMarker.index].transitDetails?.steps?.map((step, i) => (
                      <span key={i} style={{ fontSize: '12px', color: '#666' }}>
                        {step.line && `Line: ${step.line}`}
                        {step.headsign && ` → ${step.headsign}`}
                        {i < routes[selectedMarker.index].transitDetails!.steps!.length - 1 && ', '}
                      </span>
                    ))}
                  </>
                ) : (
                  <>
                    🚶 Walking • {formatDuration(routes[selectedMarker.index].duration)} • {formatDistance(routes[selectedMarker.index].distance)}
                  </>
                )}
              </div>
            )}
          </div>
        </InfoWindow>
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
    </GoogleMap>
  );
};