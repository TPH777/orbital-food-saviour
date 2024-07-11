import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { User } from "firebase/auth";

interface favList {
  favorites: string[];
}

export const getFavFoodList = async (currentUser: User) => {
  try {
    const docRef = doc(db, "consumer", currentUser.uid);
    const docSnap = await getDoc(docRef);
    const consumerData = (await docSnap.data()) as favList;
    return consumerData.favorites;
  } catch (error) {
    throw error;
  }
};
