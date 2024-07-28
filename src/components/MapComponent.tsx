import React, { useState, useEffect, Fragment } from "react";
import {
  GoogleMap,
  MarkerF,
  InfoWindowF,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useLocationContext, singaporeLoc } from "../context/Location";
import { useUpdateLocations } from "../functions/LocationHandlers";

// Google Maps API key from environment variable
const gMapKey = import.meta.env.VITE_REACT_APP_gmap;

const MapComponent: React.FC = () => {
  const [cusPos, setCusPos] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [currentPosition, setCurrentPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [activeMarker, setActiveMarker] = useState<number | null>(null);
  // State for locations from context
  const { locations, setLocations } = useLocationContext();
  // Load the Google Maps script
  const { isLoaded, loadError } = useJsApiLoader({ googleMapsApiKey: gMapKey });
  const { calculateDistances } = useUpdateLocations();

  const mapRef = React.useRef<google.maps.Map | null>(null);
  useEffect(() => {
    setCusPos(locations.curLoc);
  });
  // Calculate distances when customer position is set and map is loaded
  useEffect(() => {
    if (cusPos && isLoaded) {
      calculateDistances(cusPos);
    }
  }, [cusPos, isLoaded]);

  // Handle marker click and set the active marker
  const handleActiveMarker = (markerId: number | null) => {
    setActiveMarker(markerId);
    if (markerId !== null) {
      const marker = locations.locs.find((loc) => loc.id === markerId);
      if (marker && mapRef.current) {
        mapRef.current.panTo(marker.position);
        setCurrentPosition(marker.position);
      } else if (markerId === cusPos?.lat) {
        mapRef.current.panTo(cusPos);
        setCurrentPosition(cusPos);
      }
    }
  };

  if (loadError) return <div>Error loading maps</div>;

  return (
    <Fragment>
      <div className="container">
        <h1 className="text-center"></h1>
        <div style={{ width: "100%", height: "90vh" }}>
          {isLoaded ? (
            <GoogleMap
              center={cusPos || singaporeLoc}
              zoom={13}
              onClick={() => handleActiveMarker(null)}
              mapContainerStyle={{ width: "100%", height: "90vh" }}
              onLoad={(map) => (mapRef.current = map)}
            >
              {cusPos && (
                <MarkerF
                  key={cusPos.lat}
                  position={cusPos}
                  onClick={() => handleActiveMarker(cusPos.lat)}
                  icon={{
                    url: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
                    size: new google.maps.Size(20, 32),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(0, 32),
                  }}
                >
                  {activeMarker === cusPos.lat && (
                    <InfoWindowF onCloseClick={() => handleActiveMarker(null)}>
                      <div>Current location</div>
                    </InfoWindowF>
                  )}
                </MarkerF>
              )}
              {locations.locs.map(({ id, name, position, distance }) => (
                <MarkerF
                  key={id} // Ensure each marker has a unique key
                  position={position}
                  onClick={() => handleActiveMarker(id)}
                >
                  {activeMarker === id && (
                    <InfoWindowF onCloseClick={() => handleActiveMarker(null)}>
                      <div>
                        <strong>{name}</strong> <br /> Distance: {distance}
                      </div>
                    </InfoWindowF>
                  )}
                </MarkerF>
              ))}
            </GoogleMap>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default MapComponent;

// interface Location {
//   id: string;
//   name: string;
//   distance: string;
//   position: {
//     lat: number;
//     lng: number;
//   };
// }

// // Define the structure for the context type
// type LocationContextType = {
//   locations: {
//     curLoc: {
//       lat: number;
//       lng: number;
//     };
//     locs: Location[];
//   };
// };
