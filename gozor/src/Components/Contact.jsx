// import Header from "./Header";
// import Footer from "./Footer";
// import "./Contact.css";
 function Contact() {
    return (
        <>
            {/* <Header/> */}
            <section className="contact">
                <div className="contact-container">
                    <h3>
                        <span>الرئيسيه</span> / <span>التواصل</span>
                        <br/>
                        <h1>تواصل معنا</h1>
                    </h3>
                </div>
            </section>
            
            <div className="about-container">
                <div className="about">
                <div className="box orange">
                        <h2>العنوان</h2>
                        <p>شارع التنمية الزراعية</p>
                        <p>القاهرة، مصر</p>
                    </div>
                   
                    <div className="box yellow-green">
                        <h2>للتواصل</h2>
                        <p>+201009913445</p>
                        <p>info@crops.com</p>
                        <p>السبت - للخميس</p>
                        <p>من الساعة ٧ - ٥</p>
                    </div>
                    <div className="box green">
                        <h2>عنا</h2>
                        <p>منصة رقمية تربط بين المزارعين، المستثمرين، والتجار مما يسهل فرص التعاون الزراعي ويدعم استدامة المشاريع.</p>
                    </div>
                  
                </div>
            </div>
            {/* <Footer/> */}
        </>
    )
}
export default Contact;