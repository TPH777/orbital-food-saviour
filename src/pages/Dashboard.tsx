import { useCallback, useEffect, useMemo, useState } from "react";
import { db } from "../config/firebase";
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { BusCards } from "../components/BusCards";
import { Edit } from "../components/Edit";
import { Add } from "../components/Add";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { Search } from "../components/Search";
import { FoodItem } from "../interface/FoodItem";
import { deleteSuccess, deleteWarning } from "../functions/Alert";
import { getFoodList } from "../functions/GetFood";
import { Spinner } from "react-bootstrap";
import { useAuth } from "../context/Auth";
import { useNavigate } from "react-router-dom";

export function Dashboard() {
  const { user, isConsumer } = useAuth(); // Auth context
  // Redirect the user if not authenticated or a consumer
  let navigate = useNavigate();
  if (!user) {
    navigate("/login");
    return;
  }
  if (isConsumer) {
    navigate("/");
    return;
  }

  const [isAdding, setIsAdding] = useState<boolean>(false); // State for adding a new food item
  const [selectedFoodId, setSelectedFoodId] = useState<string>(""); // State for selected food item ID
  const [isEditing, setIsEditing] = useState<boolean>(false); // State for editing a food item
  const [foodList, setFoodList] = useState<FoodItem[]>([]); // State for the list of food items
  const [search, setSearch] = useState<string>(""); // State for search query
  const [cuisine, setCuisine] = useState<string>("~Cuisine~"); // State for selected cuisine
  const [sort, setSort] = useState<string>("~Sort~"); // State for sorting option
  const [isLoading, setIsLoading] = useState<boolean>(false); // State for loading status

  // Fetch food items from the database
  const fetchFoodList = async () => {
    try {
      setIsLoading(true);
      setFoodList(await getFoodList());
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching food items:", error);
    }
  };

  // Fetch food list when user or consumer status changes
  useEffect(() => {
    fetchFoodList();
  }, [user, isConsumer]);

  // Delete food item from the database
  const deleteFood = useCallback(
    async (id: string) => {
      const confirm = await deleteWarning(); // Show delete confirmation
      if (confirm) {
        try {
          const foodDoc = doc(db, "food", id);
          const data = (await getDoc(foodDoc)).data();
          if (data !== undefined) {
            await deleteObject(ref(getStorage(), data.imagePath)); // Delete image from storage
            await deleteDoc(foodDoc); // Delete food document
            setFoodList(foodList.filter((food) => food.id !== id)); // Update food list
            deleteSuccess(data.name); // Show success message
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
    [foodList]
  ); // Depend on foodList to re-create callback when foodList changes

  // Update food item (set editing state)
  const updateFood = useCallback((id: string) => {
    setSelectedFoodId(id); // Set selected food ID
    setIsEditing(true); // Set editing state
  }, []);

  // Filter and sort the food list based on search, cuisine, and sort criteria
  const searchFoodList = useMemo(() => {
    return foodList
      .filter((food) => {
        const nameMatches = food.name
          .toLowerCase()
          .includes(search.toLowerCase());
        const cuisineMatches =
          cuisine === "~Cuisine~" || food.cuisine === cuisine;
        return nameMatches && cuisineMatches;
      })
      .sort((a, b) => {
        if (sort === "Date") return a.date > b.date ? 1 : -1;
        if (sort === "Price") return a.price > b.price ? 1 : -1;
        if (sort === "Cuisine") return a.cuisine > b.cuisine ? 1 : -1;
        if (sort === "Favorites")
          return a.favoriteCount < b.favoriteCount ? 1 : -1;
        return a.name.localeCompare(b.name); // Default by name
      });
  }, [foodList, search, cuisine, sort]); // Depend on foodList, search, cuisine, and sort to re-create memoized value

  return (
    <>
      {/* Display loading spinner */}
      {isLoading && (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      )}

      {!isLoading && !isAdding && !isEditing && (
        <>
          <h1 className="mb-4">{user.displayName}'s Dashboard</h1>
          <div className="d-grid gap-2 mb-4">
            {/* Button to add new food */}
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={() => setIsAdding(true)}
            >
              Add new food
            </button>
          </div>

          {/* Search component for filtering food items */}
          <Search
            search={search}
            cuisine={cuisine}
            sort={sort}
            setSearch={setSearch}
            setCuisine={setCuisine}
            setSort={setSort}
          />

          {/* Display business created food items */}
          <BusCards
            foodList={searchFoodList}
            updateFood={updateFood}
            deleteFood={deleteFood}
          />
        </>
      )}

      {/* Display adding form */}
      {isAdding && (
        <Add getFoodList={fetchFoodList} setIsAdding={setIsAdding} />
      )}

      {/* Display editing form */}
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
