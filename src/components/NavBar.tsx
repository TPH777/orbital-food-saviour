import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { useAuth } from "../context/Auth";
import {
  useGetCurLoc,
  useUpdateLocations,
} from "../functions/LocationHandlers";
import { useEffect, useState } from "react";
import { useLocationContext } from "../context/Location";

export function NavBar() {
  let navigate = useNavigate();
  const { user, isConsumer } = useAuth();
  const { updateLocation } = useGetCurLoc();
  const { handleLocationContext } = useUpdateLocations();
  const { locations } = useLocationContext();
  const [isLocationUpdated, setIsLocationUpdated] = useState(false);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
        window.location.reload();
      })
      .catch((error) => console.error(error));
  };

  const locContext = async () => {
    await handleLocationContext();
    // console.log("work?");
    console.log(locations);
    if (locations.locs && locations.locs.length > 0) {
      setIsLocationUpdated(true);
    }
  };

  useEffect(() => {
    if (!isLocationUpdated) {
      const intervalId = setInterval(async () => {
        await locContext();
      }, 2000); // Adjust interval as needed

      return () => clearInterval(intervalId);
    }
  }, [isConsumer, isLocationUpdated, locations.locs]);

  // useEffect(() => {
  //   const init = async () => {
  //     if (isConsumer) {
  //       await updateLocation();
  //       console.log("Location updated");
  //       console.log(locations);
  //     }
  //   };
  //   init();
  // }, [isConsumer]);

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
          <Nav className="w-100 justify-content-between">
            {isConsumer ? (
              <>
                <Nav.Link href="#favorites">Favorites</Nav.Link>
                <Navbar.Text
                  onClick={updateLocation}
                  style={{ cursor: "pointer" }}
                >
                  Update Current Location
                </Navbar.Text>
              </>
            ) : (
              <Nav.Link href="#dashboard">Dashboard</Nav.Link>
            )}
            <Navbar.Text onClick={handleLogout} style={{ cursor: "pointer" }}>
              Logout
            </Navbar.Text>
          </Nav>
        ) : (
          <>
            <Navbar.Text onClick={updateLocation} style={{ cursor: "pointer" }}>
              Update Current Location
            </Navbar.Text>
            <Button
              variant="outline-success"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
          </>
        )}
      </Container>
    </Navbar>
  );
}
