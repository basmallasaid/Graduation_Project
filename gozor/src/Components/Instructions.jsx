import React, { useRef } from 'react';
import Navbar from './Navbar';
import styles from "../Styles/style.module.css"; 
import Footer from './Footer';

const Instructions = () => {
  // Create a reference for the farmer div
  const farmerRef = useRef(null);
  const investorRef = useRef(null);
  const merchantRef = useRef(null);
  // Function to scroll to the farmer instructions
  const scrollToFarmerInstructions = () => {
    farmerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToinvestorInstructions = () => {
    investorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const scrollTomerchantInstructions = () => {
    merchantRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <>
      <Navbar />
      <div >
        <img src="assets/inst.png" className={styles.instimg} />
      </div>
      <div className={styles.divinst}>
        <h4>
          <b>
            منصة "<span className={styles.yetxt}>جذور</span> " هي بوابتك الذكية للزراعة المستدامة
            والاستثمار الآمن. تجمع المنصة بين المزارعين الذين يسعون لتمويل دوراتهم الزراعية،
            المستثمرين الباحثين عن فرص استثمارية مضمونة في الزراعة، والتجار الذين يرغبون في شراء
            المحاصيل مباشرة من المصدر. تقدم المنصة لكل مستخدم الأدوات والإرشادات التي يحتاجها
            لتحقيق أهدافه:
          </b>
        </h4>
        <ul style={{ margin: "20px" }}>
          <li>
            <span className={styles.graytxt}>المزارعون</span> يمكنهم إدارة دوراتهم الزراعية وتلقي
            التمويل والتواصل المباشر مع المستثمرين والتجار.
          </li>
          <li>
            <span className={styles.graytxt}>المستثمرون</span> يحصلون على فرص استثمارية شفافة
            ومرنة، مع إمكانية متابعة تقدم المحاصيل ومراقبة العائدات.
          </li>
          <li>
            <span className={styles.graytxt}>التجار</span> يستفيدون من الوصول المباشر إلى محاصيل
            طازجة عالية الجودة، مع إمكانية التفاوض والتواصل مع المزارعين مباشرة.
          </li>
        </ul>
        <h4>
          <b>
            باتباعك للتعليمات المخصصة لك كمزارع، مستثمر، أو تاجر، ستتمكن من استخدام المنصة بسهولة
            وفعالية، لتحقيق أهدافك الزراعية أو الاستثمارية بكل أمان وشفافية.
          </b>
        </h4>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="btn-group" role="group" style={{ width: "50%", direction: "ltr" }}>
          <button type="button" className="btn btn-success btn-lg" onClick={scrollTomerchantInstructions}>
            <h4>تعليمات للتاجر</h4>
          </button>
          <button type="button" className="btn btn-success btn-lg" onClick={scrollToFarmerInstructions}>
            <h4>تعليمات للمزارع</h4>
          </button>
          <button type="button" className="btn btn-success btn-lg" onClick={scrollToinvestorInstructions}>
            <h4>تعليمات المستثمر</h4>
          </button>
        </div>
      </div>
      
      {/* Farmer Instructions Div */}
     
      <div className={`${styles.farmer}`} ref={farmerRef}>
        <p>تعليمات المزارع</p>
        <img src='/assets/farmerr.png'/>
      </div>
      <div className={`${styles.investor}`} ref={investorRef}>
        <p>تعليمات المستثمر</p>
        <img src='/assets/invesrorr.png'/>
      </div>
      <div className={`${styles.merchant}`} ref={merchantRef}>
        <p>تعليمات للتاجر</p>
        <img src='/assets/merchantt.png'/>
      </div>
      
      <Footer/>
    </>
  );
};

export default Instructions;
