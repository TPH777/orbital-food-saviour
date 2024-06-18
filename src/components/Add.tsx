import { addDoc, collection } from "firebase/firestore";
import swal from "sweetalert";
import { auth, db, storage } from "../config/firebase";
import { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

export const Add = ({
  getFoodList,
  setIsAdding,
}: {
  getFoodList: Function;
  setIsAdding: Function;
}) => {
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [image, setImage] = useState<File>();
  const user = auth.currentUser;
  if (!user) {
    return;
  }

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // To prevent the default form submission to trigger a full page reload

    if (price <= 0) {
      // Invalid input
      return swal({
        icon: "error",
        title: "Error!",
        text: "Price must be greater than 0",
      });
    }

    if (!name || !price || !image) {
      // Empty Input
      return swal({
        icon: "error",
        title: "Error!",
        text: "All fields are required.",
      });
    }

    const imageExt = image.type.split("/")[1]; // Invalid file type
    if (imageExt !== "jpeg" && imageExt !== "jpg" && imageExt !== "png") {
      return swal({
        icon: "error",
        title: "Error!",
        text: "Invalid image, file extension must be .jpeg, .jpg or .png",
      });
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
          userId: user.uid,
          business: user.displayName,
          imageURL: imageURL,
          imagePath: imagePath,
        });
        setIsAdding(false);
        getFoodList();
        swal({
          icon: "success",
          title: "Added!",
          text: `${name} of $${price} has been Added.`,
          timer: 1000,
          buttons: [false],
        });
      })
      .catch((error) => console.log(error));
  };

  return (
    <form onSubmit={handleAdd}>
      <h2>Add Food</h2>
      <div className="form-outline mb-4">
        <label>Name</label>
        <input
          id="name"
          type="text"
          name="name"
          className="form-control"
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="form-outline mb-4">
        <label>Price</label>
        <input
          id="price"
          type="number"
          name="price"
          className="form-control"
          onChange={(e) => setPrice(Number(e.target.value))}
        />
      </div>
      <label>Image</label>
      <div className="input-group mb-3">
        <input
          type="file"
          className="form-control"
          id="image"
          onChange={handleImage}
        />
      </div>
      <input className="btn btn-primary mb-4" type="submit" value="Add" />
      <input
        style={{ marginLeft: "12px" }}
        className="btn btn-danger mb-4"
        type="button"
        value="Cancel"
        onClick={() => setIsAdding(false)}
      />
    </form>
  );
};
