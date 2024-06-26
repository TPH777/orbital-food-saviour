import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ErrorText from "../components/ErrorText";
import { auth, googleProvider } from "../config/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import GoogleButton from "react-google-button";

export const LoginPage = () => {
  const [authenticating, setAuthenticating] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  let navigate = useNavigate();

  const defaultSignIn = async (e: any) => {
    e.preventDefault();
    setAuthenticating(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      setAuthenticating(false);
      setError(getErrorMessage(error));
    }
  };

  const googleSignIn = async () => {
    setAuthenticating(true);

    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/dashboard");
    } catch (error: any) {
      setAuthenticating(false);
      setError(error.message);
    }
  };

  const getErrorMessage = (error: any) => {
    switch (error.code) {
      case "auth/invalid-credential":
        return "Invalid credentials. Please check your email and password.";
      case "auth/invalid-email":
        return "Invalid email address.";
      default:
        return error.message;
    }
  };

  return (
    <form onSubmit={defaultSignIn}>
      <div className="form-outline mb-4">
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
        <input
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

      <button
        type="submit"
        disabled={authenticating}
        className="btn btn-primary ms-3"
      >
        {authenticating ? "Signing In..." : "Sign In"}
      </button>

      <small>
        <p className="m-1 text-center">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </small>

      <ErrorText error={error} />

      <div className="mt-3">
        <GoogleButton onClick={googleSignIn} />
      </div>
    </form>
  );
};
