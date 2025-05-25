import React, { useState } from 'react';
import styles from '../../Styles/style.module.css';
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

export default function ForgetPassword({ email, code ,token}) {  // Destructure token and onLoginSuccess from props
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate(); 


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("كلمة المرور يجب أن تكون أطول من 8 أحرف.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("كلمتا المرور غير متطابقتين.");
      return;
    }

    try {
      console.log("Token sent:", token);  // CHECK THIS!

      const response = await axios.post(
        "https://cityroots.runasp.net/api/Authentication/reset-password",
        {
          email: email,  // Use email directly
          resetCode: code,  // Use code directly
          newPassword: password // Changed to newPassword to match API
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, //  **USE THE TOKEN HERE!**
          },
        }
      );

      if (response.status === 200) {
        toast.success("تم تحديث كلمة المرور بنجاح!");
        setTimeout(() => {
          navigate("/HomeFarmer"); // Navigate after success
        }, 2000);
      } else {
        throw new Error("Unexpected response status: " + response.status);
      }
    } catch (err) {
      console.error("Error details:", err.response?.data || err.message);
      toast.error(
        `خطأ: ${err.response?.data?.message || "حدث خطأ أثناء الاتصال بالخادم."}`
      );
    }
  };


  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />

      <div className={styles.logcontainer}>
        <form className={styles.forgetform} onSubmit={handleSubmit}>
          <h1 className={styles.firsttitle}>إنشاء كلمة مرور جديدة</h1>
          <hr className={styles.hr} />
          <div className={styles.holder}>
            <div className={styles.reginput}>
              <label htmlFor="password" className={styles.reglabel}>
                <i className="fa-solid fa-lock" style={{ paddingLeft: "15px" }}></i>
                كلمة المرور
              </label>
              <br />
              <input
                type="password"
                name="password"
                placeholder="كلمة المرور"
                className={styles.loginput}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className={styles.reginput}>
              <label htmlFor="confirmPassword" className={styles.reglabel}>
                <i className="fa-solid fa-lock" style={{ paddingLeft: "15px" }}></i>
                إعادة كلمة المرور
              </label>
              <br />
              <input
                type="password"
                name="confirmPassword"
                placeholder="إعادة كلمة المرور"
                className={styles.loginput}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className={styles.logButton}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSubmit(e);
              }}
            >
              إرسال
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}