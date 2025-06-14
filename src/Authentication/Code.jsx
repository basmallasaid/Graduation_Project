import React, { useState } from 'react';
import styles from '../Styles/style.module.css';
import Modal from 'react-modal';
import New from './Newpassword'; // Renamed New.jsx to PasswordPage.jsx for clarity
import toast, { Toaster } from "react-hot-toast";
import api from '../API/axiosInstance';

// Set the app element for react-modal for accessibility

export default function Code({ email,onFlowComplete }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // State to store the temporary token received from the server
  const [verifiedToken, setVerifiedToken] = useState(null);

  const newStyles = {
    content: {
      maxWidth: '500px',
      margin: '70px auto',
      padding: '20px', // Increased padding
      borderRadius: '10px',
      height: '500px', // Auto height
      border: 'none',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!code.trim() || code.length < 6) { // Common codes are 6 digits
        toast.error("يرجى إدخال الكود الصحيح.");
        return;
    }
    if (!email) {
      toast.error("حدث خطأ: البريد الإلكتروني غير متوفر!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("Authentication/check-reset-code", {
        email: email,
        resetCode: code
      });

      // **CRITICAL CHANGE**: Extract and save the token from the response
      if (response.data && response.data.token) {
        toast.success("تم التحقق من الرمز بنجاح.");
        setVerifiedToken(response.data.token); // Save the token
        setIsModalOpen(true); // Open the modal
      } else {
        // Handle cases where the server gives a 200 OK but no token
        toast.error('حدث خطأ غير متوقع أثناء التحقق.');
      }
    } catch (error) {
      console.error('Error verifying code:', error.response);
      toast.error(error.response?.data?.message || 'الكود الذي أدخلته غير صحيح أو انتهت صلاحيته.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <div>
        <div className={styles.logcontainer}>
          <form className={styles.forgetform} onSubmit={handleSubmit}>
            <h1 className={styles.firsttitle}>برجاء ادخال كود التحقق</h1>
            <hr className={styles.hr} />
            <div className={styles.holder}>
              <div className={styles.reginput}>
                <label htmlFor="code" className={styles.reglabel}>الكود</label>
                <br />
                <input
                  type="text"
                  id="code"
                  name="code"
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className={styles.loginput}
                />
              </div>
              <button type="submit" className={styles.logButton} disabled={isLoading}>
                {isLoading ? 'جاري التحقق...' : 'التحقق من الكود'}
              </button>
            </div>
          </form>
        </div>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          style={newStyles}
        >
          {/* Close button inside modal */}
          <button 
            onClick={() => setIsModalOpen(false)}
            style={{
                background: 'transparent', border: 'none', fontSize: '24px',
                color: '#333', cursor: 'pointer', position: 'absolute',
                top: '15px', right: '15px'
            }}
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
          
          {/* **CRITICAL CHANGE**: Pass the `token` to the next component, not the `resetCode` */}
          <New email={email} token={verifiedToken} resetCode={code} onSuccess={onFlowComplete}/>
        </Modal>
      </div>
    </>
  );
}