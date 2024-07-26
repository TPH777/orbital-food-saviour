import {
  collection,
  getDocs,
  writeBatch,
  query,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";

interface FavList {
  favorites: string[];
}

export const deleteFav = async (foodId: string) => {
  try {
    const favCollectionRef = collection(db, "consumer");
    const q = query(
      favCollectionRef,
      where("favorites", "array-contains", foodId)
    );
    const querySnapshot = await getDocs(q);
    const batch = writeBatch(db);

    querySnapshot.forEach((doc) => {
      const consumerDoc = doc.data() as FavList;
      const updatedFavList = consumerDoc.favorites.filter(
        (id) => id !== foodId
      );
      batch.update(doc.ref, { favorites: updatedFavList });
    });

    await batch.commit();
  } catch (error: any) {
    throw error;
  }
};
