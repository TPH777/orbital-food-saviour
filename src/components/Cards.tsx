import { Button, Card, Col, Row } from "react-bootstrap";
import { FoodItem } from "../interface/FoodItem";
import { timestampToDate } from "../functions/Date";

export const Cards = ({
  user,
  foodList,
  updateFood,
  deleteFood,
}: {
  user: any;
  foodList: FoodItem[];
  updateFood: Function;
  deleteFood: Function;
}) => {
  return (
    <>
      {foodList && foodList.length > 0 ? (
        <Row md={4} className="g-4">
          {foodList.map(
            (food, index) =>
              food.userId == user.uid && (
                <Col key={index}>
                  <Card
                    style={{ width: "18rem" }}
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
                          ? `Date: ${timestampToDate(food.date)
                              .toString()
                              .slice(0, -38)}`
                          : "No Date"}
                      </Card.Text>
                      <br />
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
                    </Card.Body>
                  </Card>
                </Col>
              )
          )}
        </Row>
      ) : (
        <h1>No Results</h1>
      )}
    </>
  );
};
