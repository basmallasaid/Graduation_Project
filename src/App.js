import './App.css';
import React, { useState } from 'react'; // Use useState for isLoggedIn
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import "@fortawesome/fontawesome-free/css/all.min.css";

import { ToastContainer } from 'react-toastify';

// Context and Error Boundary
import { SignalRProvider } from './contexts/SignalRContext'; // Adjust path if necessary
import StanderErrorBoundary from './Components/Error/StanderErorrBoundary';

// Routing
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

// Page Components & Layout
import Notfound from './Components/Notfound';
import Navbar from './Components/Navbar'; // Main public Navbar
import Contact from './Components/Contact';
import Home from './Components/Home'; // Assume Home handles login/register modals
import Services from './Components/Services';
import About from './Components/About';
import Instructions from './Components/Instructions';
import Opinon from './Components/Opinon';

// Authentication Components
// import Register from './Authentication/Register'; // If Home handles register modal, this might not be directly routed
import Newpassword from './Authentication/Newpassword';
// Login component will be implicitly handled by Home/Navbar or a direct route if needed

// Farmer Dashboard Components
import WeatherF from './Components/FarmerDashboard/WeatherF';
import Addcrop from './Components/FarmerDashboard/addcrop';
import Cropcard from './Components/FarmerDashboard/cropcard';
import AImodel from './Components/FarmerDashboard/AImodel';
import Cropmenuview from './Components/FarmerDashboard/Cropsmeniview';
import Updatenewcycle from './Components/FarmerDashboard/Updateoncycle';
import Addcycletasks from './Components/FarmerDashboard/Addcycletasks';
import Addopencycle from './Components/FarmerDashboard/Addopencycle';
import Addclosecycle from './Components/FarmerDashboard/Addclosecycle';
import Tabletasks from './Components/FarmerDashboard/Tabletasks';
import Updateopencycle from './Components/FarmerDashboard/Updateopencycle';
import Updateclosecycle from './Components/FarmerDashboard/Updateclosecycle';
import Viewnew from './Components/FarmerDashboard/Viewnew';
import Editupdatenewcycle from './Components/FarmerDashboard/Editupdateoncycle';
import Shopping from './Components/FarmerDashboard/Shopping';
import ViewCrops from './Components/FarmerDashboard/ViewCrops';
import PaymentF from './Components/FarmerDashboard/financial reporting/PaymentF';
import HomeFarmer from './Components/FarmerDashboard/Main/HomeFarmer';
import Agricultural from './Components/FarmerDashboard/AgriculturalManagement/Agricultural';

// Investor Dashboard Components
import SeeDetails from './Components/InvestorDashboard/Investorpages/SeeDetails/SeeDetails';
import Invnewupdates from './Components/InvestorDashboard/Investorpages/SeeDetails/Invnewupdates';
import InvestorHome from './Components/InvestorDashboard/InvestorHome/InvestorHome';
import InverstorPayment from './Components/InvestorDashboard/InvestorPayment/InverstorPayment';
import FavouritePage from './Components/InvestorDashboard/FavPage/FavouritePage';
import Privatecyles from './Components/InvestorDashboard/cyclesforinvestor/Privatecycles';
import Newcycles from './Components/InvestorDashboard/cyclesforinvestor/Newcycles';
import Orders from './Components/InvestorDashboard/Investorpages/Orders/Orders';


// Merchant Dashboard Components
import MerchentHome from './Components/merchantDashboard/MerchentHome/MerchentHome';
import MerchentPayment from './Components/merchantDashboard/MerchentPayment/MerchentPayment';
import Browseharvest from './Components/merchantDashboard/browseharvest/Browseharvest';
import Seedetailsmerch from './Components/merchantDashboard/Seedetails/Seedetailsmerch';
import Merchorders from './Components/merchantDashboard/orders/Merchorders';

// Common Protected Components
import ProfileManegment from './Components/ProfileManagment/ProfileManagment';
import ChatInterface from './Components/Chat/ChatInterface';


// --- Authentication Helper ---
const isAuthenticated = () => !!localStorage.getItem("user_data");

