import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from "../Styles/style.module.css";
import Register from '../Authentication/Register';
import "@fortawesome/fontawesome-free/css/all.min.css";
import Modal from 'react-modal';
import Login from '../Authentication/Login';
import { useNavigate } from 'react-router-dom';
const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [visiblelog, setVisiblelog] = useState(false); // Modal visibility state
  const navigate = useNavigate();

  // Callback function to handle success
  const handleRegistrationSuccess = () => {
    setVisiblelog(false); // Close the modal
    navigate("/"); // Navigate to the home page
  };
  const handleLoginSuccess = () => {
    setVisible(false); // Close the modal
    navigate("/"); // Navigate to the home page
  };
  const customStyles = {
    content: {
      maxWidth: '500px', // Set your desired width
      margin: 'auto', // Centers the modal horizontally
      padding: '10px', // Add padding for better spacing
      borderRadius: '10px', // Optional: round corners
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: dim background
    },
  };
  const loginStyles = {
    content: {
      Width: '100%', // Set your desired width
      margin: 'auto', // Centers the modal horizontally
      padding: '10px', // Add padding for better spacing
      borderRadius: '10px', // Optional: round corners
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: dim background
    },
  };

  return (
    <div>
      <nav className={`navbar navbar-expand-lg ${styles.Nav}`}>
        <div className="container-fluid">
          {/* Logo */}
          <Link className="navbar-brand text-white" to="#">
            <img
              style={{ width: "250px", height: "100px", margin: "0" }}
              src="/assets/gozor (2).png"
              alt="Logo"
            />
          </Link>

          {/* Toggle button for small screens */}
          <button
            className="navbar-toggler custom-toggler bg-body-tertiary"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            {/* Conditional Rendering for Navigation Links */}

            <ul className={`navbar-nav me-auto mb-2 mb-lg-0 ${styles.navList}`}>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/">
                  الرئيسيه
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/About">
                  عنا
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/Instructions">
                  التعليمات
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/Services">
                  الخدمات
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/Opinon">
                  رايك
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/Contact">
                  التواصل
                </Link>
              </li>
            </ul>



            <div className="d-flex ms-auto">
              <button className={`btn me-2 ${styles.loginButton}`} onClick={() => setVisiblelog(true)}>
                تسجيل الدخول
              </button>

              {/* Modal Component */}
              <Modal style={customStyles}
                isOpen={visiblelog}
                onRequestClose={() => setVisiblelog(false)} // Close on modal background click
                ariaHideApp={false}

              >
                {/* Button to manually close the modal */}
                <button onClick={() => setVisiblelog(false)} style={{ position: 'absolute', top: 10, right: 10 }}>
                  <i className="fa-solid fa-xmark" style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontSize: '24px',
                    color: '#333',
                    cursor: 'pointer',
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                  }}></i>
                </button>

                {/* Pass callback to child */}
                <Register onRegistrationSuccess={handleRegistrationSuccess} />
              </Modal>
              <button className={`btn ${styles.registerButton}`} onClick={() => setVisible(true)}>انضم إلينا</button>
              <Modal isOpen={visible} onRequestClose={() => setVisible(false)}
                ariaHideApp={false}

                style={loginStyles}>
                <button onClick={() => setVisible(false)}><i className="fa-solid fa-xmark"
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontSize: '24px',
                    color: '#333',
                    cursor: 'pointer',
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                  }} ></i></button>
                <Login onLoginSuccess={handleLoginSuccess} />

              </Modal>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
