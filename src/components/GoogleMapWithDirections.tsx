import React, { useEffect, useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, DirectionsRenderer, InfoWindow, MarkerF } from '@react-google-maps/api';
import type { ItineraryItem } from '../types/itinerary';

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
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true
};

// Custom colors for routes
const routeColors = {
  walking: '#27ae60',
  transit: '#e74c3c'
};

export const GoogleMapWithDirections: React.FC<MapProps> = ({ items, selectedItem }) => {
  const [directionsResponses, setDirectionsResponses] = useState<google.maps.DirectionsResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState<{ item: ItineraryItem; index: number } | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_TOKEN,
    libraries
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Fetch all routes
  useEffect(() => {
    const fetchAllRoutes = async () => {
      if (!isLoaded || !window.google) return;
      
      setLoading(true);
      const directionsService = new google.maps.DirectionsService();
      const responses: google.maps.DirectionsResult[] = [];
      
      try {
        for (let i = 0; i < items.length - 1; i++) {
          const start = items[i].location;
          const end = items[i + 1].location;
          const isTransit = items[i + 1].transport === 'train';
          
          const request: google.maps.DirectionsRequest = {
            origin: { lat: start.lat, lng: start.lng },
            destination: { lat: end.lat, lng: end.lng },
            travelMode: isTransit 
              ? google.maps.TravelMode.TRANSIT 
              : google.maps.TravelMode.WALKING,
            ...(isTransit && {
              transitOptions: {
                modes: [google.maps.TransitMode.SUBWAY, google.maps.TransitMode.TRAIN, google.maps.TransitMode.BUS],
                routingPreference: google.maps.TransitRoutePreference.FEWER_TRANSFERS
              }
            })
          };
          
          try {
            const result = await directionsService.route(request);
            responses.push(result);
          } catch (error) {
            console.error(`Error fetching route ${i}:`, error);
          }
        }
        
        setDirectionsResponses(responses);
      } catch (error) {
        console.error('Error fetching routes:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllRoutes();
  }, [items, isLoaded]);

  // Handle selected item
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
      {/* Render all direction routes */}
      {directionsResponses.map((response, index) => (
        <DirectionsRenderer
          key={index}
          directions={response}
          options={{
            suppressMarkers: true, // We'll use our own markers
            polylineOptions: {
              strokeColor: items[index + 1].transport === 'train' ? routeColors.transit : routeColors.walking,
              strokeWeight: 5,
              strokeOpacity: 0.8
            },
            preserveViewport: true // Don't auto-zoom to fit route
          }}
        />
      ))}

      {/* Custom numbered markers */}
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
            {selectedMarker.index < items.length - 1 && directionsResponses[selectedMarker.index] && (
              <div style={{ 
                borderTop: '1px solid #eee', 
                paddingTop: '8px', 
                marginTop: '8px',
                fontSize: '13px'
              }}>
                <strong>To next stop:</strong><br />
                {items[selectedMarker.index + 1].transport === 'train' ? '🚊 ' : '🚶 '}
                {directionsResponses[selectedMarker.index].routes[0].legs[0].duration?.text} • 
                {directionsResponses[selectedMarker.index].routes[0].legs[0].distance?.text}
                
                {items[selectedMarker.index + 1].transport === 'train' && 
                 directionsResponses[selectedMarker.index].routes[0].legs[0].steps && (
                  <div style={{ marginTop: '4px', fontSize: '12px', color: '#666' }}>
                    {directionsResponses[selectedMarker.index].routes[0].legs[0].steps
                      .filter(step => step.travel_mode === 'TRANSIT')
                      .map((step, i) => (
                        <div key={i}>
                          {step.transit?.line?.short_name || step.transit?.line?.name}
                          {step.transit?.headsign && ` → ${step.transit.headsign}`}
                        </div>
                      ))}
                  </div>
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