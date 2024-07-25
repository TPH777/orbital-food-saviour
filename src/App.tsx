import React from "react";
import { createRoot } from "react-dom/client";
import MapComponent from "./components/MapComponent";
import { LocationContextProvider } from "./context/Location";

function App() {
  // Initial locations data
  const initialMarkers = [
    {
      id: 1,
      name: "NUS",
      distance: "",
      position: { lat: 1.2966, lng: 103.77641 },
    },
    {
      id: 2,
      name: "Kent Ridge",
      distance: "",
      position: { lat: 1.2933, lng: 103.7831 },
    },
    {
      id: 3,
      name: "Botanic Garden",
      distance: "",
      position: { lat: 1.3223, lng: 103.8149 },
    },
  ];

  return (
    <LocationContextProvider>
      <MapComponent />
    </LocationContextProvider>
  );
}

export default App;
