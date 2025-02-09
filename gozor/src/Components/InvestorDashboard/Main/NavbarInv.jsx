import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "../../../Styles/style.module.css"; 
const NavbarInv = () => {
        const [visiblelog, setVisiblelog] = useState(false);
        const [username, setUsername] = useState(""); 
        const navigate = useNavigate(); // Initialize useNavigate
      
        useEffect(() => {
          const email = localStorage.getItem("userEmail"); 
          if (email) {
            const name = email.split("@")[0]; 
            setUsername(name.charAt(0).toUpperCase() + name.slice(1));
          }
        }, []);
      
        const handleLogout = () => {
          // Clear user session
          localStorage.removeItem("userEmail"); // Remove email from local storage
          setUsername(""); // Clear the username state
          navigate("/"); // Redirect to home page
        };
    return (
        <>
        <nav className={`navbar navbar-expand-lg ${styles.NavF}` } style={{backgroundColor:"#073B3A"}}>
          <div className="container-fluid">
            <Link className="navbar-brand text-white" to="#">
              <img
                style={{ width: "250px", height: "100px", margin: "0" }}
                src="/assets/NavInv.png"
                alt="Logo"
              />
            </Link>
            <img src="/assets/notifications.png" style={{ width: "30px" }} alt="Notifications" />
            <p className={styles.userF}>{username || "ضيف"}</p> 
            <button
              className={`btn me-2 ${styles.outButton}`}
              onClick={handleLogout} // Attach the logout handler
            >
              تسجيل الخروج
            </button>
          </div>
        </nav>
      </>
    );
};

export default NavbarInv;