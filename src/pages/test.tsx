import Card from "react-bootstrap/Card";

export function TestPage() {
  return (
    <Card style={{ width: "18rem" }}>
      <Card.Img
        variant="top"
        src="https://www.crazymasalafood.com/wp-content/images/Top-20-Saviour-Foods-That-Will-Help-In-Flattening-Your-Stomach.jpg"
      />
      <Card.Body>
        <Card.Title>Doughnut</Card.Title>
        <Card.Subtitle>$10</Card.Subtitle>
        <Card.Text>
          Handcrafted doughnuts with a light and airy texture.
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
