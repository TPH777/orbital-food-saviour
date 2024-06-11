import { useEffect, useState } from "react";
import swal from "sweetalert";

import { auth } from "../config/firebase";
import { db } from "../config/firebase";
import { doc, getDocs, collection, deleteDoc } from "firebase/firestore";

import ErrorText from "../components/ErrorText";
import { Table } from "../components/Table";
import { Edit } from "../components/Edit";
import { Add } from "../components/Add";

export function Dashboard() {
  const user = auth.currentUser;
  if (!user) {
    return;
  }

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
    const foodDoc = doc(db, "food", id);
    swal({
      icon: "warning",
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      buttons: { cancel: true, confirm: true },
    }).then((result: any) => {
      if (result.value) {
        try {
          deleteDoc(foodDoc);
          swal({
            icon: "success",
            title: "Deleted!",
            text: `${foodDoc} Data has been deleted.`,
            timer: 1500,
          });
          getFoodList();
        } catch (error) {
          setError("delete failed");
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
          <Table
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
