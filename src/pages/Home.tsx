import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import { Badge, Button, Col, Row, Spinner } from "react-bootstrap";
import { Search } from "../components/Search";
import { FoodItem } from "../interface/FoodItem";
import { timestampToString } from "../functions/Date";
import { getFoodList } from "../functions/Get";

export function Home() {
  const [foodList, setFoodList] = useState<FoodItem[]>([]);
  const [search, setSearch] = useState<string>("");
  const [cuisine, setCuisine] = useState<string>("~Cuisine~");
  const [sort, setSort] = useState<string>("~Sort~");
  const [business, setBusiness] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchFoodList = async () => {
    try {
      setIsLoading(true);
      const updatedFoodList = await getFoodList();
      const postedFoodList = updatedFoodList.filter((food) => {
        // Display posted food items only
        return food.post === true;
      });
      setFoodList(postedFoodList);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching food items:", error);
    }
  };

  useEffect(() => {
    fetchFoodList();
  }, []);

  const searchFoodList = foodList.filter((food) => {
    const nameMatches = food.name.toLowerCase().includes(search.toLowerCase()); // Search Bar
    const cuisineMatches = cuisine === "~Cuisine~" || food.cuisine === cuisine; // Filter
    const businessMatches = business === "" || food.business === business; // Badges
    return nameMatches && cuisineMatches && businessMatches;
  });

  searchFoodList.sort((a, b) => {
    // Sort
    if (sort === "Name") {
      return a.name > b.name ? 1 : -1;
    } else if (sort === "Price") {
      return a.price > b.price ? 1 : -1;
    } else if (sort === "Cuisine") {
      return a.cuisine > b.cuisine ? 1 : -1;
    } else {
      return a.date > b.date ? 1 : -1; // Default By Date
    }
  });

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

      {isLoading && (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      )}

      {!isLoading && (
        <Row md={4} className="g-4">
          {searchFoodList.map((food, index) => (
            <Col key={index}>
              <Card style={{ width: "18rem" }} key={food.id}>
                <Card.Img variant="top" src={food.imageURL} />
                <Card.Body>
                  <Card.Title>{food.name}</Card.Title>
                  <Card.Subtitle>${food.price}</Card.Subtitle>
                  <Card.Text>
                    {food.date
                      ? `Date: ${timestampToString(food.date)}`
                      : "No Date"}
                  </Card.Text>
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
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {!isLoading && searchFoodList.length == 0 && (
        <h1 className="mt-3">No Results</h1>
      )}
    </>
  );
}
