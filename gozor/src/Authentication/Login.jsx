import React, { useState } from 'react';
import styles from '../Styles/style.module.css';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import Forget from '../Authentication/Forget';

export default function Login() {

  const [visibleforget, setVisibleforget] = useState(false);
  const forgetStyles = {
    content: {
      maxWidth: '600px', // Set your desired width
      margin: '0 auto', // Centers the modal horizontally
      padding: '10px', // Add padding for better spacing
      borderRadius: '10px', // Optional: round corners
      height:'460px'
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: dim background
    },
  };
    
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
                <p>ليس لديك حساب ؟< Link href="/Register" className={styles.linkforget}>انشاء حساب </Link></p>
                < Link href="/"className={styles.linkforget} onClick={()=>setVisibleforget(true)} > هل نسيت كلمه المرور ؟</Link>
                <Modal isOpen={visibleforget} onRequestClose={()=>setVisibleforget(false)} style={forgetStyles}>
                <button onClick={()=>setVisibleforget(false)}><i className="fa-solid fa-xmark"
                style={{
                  backgroundColor: 'transparent', 
                  border: 'none', 
                  fontSize: '24px', 
                  color: '#333', 
                  cursor: 'pointer', 
                  position: 'absolute',
                  top: '10px', 
                  right: '10px', 
                }} ></i></button>
              <Forget 
              
              />

            </Modal>

            </div>
            </form>
            <img         src="/assets/Rectangle (2).png"
    />
        </div>
    </div>
        </>);
    
  }