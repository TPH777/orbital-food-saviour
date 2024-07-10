import {
  useContext,
  createContext,
  useEffect,
  useState,
  FC,
  ReactNode,
} from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";

// Define the type for the UserContext
type UserContextType = {
  user: User | null;
  isConsumer: boolean;
};

// Create a context with a default value of null
const AuthContext = createContext<UserContextType | null>(null);

// AuthContextProvider component to wrap around the app
export const AuthContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isConsumer, setIsConsumer] = useState<boolean>(false);

  // useEffect to listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        setUser(currentUser); // Set the current user in state
        if (currentUser) {
          const docRef = doc(db, "consumer", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setIsConsumer(true);
          }
        }
      },
      (error) => {
        console.error("Auth state change error: ", error); // Log any errors
      }
    );

    // Cleanup subscription on component unmount
    return () => {
      unsubscribe();
    };
  }, []);

  // Provide the user state to child components
  return (
    <AuthContext.Provider value={{ user, isConsumer }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = (): UserContextType => {
  const context = useContext(AuthContext);

  // Throw an error if the hook is used outside of AuthProvider
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context; // Return the context value
};
