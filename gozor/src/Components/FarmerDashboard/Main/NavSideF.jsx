import React, { useState } from 'react';
import styles from "./../../../Styles/style.module.css";
import { Link } from 'react-router-dom';
const NavSideF = () => {
        const [isCollapsed, setIsCollapsed] = useState(true);
        const toggleCollapse = () => {
            setIsCollapsed(!isCollapsed);
        };
    return (
         <>
                    <div className={`${styles.item3} ${isCollapsed ? styles.collapsed : ''}`} onClick={toggleCollapse} >
                        <p className={styles.iconNavSide}>
                            <img style={{ width: "20px" }} src='/assets/account_circle.png' alt="account_circle" />
                            {!isCollapsed && ' الملف الشخصي'}
                        </p>
                        <p className={styles.iconNavSide}>
                            <img src='/assets/chat.png' alt='chat' />
                            {!isCollapsed && ' الدردشة'}
                        </p>
                        <Link className={`navbar-brand text-black ${styles.iconNavSide}`} to="/Shopping">
                            <img src='/assets/add_business.png' alt='add_business' />
                            {!isCollapsed && ' السوق'}
                        </Link>
                        <Link className={`navbar-brand text-black ${styles.iconNavSide}`} to="/WeatherF">
                            <img src="/assets/partly_cloudy_day.png" alt='partly_cloudy_day' />
                            {!isCollapsed && ' الطقس'}
                        </Link>
                    </div>
                </>
    );
};

export default NavSideF ;