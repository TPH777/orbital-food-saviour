import { doc, updateDoc } from "firebase/firestore";
import swal from "sweetalert";
import { db } from "../config/firebase";
import { useState } from "react";

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

  const handleUpdate = async (e: any) => {
    e.preventDefault();

    if (!name || !price) {
      return swal({
        icon: "error",
        title: "Error!",
        text: "All fields are required.",
      });
    }

    if (price <= 0) {
      // Invalid input
      return swal({
        icon: "error",
        title: "Error!",
        text: "Price must be greater than 0",
      });
    }

    try {
      await updateDoc(doc(db, "food", selectedFoodId), {
        name: name,
        price: price,
      });
      setIsEditing(false);
      getFoodList();
      swal({
        icon: "success",
        title: "Updated!",
        text: `Data has been updated.`,
        timer: 1500,
      });
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
