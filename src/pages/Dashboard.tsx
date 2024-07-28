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
import { deleteFav } from "../functions/DeleteFav";

export function Dashboard() {
  const { user, isConsumer } = useAuth();
  const navigate = useNavigate();

  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [selectedFoodId, setSelectedFoodId] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [foodList, setFoodList] = useState<FoodItem[]>([]);
  const [search, setSearch] = useState<string>("");
  const [cuisine, setCuisine] = useState<string>("~Cuisine~");
  const [sort, setSort] = useState<string>("~Sort~");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user === null) {
      // Wait for the authentication state to be determined
      return;
    }
    if (!user) {
      navigate("/login");
      return;
    }
    if (isConsumer) {
      navigate("/");
      return;
    }
    setIsLoading(false);
    fetchFoodList();
  }, [user, isConsumer, navigate]);

  const fetchFoodList = async () => {
    try {
      setIsLoading(true);
      const updatedFoodList = await getFoodList();
      const businessFoodList = updatedFoodList.filter((food) => {
        return food.userId === user?.uid; // Display business food items only
      });
      setFoodList(businessFoodList);
    } catch (error) {
      console.error("Error fetching food items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFood = useCallback(async (id: string) => {
    const confirm = await deleteWarning();
    if (confirm) {
      try {
        const foodDoc = doc(db, "food", id);
        const data = (await getDoc(foodDoc)).data();
        if (data) {
          await deleteObject(ref(getStorage(), data.imagePath));
          await deleteDoc(foodDoc);
          setFoodList((prevList) => prevList.filter((food) => food.id !== id));
          try {
            deleteFav(id); // Delete food item for all conumers that saved it as favorites
          } catch (error) {
            throw error;
          }
          deleteSuccess(data.name);
        }
      } catch (error) {
        console.error("Error deleting food item:", error);
      }
    }
  }, []);

  const updateFood = useCallback((id: string) => {
    setSelectedFoodId(id);
    setIsEditing(true);
  }, []);

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
        return a.name.localeCompare(b.name);
      });
  }, [foodList, search, cuisine, sort]);

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
          <BusCards
            foodList={searchFoodList}
            updateFood={updateFood}
            deleteFood={deleteFood}
            setCuisine={setCuisine}
          />
        </>
      )}

      {isAdding && (
        <Add getFoodList={fetchFoodList} setIsAdding={setIsAdding} />
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
