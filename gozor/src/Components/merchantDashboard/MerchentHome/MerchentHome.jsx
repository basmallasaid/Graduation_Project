import React, { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';
// import styles from "../../../Styles/style.module.css";
import stylesmer from "../StylesMer/stylesmer.module.css"
import NavbarMer from '../Main/NavbarMer';
import NavSideMer from '../Main/NavSideMer';
import FooterMer from '../Main/FooterMer';
const MerchentHome = () => {
    const [info, setinfo] = useState(true);
    const showInfo = () => {
        setinfo(!info);
    }
    const navigate = useNavigate();
    const InverstorPayment = () => {
        navigate("/MerchentPayment")
    }
    const financialReport = () => {
        navigate("/PaymentF")
    }
    const agriculturalCourses = () => {
        navigate("/agricultural")
    }
    return (
        <div className="d-flex flex-column min-vh-100">
            <NavbarMer/>
            <div className={`d-flex flex-grow-1 ${stylesmer.bgMer}`}>
                <NavSideMer/>
                <main className={`flex-grow-1 ${stylesmer.Home}`}>
                    <div className={`d-flex justify-content-center ${stylesmer.div}`}>
                        <div className={`${stylesmer.FSMer}`} onClick={InverstorPayment}>
                            <h4>الخدمات المالية</h4>
                            <img src="/assets/receipt_long.png" alt="receipt_long" />
                            <h5 className={`${stylesmer.tooltip_textInv}`}>قسم مخصص لإدارة ومتابعة العمليات المالية المتعلقة بالاستثمارات، بما في ذلك عرض سجل المعاملات المالية والتقارير البيانية.</h5>
                        </div>
                        <div className={`${stylesmer.Browsecrops}`} onClick={financialReport}>
                            <h4> تصفح المحاصيل</h4>
                            <img src="/assets/NewCycle.png" alt="NewCycle" />
                            <h5 className={`${stylesmer.tooltip_textInv}`}>يتيح للمستثمر استكشاف فرص الاستثمار المتاحة، مع إمكانية البحث والتصفية حسب معايير مختلفة.</h5>
                        </div>
                        <div className={`${stylesmer.cycles}`} onClick={agriculturalCourses}>
                            <h4>الطلبيات الخاصة</h4>
                            <img src="/assets/compost.png" alt="compost" />
                            <h5 className={`${stylesmer.tooltip_textInv}`}>يعرض جميع الدورات التي اشترك فيها المستثمر، سواء كانت نشطة أو منتهية، مع تفاصيل مثل حالة الدورة ونوع العائد.</h5>
                        </div>
                    </div>
                </main>
            </div>
            <FooterMer />
        </div>
    );
};

export default MerchentHome;