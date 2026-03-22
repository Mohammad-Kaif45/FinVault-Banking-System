import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Register from "./components/Register";
import CreateAccount from "./components/CreateAccount";
import Withdraw from "./components/Withdraw";
import Transfer from "./components/Transfer";
import Deposit from "./components/Deposit";
import Profile from "./components/Profile";
import AdminDashboard from './components/AdminDashboard';
import AdminRoute from './components/AdminRoute';

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

                {/* Transaction Routes */}
                <Route path="/withdraw/:accountId" element={<Withdraw />} />
                <Route path="/transfer/:accountId" element={<Transfer />} />
                <Route path="/deposit/:id" element={<Deposit />} />

                {/* Identity & Dashboard */}
                <Route path="/profile" element={<Profile />} />
                <Route path="/dashboard" element={<Dashboard />} />

                <Route path="/admin" element={<AdminDashboard />} />
                <Route
                        path="/admin"
                        element={
                            <AdminRoute>
                                <AdminDashboard />
                            </AdminRoute>
                        }
                    />
      </Routes>
    </Router>
  );
}

export default App;