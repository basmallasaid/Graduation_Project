import React, { useState } from 'react';
import styles from '../Styles/style.module.css';
import { Link } from 'react-router-dom';
export default function Login() {
    
    return(
    <>
  <div>

        <div className={styles.logcontainer}>
    
          
          <form className={styles.logform}>
          <h1 className={styles.firsttitle}> تسجيل الدخول</h1>
          <br/>
          <p className={styles.subtitlee}>أهلا بك في جذور</p>
          <hr className={styles.hr}/>
          <div className={styles.holder}>
            <div className={styles.reginput}>
            <label for="name" className={styles.reglabel}>          <i class="fa-solid fa-user" style={{paddingLeft:"15px"}}></i>
            الاسم </label>
    <br/>
              <input
              
                type="text"
                name="name"
                placeholder=" الاسم بالكامل" 
                className={styles.loginput}
              />
            </div>
            <div className={styles.reginput}>
            <label for="email" className={styles.reglabel}><i className="fa-solid fa-envelope" style={{paddingLeft:"15px"}}></i>البريد الالكتروني </label>
            <br/>

              <input
                type="email"
                name="email"
                placeholder="البريد الالكتروني"
             
                className={styles.loginput}
              />
            </div>
            <div className={styles.loginput}>
    
            <input type="radio" id="html" name="fav_language" value="HTML"/>
  <label for="html" >تذكرني</label><br/>
            </div>
            <button type="submit" className={styles.logButton}>
          دخول
        </button>
        </div>
            <div className={styles.forget}>
                <p>لديك حساب بالفعل؟ < Link href="/login" className={styles.linkforget}>تسجيل الدخول</Link></p>
                < Link href="/"className={styles.linkforget}> هل نسيت كلمه المرور ؟</Link>

            </div>
            </form>
            <img         src="/assets/Rectangle (2).png"
    />
        </div>
    </div>
        </>);
    
  }