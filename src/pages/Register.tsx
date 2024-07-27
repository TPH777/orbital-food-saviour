import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ErrorText from "../components/ErrorText";
import { auth, db } from "../config/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ButtonGroup, ToggleButton } from "react-bootstrap";
import { doc, setDoc, GeoPoint } from "firebase/firestore";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";

// Declare libraries outside the component
const libraries = ["places"];

export const RegisterPage = () => {
  const [registering, setRegistering] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isConsumer, setIsConsumer] = useState<boolean>(true);
  const [bizLoc, setBizLoc] = useState<string>("");
  const [bizCoords, setBizCoords] = useState<{ lat: number; lng: number }>({
    lat: -1,
    lng: -1,
  });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_REACT_APP_gmap,
    libraries,
  });

  const navigate = useNavigate();
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (autocompleteRef.current && inputRef.current) {
      autocompleteRef.current.setFields(["formatted_address", "geometry"]);
      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace();
        if (place?.formatted_address && place?.geometry?.location) {
          setBizLoc(place.formatted_address);
          setBizCoords({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });
        }
      });
    }
  }, [isLoaded]);

  useEffect(() => {
    if (autocompleteRef.current && inputRef.current) {
      console.log(bizCoords);
      console.log(bizLoc);
    }
  });

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
        } else {
          const locData = {
            name: name,
            location: new GeoPoint(bizCoords.lat, bizCoords.lng),
          };
          await setDoc(doc(db, "Business", name), locData);
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
      {!isConsumer ? (
        <div className="form-outline mb-4">
          <label>Business Location</label>
          {isLoaded && (
            <Autocomplete
              onLoad={(autocomplete) =>
                (autocompleteRef.current = autocomplete)
              }
              onPlaceChanged={() => {
                const place = autocompleteRef.current?.getPlace();
                if (place?.formatted_address && place?.geometry?.location) {
                  setBizLoc(place.formatted_address);
                  setBizCoords({
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                  });
                }
              }}
            >
              <input
                ref={inputRef}
                autoComplete="location"
                type="text"
                name="location"
                id="location"
                placeholder="Business Location"
                className="form-control"
                required
                value={bizLoc}
                onChange={(e) => setBizLoc(e.target.value)}
              />
            </Autocomplete>
          )}
        </div>
      ) : null}
      <div className="mb-4">
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

export default RegisterPage;
