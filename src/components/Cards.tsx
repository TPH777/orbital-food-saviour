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
    <>
      {foodList && foodList.length > 0 ? (
        <Row md={4} className="g-4">
          {foodList.map(
            (food) =>
              food.userId == user.uid && (
                <Col key={food}>
                  <Card style={{ width: "18rem" }}>
                    <Card.Img
                      className="card-img-top"
                      variant="top"
                      src={food.imageURL}
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
      ) : (
        <h1>No Results</h1>
      )}
    </>
  );
};
