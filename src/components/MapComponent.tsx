import React, { useState, useEffect, Fragment } from "react";
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";
import { useLocationContext } from "../context/Location";

// Google Maps API key from environment variable
const gMapKey = import.meta.env.VITE_REACT_APP_gmap;
const singaporeLoc = { lat: 1.3521, lng: 103.8198 };
var first = true;
const markers = [
  {
    id: 4,
    name: "NUS",
    distance: "5",
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

const MapComponent: React.FC = () => {
  // State for customer position and active marker
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
  useEffect(() => {
    if (first) {
      setLocations(markers);
      first = false;
    }
  });

  // Load the Google Maps script
  const { isLoaded } = useLoadScript({ googleMapsApiKey: gMapKey });

  // Fetch user's current position on component mount
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCusPos({ lat: latitude, lng: longitude });
        setCurrentPosition({ lat: latitude, lng: longitude });
      },
      (error) => console.error(error),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  }, []);

  // Calculate distances when customer position is set and map is loaded
  useEffect(() => {
    if (cusPos && isLoaded) {
      calculateDistances();
    }
  }, [cusPos, isLoaded]);

  // Debugging: Log locations when they are updated
  useEffect(() => {
    console.log("Updated locations:", locations);
  }, [locations]);

  // Handle marker click and set the active marker
  const handleActiveMarker = (markerId: number | null) => {
    setActiveMarker(markerId);
    if (markerId !== null) {
      const marker = locations.find((loc) => loc.id === markerId);
      if (marker) setCurrentPosition(marker.position);
    } else {
      setCurrentPosition(cusPos);
    }
  };

  // Calculate distances between customer and other locations
  const calculateDistances = async () => {
    if (!cusPos) return;
    const service = new google.maps.DistanceMatrixService();
    const origins = [{ lat: cusPos.lat, lng: cusPos.lng }];
    const destinations = markers.map((marker) => ({
      lat: marker.position.lat,
      lng: marker.position.lng,
    }));

    service.getDistanceMatrix(
      {
        origins: origins,
        destinations: destinations,
        travelMode: "DRIVING",
      },
      (response, status) => {
        if (status === "OK") {
          const results = response.rows[0].elements;
          const updatedLocations = results.map((result, index) => ({
            ...locations[index],
            distance: result.distance.text,
          }));
          setLocations(updatedLocations);
          console.log(updatedLocations);
          console.log(locations);
        }
      }
    );
  };

  return (
    <Fragment>
      <div className="container">
        <h1 className="text-center">Location!</h1>
        <div style={{ width: "100%", height: "90vh" }}>
          {isLoaded ? (
            <GoogleMap
              center={currentPosition || cusPos || singaporeLoc}
              zoom={13}
              onClick={() => handleActiveMarker(null)}
              mapContainerStyle={{ width: "100%", height: "90vh" }}
            >
              {cusPos && (
                <MarkerF
                  key={cusPos.lat}
                  position={cusPos}
                  onClick={() => handleActiveMarker(0)}
                  icon={{
                    url: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
                    size: new google.maps.Size(20, 32),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(0, 32),
                  }}
                >
                  {activeMarker === 0 && (
                    <InfoWindowF onCloseClick={() => handleActiveMarker(null)}>
                      <div>Current location</div>
                    </InfoWindowF>
                  )}
                </MarkerF>
              )}
              {locations.map(({ id, name, position, distance }) => (
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
