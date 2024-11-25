import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from "../Styles/Style.module.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Navbar = () => {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div>
      <nav className={`navbar navbar-expand-lg ${styles.Nav}` }>
              <div className="container-fluid">
                  {/* عنوان الموقع */}
                  <Link className="navbar-brand text-white" to="#" ><img style={{ width:"200px",height:"100px" , margin:"0"}} src="/assets/gozor (2).png"/></Link>

                  {/* زر التبديل للقائمة */}
                  <button
                      className="navbar-toggler custom-toggler  bg-body-tertiary"
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
                      {/* قائمة التنقل */}
            <ul className={`navbar-nav me-auto mb-2 mb-lg-0 ${styles.navList}`}>
              <li className="nav-item">
                <Link className="nav-link text-white" to="#">الرئيسيه</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="#">عنا</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="#">التعليمات</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="#">الخدمات</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="#">رايك</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="#">التواصل</Link>
              </li>
              {/* شريط البحث */}
              <li className="nav-item">
                <div className="d-flex align-items-center">
                  <button
                    className="btn btn-outline-success me-2"
                    onClick={() => setShowSearch(!showSearch)}
                    style={{ background: "none", border: "none", padding: "0" }}
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
                    <form className="d-flex" role="search" style={{ marginLeft: "10px" }}>
                      <input
                        className="form-control me-2"
                        type="search"
                        placeholder="ابحث..."
                        aria-label="Search"
                      />
                    </form>
                  )}
                </div>
              </li>
            </ul>

            {/* أزرار تسجيل الدخول والانضمام */}
            <div className="d-flex ms-auto" >
              <button className={`btn btn-success me-2 ${styles.loginButton}`}>تسجيل الدخول</button>
              <button className={`btn btn-outline-success ${styles.registerButton}`}>انضم إلينا</button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
