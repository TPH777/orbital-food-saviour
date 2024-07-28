import { collection, getDocs, writeBatch } from "firebase/firestore";
import { db } from "../config/firebase";
import { FoodItem } from "../interface/FoodItem";
import { timestampToDate } from "./Date";

export const getFoodList = async () => {
  try {
    const foodCollectionRef = collection(db, "food"); // reference to food db
    const querySnapshot = await getDocs(foodCollectionRef); // get all docs in food db
    const batch = writeBatch(db); // Collate updates required

    querySnapshot.forEach((doc) => {
      const foodItem = doc.data() as FoodItem;
      // Check if the food item's date is before the current date
      if (foodItem.post && timestampToDate(foodItem.date) < new Date()) {
        // Update the document to set post to false in the batch
        foodItem.post = false;
        batch.update(doc.ref, { post: false });
      }
    });
    await batch.commit(); // Commit the batch update

    const updatedFoodList = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id, // Add food item's doc id to the food list
    })) as FoodItem[];
    return updatedFoodList;
  } catch (error) {
    throw error; // Rethrow the error to handle it in the calling component
  }
};
