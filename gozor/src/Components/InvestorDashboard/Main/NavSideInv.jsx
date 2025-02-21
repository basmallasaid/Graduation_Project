import React, { useState } from 'react';
import styles from "./../../../Styles/style.module.css";
import { Link } from 'react-router-dom';
const NavSideInv = () => {
        const [isCollapsed, setIsCollapsed] = useState(true);
        const toggleCollapse = () => {
            setIsCollapsed(!isCollapsed);
        };
    return (
         <>
                    <div className={`${styles.item3} ${isCollapsed ? styles.collapsed : ''}`} onClick={toggleCollapse} style={{backgroundColor:"#44AB9B"}}>
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
                        <Link className={`navbar-brand text-black ${styles.iconNavSide}`} to="/FavouritePage">
                            {/* <img src="/assets/favorite.jpeg" alt='partly_cloudy_day' /> */}
                            <i class="fa-regular fa-heart" style={{fontSize:"1.3rem"}}></i>
                            {!isCollapsed && ' المفضله'}
                        </Link>
                        <Link className={`navbar-brand text-black ${styles.iconNavSide}`} to="/FavouritePage">
                            {/* <img src="/assets/favorite.jpeg" alt='partly_cloudy_day' /> */}
                            <i class="fa-regular fa-heart" style={{fontSize:"1.3rem"}}></i>
                            {!isCollapsed && ' المفضله'}
                        </Link>
                    </div>
                </>
    );
};

export default NavSideInv  ;