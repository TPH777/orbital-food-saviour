import { useEffect, useState } from "react";
import { auth } from "../config/firebase";
import { db } from "../config/firebase";
import {
  doc,
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import ErrorText from "../components/ErrorText";

export function Dashboard() {
  const user = auth.currentUser;
  if (!user) {
    return;
  }

  const [error, setError] = useState<string>("");

  const [foodList, setFoodList] = useState<any[]>([]);
  const foodCollectionRef = collection(db, "food");

  const getFoodList = async () => {
    try {
      const data = await getDocs(foodCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setFoodList(filteredData);
    } catch (error) {
      setError("get failed");
    }
  };

  useEffect(() => {
    getFoodList();
  }, []);

  const [newName, setNewName] = useState("-");
  const [newPrice, setNewPrice] = useState(0);

  const createFood = async () => {
    try {
      await addDoc(foodCollectionRef, {
        name: newName,
        price: newPrice,
        userId: user.uid,
        business: user.displayName,
      });
      getFoodList();
    } catch (error) {
      setError("create failed");
    }
  };

  const deleteFood = async (id: string) => {
    const foodDoc = doc(db, "food", id);
    try {
      await deleteDoc(foodDoc);
      getFoodList();
    } catch (error) {
      setError("delete failed");
    }
  };

  const [updatedName, setUpdatedName] = useState("");
  const [updatedPrice, setUpdatedPrice] = useState("0");

  const updateFood = async (id: any) => {
    const foodDoc = doc(db, "food", id);
    try {
      await updateDoc(foodDoc, { name: updatedName, price: updatedPrice });
      getFoodList();
    } catch (error) {
      setError("delete failed");
    }
  };

  return (
    <>
      <h1>{user?.displayName}'s Dashboard</h1>
      <br />
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Food Name"
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          type="number"
          className="form-control"
          placeholder="Price"
          onChange={(e) => setNewPrice(Number(e.target.value))}
        />
        <button type="submit" className="input-group-text" onClick={createFood}>
          Create
        </button>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Food</th>
            <th scope="col">Price</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {foodList.map(
            (food, index) =>
              food.userId == user.uid && (
                <tr key={food.id}>
                  <th scope="row">{index}</th>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={food.name}
                      onChange={(e) => setUpdatedName(e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      defaultValue={food.price}
                      onChange={(e) => setUpdatedPrice(e.target.value)}
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-outline-danger float-end ms-2"
                      onClick={() => deleteFood(food.id)}
                    >
                      Delete
                    </button>
                    <button
                      type="submit"
                      className="btn btn-outline-secondary float-end"
                      onClick={() => updateFood(food.id)}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              )
          )}
        </tbody>
      </table>
      <p className="text-center text-">End of List</p>
      <p className="text-danger">Update Button is not functional yet</p>
      <ErrorText error={error} />
    </>
  );
}
