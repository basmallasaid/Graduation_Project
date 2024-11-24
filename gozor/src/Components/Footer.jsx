// import "./footer.css";
// import "@fortawesome/fontawesome-free/css/all.css"; // Font Awesome icons

export default function Footer() {
  return (
    <>
    <footer>
  <div className="footer-container">
  <div className="footer-column">
        <h3>   حول منصه <span className="green-text"> جذور </span></h3>
      <p>توفر   <span classNameName="yellow-text">"جذور"</span> منصة رقمية تربط بين المزارعين، المستثمرين، والتجار، مما يسهل فرص التعاون الزراعي ويدعم استدامة المشاريع. </p>
    </div>
    <div className="footer-column">
      <h3>خدماتنا</h3>
      <ul>
        <li><span className="yellow-text">للمزارعين:</span> إدارة للمحاصيل، حلول الذكاء الاصطناعي، وسهولة الوصول للأسواق.</li>
        <li><span className="yellow-text">للمستثمرين:</span> فرص استثمارية، تقارير دورية، وإمكانية متابعة المشاريع.</li>
        <li> <span className="yellow-text">للتجار:</span> متجر للمنتجات الزراعية، التواصل المباشر مع المزارعين، وضمان جودة المحاصيل.</li>
      </ul>
    </div>
    <div className="footer-column">
      <h3>روابط مهمة</h3>
      <ul>
       <a href="#"><li>الأسئلة الشائعة</li></a> 
       <a href="#"><li>سياسيه الخصوصيه</li></a> 
       <a href="#"><li>شروط الاستخدام </li></a> 
       <a href="#"><li>  دعم العملاء</li></a> 
        
      </ul>
    </div>
    <div className="footer-column">
      <h3>تواصل معنا</h3>
      <ul className="contact-info">
        <li> <i className="fa-solid fa-envelope yellow-text"> </i>janaahmedelsayed15@gmail.com  </li>
        <li> <i className="fa-solid fa-phone yellow-text"></i>01061107459</li>
        <li> <i className="fa-solid fa-location-pin yellow-text"></i>شارع التنمية الزراعية، القاهرة، مصر</li>
      </ul>
      <p>تابعنا على وسائل التواصل الاجتماعي</p>
      <div className="social-icons">
        <a href="#" className="icon-twitter"><i className="fa-brands fa-twitter"></i></a>
        <a href="#" className="icon-facebook"><i className="fa-brands fa-facebook"></i></a>
        <a href="#" className="icon-pinterest"><i className="fa-brands fa-pinterest"></i></a>
        <a href="#" className="icon-instagram"><i className="fa-brands fa-instagram"></i></a>
      </div>
    </div>
   
   
  
  </div>
</footer>
  <div className="footer-bottom">
  <div>
      <a href="#">Terms of Use   |</a>  <a href="#">  Privacy Policy</a>
    </div>
    <small>© All Copyright 2024 by shawonetc Themes</small>
    
  </div>
</>
  );
}