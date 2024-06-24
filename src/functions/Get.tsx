import { collection, getDocs, writeBatch } from "firebase/firestore";
import { db } from "../config/firebase";
import { FoodItem } from "../interface/FoodItem";
import { timestampToDate } from "../functions/Date";

export const getFoodList = async () => {
  try {
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

    return updatedFoodList;
  } catch (error) {
    throw error; // Rethrow the error to handle it in the calling component
  }
};
