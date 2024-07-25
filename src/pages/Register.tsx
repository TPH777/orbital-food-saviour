import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ErrorText from "../components/ErrorText";
import { auth, db, googleProvider } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { ButtonGroup, ToggleButton } from "react-bootstrap";
import { doc, setDoc } from "firebase/firestore";

export const RegisterPage = () => {
  const [registering, setRegistering] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isConsumer, setIsConsumer] = useState<boolean>(true);

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
      .then(async (userCredential) => {
        const user = userCredential.user;
        if (isConsumer) {
          // Adding user id as a document to the consumer collection
          await setDoc(doc(db, "consumer", user.uid), {
            favorites: [],
          });
        }
        return updateProfile(user, { displayName: name });
      })
      .then(async () => {
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

  const googleSignIn = async () => {
    setRegistering(true);
    await signInWithPopup(auth, googleProvider)
      .then(async (userCredential) => {
        const user = userCredential.user;
        if (!doc(db, "consumer", user.uid)) {
          // Document don't exist (New user)
          await setDoc(doc(db, "consumer", user.uid), {});
        }
        navigate("/");
      })
      .catch((error) => {
        setRegistering(false);
        setError(error.message);
      });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        signUpWithEmailAndPassword();
      }}
    >
      <div className="d-grid gap-2 mb-4">
        <ButtonGroup>
          <ToggleButton
            id="post-checked"
            type="radio"
            variant={"outline-success"}
            value={1}
            checked={isConsumer === true}
            onChange={() => setIsConsumer(true)}
          >
            Consumer
          </ToggleButton>
          <ToggleButton
            id="post-unchecked"
            type="radio"
            variant={"outline-dark"}
            value={2}
            checked={isConsumer === false}
            onChange={() => setIsConsumer(false)}
          >
            Business
          </ToggleButton>
        </ButtonGroup>
      </div>

      <div className="form-outline mb-4">
        {isConsumer ? (
          <>
            <button
              onClick={googleSignIn}
              disabled={registering}
              className="btn btn-dark ms-3"
            >
              <img
                src="/pictures/google-logo.png"
                alt="logo"
                width="30"
                height="30"
                className="d-inline-block align-top me-2"
              />
              {registering ? "Registering..." : "Register with Google"}
            </button>
          </>
        ) : (
          <>
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
          </>
        )}
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
