import React from "react";
import { createRoot } from "react-dom/client";
import MapComponent from "./components/MapComponent";
import { LocationContextProvider } from "./context/Location";

function App() {
  // Initial locations data
  return (
    <LocationContextProvider>
      <MapComponent />
    </LocationContextProvider>
  );
}

export default App;
