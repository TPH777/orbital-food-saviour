// Pages
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { LoginPage } from "./pages/Login";
import { Layout } from "./Layout";
import { RegisterPage } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { TestPage } from "./pages/test";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/test" element={<TestPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
