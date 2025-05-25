import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "../../../Styles/style.module.css";
import api from "../../../API/axiosInstance";

const NavbarMer = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = localStorage.getItem("user_data");
        if (userData) {
          const parsedData = JSON.parse(userData);
          const email = parsedData.email;
          const response = await api.get(`Authentication/profile?name=${email}`);
          setUsername(response.data.userName || "مستخدم");
        } else {
          setUsername("ضيف");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUsername("ضيف");
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user_data");
    setUsername("");
    navigate("/");
  };

  return (
    <nav className={`navbar navbar-expand-lg ${styles.NavF}`} style={{ backgroundColor: "#0f2c2c" }}>
      <div className="container-fluid">
        <Link className="navbar-brand text-white" to="#">
          <img
            style={{ width: "250px", height: "100px", margin: "0" }}
            src="/assets/MarchentLogo.jpg"
            alt="Logo"
          />
        </Link>
        <img src="/assets/notifications.png" style={{ width: "30px" }} alt="Notifications" />
        <p className={styles.userF}>{username}</p>
        <button
          className={`btn me-2 ${styles.outButton}`}
          onClick={handleLogout}
        >
          تسجيل الخروج
        </button>
      </div>
    </nav>
  );
};

export default NavbarMer;
