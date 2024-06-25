import { CloseButton, Col, Form, Row } from "react-bootstrap";
import { cuisineTypes } from "../interface/Cuisine";

export const Search = ({
  search,
  cuisine,
  setSearch,
  setCuisine,
}: {
  search: string;
  cuisine: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setCuisine: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const handleReset = () => {
    setCuisine("All");
    setSearch("");
  };

  return (
    <>
      <Form className="mb-4">
        <Row>
          <Col xs={10}>
            <Form.Control
              type="text"
              className="searchTerm"
              placeholder="What are you looking for?"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value)
              }
            />
          </Col>
          <Col xs="auto">
            <Form.Select
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
            >
              <option key="all">All</option>
              {cuisineTypes.map((cuisine) => (
                <option key={cuisine}>{cuisine}</option>
              ))}
            </Form.Select>
          </Col>
          <Col xs="auto">
            <CloseButton className="mt-2" onClick={handleReset} />
          </Col>
        </Row>
      </Form>
    </>
  );
};
