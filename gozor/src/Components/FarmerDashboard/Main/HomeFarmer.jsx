import React, { useState } from 'react';
import styles from "../../../Styles/style.module.css";
import { Link, useNavigate } from 'react-router-dom';
import NavSideF from './NavSideF';
import FooterF from './FooterF';
import NavbarF from './NavbarF';
const HomeFarmer = () => {
    const [info, setinfo] = useState(true);
    const showInfo = () => {
        setinfo(!info);
    }
    const navigate = useNavigate();
    const farmManagement = () => {
        navigate("/farmManagement")
    }
    const financialReport = () => {
        navigate("/PaymentF")
    }
    const agriculturalCourses = () => {
        navigate("/Cropmenuview")
    }

    return (
        <div className="d-flex flex-column min-vh-100">
         <NavbarF/>
            <div className="d-flex flex-grow-1">
                <NavSideF/>
                <main className="flex-grow-1">
                <div className={styles.divflex}>
                        <div className={styles.farm_management} onClick={farmManagement}>
                            <h4>إدارة المزارع</h4>
                            <img src="/assets/Naturalist.png" alt="Naturalist"  />
                            <h5 className={styles.tooltip_text}>تنظيم المزارع و الاراضي المرتبطة بها بدقة</h5>
                        </div>
                        <div className={styles.Crop_Services} onClick={showInfo}>

                            <h4>خدمات المحاصيل</h4>
                            <img src="/assets/TreePlanting.png" alt="Naturalist" />
                            {!info &&
                                <div className={styles.infoCrop}>
                                    <Link className="nav-link text-white" to="/WeatherF">الطقس</Link>
                                    <Link className="nav-link text-white" to="/AI">تحليل النباتات</Link>
                                    <Link className="nav-link text-white" to="/Shopping">السوق</Link>
                                    <Link className="nav-link text-white" to="/ViewCrops">عرض محاصيلك</Link>
                                </div>
                            }
                            <h5 className={styles.tooltip_text}>دعم المزارع بأدوات تحليل الطقس و النباتات و السوق </h5>
                        </div>
                    </div>
                    <div className={styles.divflex}>
                        <div className={styles.fina_repo} onClick={financialReport}>
                            <h4>التقارير المالية</h4>
                            <img src="/assets/problem.png" alt="Naturalist" />
                            <h5 className={styles.tooltip_text}>استعراض و تحليل جميع المعاملات المادية بسلاسة</h5>
                        </div>
                        <div className={styles.agr_courses} onClick={agriculturalCourses}>
                            <h4>إدارة الدورات الزراعية</h4>
                            <img src="/assets/Process.png" alt="Naturalist" />
                            <h5 className={styles.tooltip_text}>متابعة دوراتك الحالية و المنتهية بسهولة</h5>
                        </div>
                    </div>
                </main>
            </div>
         <FooterF/>
        </div>
    );
};

export default HomeFarmer;