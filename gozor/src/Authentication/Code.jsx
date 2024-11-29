import React, { useState } from 'react';
import styles from '../Styles/style.module.css';
import Modal from 'react-modal';
import New from './Newpassword'
export default function Code() {
  const [visiblenew, setVisiblenew] = useState(false);

  const newStyles = {
    content: {
      maxWidth: '500px',
      margin: '0 auto',
      padding: '10px',
      borderRadius: '10px',
      height: '500px',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  };
    return(
    <>
  <div>

        <div className={styles.logcontainer}>
    
          
          <form className={styles.forgetform}>
          <h1 className={styles.firsttitle}> برجاء ادخال كود التحقق</h1>
          <br/>
          <hr className={styles.hr}/>
          <div className={styles.holder}>
         
            <div className={styles.reginput}>
            <label for="code" className={styles.reglabel}>الكود</label>
            <br/>

              <input
                type="code"
                name="code"
                placeholder="Ex:25648975"
             
                className={styles.loginput}
              />
            </div>
        
            <button type="submit" className={styles.logButton}   onClick={(event) => {
                  event.preventDefault(); // Prevent default form submission
                  setVisiblenew(true);  // Open the modal
                }}>
          ارسال
        </button>
        <Modal
                isOpen={visiblenew}
                onRequestClose={() => setVisiblenew(false)}
                style={newStyles}
              >
                <button
                  onClick={() => setVisiblenew(false)}
                >
                  <i
                    className="fa-solid fa-xmark"
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      fontSize: '24px',
                      color: '#333',
                      cursor: 'pointer',
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                    }}
                  ></i>
                </button>
                <New />
              </Modal>
        </div>
          
            </form>
     
        </div>
    </div>
        </>);
    
  }