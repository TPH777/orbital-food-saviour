import React, { Fragment, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";

const singaporeLoc = { lat: 1.3521, lng: 103.8198 };
const gMapKey = import.meta.env.VITE_REACT_APP_gmap; //gmap api key
const markers = [
  {
    id: 1,
    name: "NUS",
    position: { lat: 1.2966, lng: 103.77641 },
  },
  {
    id: 2,
    name: "Kent Ridge",
    position: { lat: 1.2933, lng: 103.7831 },
  },
  {
    id: 3,
    name: "Botanic Garden",
    position: { lat: 1.3223, lng: 103.8149 },
  },
]; //need replace with db data

function App() {
  const [cusLatitude, setLatitude] = useState(null);
  const [cusLongitude, setLongitude] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [cusPos, setCusPos] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const [distances, setDistances] = useState([]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: gMapKey,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
        setCurrentPosition({ lat: latitude, lng: longitude });
        setCusPos({ lat: latitude, lng: longitude });
      },
      (error) => console.log(error),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  }, []);

  useEffect(() => {
    if (distances) {
      calculateDistances();
    }
  }, [currentPosition]);

  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
    if (marker !== 0) {
      setCurrentPosition(markers.find((m) => m.id === marker).position);
    } else {
      setCurrentPosition(cusPos);
    }
  };

  const calculateDistances = async () => {
    //calc distance of customer to every other location
    try {
      const origins = [{ lat: cusLatitude, lng: cusLongitude }];
      const destinations = markers.map((marker) => ({
        lat: marker.position.lat,
        lng: marker.position.lng,
      }));

      const service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: origins,
          destinations: destinations,
          travelMode: "DRIVING",
        },
        (response, status) => {
          if (status === "OK") {
            const results = response.rows[0].elements;
            const updatedDistances = results.map((result, index) => ({
              id: markers[index].id,
              name: markers[index].name,
              distance: result.distance.text,
              position: markers[index].position,
            }));
            setDistances(updatedDistances);
          }
        }
      );
    } catch (error) {
      console.error("Error fetching distance data:", error);
    }
    console.log(distances);
  };

  return (
    <Fragment>
      <div className="container">
        <h1 className="text-center">Location!</h1>
        <div style={{ width: "100%", height: "90vh" }}>
          {isLoaded ? (
            <GoogleMap
              center={currentPosition || cusPos}
              zoom={13}
              onClick={() => setActiveMarker(null)}
              mapContainerStyle={{ width: "100%", height: "90vh" }}
            >
              {cusPos && (
                <MarkerF
                  key={0}
                  position={cusPos}
                  onClick={() => handleActiveMarker(0)}
                  icon={{
                    url: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
                    size: new google.maps.Size(20, 32),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(0, 32),
                  }}
                >
                  {activeMarker === 0 && ( //show customer loc
                    <InfoWindowF onCloseClick={() => setActiveMarker(null)}>
                      <div>Current location</div>
                    </InfoWindowF>
                  )}
                </MarkerF>
              )}
              {distances.map(
                (
                  { id, name, position, distance } //show the rest loc
                ) => (
                  <MarkerF
                    key={id}
                    position={position}
                    onClick={() => handleActiveMarker(id)}
                  >
                    {activeMarker === id && (
                      <InfoWindowF onCloseClick={() => setActiveMarker(null)}>
                        <div>
                          <strong>{name}</strong> <br /> Distance: {distance}
                        </div>
                      </InfoWindowF>
                    )}
                  </MarkerF>
                )
              )}
            </GoogleMap>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
    </Fragment>
  );
}

export default App;
