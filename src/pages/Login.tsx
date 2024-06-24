import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ErrorText from "../components/ErrorText";
import { auth, googleProvider } from "../config/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import GoogleButton from "react-google-button";

export const LoginPage = () => {
  const [authenticating, setAuthenticating] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  let navigate = useNavigate();

  const defaultSignIn = () => {
    setAuthenticating(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/dashboard");
      })
      .catch((error) => {
        setAuthenticating(false);
        if (error.code.includes("auth/invalid-credential")) {
          setError("Invalid Credential");
        } else if (error.code.includes("auth/invalid-email")) {
          setError("Invalid Email.");
        }
      });
  };

  const googleSignIn = () => {
    setAuthenticating(true);
    signInWithPopup(auth, googleProvider)
      .then(() => {
        navigate("/dashboard");
      })
      .catch((error) => {
        setAuthenticating(false);
        setError(error.message);
      });
  };

  return (
    <form>
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

      <button
        disabled={authenticating}
        type="button"
        className="btn btn-primary btn-block mb-4"
        onClick={() => defaultSignIn()}
      >
        Sign In
      </button>
      <small>
        <p className="m-1 text-center">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </small>
      <ErrorText error={error} />
      <p>
        <GoogleButton onClick={googleSignIn} />
      </p>
    </form>
  );
};
