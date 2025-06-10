import React, { useState, useEffect } from 'react';
import Swal from "sweetalert2";
import styles from "../Styles/style.module.css";
import api from '../API/axiosInstance';

// --- استيراد جميع مكونات النافبار والفوتر ---
import Navbar from './Navbar';
import Footer from './Footer';
import FooterF from './FarmerDashboard/Main/FooterF';
import FooterInv from './InvestorDashboard/Main/FooterInv';
import FooterMer from './merchantDashboard/Main/FooterMer';
import NavbarF from './FarmerDashboard/Main/NavbarF';
import NavbarInv from './InvestorDashboard/Main/NavbarInv';
import NavbarMer from './merchantDashboard/Main/NavbarMer';

// --- مكونات مساعدة لعرض النافبار والفوتر حسب الدور ---
const RenderNavbarByRole = ({ role }) => {
  switch (role) {
    case 'Merchant':
      return <NavbarMer />;
    case 'Investor':
      return <NavbarInv />;
    case 'Farmer':
      return <NavbarF />;
    default:
      return <Navbar />;
  }
};

const RenderFooterByRole = ({ role }) => {
  switch (role) {
    case 'Merchant':
      return <FooterMer />;
    case 'Investor':
      return <FooterInv />;
    case 'Farmer':
      return <FooterF />;
    default:
      return <Footer />;
  }
};

const Opinion = () => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [comments, setComments] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const [userId, setUserId] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user_data'));
    if (userData) {
      setUserId(userData.userId);
      setUserRole(userData.role);
      setUserName(userData.name);
    }
    loadComments();
  }, []);

  const handleStarClick = (starIndex) => {
    setRating(starIndex);
  };

  const handleSlideChange = (index) => {
    setActiveIndex(index);
  };

  const handleSubmit = async (event) => {
  event.preventDefault();

  if (!userId) {
    Swal.fire({
      title: "يرجى تسجيل الدخول أولاً",
      text: "يجب عليك تسجيل الدخول لكي تتمكن من إضافة رأيك.",
      icon: "warning",
      confirmButtonText: "حسنًا",
    });
    return;
  }

  if (rating === 0 || !feedback.trim()) {
    Swal.fire({
      title: "بيانات ناقصة",
      text: "يرجى اختيار تقييم وكتابة رأيك.",
      icon: "info",
      confirmButtonText: "حسنًا",
    });
    return;
  }

  const data = {
    rate: rating,
    userName:userName,
    descripition: feedback,
    date: new Date().toISOString(),

  };

  try {
    await api.post("Comminucation", data);
    Swal.fire({
      title: "شكراً على رأيك!",
      text: "تم إرسال رأيك بنجاح.",
      icon: "success",
      confirmButtonText: "حسنًا",
    });
    setRating(0);
    setFeedback("");
    loadComments();
  } catch (error) {
    console.error("خطأ أثناء إرسال الرأي:", error);
    Swal.fire({
      title: "خطأ",
      text: "حدث خطأ أثناء إرسال رأيك. يرجى المحاولة لاحقاً.",
      icon: "error",
      confirmButtonText: "حسنًا",
    });
  }
};


  const loadComments = async () => {
    try {
      const response = await api.get("Comminucation");
      const validComments = response.data.filter(c => c.descripition && c.rate > 0);
      setComments(validComments);
    } catch (error) {
      console.error("فشل تحميل التعليقات:", error);
    }
  };

  const commentsPerSlide = 3;
  const slideComments = [];
  for (let i = 0; i < comments.length; i += commentsPerSlide) {
    slideComments.push(comments.slice(i, i + commentsPerSlide));
  }

  return (
    <>
      <RenderNavbarByRole role={userRole} />

      <div>
        <img src="assets/opinon.png" className={styles.opinon} alt="Opinion" />
      </div>
      <div className={styles.opinondiv}>
        <p><span className={styles.yetxt}>رأيك يهمنا</span></p>
        <h3><b>ما رأيك في تجربتك معنا؟</b></h3>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            onClick={() => handleStarClick(star)}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
            style={{
              width: "5%",
              height: "50px",
              margin: "5px",
              fill: star <= rating ? "gold" : "gray",
              cursor: "pointer",
            }}
          >
            <path
              d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"
              fillRule="evenodd"
            />
          </svg>
        ))}
      </div>

      <form className={styles.contforms} style={{ marginTop: "60px" }} onSubmit={handleSubmit}>
        <textarea
          name="message"
          className={styles.textarea}
          placeholder="اكتب رأيك...."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        ></textarea>
        <button type="submit" className={styles.subbutton}>إرسال</button>
      </form>

      <div className={styles.opinonnote}>
        <p>ماذا يقول عملاؤنا</p>
        <h3 className={styles.green_text}>ملاحظات المستخدمين</h3>
      </div>

      <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner" style={{ margin: "50px auto" }}>
          {slideComments.map((slide, slideIndex) => (
            <div
              key={slideIndex}
              className={`carousel-item ${activeIndex === slideIndex ? "active" : ""}`}
            >
              <div className="container">
                <div className="row">
                  {slide.map((comment, index) => (
                    <div key={index} className="col-lg-4 col-sm-12 mb-4">
                      <div className={styles.card_container}>
                        <div className={styles.text_content}>
                          <div className={styles.name_and_title}>
                            <h2 className={styles.name}>{comment.userName || "مستخدم"}</h2>
                          </div>
                          <p className={styles.date}>
                            {new Date(comment.date).toLocaleDateString('ar-EG', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                          <p className={styles.feedback}>{comment.descripition}</p>
                          <div className={styles.stars}>
                            {Array.from({ length: 5 }, (_, starIndex) => (
                              <span
                                key={starIndex}
                                className={`${styles.star} ${starIndex < comment.rate ? styles.filled : ""}`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="prev"
          onClick={() =>
            handleSlideChange((activeIndex - 1 + slideComments.length) % slideComments.length)
          }
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="next"
          onClick={() => handleSlideChange((activeIndex + 1) % slideComments.length)}
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>

        <div className={styles.carouselIndicators}>
          {slideComments.map((_, index) => (
            <button
              key={index}
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to={index}
              className={`${styles.indicatorButton} ${activeIndex === index ? styles.activeIndicator : ''}`}
              aria-current={activeIndex === index ? "true" : "false"}
              aria-label={`Slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>

      <RenderFooterByRole role={userRole} />
    </>
  );
};

export default Opinion;
