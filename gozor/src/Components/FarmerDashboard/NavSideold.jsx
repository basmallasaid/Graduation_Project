import React, { useState } from 'react';
import styles from "../../Styles/style.module.css";
const NavSideold = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };
    return (
        <>
            <div className={`${styles.item3} ${isCollapsed ? styles.collapsed : ''}`} onClick={toggleCollapse} >
                <p>
                    <img style={{ width: "20px" }} src='/assets/account_circle.png' alt="account_circle" />
                    {!isCollapsed && ' الملف الشخصي'}
                </p>
                <p>
                    <img src='/assets/chat.png' alt='chat' />
                    {!isCollapsed && ' الدردشة'}
                </p>
                <p>
                    <img src='/assets/add_business.png' alt='add_business' />
                    {!isCollapsed && ' السوق'}
                </p>
                <p>
                    <img src="/assets/partly_cloudy_day.png" alt='partly_cloudy_day' />
                    {!isCollapsed && ' الطقس'}
                </p>
            </div>
        </>
    );
};

export default NavSideold;