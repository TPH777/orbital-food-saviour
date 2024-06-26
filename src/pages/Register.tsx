import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ErrorText from "../components/ErrorText";
import { auth } from "../config/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ButtonGroup, ToggleButton } from "react-bootstrap";

export const RegisterPage = () => {
  const [registering, setRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState<boolean>(true);

  const navigate = useNavigate();

  const signUpWithEmailAndPassword = () => {
    if (!name || !email || !password || !confirm) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setRegistering(true);

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        return updateProfile(user, { displayName: name });
      })
      .then(() => {
        navigate("/dashboard");
      })
      .catch((error) => {
        if (error.code === "auth/weak-password") {
          setError("Please enter a stronger password.");
        } else if (error.code === "auth/email-already-in-use") {
          setError("Email already in use.");
        } else {
          setError("Registration failed. Please try again.");
        }
      })
      .finally(() => {
        setRegistering(false);
      });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        signUpWithEmailAndPassword();
      }}
    >
      <div className="form-outline mb-4">
        <label>Name</label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Name"
          className="form-control"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-outline mb-4">
        <label>Email</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          className="form-control"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="form-outline mb-4">
        <label>Password</label>
        <input
          autoComplete="new-password"
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          className="form-control"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="form-outline mb-4">
        <label>Confirm Password</label>
        <input
          autoComplete="new-password"
          type="password"
          name="confirm"
          id="confirm"
          placeholder="Confirm Password"
          className="form-control"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <ButtonGroup>
          <ToggleButton
            id="post-checked"
            type="radio"
            variant={"outline-success"}
            value={1}
            checked={user === true}
            onChange={() => setUser(true)}
          >
            Consumer
          </ToggleButton>
          <ToggleButton
            id="post-unchecked"
            type="radio"
            variant={"outline-dark"}
            value={2}
            checked={user === false}
            onChange={() => setUser(false)}
          >
            Business
          </ToggleButton>
        </ButtonGroup>
        <button
          disabled={registering}
          type="submit"
          className="btn btn-primary btn-block ms-3"
        >
          {registering ? "Registering..." : "Register"}
        </button>
      </div>

      <small>
        <p className="m-1 text-center">
          Already have an account? <Link to="/login">Login.</Link>
        </p>
      </small>

      <ErrorText error={error} />
    </form>
  );
};
