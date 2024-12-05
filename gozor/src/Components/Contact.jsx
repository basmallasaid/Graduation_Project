import React, { useState } from 'react';
import axios from 'axios';
import styles from "../Styles/style.module.css";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Swal from 'sweetalert2';
const Contact = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // تأكد من وجود موضوع ورسالة
    if (!subject || !message) {
      alert("الرجاء ملء جميع الحقول");
      return;
    }

    // إرسال البيانات عبر POST
    try {
      const response = await axios.post('http://localhost:3100/contacts', {
        subject,
        message,
      });
      Swal.fire({
        title: 'تم إرسال رسالتك بنجاح',
        icon: 'success',
        confirmButtonText: 'موافق'
      });
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error("حدث خطأ أثناء إرسال الرسالة:", error);
      Swal.fire({
        title: 'حدث خطأ أثناء إرسال رسالتك',
        text: 'يرجى المحاولة لاحقاً.',
        icon: 'error',
        confirmButtonText: 'موافق'
      });
    }
  };

  return (
    <>
      <Navbar />
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
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <button type="submit" className={styles.subbutton}>
              إرسال
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
