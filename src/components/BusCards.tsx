import { Badge, Button, Card, Col, Row } from "react-bootstrap";
import { FoodItem } from "../interface/FoodItem";
import { timestampToString } from "../functions/Date";

export const BusCards = ({
  foodList,
  updateFood,
  deleteFood,
  setCuisine, // Function to set cuisine filter
}: {
  foodList: FoodItem[];
  updateFood: Function;
  deleteFood: Function;
  setCuisine: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <>
      {foodList && foodList.length > 0 ? (
        <Row md={4} className="g-4">
          {foodList.map((food, index) => (
            <Col key={index}>
              <Card
                className="flex"
                key={food.id}
                bg={food.post ? "success" : "secondary"}
              >
                <Card.Img
                  className="card-img-top"
                  variant="top"
                  src={food.imageURL}
                />
                <Card.Body>
                  <Card.Title>{food.name}</Card.Title>
                  <Card.Subtitle>${food.price}</Card.Subtitle>
                  <Card.Text>
                    {food.date
                      ? `Date: ${timestampToString(food.date)}`
                      : "No Date"}
                  </Card.Text>
                  <div className="float-end">
                    <Button
                      onClick={() => updateFood(food.id)}
                      variant="warning"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => deleteFood(food.id)}
                      className="ms-2"
                      variant="danger"
                    >
                      Delete
                    </Button>
                    <Badge
                      style={{ cursor: "pointer" }}
                      pill
                      className="ms-2"
                      bg="dark"
                      onClick={() => setCuisine(food.cuisine)}
                    >
                      {food.cuisine}
                    </Badge>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <h1>No Results</h1>
      )}
    </>
  );
};
