import React, { useState } from 'react';
import styles from '../Styles/style.module.css';
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import api from '../API/axiosInstance';

export default function PasswordPage({ email, token, resetCode,onSuccess }) {
  const [newPassword, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (newPassword.length < 8) {
      toast.error("كلمة المرور يجب أن تكون 8 أحرف على الأقل.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("كلمتا المرور غير متطابقتين.");
      return;
    }
    if (!token) {
      toast.error("رمز المصادقة مفقود. يرجى المحاولة مرة أخرى.");
      return;
    }

    setIsLoading(true);

    try {
      // The API call to reset the password
      await api.post(
        "Authentication/reset-password", // <-- THE FIX
        { // The request body
          email,
          resetCode,
          newPassword
        },
        { // The request configuration
          headers: {
            // The token is correctly sent in the Authorization header
            "Authorization": `Bearer ${token}`
          }
        }
      );

      toast.success("تم تحديث كلمة المرور بنجاح!");
        setTimeout(() => {
        if (onSuccess) {
          onSuccess(); // This function will close all modals and navigate.
        }
      }, 1500);

    } catch (err) {
      console.error(err);
      // This error handling is good! It will show a server message if available.
      toast.error(err.response?.data?.message || "فشل تحديث كلمة المرور. قد يكون الرمز قد انتهت صلاحيته.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <form className={styles.forgetform} onSubmit={handleSubmit} style={{ boxShadow: 'none', border: 'none' }}>
        <h1 className={styles.firsttitle}>إنشاء كلمة مرور جديدة</h1>
        <hr className={styles.hr} />
        <div className={styles.holder}>
          <div className={styles.reginput}>
            <label htmlFor="password" className={styles.reglabel}>
              <i className="fa-solid fa-lock" style={{ paddingLeft: "15px" }}></i>
              كلمة المرور الجديدة
            </label>
            <br />
            <input
              type="password"
              id="password"
              name="password"
              placeholder="********"
              className={styles.loginput}
              value={newPassword}
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
              id="confirmPassword"
              name="confirmPassword"
              placeholder="********"
              className={styles.loginput}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button type="submit" className={styles.logButton} disabled={isLoading}>
            {isLoading ? 'جاري الحفظ...' : 'حفظ كلمة المرور'}
          </button>
        </div>
      </form>
    </div>
  );
}