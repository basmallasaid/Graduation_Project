import './App.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ToastContainer } from 'react-toastify';
import Cookies from 'js-cookie'; // Needed for the isAuthenticated helper

// Context, Error Boundary, and Auth Logic
import { SignalRProvider } from './contexts/SignalRContext';
import StanderErrorBoundary from './Components/Error/StanderErorrBoundary';
import AuthRedirect from './Authentication/AuthRedirect'; // The new component for redirection logic

// Routing
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

// Page Components & Layout
import Notfound from './Components/Notfound';
import Navbar from './Components/Navbar';
import Contact from './Components/Contact';
import Home from './Components/Home';
import Services from './Components/Services';
import About from './Components/About';
import Instructions from './Components/Instructions';
import Opinon from './Components/Opinon';

// Authentication Components
import Newpassword from './Authentication/Newpassword';

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
// A reliable function to check if the user is authenticated.
const isAuthenticated = () => {
    const token = Cookies.get("access_token");
    const userData = localStorage.getItem("user_data");
    return !!token && !!userData;
};

// --- Protected Route Component ---
// This component guards routes that require a logged-in user.
const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
        // If the user is not authenticated, redirect them to the /login path.
        // The Home component will then be rendered and can show the login modal.
        return <Navigate to="/login" replace />;
    }
    // If authenticated, render the child component (the protected page).
    return children;
};

// --- Layout Component for Public Pages ---
// This wrapper adds the main public-facing Navbar to a page.
const PublicPageLayout = ({ children }) => (
    <>
        <Navbar /> {/* Navbar is now self-sufficient, no props needed */}
        {children}
    </>
);

function App() {
    // The `onLoginSuccess` callback is passed to the Home component
    // to let it know when the Login modal has successfully finished its job.
    // It doesn't need to do anything here, but it's good practice for component communication.
    const handleLoginSuccess = () => {
        console.log("Login successful. Redirection is handled by Login.js and AuthRedirect.js.");
    };

    return (
        <SignalRProvider>
            <ToastContainer />
            <StanderErrorBoundary>
                <BrowserRouter>
                    {/* AuthRedirect runs on every route change to handle session logic */}
                    <AuthRedirect />

                    <Routes>
                        {/* --- PUBLIC ROUTES --- */}
                        {/* These routes are accessible to everyone and use the PublicPageLayout. */}
                        <Route path="/" element={<PublicPageLayout><Home onLoginSuccess={handleLoginSuccess} /></PublicPageLayout>} />
                        <Route path="/Home" element={<Navigate to="/" replace />} /> {/* Redirect alias to the main route */}
                        
                        {/* Specific routes to trigger modals within the Home component */}
                        <Route path="/login" element={<PublicPageLayout><Home isLoginPage={true} onLoginSuccess={handleLoginSuccess} /></PublicPageLayout>} />
                        <Route path="/register" element={<PublicPageLayout><Home isRegisterPage={true} /></PublicPageLayout>} />
                        
                        <Route path="/Services" element={<PublicPageLayout><Services /></PublicPageLayout>} />
                        <Route path="/Contact" element={<Contact />} />
                        <Route path="/About" element={<PublicPageLayout><About /></PublicPageLayout>} />
                        <Route path="/Instructions" element={<PublicPageLayout><Instructions /></PublicPageLayout>} />
                        <Route path="/Opinon" element={<Opinon />} />
                        <Route path="/Newpassword" element={<Newpassword />} />

                        {/* --- PROTECTED ROUTES --- */}
                        {/* All routes below are wrapped in the ProtectedRoute component. */}

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
    );
}

export default App;