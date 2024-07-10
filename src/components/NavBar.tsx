import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { useAuth } from "../context/Auth";

export function NavBar() {
  let navigate = useNavigate();
  const { user, isConsumer } = useAuth();

  const Logout = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
        window.location.reload();
      })
      .catch((error) => console.error(error));
  };

  return (
    <Navbar className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="#">
          <img
            src="/pictures/food-saviour-logo.png"
            alt="logo"
            width="30"
            height="30"
            className="d-inline-block align-top me-2"
          />
          Food Saviour
        </Navbar.Brand>
        {user ? (
          <>
            <Nav className="me-auto">
              {isConsumer ? (
                <Nav.Link href="#favorites">Favorites</Nav.Link>
              ) : (
                <Nav.Link href="#dashboard">Dashboard</Nav.Link>
              )}
            </Nav>
            <Navbar.Text onClick={Logout} style={{ cursor: "pointer" }}>
              Logout
            </Navbar.Text>
          </>
        ) : (
          <Button variant="outline-success" onClick={() => navigate("/login")}>
            Sign In
          </Button>
        )}
      </Container>
    </Navbar>
  );
}
