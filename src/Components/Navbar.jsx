import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from "../Styles/style.module.css";
import Register from '../Authentication/Register';
import Login from '../Authentication/Login';
import Modal from 'react-modal';
import "@fortawesome/fontawesome-free/css/all.min.css";

const Navbar = () => {
    const [visible, setVisible] = useState(false);
    const [visiblelog, setVisiblelog] = useState(false);
    const navigate = useNavigate();

    const handleRegistrationSuccess = () => navigate("/");
    const handleLoginSuccess = () => setVisible(false);

      const customStyles = {
        content: {
            maxWidth: '500px', // Set your desired width
            margin: 'auto', // Centers the modal horizontally
            padding: '10px', // Add padding for better spacing
            borderRadius: '10px', // Optional: round corners
            height:"100%"
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: dim background
        },
    };
    const loginStyles = {
        content: {
            width: '75%', // Set your desired width
            margin: 'auto', // Centers the modal horizontally
            padding: '10px', // Add padding for better spacing
            borderRadius: '15px', // Optional: round corners
            height:"665px"
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: dim background
        },
    };

    return (
        <nav className={`navbar navbar-expand-lg ${styles.Nav}`}>
            <div className="container-fluid">
                {/* Brand Logo */}
                <Link className="navbar-brand text-white" to="/">
                    <img
                        style={{ width: "200px", height: "auto" }}
                        src="/assets/gozor (2).png"
                        alt="Logo"
                    />
                </Link>

                {/* Toggle button */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                    style={{backgroundColor:"white"}}
                >
                    <span className="navbar-toggler-icon" ></span>
                </button>

                {/* Nav links and buttons */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className={`navbar-nav ms-auto mb-2 mb-lg-0 ${styles.navList}`}>
                        <li className="nav-item">
                            <Link className="nav-link text-white" to="/">الرئيسيه</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-white" to="/About">عنا</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-white" to="/Instructions">التعليمات</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-white" to="/Services">الخدمات</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-white" to="/Opinon">رايك</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-white" to="/Contact">التواصل</Link>
                        </li>
                    </ul>

                    {/* Auth buttons */}
                    <div className="d-flex flex-column flex-lg-row gap-2 mt-3 mt-lg-0">
                        <button className={`btn ${styles.loginButton}`} onClick={() => setVisiblelog(true)}>
                            انضم إلينا
                        </button>
                        <button className={`btn ${styles.registerButton}`} onClick={() => setVisible(true)}>
                            تسجيل الدخول
                        </button>
                    </div>
                </div>
            </div>

            {/* Register Modal */}
            <Modal
                isOpen={visiblelog}
                onRequestClose={() => setVisiblelog(false)}
                style={customStyles}
                ariaHideApp={false}
            >
                <button onClick={() => setVisiblelog(false)} className="btn-close" style={{ position: 'absolute', top: 10, right: 10 }} />
                <Register
                    onRegistrationSuccess={handleRegistrationSuccess}
                    setVisibleRegister={setVisiblelog}
                    setVisibleLogin={setVisible}
                />
            </Modal>

            {/* Login Modal */}
            <Modal
                isOpen={visible}
                onRequestClose={() => setVisible(false)}
                style={loginStyles}
                ariaHideApp={false}
            >
                <button onClick={() => setVisible(false)} className="btn-close" style={{ position: 'absolute', top: 20, right: 20 }} />
                <Login
                    onLoginSuccess={handleLoginSuccess}
                    setVisibleLogin={setVisible}
                    setVisibleRegister={setVisiblelog}
                />
            </Modal>
        </nav>
    );
};

export default Navbar;
