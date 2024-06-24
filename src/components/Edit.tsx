import { useState } from "react";
import { CrudForm } from "./CrudForm";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../config/firebase";
import { ref, uploadBytes } from "firebase/storage";
import { invalidInputWarning, updateSuccess } from "../functions/Alert";
import { FoodItem } from "../interface/FoodItem";
import { timestampToDate } from "../functions/Date";

interface EditProps {
  foodList: FoodItem[];
  selectedFoodId: string;
  getFoodList: Function;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Edit = ({
  foodList,
  selectedFoodId,
  getFoodList,
  setIsEditing,
}: EditProps) => {
  const [food] = foodList.filter((food: any) => food.id === selectedFoodId);
  const [name, setName] = useState<string>(food.name);
  const [price, setPrice] = useState<number>(food.price);
  const [image, setImage] = useState<File>();
  const [post, setPost] = useState<boolean>(food.post);
  const [date, setDate] = useState<Date>(timestampToDate(food.date));

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (invalidInputWarning(name, price, image, date, false)) {
      return;
    }

    if (image) {
      const foodDoc = doc(db, "food", selectedFoodId);
      const data = (await getDoc(foodDoc)).data();
      if (data) {
        const storageRef = ref(storage, data.imagePath);
        try {
          await uploadBytes(storageRef, image);
        } catch (error) {
          console.log(error);
        }
      }
    }

    try {
      await updateDoc(doc(db, "food", selectedFoodId), {
        name: name,
        price: price,
        post: post,
        date: date,
      });
      setIsEditing(false);
      getFoodList();
      updateSuccess(name);
      if (image) {
        // To refresh image
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <CrudForm
      add={false}
      name={name}
      price={price}
      post={post}
      date={date}
      setName={setName}
      setPrice={setPrice}
      setPost={setPost}
      setDate={setDate}
      handleForm={handleUpdate}
      handleImage={handleImage}
      setInProgress={setIsEditing}
    />
  );
};
