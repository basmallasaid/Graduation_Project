import React from 'react';
import styles from "../../../Styles/style.module.css"; 
import { Link } from 'react-router-dom';
const FooterInv = () => {
    return (
        <>
        <footer className={` text-white ${styles.footerF}`} style={{backgroundColor:"#073B3A"}}>
           <div className={`container ${styles.footer_container}`}>
             <div className="row">
               <div className={`col-md-3 ${styles.footer_column}`}>
               <h3>حول منصه <span className={styles.green_text}> جذور </span></h3>
               <p>توفر<span className={styles.yellow_text}>"جذور"</span> منصة رقمية تربط بين المزارعين، المستثمرين، والتجار، مما يسهل فرص التعاون الزراعي ويدعم استدامة المشاريع. </p>
               </div>
               <div className={`col-md-3 ${styles.footer_column}`}>
               <h3>خدماتنا</h3>
                 <p>
                 <span className={styles.yellow_text}>للمزارعين:</span> إدارة للمحاصيل، حلول الذكاء الاصطناعي، وسهولة الوصول للأسواق.
                 </p>
                 <p>
                 <span className={styles.yellow_text}>للمستثمرين:</span> فرص استثمارية، تقارير دورية، وإمكانية متابعة المشاريع.
                 </p>
                 <p>
                 <span className={styles.yellow_text}>للتجار:</span> متجر للمنتجات الزراعية، التواصل المباشر مع المزارعين، وضمان جودة المحاصيل.
                 </p>
               </div>
               <div className={`col-md-3 ${styles.footer_column}`}>
               <h3>روابط مهمة</h3>
                 <ul className="list-unstyled">
                     <li>
                  <Link to="/Opinon" >
                  رايك يهمنا
                  </Link>
                </li>
              
                <li>
                  <Link to="/Contact" >
تواصل معنا                  </Link>
                </li>
                 </ul>
               </div>
               <div className={`col-md-3 ${styles.footer_column}`}>
               <h3>تواصل معنا</h3>
                 <ul className={`list-unstyled `}>
                   
                   <li>
                     {" "}
                     <svg
                       xmlns="http://www.w3.org/2000/svg"
                       width="16"
                       height="16"
                       fill="currentColor"
                       className="bi bi-envelope-fill"
                       viewBox="0 0 16 16"
                       color='darkgoldenrod'
                     >
                       <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z" />
                     </svg>{" "}
                     Gozor@gmail.com
                   </li>
                   <li>
                     <svg
                       xmlns="http://www.w3.org/2000/svg"
                       width="16"
                       height="16"
                       fill="currentColor"
                       className="bi bi-telephone-fill"
                       viewBox="0 0 16 16"
                       color='darkgoldenrod'
                     >
                       <path
                         fill-rule="evenodd"
                         d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"
                       />
                     </svg>
                     {" "} +20 108447538
                   </li>
                   <li>
                   <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                    width="16"
                     height="16"
                    color='darkgoldenrod'
                    fill="currentColor"
                     className="bi bi-telephone-fill"
                     
   
                    >
                      
                   <path d="M172.3 501.7C27 291 0 269.4 0 192 0 86 86 0 192 0s192 86 192 192c0 77.4-27 99-172.3 309.7-9.5 13.8-29.9 13.8-39.5 0zM192 272c44.2 0 80-35.8 80-80s-35.8-80-80-80-80 35.8-80 80 35.8 80 80 80z"/></svg>
                    {" "} شارع التنمية الزراعية، القاهرة، مصر
                   </li>
                 </ul>
                 <p>تابعنا على وسائل التواصل الاجتماعي</p>
                 <ul className="list-unstyled d-flex">
                 <li className="me-5"><Link to="/" target="_blank" className="text-decoration-none">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="16" height="16"  fill="currentColor">
                  <path fill="#ffffff" d="M279.1 288l14.2-92.7h-88.9v-60.1c0-25.4 12.4-50.1 52.2-50.1h40.4V6.3S260.4 0 225.4 0c-73.2 0-121.1 44.4-121.1 124.7v70.6H22.9V288h81.4v224h100.2V288z"/></svg></Link></li>
                   <li className="me-5"><Link to="/" target="_blank" className="text-decoration-none">
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16"  fill="currentColor">
                   <path fill="#ffffff" d="M459.4 151.7c.3 4.5 .3 9.1 .3 13.6 0 138.7-105.6 298.6-298.6 298.6-59.5 0-114.7-17.2-161.1-47.1 8.4 1 16.6 1.3 25.3 1.3 49.1 0 94.2-16.6 130.3-44.8-46.1-1-84.8-31.2-98.1-72.8 6.5 1 13 1.6 19.8 1.6 9.4 0 18.8-1.3 27.6-3.6-48.1-9.7-84.1-52-84.1-103v-1.3c14 7.8 30.2 12.7 47.4 13.3-28.3-18.8-46.8-51-46.8-87.4 0-19.5 5.2-37.4 14.3-53 51.7 63.7 129.3 105.3 216.4 109.8-1.6-7.8-2.6-15.9-2.6-24 0-57.8 46.8-104.9 104.9-104.9 30.2 0 57.5 12.7 76.7 33.1 23.7-4.5 46.5-13.3 66.6-25.3-7.8 24.4-24.4 44.8-46.1 57.8 21.1-2.3 41.6-8.1 60.4-16.2-14.3 20.8-32.2 39.3-52.6 54.3z"/></svg></Link></li>
                   <li className="me-5"><Link to="" target="_blank" className="text-decoration-none">
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"width="16" height="16" fill="currentColor" color='white'>
                   <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg></Link></li>
                 </ul>
               </div>
             </div>
           </div>
         </footer>
         <div className={styles.footer_bottom} style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center',backgroundColor:'#2D625A' }}>
         <div style={{ textAlign: 'right' }} >
       <Link className="text-decoration-none" to="#" style={{ color: "white" }}>Terms of Use |</Link>  
       <Link to="#" className="text-decoration-none" style={{ color: "white" }}>Privacy Policy</Link>
     </div>
     <small style={{ textAlign: 'left' }}>© All Copyright 2024 by shawonetc Themes</small>
   </div>
   
          
        
   </>
     );
   }

export default FooterInv;