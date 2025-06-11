import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "../../../Styles/style.module.css";
import api from "../../../API/axiosInstance";
import { useSignalR } from "../../../contexts/SignalRContext"; // Adjust path as needed
import Cookies from "js-cookie"; // Import Cookies if you're using it for access_token
import NotificationBell from "../../Notification/NotificationBell";

const NavbarF = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const { stopConnection, isConnected } = useSignalR(); // Get SignalR context functions

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataString = localStorage.getItem("user_data");
        if (userDataString) {
          const parsedData = JSON.parse(userDataString);
          // Prefer getting email from localStorage directly if it's stored there upon login
          const emailForProfile = localStorage.getItem("name") || parsedData.email; // 'name' key was used in your Login.jsx

          if (emailForProfile) {
            // Assuming your profile endpoint expects the email as a query parameter 'name'
            // or uses the token for identification. If it uses token, ensure API instance sends it.
            // If your /profile endpoint is protected and uses the token, you might not need to send email.
            // For now, I'll assume it needs the email as 'name'.
            const response = await api.get(`Authentication/profile?name=${encodeURIComponent(emailForProfile)}`);
            setUsername(response.data.userName || "مستخدم");
          } else {
            console.warn("Email not found in local storage for profile fetching.");
            setUsername("ضيف");
          }
        } else {
          setUsername("ضيف");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response && error.response.status === 401) {
          // Handle unauthorized access, perhaps user data is stale
          setUsername("ضيف (جلسة منتهية)");
          // Optionally, force logout here if profile fetch fails due to auth
          // handleLogout(true); // Pass a flag to avoid recursive calls if handleLogout also calls this
        } else {
          setUsername("ضيف");
        }
      }
    };

    fetchUserData();
  }, []); // Empty dependency array means this runs once on mount

  const handleLogout = async () => {
    console.log("NavbarMer: Initiating logout sequence...");

    // 1. Stop SignalR connection
    if (isConnected) {
      console.log("NavbarMer: SignalR is connected, attempting to stop it.");
      try {
        await stopConnection();
        console.log("NavbarMer: SignalR connection stopped successfully.");
      } catch (err) {
        console.error("NavbarMer: Error stopping SignalR connection:", err);
        // Continue with logout even if SignalR stop fails
      }
    } else {
      console.log("NavbarMer: SignalR not connected or already stopped.");
    }

    // 2. Clear authentication data
    localStorage.removeItem("user_data");
    localStorage.removeItem("name"); // Remove the stored email/name
    Cookies.remove("access_token"); // Ensure the access token cookie is removed
    Cookies.remove("email"); // If you used this for 'remember me'
    Cookies.remove("rememberMe"); // If you used this for 'remember me'

    console.log("NavbarMer: Authentication data cleared.");

    // 3. Update local state (optional, as navigation will unmount)
    setUsername(""); // Or "ضيف"

    // 4. Call any global logout handler passed via props (if applicable)
    // Example: if (props.onGlobalLogout) props.onGlobalLogout();

    // 5. Navigate to the home/login page
    navigate("/");
    // Optional: window.location.reload(); // If you absolutely need a full page refresh
  };

  return (
    <nav className={`navbar  ${styles.NavF}`} >
      <div className="container-fluid">
        <Link className="navbar-brand text-white" to="/HomeFarmer"> {/* Make logo link to a relevant page */}
          <img
            style={{ width: "250px", height: "100px", margin: "0" }}
            src="/assets/Nav.png" // Ensure this path is correct relative to public folder
            alt="Logo"
          />
        </Link>
        {/* Conditionally render user info and logout if username is not "ضيف" or similar */}
        {username && username !== "ضيف" && (
          <>
            {/* <img src="/assets/notifications.png" style={{ width: "30px", marginLeft: 'auto', marginRight: '15px' }} alt="Notifications" /> */}
            <NotificationBell/>
            <p className={styles.userF} style={{ margin: '0 15px 0 0', color: 'white' }}>مرحباً, {username}</p>
            <button
              className={`btn me-2 ${styles.outButton}`} 
              onClick={handleLogout}
            >
              تسجيل الخروج
            </button>
          </>
        )}
        {/* If user is "ضيف", you might want to show a Login link instead */}
        {(!username || username === "ضيف") && (
            <Link to="/login" className="btn btn-outline-light ms-auto">تسجيل الدخول</Link>
        )}
      </div>
      
    </nav>
  );
};

export default NavbarF;