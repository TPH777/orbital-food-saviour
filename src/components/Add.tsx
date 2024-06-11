import { addDoc, collection } from "firebase/firestore";
import swal from "sweetalert";
import { auth, db } from "../config/firebase";
import { useState } from "react";

export const Add = ({
  getFoodList,
  setIsAdding,
}: {
  getFoodList: Function;
  setIsAdding: Function;
}) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const user = auth.currentUser;
  if (!user) {
    return;
  }

  const handleAdd = async (e: any) => {
    e.preventDefault(); // To prevent the default form submission to trigger a full page reload

    if (!name || !price) {
      // Empty Input
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
      await addDoc(collection(db, "food"), {
        name: name,
        price: price,
        userId: user.uid,
        business: user.displayName,
      });
      setIsAdding(false);
      getFoodList();
      swal({
        icon: "success",
        title: "Added!",
        text: `${name} of $${price} has been Added.`,
        timer: 1500,
      });
    } catch (error) {
      console.log(error);
    }
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
