import React from 'react';
import { Train, MapPin, Bus } from 'lucide-react';
import type { ItineraryItemV2, PlaceItem, TravelItem } from '../types/itineraryV2';

interface SidebarProps {
  items: ItineraryItemV2[];
  selectedItem: string | null;
  onItemClick: (item: ItineraryItemV2) => void;
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

export const SidebarV2: React.FC<SidebarProps> = ({ items, selectedItem, onItemClick }) => {
  let placeCounter = 0;

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Boston Visit Itinerary</h2>
      <div className="itinerary-list">
        {items.map((item) => {
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
                  <div className="item-time">{placeItem.time}</div>
                  {placeItem.description && (
                    <div className="item-description">{placeItem.description}</div>
                  )}
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
                    {travelItem.duration && (
                      <span className="travel-duration">{travelItem.duration}</span>
                    )}
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