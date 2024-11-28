import React from 'react';
import Navbar from './Navbar';
import styles from "../Styles/style.module.css"; 
const Instructions = () => {
    return (
        <>
        <Navbar/>
        <div>
            <img src='assets/inst.png' className={styles.instimg}/>
        </div>
        <div className={styles.divinst}>
            <h4><b>منصة "<span className={styles.yetxt}>جذور</span> " هي بوابتك الذكية للزراعة المستدامة والاستثمار الآمن. تجمع المنصة بين المزارعين الذين يسعون لتمويل دوراتهم الزراعية، المستثمرين الباحثين عن فرص استثمارية مضمونة في الزراعة، والتجار الذين يرغبون في شراء المحاصيل مباشرة من المصدر. تقدم المنصة لكل مستخدم الأدوات والإرشادات التي يحتاجها لتحقيق أهدافه:</b></h4>
            <ul style={{margin:"20px"}}>
                <li><span className={styles.graytxt}>المزارعون</span> يمكنهم إدارة دوراتهم الزراعية وتلقي التمويل والتواصل المباشر مع المستثمرين والتجار.</li>
                <li><span className={styles.graytxt}>المستثمرون</span> يحصلون على فرص استثمارية شفافة ومرنة، مع إمكانية متابعة تقدم المحاصيل ومراقبة العائدات.</li>
                <li><span className={styles.graytxt}>التجار</span> يستفيدون من الوصول المباشر إلى محاصيل طازجة عالية الجودة، مع إمكانية التفاوض والتواصل مع المزارعين مباشرة.</li>
            </ul>
            <h4><b>باتباعك للتعليمات المخصصة لك كمزارع، مستثمر، أو تاجر، ستتمكن من استخدام المنصة بسهولة وفعالية، لتحقيق أهدافك الزراعية أو الاستثمارية بكل أمان وشفافية.</b></h4>
        </div>
        <div style={{ display: "flex", justifyContent: "center"}}>
            <div className="btn-group  " role="group" style={{width:"50%" ,direction:"ltr" }} >
                <button type="button" className="btn btn-success btn-lg"  ><h4> تعليمات للتاجر</h4></button>
                <button type="button" className="btn btn-success btn-lg"><h4>تعليمات للمزارع</h4></button>
                <button type="button" className="btn btn-success btn-lg"><h4>تعليمات المستثمر</h4></button>
            </div>
            </div>
            <div className='farmer' >
                <h3>تعليمات المزارع</h3>
                
            </div>


        </>
    );
};

export default Instructions;