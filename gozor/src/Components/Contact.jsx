// import Header from "./Header";
// import Footer from "./Footer";
 import styles from  "../Styles/style.module.css";
import Footer from "./Footer";
import Navbar from "./Navbar";
 function Contact() {
    return (
        <>
            
            <Navbar/>
            <section className={styles.contact}>
                <div className={styles.contact_container}>
                    <h3 >
                        <span className={styles.span}>الرئيسيه / التواصل</span> <span></span>
                        <br/>
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
        <div className={styles.card_2} >
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
        <form className={styles.contforms}>
          <input type="message" placeholder="الموضوع" className={styles.forminput} />
          <textarea placeholder="رسالتك" className={styles.forminputarea}></textarea>
          <button type="submit" className={styles.subbutton}>إرسال</button>
        </form>
      </div>
    </div>
    <Footer/>
  
       
   
        </>
    )
}
export default Contact;