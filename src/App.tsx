import { useState } from 'react'
import './App.css'
import { SidebarV3 } from './components/SidebarV3'
import { GoogleMapV2 } from './components/GoogleMapV2'
import { itineraryDataV3 } from './types/itineraryV3'
import type { ItineraryItemV3 } from './types/itineraryV3'

function App() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleItemClick = (item: ItineraryItemV3) => {
    setSelectedItem(item.id);
  };

  return (
    <div className="app">
      <SidebarV3 
        items={itineraryDataV3} 
        selectedItem={selectedItem}
        onItemClick={handleItemClick}
      />
      <GoogleMapV2 
        items={itineraryDataV3}
        selectedItem={selectedItem}
      />
    </div>
  )
}

export default App