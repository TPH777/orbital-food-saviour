import { NavBar } from "./components/NavBar";
import { Outlet } from "react-router-dom";
import "./App.css";
import { Container } from "react-bootstrap";

export function Layout() {
  return (
    <>
      <Container>
        <br />
        <NavBar />
        <br />
        <main>
          <Outlet />
        </main>
      </Container>
    </>
  );
}
