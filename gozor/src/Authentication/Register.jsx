import React, { useState } from "react";
import styles from "../Styles/style.module.css";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";

const CreateAccountForm = ({ onRegistrationSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [repPassword, setRepPassword] = useState("");
  const [category, setCategory] = useState("مزارع");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  const handleCategoryChange = (newCategory) => setCategory(newCategory);

  const validateForm = () => {
    if (!name.trim() || name.split(" ").length < 2) {
      toast.error("يرجى إدخال الاسم بالكامل (اسم أول واسم عائلة).");
      return false;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("يرجى إدخال بريد إلكتروني صحيح.");
      return false;
    }
    if (!phone.trim() || !/^\d{11}$/.test(phone)) {
      toast.error("يرجى إدخال رقم هاتف مكون من 11 رقمًا.");
      return false;
    }
    if (!password.trim() || password.length < 8) {
      toast.error("يجب أن تكون كلمة المرور مكونة من 8 أحرف على الأقل.");
      return false;
    }
    if (password !== repPassword) {
      toast.error("كلمتا المرور غير متطابقتين.");
      return false;
    }
    if (!category) {
      toast.error("يرجى اختيار فئة واحدة.");
      return false;
    }
    if (!username.trim()) {
      toast.error("يرجى إدخال اسم المستخدم.");
      return false;
    }
    if (!bio.trim()) {
      toast.error("يرجى كتابة السيرة الذاتية.");
      return false;
    }
    return true;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const regObj = { name, email, phone, password, category, username, bio };

    // Use Axios for making POST request
    axios
      .post("http://localhost:8000/users", regObj, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        if (response.status === 201) {
          toast.success("تم التسجيل بنجاح!", { duration: 4000 });

          // Save user data in cookies if needed
          const user = response.data;
          Cookies.set("user", JSON.stringify(user), { expires: 1 }); // Store user data in cookies for 1 day

          setTimeout(() => {
            onRegistrationSuccess();
          }, 2000);
        }
      })
      .catch((err) => {
        console.error("Error during registration:", err);
        toast.error("فشل التسجيل. حاول مرة أخرى.");
      });
  };
  return (
    <>
          <Toaster position="top-center" reverseOrder={false} />

    <div className={styles.regcontainer}>
      <h1 className={styles.firsttitle}>حساب جديد</h1>
      <p className={styles.subtitlee}>أهلا بك في جذور</p>
      <form className={styles.regform}>
        <div className={styles.reginput}>
          <label className={styles.reglabel}>
            <i className="fa-solid fa-user" style={{ paddingLeft: "15px" }}></i>
            الاسم
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="الاسم بالكامل"
            className={styles.input}
          />
        </div>
        <div className={styles.reginput}>
          <label className={styles.reglabel}>
            <i className="fa-solid fa-envelope" style={{ paddingLeft: "15px" }}></i>
            البريد الالكتروني
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="البريد الالكتروني"
            className={styles.input}
          />
        </div>
        <div className={styles.reginput}>
          <label className={styles.reglabel}>
            <i className="fa-solid fa-phone" style={{ paddingLeft: "15px" }}></i>
            رقم الهاتف
          </label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="text"
            placeholder="رقم الهاتف"
            className={styles.input}
          />
        </div>
        <div className={styles.reginput}>
          <label className={styles.reglabel}>
            <i className="fa-solid fa-lock" style={{ paddingLeft: "15px" }}></i>
            كلمة المرور
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="كلمة المرور"
            className={styles.input}
          />
        </div>
        <div className={styles.reginput}>
          <label className={styles.reglabel}>
            <i className="fa-solid fa-lock" style={{ paddingLeft: "15px" }}></i>
            إعادة كلمة المرور
          </label>
          <input
            value={repPassword}
            onChange={(e) => setRepPassword(e.target.value)}
            type="password"
            placeholder="إعادة كلمة المرور"
            className={styles.input}
          />
        </div>
        <label className={styles.reglabel}>اختار الفئة</label>
        <div className={styles.regcategory}>
          <button
            type="button"
            className={`${styles.regcategoryButton} ${category === "مزارع" ? styles.active : ""}`}
            onClick={() => handleCategoryChange("مزارع")}
          >
            مزارع
          </button>
          <button
            type="button"
            className={`${styles.regcategoryButton} ${category === "تاجر" ? styles.active : ""}`}
            onClick={() => handleCategoryChange("تاجر")}
          >
            تاجر
          </button>
          <button
            type="button"
            className={`${styles.regcategoryButton} ${category === "مستثمر" ? styles.active : ""}`}
            onClick={() => handleCategoryChange("مستثمر")}
          >
            مستثمر
          </button>
        </div>
        <div className={styles.reginput}>
          <label className={styles.reglabel}>
            <i className="fa-solid fa-user" style={{ paddingLeft: "15px" }}></i>
            اسم المستخدم
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="اسم المستخدم"
            className={styles.input}
          />
        </div>
        <div className={styles.reginput}>
          <label className={styles.reglabel}>
            <i className="fa-solid fa-message" style={{ paddingLeft: "15px" }}></i>
            السيرة الذاتية
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="السيرة الذاتية"
            className={styles.regtextarea}
          ></textarea>
        </div>
        <button
          type="submit"
          className={styles.regButton}
          onClick={handleRegister}
        >
          إنشاء
        </button>
      </form>
    </div>
    </>
  );
};

export default CreateAccountForm;
