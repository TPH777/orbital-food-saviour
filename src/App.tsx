// Pages
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { LoginPage } from "./pages/Login";
import { Layout } from "./Layout";
import { RegisterPage } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { FavoritePage } from "./pages/Favorites";
import { AuthContextProvider } from "./context/Auth";
import { APIProvider } from "@vis.gl/react-google-maps";

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/favorites" element={<FavoritePage />} />
          </Route>
        </Routes>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
