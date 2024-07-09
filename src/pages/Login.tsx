import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ErrorText from "../components/ErrorText";
import { auth, db, googleProvider } from "../config/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { getErrorMessage } from "../functions/GetError";
import { doc, setDoc } from "firebase/firestore";

export const LoginPage = () => {
  const [authenticating, setAuthenticating] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  let navigate = useNavigate();

  const defaultSignIn = async (e: any) => {
    e.preventDefault();
    setAuthenticating(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setAuthenticating(false);
      setError(getErrorMessage(error));
    }
  };

  const googleSignIn = async () => {
    setAuthenticating(true);
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
        setAuthenticating(false);
        setError(error.message);
      });
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

      <div className="mb-4">
        <button
          type="submit"
          disabled={authenticating}
          className="btn btn-primary ms-5 me-3"
        >
          {authenticating ? "Signing In..." : "Sign In"}
        </button>
        |
        <button
          onClick={googleSignIn}
          disabled={authenticating}
          className="btn btn-dark ms-3"
        >
          <img
            src="/pictures/google-logo.png"
            alt="logo"
            width="30"
            height="30"
            className="d-inline-block align-top me-2"
          />
          {authenticating ? "Signing In..." : "Google Sign In (Consumer)"}
        </button>
      </div>

      <small>
        <p className="m-1 text-center">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </small>

      <ErrorText error={error} />
    </form>
  );
};
