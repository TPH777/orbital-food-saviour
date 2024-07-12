import { useEffect, useMemo, useState } from "react";
import Card from "react-bootstrap/Card";
import { Badge, Button, Col, Row, Spinner } from "react-bootstrap";
import { Search } from "../components/Search";
import { FoodItem } from "../interface/FoodItem";
import { timestampToString } from "../functions/Date";
import { getFoodList } from "../functions/GetFood";
import { useAuth } from "../context/Auth";
import { getFavFoodList } from "../functions/GetFav";
import { HeartSwitch } from "@anatoliygatt/heart-switch";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export function Home() {
  const [foodList, setFoodList] = useState<FoodItem[]>([]);
  const [search, setSearch] = useState<string>("");
  const [cuisine, setCuisine] = useState<string>("~Cuisine~");
  const [sort, setSort] = useState<string>("~Sort~");
  const [business, setBusiness] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [favList, setFavList] = useState<string[]>([]);
  const { user, isConsumer } = useAuth();

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

  // To wait for async auth
  useEffect(() => {
    fetchFoodList();
  }, [user, isConsumer]);

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
        return a.date > b.date ? 1 : -1;
      });
  }, [foodList, search, cuisine, business, sort]);

  let navigate = useNavigate();
  const toggleFavorite = async (foodId: string) => {
    if (!user) {
      // Not logged in
      navigate("/login");
    } else {
      setFavList((prev) => {
        const newFavList = prev.includes(foodId)
          ? prev.filter((id) => id !== foodId) // Remove
          : [...prev, foodId]; // Apppend
        updateDoc(doc(db, "consumer", user.uid), { favorites: newFavList });
        return newFavList;
      });
    }
  };

  return (
    <>
      <Search
        search={search}
        cuisine={cuisine}
        sort={sort}
        setSearch={setSearch}
        setCuisine={setCuisine}
        setSort={setSort}
      />

      <Button
        variant="secondary"
        className="mb-4"
        hidden={!business}
        onClick={() => setBusiness("")}
      >
        Showing {business}'s results only, Click to Return
      </Button>

      {isLoading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : (
        <>
          <Row md={4} className="g-4">
            {searchFoodList.map((food, index) => (
              <Col key={index}>
                <Card className="flex" key={food.id}>
                  <Card.Img variant="top" src={food.imageURL} />
                  <Card.Body>
                    <Card.Title>{food.name}</Card.Title>
                    <Card.Subtitle>${food.price}</Card.Subtitle>
                    <Card.Text>Date: ${timestampToString(food.date)}</Card.Text>

                    <Badge
                      style={{ cursor: "pointer" }}
                      pill
                      className="ms-2"
                      bg="warning"
                      onClick={() => setCuisine(food.cuisine)}
                    >
                      {food.cuisine}
                    </Badge>
                    <Badge
                      style={{ cursor: "pointer" }}
                      pill
                      className="ms-2"
                      bg="dark"
                      onClick={() => setBusiness(food.business)}
                    >
                      {food.business}
                    </Badge>
                    <HeartSwitch
                      size="sm"
                      checked={favList.includes(food.id) ? true : false}
                      onChange={() => toggleFavorite(food.id)}
                    />
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}

      {!isLoading && searchFoodList.length == 0 && (
        <h1 className="mt-3">No Results</h1>
      )}
    </>
  );
}
