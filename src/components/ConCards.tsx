import { Badge, Card, Col, Container, Row } from "react-bootstrap";
import { timestampToString } from "../functions/Date";
import { HeartSwitch } from "@anatoliygatt/heart-switch";
import { FoodItem } from "../interface/FoodItem";

// ConCards component to display a grid of food cards
export const ConCards = ({
  favList, // List of favorite food item IDs
  searchFoodList, // List of food items to display based on search/filter
  toggleFavorite, // Function to toggle favorite status
  setCuisine, // Function to set cuisine filter
  setBusiness, // Function to set business filter
}: {
  favList: string[];
  searchFoodList: FoodItem[];
  toggleFavorite: (foodId: string) => Promise<void>;
  setCuisine: React.Dispatch<React.SetStateAction<string>>;
  setBusiness: React.Dispatch<React.SetStateAction<string>>;
}) => (
  <Row md={4} className="g-4">
    {/* Map through the filtered food list and display each food item */}
    {searchFoodList.map((food, index) => (
      <Col key={index}>
        <Card
          className="flex"
          bg={food.post ? "light" : "secondary"}
          key={food.id}
        >
          <Card.Img variant="top" src={food.imageURL} /> {/* Food image */}
          <Card.Body>
            <Card.Title>{food.name}</Card.Title> {/* Food name */}
            <Card.Subtitle>${food.price}</Card.Subtitle> {/* Food price */}
            <Card.Text>Date: {timestampToString(food.date)}</Card.Text>{" "}
            {/* Food date */}
            {/* Badge to filter by cuisine */}
            <Badge
              style={{ cursor: "pointer" }}
              pill
              className="ms-2"
              bg="warning"
              onClick={() => setCuisine(food.cuisine)}
            >
              {food.cuisine}
            </Badge>
            {/* Badge to filter by business */}
            <Badge
              style={{ cursor: "pointer" }}
              pill
              className="ms-2"
              bg="dark"
              onClick={() => setBusiness(food.business)}
            >
              {food.business}
            </Badge>
            {/* HeartSwitch to toggle favorite status */}
            <Container className="mt-2">
              <Row className="justify-content-md-end">
                <Col xs={2}>
                  <HeartSwitch
                    size="sm"
                    checked={favList.includes(food.id)}
                    onChange={() => toggleFavorite(food.id)}
                  />
                </Col>
                <Col xs={1}>{food.favoriteCount || 0}</Col>
              </Row>
            </Container>
          </Card.Body>
        </Card>
      </Col>
    ))}
  </Row>
);
