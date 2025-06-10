import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import styles from "../Styles/style.module.css";
import api from '../API/axiosInstance';

// ... (مكونات RenderNavbarByRole و RenderFooterByRole تبقى كما هي)
import FooterF from './FarmerDashboard/Main/FooterF';
import FooterInv from './InvestorDashboard/Main/FooterInv';
import FooterMer from './merchantDashboard/Main/FooterMer';
import NavbarF from './FarmerDashboard/Main/NavbarF';
import NavbarInv from './InvestorDashboard/Main/NavbarInv';
import NavbarMer from './merchantDashboard/Main/NavbarMer';
import Navbar from './Navbar';
import Footer from './Footer';

const RenderNavbarByRole = ({ role }) => {
  switch (role) {
    case 'Merchant': return <NavbarMer />;
    case 'Investor': return <NavbarInv />;
    case 'Farmer': return <NavbarF />;
    default: return <Navbar />;
  }
};
const RenderFooterByRole = ({ role }) => {
  switch (role) {
    case 'Merchant': return <FooterMer />;
    case 'Investor': return <FooterInv />;
    case 'Farmer': return <FooterF />;
    default: return <Footer />;
  }
};


const Contact = () => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [userId, setUserId] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user_data"));
    if (userData && userData.userId && userData.role) {
      setUserId(userData.userId);
      setUserRole(userData.role);
    }
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!userId) {
    Swal.fire({
      title: 'يرجى تسجيل الدخول أولاً',
      text: 'يجب عليك تسجيل الدخول لتتمكن من إرسال رسالة.',
      icon: 'warning',
      confirmButtonText: 'موافق'
    });
    return;
  }

  if (!subject || !description) {
    Swal.fire({
      title: 'يرجى ملء جميع الحقول',
      icon: 'info',
      confirmButtonText: 'موافق'
    });
    return;
  }

  if (description.length < 11) {
    Swal.fire({
      title: 'الرسالة قصيرة جداً',
      text: 'يجب أن تحتوي الرسالة على 11 حرفًا على الأقل.',
      icon: 'warning',
      confirmButtonText: 'موافق'
    });
    return;
  }

  setIsSubmitting(true);

  try {
    await api.post('Comminucation/SendSupprt', {
      Subject: subject,
      Description: description,
      UserId: userId
    });

    Swal.fire({
      title: 'تم إرسال رسالتك بنجاح',
      icon: 'success',
      confirmButtonText: 'موافق'
    });

    setSubject('');
    setDescription('');
  } catch (error) {
    console.error("تفاصيل الخطأ من الخادم:", error.response?.data);
    Swal.fire({
      title: 'حدث خطأ أثناء إرسال رسالتك',
      text: 'يرجى المحاولة لاحقاً.',
      icon: 'error',
      confirmButtonText: 'موافق'
    });
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <>
      <RenderNavbarByRole role={userRole} />

      {/* ... بقية الكود (JSX) يبقى كما هو ... */}
      <section className={styles.contact}>
        <div className={styles.contact_container}>
          <h3>
            <span className={styles.span}>الرئيسيه / التواصل</span>
            <br />
          </h3>
          <h1>تواصل معنا</h1>
        </div>
      </section>

      <div className={styles.call}>
        <div className={styles.cards}>
          <div className={styles.card_1}>
            <h3>العنوان</h3>
            <p>شارع التنميه الزراعيه, القاهرة, مصر</p>
          </div>
          <div className={styles.card_2}>
            <h3>للتواصل</h3>
            <p>01061107459</p>
            <p>Gozor@gmail.com</p>
            <p>من 9 ص إلى 5 م</p>
          </div>
          <div className={styles.card_3}>
            <h3>عنا</h3>
            <p>
              نحن منصة توفر طرق استثمار آمنة ومبتكرة في المجال الزراعي
              <br />
              مع دعم متواصل للمستثمرين.
            </p>
          </div>
        </div>

        <div className={styles.forms}>
          <h2 className={styles.ytext}>تواصل معنا</h2>
          <p className={styles.headtitle}>اكتب رسالتك</p>
          <form className={styles.contforms} onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="الموضوع"
              className={styles.forminput}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <textarea
              placeholder="رسالتك"
              className={styles.forminputarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <button
              type="submit"
              className={styles.subbutton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "جاري الإرسال..." : "إرسال"}
            </button>
          </form>
        </div>
      </div>

      <RenderFooterByRole role={userRole} />
    </>
  );
};

export default Contact;