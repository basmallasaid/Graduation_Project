import React from 'react';
import NavbarF from './NavbarF';
import NavSideF from '../MainC/NavSideF';
import FooterF from '../MainC/FooterF';

const MainPageStyle = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
        <NavbarF/>
        <div className="d-flex flex-grow-1">
            <NavSideF/>
            <main className="flex-grow-1">
                <h1>Main Content Area</h1>
            </main>
        </div>
       <FooterF/>
    </div>
    );
};

export default MainPageStyle;