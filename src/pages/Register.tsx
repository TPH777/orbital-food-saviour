import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ErrorText from "../components/ErrorText";
import { auth } from "../config/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export const RegisterPage = () => {
  const [registering, setRegistering] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [error, setError] = useState<string>("");

  let navigate = useNavigate();

  const signUpWithEmailAndPassword = () => {
    if (password !== confirm) {
      setError("Please make sure your passwords match.");
      return;
    }

    if (error !== "") setError("");

    setRegistering(true);

    createUserWithEmailAndPassword(auth, email, password)
      .then((user) => {
        updateProfile(user.user, {
          displayName: name,
        }).then(() => navigate("/dashboard"));
      })
      .catch((error) => {
        if (error.code.includes("auth/weak-password")) {
          setError("Please enter a stronger password.");
        } else if (error.code.includes("auth/email-already-in-use")) {
          setError("Email already in use.");
        } else {
          setError("Invalid Email");
        }

        setRegistering(false);
      });
  };

  return (
    <form>
      <div className="form-outline mb-4">
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Name"
          className="form-control"
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-outline mb-4">
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          className="form-control"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="form-outline mb-4">
        <input
          autoComplete="new-password"
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          className="form-control"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </div>

      <div className="form-outline mb-4">
        <input
          autoComplete="new-password"
          type="password"
          name="confirm"
          id="confirm"
          placeholder="Confirm Password"
          className="form-control"
          onChange={(e) => setConfirm(e.target.value)}
          value={confirm}
        />
      </div>

      <button
        disabled={registering}
        type="button"
        className="btn btn-primary btn-block mb-4"
        onClick={() => signUpWithEmailAndPassword()}
      >
        Register
      </button>
      <small>
        <p className="m-1 text-center">
          Already have an account? <Link to="/login">Login.</Link>
        </p>
      </small>
      <ErrorText error={error} />
    </form>
  );
};
