import { Button, Card, Col, Row } from "react-bootstrap";

export const Cards = ({
  user,
  foodList,
  updateFood,
  deleteFood,
}: {
  user: any;
  foodList: any[];
  updateFood: Function;
  deleteFood: Function;
}) => {
  return (
    <Row md={4} className="g-4">
      {foodList.map(
        (food) =>
          food.userId == user.uid && (
            <Col>
              <Card style={{ width: "18rem" }}>
                <Card.Img
                  className=".card-img-top"
                  variant="top"
                  src={
                    food.imageURL
                      ? food.imageURL
                      : "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"
                  }
                />
                <Card.Body>
                  <Card.Title>{food.name}</Card.Title>
                  <Card.Subtitle>${food.price}</Card.Subtitle>
                  <br />
                  <Button
                    onClick={() => updateFood(food.id)}
                    variant="secondary"
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
  );
};
