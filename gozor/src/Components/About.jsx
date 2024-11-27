import React from 'react';
import Navbar from './Navbar';
import styles from "../Styles/style.module.css";
import Footer from './Footer';
const About = () => {
    return (
        <>
            <Navbar />
            <img className={styles.instimg} src='assets/about.png' />
            <div className={` text-center ${styles.grid}`}>
                <div className="row" style={{ textAlign: "right" }}>
                    <div className="col-sm-5">
                        <p><span className={styles.yetxt}>تعرف علينا</span></p>
                        <h3><b>منصة زراعية متكاملة لربط المزارعين بالمستثمرين والتجار</b></h3>
                        <p className={styles.green_text}>نقدم في منصة " <span className={styles.yetxt}>جذور</span>" تجربة زراعية فريدة من نوعها، حيث نوفر حلولًا ذكية ومتكاملة لربط المزارعين مع المستثمرين والتجار، بهدف تحقيق تنمية مستدامة ودعم القطاع الزراعي.</p>
                        <ul>
                            <li>سهولة الوصول إلى المستثمرين:<span className={styles.graytxt}> من خلال منصتنا، يمكن للمزارعين استعراض فرص الاستثمار وعرض أراضيهم للمستثمرين الراغبين في دعم المشاريع الزراعية. </span></li>
                            <li>حلول مبتكرة لمشاكل الزراعة:<span className={styles.graytxt}> نعتمد على الذكاء الاصطناعي لمساعدة المزارعين في تشخيص مشاكل النباتات واقتراح حلول ملائمة. </span></li>
                            <li>منصة تجارية شاملة:<span className={styles.graytxt}> يمكن للتجار عرض وبيع منتجاتهم الزراعية على منصتنا للوصول إلى جمهور أوسع. </span></li>
                        </ul>
                        <div style={{ textAlign: "center", margin: "50px" }}>
                        <button type="submit" className={styles.subbutton}>أكتشف المزيد</button>
                        </div>
                    </div>
                    <div className="col-sm-3"><img src="assets/farmgirl.png" /></div>
                </div>
            </div>
            <div className={styles.card}>
                <div className={`card ${styles.boxshadowabout}`}>
                    <div className="card-body">
                        <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
                            <b>مهمتنا و رؤيتنا</b>
                        </h3>
                        <div className="row">
                            <div className="col">
                                <p className={styles.graytxt}>
                                    <span className={styles.yetxt}>المهمة:</span> تعزيز الزراعة المستدامة من خلال التكنولوجيا والتواصل المباشر.
                                </p>
                            </div>
                            <div className="col">
                                <p className={styles.graytxt}>
                                    <span className={styles.yetxt}>الرؤية:</span> بناء بيئة زراعية شاملة تربط بين المزارعين والمستثمرين والتجار لتحقيق شراكات طويلة الأمد.
                                </p>
                            </div>
                        </div>
                    </div>
                    <img src="assets/farmb.png" className="card-img-bottom" alt="farmer" />
                </div>
            </div>
           
                <h2 className={styles.green_text} style={{ textAlign: "center",marginBottom:"80px" }}><b>خدماتنا</b></h2>
                <div className={`container ${styles.card}`} style={{marginBottom:"90px"}}>
                <div className="row">
                    <div className="col">
                        <div className="card" style={{width:"18rem"}}>
                            <img src="assets/fr.png" className="card-img-top" alt="..." />
                            <div className="card-body">
                                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card" style={{width:"18rem"}}>
                            <img src="assets/frr.png" className="card-img-top" alt="..." />
                            <div className="card-body">
                                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="card" style={{width:"18rem"}}>
                            <img src="assets/frrr.png" className="card-img-top" alt="..." />
                            <div className="card-body">
                                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

        </>
    );
};

export default About;