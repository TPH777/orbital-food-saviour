import { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { getDocs, collection } from "firebase/firestore";
import Card from "react-bootstrap/Card";
import { Col, Row } from "react-bootstrap";
import { Search } from "../components/Search";

export function Home() {
  const [foodList, setFoodList] = useState<any[]>([]);
  const [query, setQuery] = useState<string>("");
  const foodCollectionRef = collection(db, "food");

  const getFoodList = async () => {
    try {
      const data = await getDocs(foodCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setFoodList(filteredData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getFoodList();
  }, []);

  const searchFoodList = foodList.filter((food) =>
    food.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <Search setQuery={(query: string) => setQuery(query)} />
      <br />

      {searchFoodList && searchFoodList.length > 0 ? (
        <Row md={4} className="g-4">
          {searchFoodList.map((food) => (
            <Col key={food.id}>
              <Card style={{ width: "18rem" }} key={food}>
                <Card.Img variant="top" src={food.imageURL} />
                <Card.Body>
                  <Card.Title>{food.name}</Card.Title>
                  <Card.Subtitle>${food.price}</Card.Subtitle>
                  <br />
                  <Card.Text>Prepared by: {food.business}</Card.Text>
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
}
