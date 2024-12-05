import React, { useState } from 'react';
import axios from 'axios'; // Import axios
import styles from '../Styles/style.module.css';
import Modal from 'react-modal';
import Email from './Email';
import toast, { Toaster } from "react-hot-toast"; // Import toast for notifications
import Code from './Code';  // Import Code component

export default function Forget() {
  const [visibleemail, setVisibleemail] = useState(false); // Modal visibility state
  const [email, setEmail] = useState(''); // State to store email input
  const [isLoading, setIsLoading] = useState(false); // Loading state for async operations

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
      const response = await axios.post("http://localhost:8000/users", { email });

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
                  value={email} // Bind email state to the input
                  onChange={handleEmailChange} // Update state on input change
                  placeholder="البريد الالكتروني"
                  className={styles.loginput}
                />
              </div>
              <button
                type="submit"
                className={styles.logButton}
                onClick={handleSubmit} // Handle submit with Axios
              >
                {isLoading ? 'جاري ارسال...' : 'ارسال'} {/* Show loading text if request is in progress */}
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
                <Email />
              </Modal>
            </div>
          </form>
        </div>
      </div>

      {/* Pass the email as a prop to the Code component */}
      <Code email={email} />
    </>
  );
}
