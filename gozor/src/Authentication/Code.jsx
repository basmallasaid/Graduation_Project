import React, { useState } from 'react';
import styles from '../Styles/style.module.css';
import Modal from 'react-modal';
import New from './Newpassword';
import axios from 'axios';  
import toast, { Toaster } from "react-hot-toast";

export default function Code({ email }) { 
  const [visiblenew, setVisiblenew] = useState(false);
  const [code, setCode] = useState('');  

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

  const handleSubmit = async (event) => {
    event.preventDefault();  
  
    if (!email) {
      toast.error("البريد الإلكتروني غير متوفر!");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:3100/code", {
        email: email,  
        code: code  
      });
  
      if (response.data.isValid) {
        setVisiblenew(true);
      } else {
        toast.error('الكود غير صحيح');  
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      toast.error('حدث خطأ. يرجى المحاولة لاحقاً');  
    }
  };
  
  

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <div>
        <div className={styles.logcontainer}>
          <form className={styles.forgetform} onSubmit={handleSubmit}>
            <h1 className={styles.firsttitle}>برجاء ادخال كود التحقق</h1>
            <br />
            <hr className={styles.hr} />
            <div className={styles.holder}>
              <div className={styles.reginput}>
                <label for="code" className={styles.reglabel}>الكود</label>
                <br />
                <input
                  type="text"  
                  name="code"
                  placeholder="Ex:25648975"
                  value={code}  
                  onChange={(e) => setCode(e.target.value)}  
                  className={styles.loginput}
                />
              </div>
              <button type="submit" className={styles.logButton}
                  onClick={(e) => {
                    e.preventDefault(); 
                    e.stopPropagation(); 
                    handleSubmit(e); 
                  }}
              >
                
                ارسال
              </button>
            </div>
          </form>
        </div>

        <Modal
          isOpen={visiblenew}
          onRequestClose={() => setVisiblenew(false)}
          style={newStyles}
        >
          <button onClick={() => setVisiblenew(false)}>
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
          <New email={email} code={code}/>
        </Modal>
      </div>
    </>
  );
}
