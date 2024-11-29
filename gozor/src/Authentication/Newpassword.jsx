import React, { useState } from 'react';
import styles from '../Styles/style.module.css';

export default function Forget() {


  return (
    <>
      <div>
        <div className={styles.logcontainer}>
          <form className={styles.forgetform}>
            <h1 className={styles.firsttitle}>انشاء كلمه مرور جديده</h1>
            <hr className={styles.hr} />
            <div className={styles.holder}>
              <div className={styles.reginput}>
                <label
                  htmlFor="password"
                  className={styles.reglabel}
                >
              <i class="fa-solid fa-lock"style={{paddingLeft:"15px"}}></i>
                  كلمه المرور 
                </label>
                <br />
                <input
                  type="password"
                  name="password"
                  placeholder="كلمه المرور"
                  className={styles.loginput}
                />
              </div>
              <div className={styles.reginput}>
                <label
                  htmlFor="password"
                  className={styles.reglabel}
                >
              <i class="fa-solid fa-lock"style={{paddingLeft:"15px"}}></i>
                   اعاده كلمه المرور 
                </label>
                <br />
                <input
                  type="password"
                  name="password"
                  placeholder="اعاده كلمه المرور"
                  className={styles.loginput}
                />
              </div>
              <button
                type="submit"
                className={styles.logButton}
              
              >
                ارسال
              </button>
           
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
