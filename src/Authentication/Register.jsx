import React, { useState } from "react";
import styles from "../Styles/style.module.css";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import api from "../API/axiosInstance";

const CreateAccountForm = ({ onRegistrationSuccess, setVisibleRegister, setVisibleLogin }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [repPassword, setRepPassword] = useState("");
    const [category, setCategory] = useState("Farmer"); // Default to uppercase 'Farmer'
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

    const handleRegister = (e) => {
        e.preventDefault();

       
        if (password !== repPassword) {
            showError("كلمتا المرور غير متطابقتين.");
            return; 
        }
    


        const formData = new FormData();
        formData.append("Name", name);
        formData.append("Email", email);
        formData.append("PhoneNumber", phone);
        formData.append("Password", password);
        formData.append("Role", category);
        formData.append("UserName", username);
        formData.append("Bio", bio);

        api.post("/Authentication/register", formData)
            .then((response) => {
                // A status of 200 or 201 can indicate success.
                if (response.status === 201 || response.status === 200) {
                    toast.success("تم إنشاء الحساب بنجاح! سيتم تحويلك لتسجيل الدخول.", {
                        duration: 4000,
                        position: "top-center",
                        style: {
                            background: "#e0ffe0",
                            color: "#0f5132",
                            fontWeight: "bold",
                        },
                    });

                    setTimeout(() => {
                        setVisibleRegister(false);
                        setVisibleLogin(true);
                    }, 2000);

                    if (onRegistrationSuccess) {
                        onRegistrationSuccess();
                    }
                }
            })
            .catch((err) => {
                console.error("Error during registration:", err.response);

                if (err.response && err.response.data) {
                    const responseData = err.response.data;

                    if (typeof responseData === 'object' && responseData.errors) {
                        const errors = responseData.errors;
                        const firstErrorKey = Object.keys(errors)[0];
                        const errorMessage = errors[firstErrorKey][0];
                        showError(errorMessage);
                    } 
                    else if (typeof responseData === 'string') {
                        showError(responseData);
                    } 
                    else if (typeof responseData === 'object' && responseData.title) {
                        showError(responseData.title);
                    } 
                    else {
                        showError("فشل التسجيل. حدث خطأ غير متوقع.");
                    }
                } else {
                    showError("فشل التسجيل. خطأ في الشبكة.");
                }
            });
    };


    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />

            <div className={styles.regcontainer}>
                <h1 className={styles.firsttitle}>حساب جديد</h1>
                <p className={styles.subtitlee}>أهلا بك في جذور</p>
                <form className={styles.regform} onSubmit={handleRegister}>
                    {/* All input fields remain the same */}
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
                        {/* FIX: Use uppercase to match state and styling logic */}
                        <button
                            type="button"
                            className={`${styles.regcategoryButton} ${category === "Farmer" ? styles.active : ""}`}
                            onClick={() => handleCategoryChange("Farmer")}
                        >
                            مزارع
                        </button>
                        <button
                            type="button"
                            className={`${styles.regcategoryButton} ${category === "Merchant" ? styles.active : ""}`}
                            onClick={() => handleCategoryChange("Merchant")}
                        >
                            تاجر
                        </button>
                        <button
                            type="button"
                            className={`${styles.regcategoryButton} ${category === "Investor" ? styles.active : ""}`}
                            onClick={() => handleCategoryChange("Investor")}
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
                    >
                        إنشاء
                    </button>
                </form>
            </div>
        </>
    );
};

export default CreateAccountForm;