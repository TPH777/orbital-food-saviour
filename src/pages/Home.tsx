import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import { Col, Row } from "react-bootstrap";
import { Search } from "../components/Search";
import { FoodItem } from "../interface/FoodItem";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { timestampToDate } from "../functions/Date";

export function Home() {
  const [foodList, setFoodList] = useState<FoodItem[]>([]);
  const [query, setQuery] = useState<string>("");

  const getFoodList = async () => {
    try {
      const data = await getDocs(collection(db, "food"));
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as FoodItem[];
      setFoodList(filteredData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFoodList();
  }, []);

  const searchFoodList = foodList.filter(
    (food) =>
      food.post === true &&
      food.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <Search setQuery={setQuery} />
      <br />

      {searchFoodList && searchFoodList.length > 0 ? (
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
                      ? `Date: ${timestampToDate(food.date)
                          .toString()
                          .slice(0, -38)}`
                      : "No Date"}
                  </Card.Text>
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
