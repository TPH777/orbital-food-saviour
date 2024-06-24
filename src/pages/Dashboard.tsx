import { useEffect, useState } from "react";

import { auth, db } from "../config/firebase";
import {
  doc,
  deleteDoc,
  getDoc,
  getDocs,
  collection,
} from "firebase/firestore";

import { Cards } from "../components/Cards";
import { Edit } from "../components/Edit";
import { Add } from "../components/Add";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { Search } from "../components/Search";
import { FoodItem } from "../interface/FoodItem";
import { deleteSuccess, deleteWarning } from "../functions/Alert";

export function Dashboard() {
  const user = auth.currentUser;
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [selectedFoodId, setSelectedFoodId] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [foodList, setFoodList] = useState<FoodItem[]>([]);
  const [search, setSearch] = useState<string>("");

  const getFoodList = async () => {
    try {
      const data = await getDocs(collection(db, "food"));
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as FoodItem[];
      setFoodList(filteredData);
      console.log("called");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFoodList();
  }, []);

  const deleteFood = async (id: string) => {
    const confirm = await deleteWarning();
    if (confirm) {
      try {
        const foodDoc = doc(db, "food", id);
        const data = (await getDoc(foodDoc)).data();
        if (data !== undefined) {
          await deleteObject(ref(getStorage(), data.imagePath));
          await deleteDoc(foodDoc);
          getFoodList();
          deleteSuccess(data.name);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const updateFood = async (id: string) => {
    setSelectedFoodId(id);
    setIsEditing(true);
  };

  const searchFoodList = foodList.filter((food) =>
    food.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <h1>{user?.displayName}'s Dashboard</h1>
      <br />
      {!isAdding && !isEditing && (
        <>
          <div className="d-grid gap-2">
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={() => setIsAdding(true)}
            >
              Add new food
            </button>
          </div>
          <br />
          <Search setQuery={setSearch} />
          <br />
          <Cards
            user={user}
            foodList={searchFoodList}
            updateFood={updateFood}
            deleteFood={deleteFood}
          />
        </>
      )}

      {isAdding && (
        <Add user={user} getFoodList={getFoodList} setIsAdding={setIsAdding} />
      )}

      {isEditing && (
        <Edit
          foodList={foodList}
          selectedFoodId={selectedFoodId}
          getFoodList={getFoodList}
          setIsEditing={setIsEditing}
        />
      )}
    </>
  );
}
