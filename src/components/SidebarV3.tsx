import React, { useMemo } from 'react';
import { Train, MapPin, Bus, Clock } from 'lucide-react';
import type { ItineraryItemV3, PlaceItem, TravelItem } from '../types/itineraryV3';
import { calculateSchedule } from '../types/itineraryV3';

interface SidebarProps {
  items: ItineraryItemV3[];
  selectedItem: string | null;
  onItemClick: (item: ItineraryItemV3) => void;
}

const TransportIcon: React.FC<{ transport: string }> = ({ transport }) => {
  switch (transport) {
    case 'bus':
      return <Bus size={14} />;
    case 'train':
      return <Train size={14} />;
    default:
      return <MapPin size={14} />;
  }
};

const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
};

export const SidebarV3: React.FC<SidebarProps> = ({ items, selectedItem, onItemClick }) => {
  const schedule = useMemo(() => calculateSchedule(items), [items]);
  let placeCounter = 0;

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Boston Visit Itinerary</h2>
      <div className="itinerary-list">
        {schedule.map(({ item, calculatedStartTime, isFixed }) => {
          if (item.type === 'place') {
            placeCounter++;
            const placeItem = item as PlaceItem;
            return (
              <div
                key={item.id}
                className={`itinerary-item place-item ${selectedItem === item.id ? 'selected' : ''}`}
                onClick={() => onItemClick(item)}
              >
                <div className="item-number">{placeCounter}</div>
                <div className="item-content">
                  <div className="item-header">
                    <div className="item-title">
                      <span className="item-icon">
                        <MapPin size={16} />
                      </span>
                      {placeItem.title}
                    </div>
                  </div>
                  <div className="item-details">
                    <div className={`item-time ${isFixed ? 'fixed-time' : ''}`}>
                      {isFixed && <Clock size={12} className="fixed-time-icon" />}
                      {calculatedStartTime}
                    </div>
                    <div className="item-duration">
                      {formatDuration(placeItem.duration)}
                    </div>
                  </div>
                  {placeItem.description && (
                    <div className="item-description">{placeItem.description}</div>
                  )}
                  <a 
                    href={
                      placeItem.location.placeId
                        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeItem.location.name)}&query_place_id=${placeItem.location.placeId}`
                        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeItem.location.name)}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="google-maps-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Google Maps
                  </a>
                </div>
              </div>
            );
          } else {
            const travelItem = item as TravelItem;
            return (
              <div
                key={item.id}
                className={`travel-item ${selectedItem === item.id ? 'selected' : ''}`}
                onClick={() => onItemClick(item)}
              >
                <div className="travel-content">
                  <div className="travel-mode">
                    <TransportIcon transport={travelItem.transport} />
                    <span className="travel-mode-text">
                      {travelItem.transport === 'walk' ? 'Walk' : 
                       travelItem.transport === 'bus' ? 'Bus' : 'Train/Subway'}
                    </span>
                    <span className="travel-duration">{formatDuration(travelItem.duration)}</span>
                  </div>
                  <div className="travel-route">
                    <span className="travel-from">{travelItem.from}</span>
                    <span className="travel-to">→ {travelItem.to}</span>
                  </div>
                  {travelItem.description && (
                    <div className="travel-description">{travelItem.description}</div>
                  )}
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};