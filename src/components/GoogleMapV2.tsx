import React, { useEffect, useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, DirectionsRenderer, InfoWindow, MarkerF } from '@react-google-maps/api';
import type { ItineraryItemV2, PlaceItem } from '../types/itineraryV2';

// Define libraries outside component to prevent reloading
const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = ['places'];

interface MapProps {
  items: ItineraryItemV2[];
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
  walk: '#27ae60',
  train: '#e74c3c',
  bus: '#f39c12'
};

export const GoogleMapV2: React.FC<MapProps> = ({ items, selectedItem }) => {
  const [directionsResponses, setDirectionsResponses] = useState<google.maps.DirectionsResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState<{ item: PlaceItem; index: number } | null>(null);
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

  // Extract only place items for markers
  const placeItems = items.filter(item => item.type === 'place') as PlaceItem[];

  // Fetch routes between consecutive places
  useEffect(() => {
    const fetchAllRoutes = async () => {
      if (!isLoaded || !window.google) return;
      
      setLoading(true);
      const directionsService = new google.maps.DirectionsService();
      const responses: google.maps.DirectionsResult[] = [];
      
      try {
        // Find pairs of places with their travel method
        for (let i = 0; i < items.length - 1; i++) {
          if (items[i].type === 'place' && items[i + 2]?.type === 'place') {
            const startPlace = items[i] as PlaceItem;
            const travelInfo = items[i + 1];
            const endPlace = items[i + 2] as PlaceItem;
            
            if (travelInfo.type === 'travel') {
              const travelMode = 
                travelInfo.transport === 'walk' ? google.maps.TravelMode.WALKING :
                travelInfo.transport === 'bus' ? google.maps.TravelMode.TRANSIT :
                google.maps.TravelMode.TRANSIT;
              
              const request: google.maps.DirectionsRequest = {
                origin: { lat: startPlace.location.lat, lng: startPlace.location.lng },
                destination: { lat: endPlace.location.lat, lng: endPlace.location.lng },
                travelMode: travelMode,
                ...(travelMode === google.maps.TravelMode.TRANSIT && {
                  transitOptions: {
                    modes: [google.maps.TransitMode.SUBWAY, google.maps.TransitMode.TRAIN, google.maps.TransitMode.BUS],
                    routingPreference: google.maps.TransitRoutePreference.FEWER_TRANSFERS
                  }
                })
              };
              
              try {
                const result = await directionsService.route(request);
                responses.push(result);
                
                // Update travel duration in the data
                if (result.routes?.[0]?.legs?.[0]?.duration?.text) {
                  travelInfo.duration = result.routes[0].legs[0].duration.text;
                }
              } catch (error) {
                console.error(`Error fetching route:`, error);
              }
            }
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
      const selectedPlace = placeItems.find(item => item.id === selectedItem);
      if (selectedPlace) {
        map.panTo({ lat: selectedPlace.location.lat, lng: selectedPlace.location.lng });
        map.setZoom(15);
      }
    }
  }, [selectedItem, placeItems, map]);

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
      {directionsResponses.map((response, index) => {
        // Find the corresponding travel item
        const travelItemIndex = index * 2 + 1;
        const travelItem = items[travelItemIndex];
        const strokeColor = travelItem?.type === 'travel' ? 
          routeColors[travelItem.transport] : routeColors.walk;
        
        return (
          <DirectionsRenderer
            key={index}
            directions={response}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor,
                strokeWeight: 5,
                strokeOpacity: 0.8
              },
              preserveViewport: true
            }}
          />
        );
      })}

      {/* Custom numbered markers for places only */}
      {placeItems.map((item, index) => (
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
              <p style={{ margin: '0', fontSize: '14px' }}>
                {selectedMarker.item.description}
              </p>
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