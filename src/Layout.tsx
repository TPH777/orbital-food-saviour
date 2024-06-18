import { NavBar } from "./components/NavBar";
import { Outlet } from "react-router-dom";
import "./App.css";

export function Layout() {
  return (
    <>
      <NavBar />
      <br />
      <main>
        <Outlet />
      </main>
    </>
  );
}
