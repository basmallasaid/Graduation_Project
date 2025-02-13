import React, { useState } from 'react';
import axios from 'axios';
import styles from '../Styles/style.module.css';
import Modal from 'react-modal';
import Email from './Email';
import toast, { Toaster } from "react-hot-toast";
import Code from './Code';

export default function Forget() {
  const [visibleemail, setVisibleemail] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const emailStyles = {
    content: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '10px',
      borderRadius: '10px',
      height: '500px',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.error("يرجى إدخال البريد الإلكتروني");
      return;
    }

    setVisibleemail(true);

    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:3100/forgetemail", { email });

      if (response.status === 200) {
        toast.success("تم إرسال البريد الإلكتروني بنجاح");
      }
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div>
        <div className={styles.logcontainer}>
          <form className={styles.forgetform}>
            <h1 className={styles.firsttitle}>اعاده كلمه المرور</h1>
            <br />
            <p className={styles.subtitlee}>ارسال الي البريد الالكتروني الخاص بك</p>
            <hr className={styles.hr} />
            <div className={styles.holder}>
              <div className={styles.reginput}>
                <label htmlFor="email" className={styles.reglabel}>
                  <i className="fa-solid fa-envelope" style={{ paddingLeft: '15px' }}></i>
                  البريد الالكتروني
                </label>
                <br />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="البريد الالكتروني"
                  className={styles.loginput}
                />
              </div>
              <button
                type="submit"
                className={styles.logButton}
                onClick={handleSubmit}
              >
                {isLoading ? 'جاري ارسال...' : 'ارسال'}
              </button>
              <Modal
                isOpen={visibleemail}
                onRequestClose={() => setVisibleemail(false)}
                style={emailStyles}
              >
                <button
                  onClick={() => setVisibleemail(false)}
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
                <Email email={email} /> {/* Pass the email prop here */}
              </Modal>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}