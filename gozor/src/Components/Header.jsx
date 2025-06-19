import React, { useState } from "react"; // React hooks
// import gozor from "../assets/gozor.png"; // Logo import
// import "@fortawesome/fontawesome-free/css/all.css"; // Font Awesome icons
// import "./Header.css"; // Styles

export default function Header() {
  const [showSearch, setShowSearch] = useState(false); // Manage search form visibility
  const [searchQuery, setSearchQuery] = useState(""); // Store search query

  const toggleSearch = () => {
    setShowSearch(!showSearch); // Toggle form visibility
    if (!showSearch) {
      setSearchQuery(""); // Clear search query when opening search
    }
  };

  const handleSearch = () => {
    // Handle search logic here (e.g., sending the query to a server)
    setShowSearch(false); // Close the search field after search is triggered
  };

  return (
    <div className="header">
      <div className="container">
        {/* Logo */}
        <div className="logo-container">
          {/* <img src={gozor} alt="Logo" className="logo" /> */}
        </div>

        {/* Navigation Links */}
        {!showSearch && (
          <div className="nav-links">
            <ul>
              <li>الرئيسيه</li>
              <li>عنا</li>
              <li>التعليمات</li>
              <li>الخدمات</li>
              <li>رايك</li>
              <li>التواصل</li>
            </ul>
          </div>
        )}

        {/* Search Form (aligned in the same row) */}
        <div className="search-container">
          {!showSearch && (
            <div className="search-circle" onClick={toggleSearch}>
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>
          )}

          {showSearch && (
            <div className="search-form">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث..."
                  className="search-input"
                />
                <button className="search-button" onClick={handleSearch}>
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Button Container */}
        <div className="button-container">
          <button className="login-button">انضم الينا </button>
          <button className="register-button">تسجيل الدخول</button>
        </div>
      </div>
    </div>
  );
}
