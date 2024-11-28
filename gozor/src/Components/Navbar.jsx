import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from "../Styles/style.module.css";
import Register from '../Authentication/Register';
import "@fortawesome/fontawesome-free/css/all.min.css";
import Modal from 'react-modal'
import Login from '../Authentication/Login';
const Navbar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visiblelog, setVisiblelog] = useState(false);
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
      Width: '100px', // Set your desired width
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
            {!showSearch && (
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
                  <Link className="nav-link text-white" to="#">
                    رايك
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/Contact">
                    التواصل
                  </Link>
                </li>
              </ul>
            )}

            {/* Search Bar */}
            <div className="d-flex align-items-center">
              <button
                className="btn btn-outline-success me-2"
                onClick={() => setShowSearch(!showSearch)}
                style={{ background: "none", border: "none", padding: "0",marginLeft:"50px" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  style={{ width: "24px", height: "24px", fill: "#ffffff" }}
                >
                  <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6 .1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" />
                </svg>
              </button>
              {showSearch && (
                <form className="d-flex" role="search" style={{ marginLeft: "10px",width:"300px",padding:"10px 0" }}>
                  <input
                    className="form-control me-2"
                    type="search"
                    placeholder="ابحث..."
                    aria-label="Search"
                  />
                </form>
              )}
            </div>
          <div className="d-flex ms-auto">
            <button className={`btn me-2 ${styles.loginButton}`} onClick={()=>setVisiblelog(true)}>تسجيل الدخول</button>
            <Modal isOpen={visiblelog} onRequestClose={()=>setVisiblelog(false)} style={customStyles}>
              <button onClick={()=>setVisiblelog(false)}><i className="fa-solid fa-xmark"
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
              <Register/>

            </Modal>
            <button className={`btn ${styles.registerButton}`}  onClick={()=>setVisible(true)}>انضم إلينا</button>
            <Modal isOpen={visible} onRequestClose={()=>setVisible(false)} style={loginStyles}>
              <button onClick={()=>setVisible(false)}><i className="fa-solid fa-xmark"
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
              <Login/>

            </Modal>
          </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
