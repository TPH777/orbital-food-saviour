import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "../config/firebase";
import { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { addSuccess, invalidInputWarning } from "../functions/Alert";
import { CrudForm } from "./CrudForm";

interface AddProps {
  user: any;
  getFoodList: Function;
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Add = ({ user, getFoodList, setIsAdding }: AddProps) => {
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [image, setImage] = useState<any>();
  const [post, setPost] = useState<boolean>(false);
  const [date, setDate] = useState<Date>(new Date());

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // To prevent the default form submission to trigger a full page reload

    if (invalidInputWarning(name, price, image, date, post, true)) {
      return;
    }

    // Upload image to storage
    const imagePath = "images/" + `${user.uid}/` + uuidv4();
    const storageRef = ref(storage, imagePath);
    try {
      await uploadBytes(storageRef, image);
    } catch (error) {
      console.log(error);
    }

    getDownloadURL(storageRef) // Download image url
      .then(async (url) => {
        const imageURL = url;
        await addDoc(collection(db, "food"), {
          name: name,
          price: price,
          date: date,
          post: post,
          userId: user.uid,
          business: user.displayName,
          imageURL: imageURL,
          imagePath: imagePath,
        });
        setIsAdding(false);
        getFoodList();
        addSuccess(name, price);
      })
      .catch((error) => console.log(error));
  };

  return (
    <CrudForm
      add={true}
      name={""}
      price={0}
      date={date}
      post={post}
      setName={setName}
      setPrice={setPrice}
      setPost={setPost}
      setDate={setDate}
      handleForm={handleAdd}
      handleImage={handleImage}
      setInProgress={setIsAdding}
    />
  );
};
