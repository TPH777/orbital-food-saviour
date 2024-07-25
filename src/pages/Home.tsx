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
import { ConCards } from "../components/ConCards";
import { consumersOnly } from "../functions/Alert";

export function Home() {
  const [foodList, setFoodList] = useState<FoodItem[]>([]); // State for all posted food items
  const [search, setSearch] = useState<string>(""); // State for search input
  const [cuisine, setCuisine] = useState<string>("~Cuisine~"); // State for selected cuisine
  const [sort, setSort] = useState<string>("~Sort~"); // State for sorting
  const [business, setBusiness] = useState<string>(""); // State for selected business
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
  const [favList, setFavList] = useState<string[]>([]); // State for consumer favorite food items
  const { user, isConsumer } = useAuth(); // Auth context

  // Fetch food items from the database
  const fetchFoodList = async () => {
    setIsLoading(true);
    try {
      const updatedFoodList = await getFoodList();
      const postedFoodList = updatedFoodList.filter((food) => {
        return food.post === true; // Display posted food items only
      });
      setFoodList(postedFoodList);
      if (user && isConsumer) {
        const userFavList = await getFavFoodList(user);
        setFavList(userFavList);
      }
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
    return foodList
      .filter((food) => {
        const nameMatches = food.name
          .toLowerCase()
          .includes(search.toLowerCase());
        const cuisineMatches =
          cuisine === "~Cuisine~" || food.cuisine === cuisine;
        const businessMatches = business === "" || food.business === business;
        return nameMatches && cuisineMatches && businessMatches;
      })
      .sort((a, b) => {
        if (sort === "Name") return a.name.localeCompare(b.name);
        if (sort === "Price") return a.price > b.price ? 1 : -1;
        if (sort === "Cuisine") return a.cuisine > b.cuisine ? 1 : -1;
        if (sort === "Favorites")
          return a.favoriteCount < b.favoriteCount ? 1 : -1;
        return a.date > b.date ? 1 : -1;
      });
  }, [foodList, search, cuisine, business, sort]);

  // Function to toggle favorite status of a food item
  let navigate = useNavigate();
  const toggleFavorite = useCallback(async (foodId: string) => {
    if (!user) {
      navigate("/login"); // Redirect to login if not logged in
    } else if (!isConsumer) {
      consumersOnly(); // Alert businesses that they cant save favorites
      return;
    } else {
      setFavList((prev) => {
        const add = !prev.includes(foodId);
        const newFavList = add
          ? [...prev, foodId] // Add to favorites
          : prev.filter((id) => id !== foodId); // Remove from favorites
        updateDoc(doc(db, "consumer", user.uid), { favorites: newFavList }); // Update in Firestore

        // Update favorite count in Firestore
        updateDoc(doc(db, "food", foodId), {
          favoriteCount: add ? increment(1) : increment(-1),
        });

        // Update local state for favorite count
        setFoodList((prevFoodList) =>
          prevFoodList.map((food) =>
            food.id === foodId
              ? {
                  ...food,
                  favoriteCount: add
                    ? food.favoriteCount + 1
                    : food.favoriteCount - 1,
                }
              : food
          )
        );
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
          favList={favList}
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
