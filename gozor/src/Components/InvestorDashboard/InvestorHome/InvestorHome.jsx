import React, { useState } from 'react';
import NavSideInv from '../Main/NavSideInv';
import NavbarInv from '../Main/NavbarInv';
import FooterInv from '../Main/FooterInv';
import { Link, useNavigate } from 'react-router-dom';
import styles from "../../../Styles/style.module.css";
import stylesInv from "../StylesInv/stylesInv.module.css"
const InvestorHome = () => {
    const [info, setinfo] = useState(true);
    const showInfo = () => {
        setinfo(!info);
    }
    const navigate = useNavigate();
    const InverstorPayment = () => {
        navigate("/InverstorPayment")
    }
    const financialReport = () => {
        navigate("/PaymentF")
    }
    const agriculturalCourses = () => {
        navigate("/agricultural")
    }
    return (
        <div className="d-flex flex-column min-vh-100">
            <NavbarInv />
            <div className={`d-flex flex-grow-1 ${stylesInv.bgInv}`}>
                <NavSideInv />
                <main className={`flex-grow-1 ${stylesInv.Home}`}>
                    <div className={`d-flex justify-content-center ${stylesInv.div}`}>
                        <div className={`${stylesInv.FS}`} onClick={InverstorPayment}>
                            <h4>الخدمات المالية</h4>
                            <img src="/assets/receipt_long.png" alt="receipt_long" />
                            <h5 className={`${stylesInv.tooltip_textInv}`}>استعراض و تحليل جميع المعاملات المادية بسلاسة</h5>
                        </div>
                        <div className={`${stylesInv.NewCycle}`} onClick={financialReport}>
                            <h4>تصفح الدورات الجديدة</h4>
                            <img src="/assets/NewCycle.png" alt="NewCycle" />
                            <h5 className={`${stylesInv.tooltip_textInv}`}>استعراض الدورات الجديدة</h5>
                        </div>
                        <div className={`${stylesInv.cycles}`} onClick={agriculturalCourses}>
                            <h4>الدورات الخاصة</h4>
                            <img src="/assets/compost.png" alt="compost" />
                            <h5 className={`${stylesInv.tooltip_textInv}`}>متابعة دوراتك الحالية و المنتهية بسهولة</h5>
                        </div>
                    </div>
                </main>
            </div>
            <FooterInv />
        </div>
    );
};

export default InvestorHome;