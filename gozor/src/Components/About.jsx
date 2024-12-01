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
                <div className="row" >
                    <div className="col">
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
                    <div className="col"><img src="assets/farmgirl.png" /></div>
                </div>
            </div>
            <div className={styles.card} style={{textAlign:"center"}}>
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

            <h2 className={styles.green_text} style={{ textAlign: "center", marginBottom: "80px" }}><b>خدماتنا</b></h2>
            <div className={`container ${styles.card}`} style={{ marginBottom: "90px" }}>
                <div className="row">
                    <div className="col">
                        
                            <img src="assets/all.png" alt="..." style={{width:"100%"}} />
                           
                       
                    </div>
                    <div className="col">
                        
                            <img src="assets/all2.png" alt="..."  style={{width:"100%"}}/>
                            
                      
                    </div>
                    <div className="col">
                        
                            <img src="assets/all3.png"  alt="..." style={{width:"100%"}} />
                            
                       
                    </div>
                </div>
            </div>
            <div className={`${styles.aboutimg}`}>
                <h1 className={styles.sliderTitle}><b>قصص نجاح</b></h1>
                <div
                    id="customSlider"
                    className={`carousel slide ${styles.sliderContainer}`}
                    data-bs-ride="carousel"
                    style={{
                        maxWidth: "800px",
                        margin: "0 auto",
                        borderRadius: "15px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        background: "white"
                    }}
                >
                    {/* Indicators */}
                    <div className="carousel-indicators">
                        <button
                            type="button"
                            data-bs-target="#customSlider"
                            data-bs-slide-to="0"
                            className="active"
                            aria-current="true"
                            aria-label="Slide 1"
                        ></button>
                        <button type="button" data-bs-target="#customSlider" data-bs-slide-to="1" aria-label="Slide 2"></button>
                        <button type="button" data-bs-target="#customSlider" data-bs-slide-to="2" aria-label="Slide 3"></button>
                    </div>

                    {/* Slider Content */}
                    <div className={styles.carousel_inner}>
                        {/* Slide 1 */}
                        <div className="carousel-item active">
                            <img src="assets/slider.png" className="d-block w-100" alt="Farmer" />
                            <div className="carousel-caption d-md-block">
                                <p className={styles.sliderText}>
                                    <b>
                                        مزارع من قرية صغيرة تمكن من زيادة إنتاجه بنسبة 40% بعد استخدام المنصة لتنظيم الدورة الزراعية وإدارة المحاصيل.
                                    </b>
                                </p>
                            </div>
                        </div>

                        {/* Slide 2 */}
                        <div className="carousel-item">
                            <img src="assets/slider2.png" className="d-block w-100" alt="Farmer" />
                            <div className="carousel-caption d-md-block">
                                <p className={styles.sliderText}>
                                    <b>
                                        تاجر مواد غذائية تمكن من تأمين مصدر دائم من المحاصيل الطازجة بعد التعامل مباشرة مع المزارعين المحليين عبر المنصة.
                                    </b>
                                </p>
                            </div>
                        </div>

                        {/* Slide 3 */}
                        <div className="carousel-item">
                            <img src="assets/slider3.png" className="d-block w-100" alt="Farmer" />
                            <div className="carousel-caption d-md-block">
                                <p className={styles.sliderText}>
                                    <b>
                                        مستثمر شاب تمكن من استثمار مبلغ بسيط وحصل على عائدات ثابتة وسريعة في وقت قصير عبر التعاون مع عدة مزارعين.
                                    </b>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#customSlider"
                        data-bs-slide="prev"
                    >
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#customSlider"
                        data-bs-slide="next"
                    >
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </div>




            <Footer />

        </>
    );
};

export default About;