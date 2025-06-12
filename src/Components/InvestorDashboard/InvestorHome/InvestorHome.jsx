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
        navigate("/NewCycles")
    }
    const agriculturalCourses = () => {
        navigate("/PrivateCycles")
    }
    return (
        <div className="d-flex flex-column min-vh-100">
            <NavbarInv />
            <div className={`d-flex flex-grow-1 ${stylesInv.bgInv}`}>
                <NavSideInv />
                <main className={`flex-grow-1 ${stylesInv.Home} ${styles.hid}`}>
                    <div className={`d-flex justify-content-center ${stylesInv.div}`}>
                        <div className={`${stylesInv.FS}`} onClick={InverstorPayment}>
                            <h4>الخدمات المالية</h4>
                            <img src="/assets/receipt_long.png" alt="receipt_long" />
                            <h5 className={`${stylesInv.tooltip_textInv}`}>قسم مخصص لإدارة ومتابعة العمليات المالية المتعلقة بالاستثمارات، بما في ذلك عرض سجل المعاملات المالية والتقارير البيانية.</h5>
                        </div>
                        <div className={`${stylesInv.NewCycle}`} onClick={financialReport}>
                            <h4>تصفح الدورات الجديدة</h4>
                            <img src="/assets/NewCycle.png" alt="NewCycle" />
                            <h5 className={`${stylesInv.tooltip_textInv}`}>يتيح للمستثمر استكشاف فرص الاستثمار المتاحة، مع إمكانية البحث والتصفية حسب معايير مختلفة.</h5>
                        </div>
                        <div className={`${stylesInv.cycles}`} onClick={agriculturalCourses}>
                            <h4>الدورات الخاصة</h4>
                            <img src="/assets/compost.png" alt="compost" />
                            <h5 className={`${stylesInv.tooltip_textInv}`}>يعرض جميع الدورات التي اشترك فيها المستثمر، سواء كانت نشطة أو منتهية، مع تفاصيل مثل حالة الدورة ونوع العائد.</h5>
                        </div>
                    </div>
                </main>
            </div>
            <FooterInv />
        </div>
    );
};

export default InvestorHome;