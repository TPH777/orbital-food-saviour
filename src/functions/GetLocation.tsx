import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

export const getLocList = async () => {
  try {
    const locRef = collection(db, "Business");
    const querySnapshot = await getDocs(locRef);

    const returnList = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    // console.log(returnList);
    return returnList;
  } catch (error) {
    throw error;
  }
};
