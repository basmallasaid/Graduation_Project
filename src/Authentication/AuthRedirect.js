// src/Components/AuthRedirect.js

import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useSignalR } from '../contexts/SignalRContext'; // Adjust path if needed

const AuthRedirect = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Gets the current URL path
    const { startConnection, connection } = useSignalR();

    useEffect(() => {
        const token = Cookies.get("access_token");
        const userDataString = localStorage.getItem("user_data");

        // List of public routes that a logged-in user should be redirected FROM.
        // Based on your App.js, these are the main public-facing routes.
        const publicRoutes = [
            '/', 
            '/Home', 
            '/login', 
            '/register', 
            '/Services', 
            '/About', 
            '/Instructions', 
        ];

        // --- SCENARIO 1: User is logged in ---
        if (token && userDataString) {
            const userData = JSON.parse(userDataString);
            const { role } = userData;

            // Determine the correct dashboard path based on the user's role
            let dashboardPath = '/'; // Fallback
            if (role === "Farmer") dashboardPath = "/HomeFarmer";
            else if (role === "Investor") dashboardPath = "/InvestorHome";
            else if (role === "Merchant") dashboardPath = "/MerchentHome";

            // If the user is currently on a public page, redirect them to their dashboard.
            if (publicRoutes.includes(location.pathname)) {
                console.log(`User is logged in. Redirecting from ${location.pathname} to ${dashboardPath}`);
                navigate(dashboardPath, { replace: true });
            }

            // Also, re-establish SignalR connection on page reload if it's not active
            if (token && !connection) {
                 console.log("Session found on page load. Re-initializing SignalR connection...");
                 startConnection(token);
            }

        } 
        // --- SCENARIO 2: User is NOT logged in ---
        // Your <ProtectedRoute> component already handles this perfectly by redirecting
        // users from protected pages to '/login'. No extra logic is needed here for that case.

    // This effect runs whenever the URL changes.
    }, [location.pathname, navigate, startConnection, connection]); 

    return null; // This component renders nothing. It's purely for logic.
};

export default AuthRedirect;