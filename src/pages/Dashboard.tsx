import { useEffect, useState } from "react";
import swal from "sweetalert";

import { auth, db } from "../config/firebase";
import {
  doc,
  getDocs,
  collection,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

import ErrorText from "../components/ErrorText";
import { Cards } from "../components/Cards";
import { Edit } from "../components/Edit";
import { Add } from "../components/Add";
import { deleteObject, getStorage, ref } from "firebase/storage";

export function Dashboard() {
  const user = auth.currentUser;

  const [error, setError] = useState<string>("");
  const [isAdding, setIsAdding] = useState(false);
  const [selectedFoodId, setSelectedFoodId] = useState<any>();
  const [isEditing, setIsEditing] = useState(false);

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

  const deleteFood = async (id: string) => {
    swal({
      icon: "warning",
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      buttons: [true, true],
    }).then(async (result: boolean) => {
      if (result) {
        try {
          const foodDoc = doc(db, "food", id);
          const data = (await getDoc(foodDoc)).data();
          if (data !== undefined) {
            deleteObject(ref(getStorage(), data.imagePath));
          }
          deleteDoc(foodDoc);
          swal({
            icon: "success",
            title: "Deleted!",
            text: `Data has been deleted.`,
            buttons: [false],
            timer: 1000,
          });
          getFoodList();
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const updateFood = async (id: string) => {
    setSelectedFoodId(id);
    setIsEditing(true);
  };

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
          <Cards
            user={user}
            foodList={foodList}
            updateFood={updateFood}
            deleteFood={deleteFood}
          />
        </>
      )}

      {isAdding && <Add getFoodList={getFoodList} setIsAdding={setIsAdding} />}

      {isEditing && (
        <Edit
          foodList={foodList}
          selectedFoodId={selectedFoodId}
          getFoodList={getFoodList}
          setIsEditing={setIsEditing}
        />
      )}
      <ErrorText error={error} />
    </>
  );
}
