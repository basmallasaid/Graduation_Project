import React, { useState } from 'react'; // Import useState
import Navbar from './Navbar';
import styles from "../Styles/style.module.css";
import Footer from './Footer';

const Opinon = () => {
    // State to track the selected star rating
    const [rating, setRating] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0); // State for carousel active slide

    // Function to handle star click
    const handleStarClick = (starIndex) => {
        setRating(starIndex);
    };

    // Function to handle slide change in carousel
    const handleSlideChange = (index) => {
        setActiveIndex(index);
    };

    return (
        <>
            <Navbar />
            <div>
                <img src="assets/opinon.png" className={styles.opinon} alt="Opinion" />
            </div>
            <div className={styles.opinondiv}>
                <p><span className={styles.yetxt}>رأيك يهمنا </span></p>
                <h3><b>ما رأيك في تجربتك معنا ؟</b></h3>
            </div>
            <div style={{ textAlign: 'center' }}>
                <h5 className={styles.graytxt}>تقييمك</h5>
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        onClick={() => handleStarClick(star)} // Set rating on click
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                        style={{
                            width: "5%",
                            height: "50px",
                            margin: "5px",
                            fill: star <= rating ? "gold" : "gray", // Change color based on rating
                            cursor: "pointer", // Add pointer cursor for better UX
                        }}
                    >
                        <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z" />
                    </svg>
                ))}
            </div>
            <form className={styles.contforms} style={{ marginTop: "60px" }}>
                <textarea name="message" className={styles.textarea} placeholder="اكتب رأيك...."></textarea>
                <button type="submit" className={styles.subbutton}>إرسال</button>
            </form>
            <div className={styles.opinonnote}>
                <p>ماذا يقول عملاؤنا</p>
                <h3 className={styles.green_text}>ملاحظات المستخدمين</h3>
            </div>

            <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                <div className={styles.carousel_indicators}>
                    {[0, 1].map((index) => (
                        <button
                            key={index}
                            type="button"
                            data-bs-target="#carouselExampleIndicators"
                            data-bs-slide-to={index}
                            className={index === activeIndex ? "active" : ""}
                            aria-label={`Slide ${index + 1}`}
                            onClick={() => handleSlideChange(index)} // عند النقر على الدائرة، نغير الشريحة النشطة
                        ></button>
                    ))}
                </div>

                <div className="carousel-inner" style={{margin:"50px auto"}}>
                    <div className={`carousel-item ${activeIndex === 0 ? "active" : ""}`}>
                        <div class="container text-center">
                            <div class="row">
                                <div class="col-lg-4 col-sm-12  ">
                                    <div className={styles.card_container}>
                                        <img src="/assets/person1.png"  alt="Profile"  className={styles.profile_image}  />
                                        <div className={styles.text_content}>
                                            <div className={styles.name_and_title}>
                                                <h2 className={styles.name}>أحمد سالم</h2>
                                                <span className={styles.title}><b>مهندس زراعي</b></span>
                                            </div>
                                            <p className={styles.date}>٢٤ أغسطس ٢٠٢٤</p>
                                            <p className={styles.feedback}>
                                                أحببت بساطة المنصة وشفافيتها. استطعت بسهولة العثور على مشاريع زراعية
                                                تناسب أهدافي الاستثمارية، وأنا سعيد بنتائج الاستثمار حتى الآن.
                                            </p>
                                            <div className={styles.stars}>
                                                <span className={`${styles.star} ${styles.filled}`}>★</span>
                                                <span className={`${styles.star} ${styles.filled}`}>★</span>
                                                <span className={`${styles.star} ${styles.filled}`}>★</span>
                                                <span className={`${styles.star} ${styles.filled}`}>★</span>
                                                <span className={styles.star}>★</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-4 col-sm-12 ">
                                <div className={styles.card_container}>
                                        <img src="/assets/person2.png"  alt="Profile"  className={styles.profile_image}  />
                                        <div className={styles.text_content}>
                                            <div className={styles.name_and_title}>
                                                <h2 className={styles.name}>ليلي حسن</h2>
                                                <span className={styles.title}><b>مالكة أرض زراعية</b></span>
                                            </div>
                                            <p className={styles.date}>١ أكتوبر ٢٠٢٤</p>
                                            <p className={styles.feedback}>مع منصة بذور، تمكنت من عرض أرضي الزراعية للمستثمرين. الآن لدي شراكة ناجحة ودخل إضافي ثابت لمزرعتي.
                                            </p>
                                            <div className={styles.stars}>
                                                <span className={`${styles.star} ${styles.filled}`}>★</span>
                                                <span className={`${styles.star} ${styles.filled}`}>★</span>
                                                <span className={`${styles.star} ${styles.filled}`}>★</span>
                                                <span className={`${styles.star} `}>★</span>
                                                <span className={styles.star}>★</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-4 col-sm-12 ">
                                <div className={styles.card_container}>
                                        <img src="/assets/person3.png"  alt="Profile"  className={styles.profile_image}  />
                                        <div className={styles.text_content}>
                                            <div className={styles.name_and_title}>
                                                <h2 className={styles.name}>خالد عمر</h2>
                                                <span className={styles.title}><b>تاجر محاصيل</b></span>
                                            </div>
                                            <p className={styles.date}>٢٠ ديسمبر ٢٠٢٤</p>
                                            <p className={styles.feedback}>
                                            بفضل هذه المنصة، وسّعت نطاق عملي الزراعي وتمكنت من الوصول إلى منتجات طازجة بجودة عالية. الشات الفوري مع المزارعين يجعل التنسيق أسهل بكثير.
                                            </p>
                                            <div className={styles.stars}>
                                                <span className={`${styles.star} ${styles.filled}`}>★</span>
                                                <span className={`${styles.star} ${styles.filled}`}>★</span>
                                                <span className={`${styles.star} ${styles.filled}`}>★</span>
                                                <span className={`${styles.star} ${styles.filled}`}>★</span>
                                                <span className={styles.star}>★</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`carousel-item ${activeIndex === 1 ? "active" : ""}`}>
                    <div class="container text-center">
                            <div class="row">
                                <div class="col-lg-6 col-sm-12">
                                    <div className={styles.card_container}>
                                        <img src="/assets/person4.png"  alt="Profile"  className={styles.profile_image}  />
                                        <div className={styles.text_content}>
                                            <div className={styles.name_and_title}>
                                                <h2 className={styles.name}>طارق علي</h2>
                                                <span className={styles.title}><b>محلل مالي</b></span>
                                            </div>
                                            <p className={styles.date}>١٠ يونيو ٢٠٢٤ </p>
                                            <p className={styles.feedback}>
                                            هذه المنصة توفر فرصة فريدة للاستثمار الزراعي بمخاطر مدروسة وعوائد مجزية. أعتقد أنها حل مثالي للمستثمرين الذين يبحثون عن فرص آمنة وملموسة.
                                            </p>
                                            <div className={styles.stars}>
                                                <span className={`${styles.star} ${styles.filled}`}>★</span>
                                                <span className={`${styles.star} ${styles.filled}`}>★</span>
                                                <span className={`${styles.star} ${styles.filled}`}>★</span>
                                                <span className={`${styles.star} ${styles.filled}`}>★</span>
                                                <span className={`${styles.star} ${styles.filled}`}>★</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6 col-sm-12">
                                <div className={styles.card_container}>
                                        <img src="/assets/person5.png"  alt="Profile"  className={styles.profile_image}  />
                                        <div className={styles.text_content}>
                                            <div className={styles.name_and_title}>
                                                <h2 className={styles.name}>نورة الجابر</h2>
                                                <span className={styles.title}><b>مهندسة زراعية</b></span>
                                            </div>
                                            <p className={styles.date}>١٠ مارس ٢٠٢٤</p>
                                            <p className={styles.feedback}>
                                            أعجبتني ميزة الذكاء الاصطناعي التي تساعد في تشخيص أمراض النباتات. توفير تقارير دقيقة يساعد المزارعين على حماية محاصيلهم.
                                            </p>
                                            <div className={styles.stars}>
                                                <span className={`${styles.star} ${styles.filled}`}>★</span>
                                                <span className={`${styles.star} ${styles.filled}`}>★</span>
                                                <span className={`${styles.star} ${styles.filled}`}>★</span>
                                                <span className={`${styles.star} ${styles.filled}`}>★</span>
                                                <span className={styles.star}>★</span>
                                            </div>
                                        </div>
                                 </div>
                                 </div>
                                 </div>
                                 </div>
                                   
                                
                            

                    </div>
                </div>

                <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide="prev"
                    onClick={() => handleSlideChange((activeIndex - 1 + 3) % 3)} // الانتقال إلى الشريحة السابقة
                >
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide="next"
                    onClick={() => handleSlideChange((activeIndex + 1) % 3)} // الانتقال إلى الشريحة التالية
                >
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
            <Footer/>
        </>
    );
};

export default Opinon;
