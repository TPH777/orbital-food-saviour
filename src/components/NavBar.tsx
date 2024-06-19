import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { useEffect, useState } from "react";

export function NavBar() {
  let navigate = useNavigate();

  const [user, setUser] = useState<User>();
  const getUser = async () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      }
    });
  };

  useEffect(() => {
    getUser();
  }, []);

  const Logout = () => {
    signOut(auth)
      .then(() => navigate("/"))
      .catch((error) => console.error(error));
  };

  return (
    <>
      <nav className="navbar bg-body-tertiary">
        <form className="container-fluid">
          <button className="btn" type="button" onClick={() => navigate("/")}>
            Food Saviour
          </button>
          {user ? (
            <>
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-outline-primary me-2"
                  type="button"
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </button>
                <button
                  className="btn btn-outline-danger me-2"
                  type="button"
                  onClick={Logout}
                >
                  Log Out
                </button>
              </div>
            </>
          ) : (
            <button
              className="btn btn-outline-success"
              type="button"
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>
          )}
        </form>
      </nav>
    </>
  );
}
