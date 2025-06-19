import React, { useState } from "react";
import styles from "../Styles/style.module.css";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";
import api from "../API/axiosInstance";

const CreateAccountForm = ({ onRegistrationSuccess, setVisibleRegister, setVisibleLogin }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [repPassword, setRepPassword] = useState("");
    const [category, setCategory] = useState("farmer");
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");

    const handleCategoryChange = (newCategory) => setCategory(newCategory);

    const showError = (message) => {
        toast.dismiss();
        toast.error(message, {
            duration: 5000,
            position: "top-center",
            style: {
                background: "#fff0f0",
                color: "#b00020",
                fontWeight: "bold",
                fontSize: "14px",
            },
        });
    };

    const validateForm = () => {
        if (!name.trim() || name.split(" ").length < 2) {
            showError("يرجى إدخال الاسم بالكامل (اسم أول واسم عائلة).");
            return false;
        }
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
            showError("يرجى إدخال بريد إلكتروني صحيح.");
            return false;
        }
        if (!phone.trim() || !/^\d{11}$/.test(phone)) {
            showError("يرجى إدخال رقم هاتف مكون من 11 رقمًا.");
            return false;
        }
        if (!password.trim() || password.length < 8) {
            showError("يجب أن تكون كلمة المرور مكونة من 8 أحرف على الأقل.");
            return false;
        }
        if (password !== repPassword) {
            showError("كلمتا المرور غير متطابقتين.");
            return false;
        }
        if (!category) {
            showError("يرجى اختيار فئة واحدة.");
            return false;
        }
        if (!username.trim()) {
            showError("يرجى إدخال اسم المستخدم.");
            return false;
        }
        if (!bio.trim()) {
            showError("يرجى كتابة السيرة الذاتية.");
            return false;
        }
        return true;
    };

    const handleRegister = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const regObj = { name, email, phone, password, category, username, bio };

        api
            .post("/Authentication/register", regObj, {
                headers: { "Content-Type": "application/json" },
            })
            .then((response) => {
                if (response.status === 201) {
                    toast.success("تم إنشاء الحساب بنجاح!", {
                        duration: 4000,
                        position: "top-center",
                        style: {
                            background: "#e0ffe0",
                            color: "#0f5132",
                            fontWeight: "bold",
                        },
                    });

                    const user = response.data;
                    Cookies.set("user", JSON.stringify(user), { expires: 1 });

                    setTimeout(() => {
                        setVisibleRegister(false);
                        setVisibleLogin(true);
                    }, 2000);

                    onRegistrationSuccess();
                }
            })
            .catch((err) => {
                console.error("Error during registration:", err);
                showError("فشل التسجيل. حاول مرة أخرى.");
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
                            className={`${styles.regcategoryButton} ${category === "farmer" ? styles.active : ""}`}
                            onClick={() => handleCategoryChange("farmer")}
                        >
                            مزارع
                        </button>
                        <button
                            type="button"
                            className={`${styles.regcategoryButton} ${category === "merchant" ? styles.active : ""}`}
                            onClick={() => handleCategoryChange("merchant")}
                        >
                            تاجر
                        </button>
                        <button
                            type="button"
                            className={`${styles.regcategoryButton} ${category === "investor" ? styles.active : ""}`}
                            onClick={() => handleCategoryChange("investor")}
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
