import { CloseButton, Col, Form, Row } from "react-bootstrap";
import { cuisineTypes } from "../interface/Cuisine";

export const Search = ({
  search,
  cuisine,
  sort,
  setSearch,
  setCuisine,
  setSort,
}: {
  search: string;
  cuisine: string;
  sort: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setCuisine: React.Dispatch<React.SetStateAction<string>>;
  setSort: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const handleReset = () => {
    setSearch("");
    setCuisine("~Cuisine~");
    setSort("~Sort~");
  };

  return (
    <>
      <Form className="mb-4">
        <Row>
          <Col xs={8}>
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

          <Col xs={2}>
            <Form.Select
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
            >
              <option key="all">~Cuisine~</option>
              {cuisineTypes.map((cuisine) => (
                <option key={cuisine}>{cuisine}</option>
              ))}
            </Form.Select>
          </Col>

          <Col xs="auto">
            <Form.Select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option key="all">~Sort~</option>
              <option key="name">Name</option>
              <option key="date">Date</option>
              <option key="price">Price</option>
              <option key="cuisine">Cuisine</option>
            </Form.Select>
          </Col>

          <Col xs={"auto"}>
            <CloseButton className="mt-2" onClick={handleReset} />
          </Col>
        </Row>
      </Form>
    </>
  );
};
