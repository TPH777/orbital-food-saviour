import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { Search } from "../components/Search";
import { FoodItem } from "../interface/FoodItem";
import { getFoodList } from "../functions/GetFood";
import { useAuth } from "../context/Auth";
import { getFavFoodList } from "../functions/GetFav";
import { useNavigate } from "react-router-dom";
import { doc, increment, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { deleteWarning } from "../functions/Alert";
import { ConCards } from "../components/ConCards";

export function FavoritePage() {
  const { user, isConsumer } = useAuth(); // Auth context
  // Redirect the user if not authenticated or not a consumer
  let navigate = useNavigate();
  if (!user) {
    navigate("/login");
    return;
  }
  if (!isConsumer) {
    navigate("/");
    return;
  }

  const [foodList, setFoodList] = useState<FoodItem[]>([]); // State for user favorite food items
  const [search, setSearch] = useState<string>(""); // State for search input
  const [cuisine, setCuisine] = useState<string>("~Cuisine~"); // State for selected cuisine
  const [sort, setSort] = useState<string>("~Sort~"); // State for sorting
  const [business, setBusiness] = useState<string>(""); // State for selected business
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state

  // Fetch food items from the database
  const fetchFoodList = async () => {
    setIsLoading(true);
    try {
      const updatedFoodList = await getFoodList();
      const userFavList = await getFavFoodList(user); // Array of string of food.id of user favorites
      const finalFoodList = updatedFoodList.filter(
        (food) => userFavList.includes(food.id) // fav food items
      );
      setFoodList(finalFoodList);
    } catch (error) {
      console.error("Error fetching food items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch food list when user or consumer status changes
  useEffect(() => {
    fetchFoodList();
  }, [user, isConsumer]);

  // Filter and sort food items based on search criteria
  const searchFoodList = useMemo(() => {
    // To save state, reduce re-render
    return foodList
      .filter((food) => {
        // Filter by name, cuisine and business
        const nameMatches = food.name
          .toLowerCase()
          .includes(search.toLowerCase());
        const cuisineMatches =
          cuisine === "~Cuisine~" || food.cuisine === cuisine;
        const businessMatches = business === "" || food.business === business;
        return nameMatches && cuisineMatches && businessMatches;
      })
      .sort((a, b) => {
        // Sort
        if (sort === "Name") return a.name.localeCompare(b.name);
        if (sort === "Price") return a.price > b.price ? 1 : -1;
        if (sort === "Cuisine") return a.cuisine > b.cuisine ? 1 : -1;
        return a.date > b.date ? 1 : -1; // Default by date
      });
  }, [foodList, search, cuisine, business, sort]);

  // Function to toggle favorite status of a food item
  const toggleFavorite = useCallback(async (foodId: string) => {
    const confirm = await deleteWarning();
    if (confirm) {
      setFoodList((prev) => {
        // Remove from favorites
        const newFavList = prev.filter((food) => food.id !== foodId);
        updateDoc(doc(db, "consumer", user.uid), {
          favorites: newFavList.map((f) => f.id),
        });

        // Decrement favorite count in Firestore
        updateDoc(doc(db, "food", foodId), {
          favoriteCount: increment(-1),
        });
        return newFavList;
      });
    }
  }, []);

  return (
    <>
      {/* Search component for filtering food items */}
      <Search
        search={search}
        cuisine={cuisine}
        sort={sort}
        setSearch={setSearch}
        setCuisine={setCuisine}
        setSort={setSort}
      />

      {/* Button to clear business filter */}
      <Button
        variant="secondary"
        className="mb-4"
        hidden={!business}
        onClick={() => setBusiness("")}
      >
        Showing {business}'s results only, Click to Return
      </Button>

      {/* Display food items */}
      {isLoading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <ConCards
          favList={foodList.map((f) => f.id)}
          searchFoodList={searchFoodList}
          toggleFavorite={toggleFavorite}
          setCuisine={setCuisine}
          setBusiness={setBusiness}
        />
      )}

      {/* Display message if no results found */}
      {!isLoading && searchFoodList.length == 0 && (
        <h1 className="mt-3">No Results</h1>
      )}
    </>
  );
}
