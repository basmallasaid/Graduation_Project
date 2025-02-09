import React, { useState } from 'react';
import NavbarF from './NavbarFold';
import FooterF from './FooterFold';
import styles from "../../Styles/style.module.css";
import { Link, useNavigate } from 'react-router-dom';
import NavSide from './NavSideold';
const FarmerHomeold = () => {
    const [info, setinfo] = useState(true);
    const showInfo = () => {
        setinfo(!info);
    }
    const navigate = useNavigate();
    const farmManagement = () => {
        navigate("/farm_management")
    }
    const financialReport = () => {
        navigate("/CycleFrame")
    }
    const agriculturalCourses = () => {
        navigate("/agricultural")
    }
    return (
        <>
            <div className={`${styles.grid_container} ${styles.greenline_bg}`}>
                <div className={styles.item1}><NavbarF /></div>
                <div className={styles.item2}>
                    <div className={styles.divflex}>
                        <div className={styles.farm_management} onClick={farmManagement}>
                            <h4>إدارة المزارع</h4>
                            <img src="/assets/Naturalist.png" alt="Naturalist" />
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
                        <div className={styles.agr_courses} onclick={agriculturalCourses}>
                            <h4>إدارة الدورات الزراعية</h4>
                            <img src="/assets/Process.png" alt="Naturalist" />
                            <h5 className={styles.tooltip_text}>متابعة دوراتك الحالية و المنتهية بسهولة</h5>
                        </div>
                    </div>
                </div>
                {/* menu */}
                <NavSide />
                <div className={styles.item4}><FooterF /></div>
            </div>
        </>
    );
};

export default FarmerHomeold;