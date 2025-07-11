import React from 'react';
import { Train, MapPin } from 'lucide-react';
import type { ItineraryItem } from '../types/itinerary';

interface SidebarProps {
  items: ItineraryItem[];
  selectedItem: string | null;
  onItemClick: (item: ItineraryItem) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ items, selectedItem, onItemClick }) => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Boston Visit Itinerary</h2>
      <div className="itinerary-list">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`itinerary-item ${selectedItem === item.id ? 'selected' : ''}`}
            data-transport={item.transport}
            onClick={() => onItemClick(item)}
          >
            <div className="item-number">{index + 1}</div>
            <div className="item-content">
              <div className="item-header">
                <div className="item-title">
                  <span className="item-icon">
                    {item.transport === 'train' ? <Train size={18} /> : <MapPin size={18} />}
                  </span>
                  {item.title}
                </div>
              </div>
              <div className="item-time">{item.time}</div>
              {item.description && (
                <div className="item-description">{item.description}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};