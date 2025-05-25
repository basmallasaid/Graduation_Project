import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "../../../Styles/style.module.css"; 
import api from "../../../API/axiosInstance";

const NavbarF = () => {
  const [username, setUsername] = useState(""); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = localStorage.getItem("name");
        console.log("email from localStorage:", email); // 👈 تأكد من وجود الإيميل

        if (email) {
          const response = await api.get(`Authentication/profile?name=${email}`);
          console.log("API response:", response.data); // 👈 شوف بيانات الـ API

          // تعيين الاسم من الاستجابة
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
    localStorage.removeItem("userEmail");
    localStorage.removeItem("name"); // تأكد من مسح الاسم كمان
    setUsername("");
    navigate("/");
  };

  return (
    <nav className={`navbar navbar-expand-lg ${styles.NavF}`}>
      <div className="container-fluid">
        <Link className="navbar-brand text-white" to="#">
          <img
            style={{ width: "250px", height: "100px", margin: "0" }}
            src="/assets/Nav.png"
            alt="Logo"
          />
        </Link>

        <img src="/assets/notifications.png" style={{ width: "30px" }} alt="Notifications" />

        <p className={styles.userF}>{username}</p> {/* عرض اسم المستخدم */}

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

export default NavbarF;
