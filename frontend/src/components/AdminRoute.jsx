import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    // 1. Grab the currently logged-in user's email from localStorage
    // (Make sure "email" is the exact key you used when saving it during login!)
    const currentUserEmail = localStorage.getItem("email");

    // 2. Define the Master Admin Email
    // 👇 Change this to whatever email you want to use as your Admin account
    const ADMIN_EMAIL = "roshansaif764@gmail.com";

    // 3. The Security Check
    if (currentUserEmail === ADMIN_EMAIL) {
        // They are the admin! Open the door and render the dashboard.
        return children;
    } else {
        // Intruder alert! Redirect them back to their standard user dashboard.
        alert("⛔ Unauthorized Access. You are not an Admin.");
        return <Navigate to="/dashboard" />;
    }
};

export default AdminRoute;