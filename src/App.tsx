import { useState } from 'react'
import './App.css'
import { SidebarV2 } from './components/SidebarV2'
import { GoogleMapV2 } from './components/GoogleMapV2'
import { itineraryDataV2 } from './types/itineraryV2'
import type { ItineraryItemV2 } from './types/itineraryV2'

function App() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleItemClick = (item: ItineraryItemV2) => {
    setSelectedItem(item.id);
  };

  return (
    <div className="app">
      <SidebarV2 
        items={itineraryDataV2} 
        selectedItem={selectedItem}
        onItemClick={handleItemClick}
      />
      <GoogleMapV2 
        items={itineraryDataV2}
        selectedItem={selectedItem}
      />
    </div>
  )
}

export default App