// --- Protected Route Component ---
const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
        // User not authenticated, redirect to login page.
        // Pass the current location to redirect back after login.
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());

    // This function is called by the Login component upon successful login
    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        // SignalR connection is now expected to be started within Login.jsx using useSignalR()
    };

    // This function is passed to the main Navbar to update App's state on logout
    const handleLogout = () => {
        setIsLoggedIn(false);
        // SignalR connection stop is expected to be handled in Navbar.jsx (or other navbars) using useSignalR()
        // This App-level function mainly updates the isLoggedIn state.
    };

    // Component to render public pages with the main Navbar
    const PublicPageLayout = ({ children }) => (
        <>
            <Navbar
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout} /* For Navbar to tell App to update state */
                onLoginSuccess={handleLoginSuccess} /* For Navbar to pass to Login modal */
            />
            {children}
        </>
    );

    return (
        <>
        
        <SignalRProvider> {/* SignalR context available to the whole app */}
        <ToastContainer />
            <StanderErrorBoundary>
                <BrowserRouter>
                    <Routes>
                        {/* Public Routes with Main Navbar */}
                        <Route path="/" element={<PublicPageLayout><Home onLoginSuccess={handleLoginSuccess} /></PublicPageLayout>} />
                        <Route path="/Home" element={<PublicPageLayout><Home onLoginSuccess={handleLoginSuccess} /></PublicPageLayout>} />

                        {/*
                          If Login/Register are modals triggered from Home/Navbar:
                          The ProtectedRoute will redirect to "/login".
                          The Home component (when at /login path or triggered) should show the Login modal.
                        */}
                        <Route path="/login" element={<PublicPageLayout><Home isLoginPage={true} onLoginSuccess={handleLoginSuccess} /></PublicPageLayout>} />
                        <Route path="/register" element={<PublicPageLayout><Home isRegisterPage={true} /></PublicPageLayout>} />


                        <Route path="/Services" element={<PublicPageLayout><Services /></PublicPageLayout>} />
                        <Route path="/Contact" element={<PublicPageLayout><Contact /></PublicPageLayout>} />
                        <Route path="/About" element={<PublicPageLayout><About /></PublicPageLayout>} />
                        <Route path="/Instructions" element={<PublicPageLayout><Instructions /></PublicPageLayout>} />
                        <Route path="/Opinon" element={<PublicPageLayout><Opinon /></PublicPageLayout>} />

                        {/* Standalone Authentication Pages (if any, Newpassword might be one) */}
                        <Route path="/Newpassword" element={<Newpassword />} />

                        {/* Protected Routes - These typically have their own internal layout/navbar */}
                        {/* Farmer Routes */}
                        <Route path="/HomeFarmer" element={<ProtectedRoute><HomeFarmer /></ProtectedRoute>} />
                        <Route path="/WeatherF" element={<ProtectedRoute><WeatherF /></ProtectedRoute>} />
                        <Route path="/viewcrops" element={<ProtectedRoute><ViewCrops /></ProtectedRoute>} />
                        <Route path="/addcrop" element={<ProtectedRoute><Addcrop /></ProtectedRoute>} />
                        <Route path="/cropcard" element={<ProtectedRoute><Cropcard /></ProtectedRoute>} />
                        <Route path="/AI" element={<ProtectedRoute><AImodel /></ProtectedRoute>} />
                        <Route path="/Cropmenuview" element={<ProtectedRoute><Cropmenuview /></ProtectedRoute>} />
                        <Route path="/Updateoncycle" element={<ProtectedRoute><Updatenewcycle /></ProtectedRoute>} />
                        <Route path="/Addcycletasks" element={<ProtectedRoute><Addcycletasks /></ProtectedRoute>} />
                        <Route path="/Addopencycle" element={<ProtectedRoute><Addopencycle /></ProtectedRoute>} />
                        <Route path="/Addclosecycle" element={<ProtectedRoute><Addclosecycle /></ProtectedRoute>} />
                        <Route path="/Tabletasks" element={<ProtectedRoute><Tabletasks /></ProtectedRoute>} />
                        <Route path="/Updateopencycle" element={<ProtectedRoute><Updateopencycle /></ProtectedRoute>} />
                        <Route path="/Updateclosecycle" element={<ProtectedRoute><Updateclosecycle /></ProtectedRoute>} />
                        <Route path="/Viewnew" element={<ProtectedRoute><Viewnew /></ProtectedRoute>} />
                        <Route path="/Editupdatenewcycle" element={<ProtectedRoute><Editupdatenewcycle /></ProtectedRoute>} />
                        <Route path="/Shopping" element={<ProtectedRoute><Shopping /></ProtectedRoute>} />
                        <Route path="/PaymentF" element={<ProtectedRoute><PaymentF /></ProtectedRoute>} />
                        <Route path="/farmManagement" element={<ProtectedRoute><Agricultural /></ProtectedRoute>} />

                        {/* Investor Routes */}
                        <Route path="/InvestorHome" element={<ProtectedRoute><InvestorHome /></ProtectedRoute>} />
                        <Route path="/SeeDetails/:cycleId" element={<ProtectedRoute><SeeDetails /></ProtectedRoute>} />
                        <Route path="/Invnewupdates" element={<ProtectedRoute><Invnewupdates /></ProtectedRoute>} />
                        <Route path="/InverstorPayment" element={<ProtectedRoute><InverstorPayment /></ProtectedRoute>} />
                        <Route path="/FavouritePage" element={<ProtectedRoute><FavouritePage /></ProtectedRoute>} />
                        <Route path="/PrivateCycles" element={<ProtectedRoute><Privatecyles /></ProtectedRoute>} />
                        <Route path="/NewCycles" element={<ProtectedRoute><Newcycles /></ProtectedRoute>} />
                        <Route path="/Orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />


                        {/* Merchant Routes */}
                        <Route path="/MerchentHome" element={<ProtectedRoute><MerchentHome /></ProtectedRoute>} />
                        <Route path="/MerchentPayment" element={<ProtectedRoute><MerchentPayment /></ProtectedRoute>} />
                        <Route path="/Browseharvest" element={<ProtectedRoute><Browseharvest /></ProtectedRoute>} />
                        <Route path="/Seedetailsmerch/:harvestId" element={<ProtectedRoute><Seedetailsmerch /></ProtectedRoute>} />
                        <Route path="/Merchorders" element={<ProtectedRoute><Merchorders /></ProtectedRoute>} />

                        {/* Common Protected Routes */}
                        <Route path="/ProfileManegment" element={<ProtectedRoute><ProfileManegment /></ProtectedRoute>} />
                        <Route path="/ChatInterface" element={<ProtectedRoute><ChatInterface /></ProtectedRoute>} />

                        {/* Fallback 404 Not Found Route */}
                        <Route path="*" element={<Notfound />} />
                    </Routes>
                </BrowserRouter>
            </StanderErrorBoundary>
        </SignalRProvider>
        </>
    );
}

export default App;