import { useState, useCallback } from "react";
import { collection, GeoPoint, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import {
  useLocationContext,
  singaporeLoc,
  Location,
} from "../context/Location";

interface FirestoreLocation {
  id: string;
  name: string;
  location: GeoPoint;
}

var local = [singaporeLoc.lat, singaporeLoc.lng];

export const useGetCurLoc = () => {
  const { locations, setLocations } = useLocationContext();
  const updateLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        local[0] = latitude;
        local[1] = longitude;
        setLocations({
          curLoc: {
            lat: latitude,
            lng: longitude,
          },
          locs: locations.locs,
        });
        console.log(locations);
      },
      (error) => {
        console.error(error);
        console.error("using default location: Singapore Center");
        setLocations({
          curLoc: {
            lat: singaporeLoc.lat,
            lng: singaporeLoc.lng,
          },
          locs: locations.locs,
        });
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };
  return { locations, updateLocation };
};

export const useUpdateLocations = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [locList, setLocList] = useState<FirestoreLocation[]>([]);
  const { locations, setLocations } = useLocationContext();

  const getLocList = async (): Promise<FirestoreLocation[]> => {
    try {
      const locRef = collection(db, "Business");
      const querySnapshot = await getDocs(locRef);

      const returnList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        location: doc.data().location,
      })) as FirestoreLocation[];
      return returnList;
    } catch (error) {
      throw error;
    }
  };

  const fetchLocList = useCallback(async () => {
    setIsLoading(true);
    try {
      const updatedLocList = await getLocList();
      setLocList(updatedLocList);
    } catch (error) {
      console.error("Error fetching locations:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLocationContext = useCallback(async () => {
    await fetchLocList();
    const local = await getCurLocation();
    const updateLoc: Location[] = locList.map((loc) => {
      const { id, name, location } = loc;
      return {
        id,
        name,
        distance: "",
        position: {
          lat: location.latitude,
          lng: location.longitude,
        },
      };
    });

    setLocations({
      curLoc: {
        lat: local[0],
        lng: local[1],
      },
      locs: updateLoc,
    });
  }, [fetchLocList, locList, setLocations]);

  const getCurLocation = async (): Promise<[number, number]> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve([latitude, longitude]);
        },
        (error) => {
          console.error(error);
          reject([singaporeLoc.lat, singaporeLoc.lng]);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    });
  };

  const calculateDistances = async (cusPos: { lat: number; lng: number }) => {
    if (!cusPos) return;
    const service = new google.maps.DistanceMatrixService();
    const origins = [{ lat: cusPos.lat, lng: cusPos.lng }];
    const destinations = locations.locs.map((loc) => loc.position);

    service.getDistanceMatrix(
      {
        origins: origins,
        destinations: destinations,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === "OK" && response?.rows[0]) {
          const results = response.rows[0].elements;
          const updatedLocations = locations.locs.map((loc, index) => {
            const result = results[index];
            const distanceText =
              result.status === "OK" ? result.distance.text : "Too Far";
            return {
              ...loc,
              distance: distanceText,
            };
          });
          setLocations((prevLocations) => ({
            curLoc: prevLocations.curLoc,
            locs: updatedLocations,
          }));
        } else {
          console.error("Error calculating distances:", status);
        }
      }
    );
  };

  return { handleLocationContext, isLoading, locList, calculateDistances };
};
