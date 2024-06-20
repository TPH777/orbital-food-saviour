import { doc, getDoc, updateDoc } from "firebase/firestore";
import swal from "sweetalert";
import { db, storage } from "../config/firebase";
import { useState } from "react";
import { ref, uploadBytes } from "firebase/storage";

export const Edit = ({
  foodList,
  selectedFoodId,
  getFoodList,
  setIsEditing,
}: {
  foodList: any;
  selectedFoodId: string;
  getFoodList: Function;
  setIsEditing: Function;
}) => {
  const [food] = foodList.filter((food: any) => food.id === selectedFoodId);
  const [name, setName] = useState(food.name);
  const [price, setPrice] = useState(food.price);
  const [image, setImage] = useState<File>();

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (price <= 0) {
      // Invalid input
      return swal({
        icon: "error",
        title: "Error!",
        text: "Price must be greater than 0",
      });
    }

    if (!name || !price) {
      // Empty Input
      return swal({
        icon: "error",
        title: "Error!",
        text: "All fields are required.",
      });
    }

    if (image) {
      const imageExt = image.type.split("/")[1]; // Invalid file type
      if (imageExt !== "jpeg" && imageExt !== "jpg" && imageExt !== "png") {
        return swal({
          icon: "error",
          title: "Error!",
          text: "Invalid image, file extension must be .jpeg, .jpg or .png",
        });
      }

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
      });
      setIsEditing(false);
      getFoodList();
      await swal({
        icon: "success",
        title: "Updated!",
        text: `${name} has been updated.`,
        timer: 1200,
        buttons: [false],
      });
      if (image) {
        // To refresh image
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleUpdate}>
      <h2>Update Food</h2>
      <div className="form-outline mb-4">
        <label>Name</label>
        <input
          id="name"
          type="text"
          name="name"
          value={name}
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
          value={price}
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
      <input className="btn btn-primary mb-4" type="submit" value="Update" />
      <input
        style={{ marginLeft: "12px" }}
        className="btn btn-danger mb-4"
        type="button"
        value="Cancel"
        onClick={() => setIsEditing(false)}
      />
    </form>
  );
};
