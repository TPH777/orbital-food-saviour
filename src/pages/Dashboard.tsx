import { useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { Cards } from "../components/Cards";
import { Edit } from "../components/Edit";
import { Add } from "../components/Add";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { Search } from "../components/Search";
import { FoodItem } from "../interface/FoodItem";
import { deleteSuccess, deleteWarning } from "../functions/Alert";
import { getFoodList } from "../functions/Get";
import { Spinner } from "react-bootstrap";

export function Dashboard() {
  const user = auth.currentUser;
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [selectedFoodId, setSelectedFoodId] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [foodList, setFoodList] = useState<FoodItem[]>([]);
  const [search, setSearch] = useState<string>("");
  const [cuisine, setCuisine] = useState<string>("~Cuisine~");
  const [sort, setSort] = useState<string>("~Sort~");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // To set food list
  const fetchFoodList = async () => {
    try {
      setIsLoading(true);
      const updatedFoodList = await getFoodList();
      setFoodList(updatedFoodList);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching food items:", error);
    }
  };

  useEffect(() => {
    fetchFoodList();
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
          setFoodList(foodList.filter((food) => food.id !== id));
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

  const searchFoodList = foodList.filter((food) => {
    const nameMatches = food.name.toLowerCase().includes(search.toLowerCase()); // Search
    const cuisineMatches = cuisine === "~Cuisine~" || food.cuisine === cuisine; // Filter
    return nameMatches && cuisineMatches;
  });

  searchFoodList.sort((a, b) => {
    // Sort
    if (sort === "Date") {
      return a.date > b.date ? 1 : -1;
    } else if (sort === "Price") {
      return a.price > b.price ? 1 : -1;
    } else if (sort === "Cuisine") {
      return a.cuisine > b.cuisine ? 1 : -1;
    } else {
      return a.name > b.name ? 1 : -1; // Default by name
    }
  });
  return (
    <>
      {isLoading && (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      )}
      {!isLoading && !isAdding && !isEditing && (
        <>
          <h1 className="mb-4">{user?.displayName}'s Dashboard</h1>
          <div className="d-grid gap-2 mb-4">
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={() => setIsAdding(true)}
            >
              Add new food
            </button>
          </div>

          <Search
            search={search}
            cuisine={cuisine}
            sort={sort}
            setSearch={setSearch}
            setCuisine={setCuisine}
            setSort={setSort}
          />

          <Cards
            user={user}
            foodList={searchFoodList}
            updateFood={updateFood}
            deleteFood={deleteFood}
          />
        </>
      )}

      {isAdding && (
        <Add
          user={user}
          getFoodList={fetchFoodList}
          setIsAdding={setIsAdding}
        />
      )}

      {isEditing && (
        <Edit
          foodList={foodList}
          selectedFoodId={selectedFoodId}
          getFoodList={fetchFoodList}
          setIsEditing={setIsEditing}
        />
      )}
    </>
  );
}
