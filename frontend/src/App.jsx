import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard"; // Assuming you have this from Week 6/7

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Route: Redirect to Login for now */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* The Login Page */}
        <Route path="/login" element={<Login />} />

        {/* The Dashboard (We will protect this in Day 4!) */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;