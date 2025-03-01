import React from 'react';
import NavbarInv from './NavbarInv';
import NavSideInv from './NavSideInv';
import FooterInv from './FooterInv';

const MainPageStyle = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
        <NavbarInv/>
        <div className="d-flex flex-grow-1">
            <NavSideInv/>
            <main className="flex-grow-1">
                <h1>Main Content Area</h1>
            </main>
        </div>
       <FooterInv/>
    </div>
    );
};

export default MainPageStyle;