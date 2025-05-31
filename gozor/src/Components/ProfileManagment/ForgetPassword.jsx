import React, { useState } from 'react';
import styles from '../../Styles/style.module.css';
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import api from '../../API/axiosInstance';

// This component is for a logged-in user to change their current password.
// The name "ForgetPassword" is a misnomer for this functionality but kept as per original file name.
export default function ForgetPassword({ onSuccess }) { // onSuccess prop for better modal handling
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error("الرجاء إدخال كلمة المرور الحالية.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("كلمة المرور الجديدة يجب أن تتكون من 6 أحرف على الأقل.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("كلمتا المرور الجديدتان غير متطابقتين.");
      return;
    }
    if (currentPassword === newPassword) {
      toast.error("كلمة المرور الجديدة يجب أن تكون مختلفة عن كلمة المرور الحالية.");
      return;
    }

    // Retrieve token from localStorage
    let token = null;
    try {
      const userDataString = localStorage.getItem("user_data");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        token = userData?.token; // Access the token property
      }
    } catch (error) {
      console.error("Error parsing user_data from localStorage:", error);
      toast.error("خطأ في قراءة بيانات المستخدم. يرجى المحاولة مرة أخرى.");
      return;
    }

    if (!token) {
      toast.error("جلسة المستخدم غير صالحة أو منتهية. يرجى تسجيل الدخول مرة أخرى.");
      // Optionally, navigate to login or trigger re-authentication
      // navigate("/login");
      return;
    }

    try {
      const response = await api.post(
        "Authentication/change-password",
        {
          currentPassword: currentPassword,
          newPassword: newPassword
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // Use the retrieved token
          },
        }
      );

      if (response.status === 200 || response.status === 204) {
        toast.success(response.data?.message || "تم تغيير كلمة المرور بنجاح!");
        
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");

        if (onSuccess && typeof onSuccess === 'function') {
            onSuccess(); // Call the callback to notify parent (e.g., close modal)
        } else {
            setTimeout(() => {
              // Consider navigating to a profile page or staying on the current page
              // instead of always to HomeFarmer, especially if this is a modal.
              // For now, keeping original fallback.
              navigate("/HomeFarmer"); 
            }, 2000);
        }

      } else {
        throw new Error(`فشل تغيير كلمة المرور. الحالة: ${response.status}`);
      }
    } catch (err) {
      console.error("Error changing password:", err.response?.data || err.message);
      let errorMessage = "حدث خطأ أثناء تغيير كلمة المرور.";
      if (err.response?.data) {
        if (typeof err.response.data === 'string' && err.response.data.length < 200) {
            errorMessage = err.response.data;
        } else if (err.response.data.message) {
            errorMessage = err.response.data.message;
        } else if (err.response.data.title && typeof err.response.data.title === 'string') {
            errorMessage = err.response.data.title;
        } else if (err.response.data.errors) {
            const errorValues = Object.values(err.response.data.errors).flat();
            if (errorValues.length > 0) {
                errorMessage = errorValues.join("\n");
            }
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />

      <div className={styles.logcontainer}>
        <form className={styles.forgetform} onSubmit={handleSubmit}>
          <h1 className={styles.firsttitle}>تغيير كلمة المرور</h1>
          <hr className={styles.hr} />
          <div className={styles.holder}>
            <div className={styles.reginput}>
              <label htmlFor="currentPassword" className={styles.reglabel}>
                <i className="fa-solid fa-key" style={{ paddingLeft: "15px" }}></i>
                كلمة المرور الحالية
              </label>
              <br />
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                placeholder="كلمة المرور الحالية"
                className={styles.loginput}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <div className={styles.reginput}>
              <label htmlFor="newPassword" className={styles.reglabel}>
                <i className="fa-solid fa-lock" style={{ paddingLeft: "15px" }}></i>
                كلمة المرور الجديدة
              </label>
              <br />
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                placeholder="كلمة المرور الجديدة"
                className={styles.loginput}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            <div className={styles.reginput}>
              <label htmlFor="confirmNewPassword" className={styles.reglabel}>
                <i className="fa-solid fa-lock" style={{ paddingLeft: "15px" }}></i>
                تأكيد كلمة المرور الجديدة
              </label>
              <br />
              <input
                type="password"
                id="confirmNewPassword"
                name="confirmNewPassword"
                placeholder="تأكيد كلمة المرور الجديدة"
                className={styles.loginput}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
            <button
              type="submit"
              className={styles.logButton}
            >
              تغيير كلمة المرور
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}