import React, { createContext, useContext, useState, ReactNode } from "react";

export const singaporeLoc = { lat: 1.3521, lng: 103.8198 };

// Define the structure for each Location
export interface Location {
  id: string;
  name: string;
  distance: string;
  position: {
    lat: number;
    lng: number;
  };
}

// Define the structure for the context type
type LocationContextType = {
  locations: {
    curLoc: {
      lat: number;
      lng: number;
    };
    locs: Location[];
  };
  setLocations: React.Dispatch<
    React.SetStateAction<{
      curLoc: { lat: number; lng: number };
      locs: Location[];
    }>
  >;
};

// Create the context with an initial undefined value
const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

// Provider component for the Location context
const LocationContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [locations, setLocations] = useState<{
    curLoc: { lat: number; lng: number };
    locs: Location[];
  }>({
    curLoc: { lat: singaporeLoc.lat, lng: singaporeLoc.lng },
    locs: [],
  });

  return (
    <LocationContext.Provider value={{ locations, setLocations }}>
      {children}
    </LocationContext.Provider>
  );
};

// Custom hook to use the Location context
const useLocationContext = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error(
      "useLocationContext must be used within a LocationContextProvider"
    );
  }
  return context;
};

export { LocationContextProvider, useLocationContext };
