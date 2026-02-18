import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard"; // Assuming you have this from Week 6/7
import Register from "./components/Register";
import CreateAccount from "./components/CreateAccount";
import Withdraw from "./components/Withdraw";
import Transfer from "./components/Transfer";
function App() {
  return (
    <Router>
      <Routes>
        {/* Default Route: Redirect to Login for now */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* The Login Page */}
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/create-account" element={<CreateAccount />} />

        <Route path="/withdraw/:accountId" element={<Withdraw />} />
        <Route path="/transfer/:accountId" element={<Transfer />} />



        {/* The Dashboard (We will protect this in Day 4!) */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;