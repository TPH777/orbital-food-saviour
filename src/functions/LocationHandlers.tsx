import {
  useLocationContext,
  singaporeLoc,
  Location,
} from "../context/Location";
import { useEffect, useState } from "react";
import { collection, GeoPoint, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

export const useGetCurLoc = () => {
  const { locations, setLocations } = useLocationContext();
  const updateLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
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
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
  const [locList, setLocList] = useState<{}[]>([]); // State for user favorite food items
  const { locations, setLocations } = useLocationContext();

  const getLocList = async () => {
    try {
      const locRef = collection(db, "Business");
      const querySnapshot = await getDocs(locRef);

      const returnList = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      return returnList;
    } catch (error) {
      throw error;
    }
  };

  const fetchLocList = async () => {
    setIsLoading(true);
    try {
      const updatedLocList = await getLocList();
      setLocList(updatedLocList);
    } catch (error) {
      console.error("Error fetching food items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationContext = async () => {
    await fetchLocList();
    const updateLoc: Location[] = locList.map((loc) => {
      const id = loc.id || "";
      const name = loc.name || "";
      const geoPoint = loc.location || new GeoPoint(0, 0);

      return {
        id,
        name,
        distance: "",
        position: {
          lat: geoPoint._lat,
          lng: geoPoint._long,
        },
      };
    });

    setLocations({
      curLoc: {
        lat: locations.curLoc.lat,
        lng: locations.curLoc.lng,
      },
      locs: updateLoc,
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
        if (status === "OK") {
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
          setLocations({
            curLoc: locations.curLoc,
            locs: updatedLocations,
          });
        } else {
          console.error("Error calculating distances:", status);
        }
      }
    );
  };

  return { handleLocationContext, isLoading, locList, calculateDistances };
};
