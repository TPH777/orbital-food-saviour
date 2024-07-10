import {
  useContext,
  createContext,
  useEffect,
  useState,
  FC,
  ReactNode,
} from "react";
import { collection, getDocs, writeBatch } from "firebase/firestore";
import { db } from "../config/firebase";
import { FoodItem } from "../interface/FoodItem";
import { timestampToDate } from "../functions/Date";

// Create a context with a default value of null
const FoodContext = createContext<FoodItem[]>([]);

// FoodContextProvider component to wrap around the app
export const FoodContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [foodList, setFoodList] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Function to fetch food items from Firestore and update the list

  // useEffect to fetch food list on component mount
  useEffect(() => {
    const getFoodList = async () => {
      try {
        setIsLoading(true);
        const foodCollectionRef = collection(db, "food");
        const querySnapshot = await getDocs(foodCollectionRef);

        const batch = writeBatch(db);

        querySnapshot.forEach((doc) => {
          const foodItem = doc.data() as FoodItem;

          // Check if the food item's date is before the current date
          if (foodItem.post && timestampToDate(foodItem.date) < new Date()) {
            // Update the document to set post to false in the batch
            const foodDocRef = doc.ref;
            batch.update(foodDocRef, { post: false });
          }
        });

        // Commit the batch update
        await batch.commit();

        // Fetch the updated data after the batch update
        const updatedQuerySnapshot = await getDocs(foodCollectionRef);
        const updatedFoodList = updatedQuerySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as FoodItem[];

        // Update the state with the fetched food list
        setFoodList(updatedFoodList);
        console.log("called");
        setIsLoading(false);
      } catch (error) {
        throw error; // Rethrow the error to handle it in the calling component
      }
    };

    return () => {
      getFoodList();
    };
  }, []);

  // Provide the food list state to child components
  return (
    <FoodContext.Provider value={foodList}>
      {!isLoading && children}
    </FoodContext.Provider>
  );
};

// Custom hook to use the FoodContext
export const useFoodList = (): FoodItem[] => {
  const context = useContext(FoodContext);

  // Throw an error if the hook is used outside of FoodContextProvider
  if (context === null) {
    throw new Error("useFoodList must be used within a FoodProvider");
  }

  return context; // Return the context value
};
