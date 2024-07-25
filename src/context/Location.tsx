import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the structure for each Location
interface Location {
  id: number;
  name: string;
  distance: string;
  position: {
    lat: number;
    lng: number;
  };
}

// Define the structure for the context type
type LocationContextType = {
  locations: Location[];
  setLocations: React.Dispatch<React.SetStateAction<Location[]>>;
};

// Create the context with an initial undefined value
const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

// Provider component for the Location context
const LocationContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [locations, setLocations] = useState<Location[]>([]);

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
