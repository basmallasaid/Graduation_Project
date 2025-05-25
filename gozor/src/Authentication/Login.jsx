import React, { useState, useEffect } from 'react';
import styles from '../Styles/style.module.css';
import { Link, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import Forget from '../Authentication/Forget';
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import api from '../API/axiosInstance';

export default function Login({ onLoginSuccess, setVisibleLogin, setVisibleRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [visibleForget, setVisibleForget] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const forgetStyles = {
        content: {
            maxWidth: '600px',
            margin: '0 auto',
            padding: '10px',
            borderRadius: '10px',
            height: '460px'
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
    };

    useEffect(() => {
        const remember = Cookies.get("rememberMe") === "true";
        if (remember) {
            const savedEmail = Cookies.get("email");
            if (savedEmail) setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    const validate = () => {
        if (!email || !password) {
            toast.error("الرجاء إدخال البريد الإلكتروني وكلمة المرور", { duration: 3000 });
            return false;
        }
        return true;
    };

    const proceedLogin = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);

        try {
            const response = await api.post("/Authentication/login", {
                email,
                password
            });

            const { token, role } = response.data;

            if (!token || !role) {
                throw new Error("لم يتم استلام بيانات الدخول بشكل صحيح");
            }

            const cookieOptions = {
                secure: true,
                sameSite: 'Strict',
                expires: rememberMe ? 7 : 1
            };

            Cookies.set("access_token", token, cookieOptions);
            localStorage.setItem("user_data", JSON.stringify(response.data));
            localStorage.setItem("name", email); // ✅ لحفظ الإيميل في localStorage

            if (rememberMe) {
                Cookies.set("email", email, cookieOptions);
                Cookies.set("rememberMe", "true", cookieOptions);
            } else {
                Cookies.remove("email");
                Cookies.remove("rememberMe");
            }

            toast.success("تم تسجيل الدخول بنجاح!", { duration: 1000 });

            setTimeout(() => {
                if (role === "Farmer") {
                    navigate("/HomeFarmer");
                } else if (role === "Investor") {
                    navigate("/InvestorHome");
                } else if (role === "Merchant") {
                    navigate("/MerchentHome");
                } else {
                    navigate("/");
                }

                onLoginSuccess();
                setVisibleLogin(false);
                window.location.reload(); // ✅ لإعادة تحميل Navbar وقراءة الاسم
            }, 2000);

        } catch (error) {
            console.error("Login error:", error);
            if (error.response) {
                if (error.response.status === 401) {
                    toast.error("البريد الإلكتروني أو كلمة المرور غير صحيحة", { duration: 3000 });
                } else {
                    toast.error("حدث خطأ في الخادم", { duration: 3000 });
                }
            } else {
                toast.error("فشل الاتصال بالخادم", { duration: 3000 });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateAccountClick = (e) => {
        e.preventDefault();
        setVisibleLogin(false);
        setVisibleRegister(true);
    };

    return (
        <div>
            <Toaster position="top-center" reverseOrder={false} />
            <div className={styles.logcontainer}>
                <form className={styles.logform} onSubmit={proceedLogin}>
                    <h1 className={styles.firsttitle}>تسجيل الدخول</h1>
                    <p className={styles.subtitlee}>أهلا بك في جذور</p>
                    <hr className={styles.hr} />
                    <div className={styles.holder}>
                        <div className={styles.reginput}>
                            <label htmlFor="email" className={styles.reglabel}>
                                <i className="fa-solid fa-envelope" style={{ paddingLeft: "15px" }}></i>البريد الإلكتروني
                            </label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                name="email"
                                placeholder="البريد الإلكتروني"
                                className={styles.loginput}
                                disabled={isLoading}
                            />
                        </div>

                        <div className={styles.reginput}>
                            <label htmlFor="password" className={styles.reglabel}>
                                <i className="fa-solid fa-lock" style={{ paddingLeft: "15px" }}></i>كلمة المرور
                            </label>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                name="password"
                                placeholder="كلمة المرور"
                                className={styles.loginput}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="loginput" style={{ marginRight: "50px" }}>
                            <input
                                type="checkbox"
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={() => setRememberMe(prev => !prev)}
                                disabled={isLoading}
                            />
                            <label htmlFor="rememberMe" style={{ marginRight: "10px" }}>تذكرني</label>
                        </div>

                        <button 
                            type="submit" 
                            className={styles.logButton}
                            disabled={isLoading}
                        >
                            {isLoading ? 'جاري التحميل...' : 'دخول'}
                        </button>
                    </div>

                    <div className={styles.forget}>
                        <div style={{ display: "flex", gap: "5px" }}>
                            <p>ليس لديك حساب؟ </p>
                            <Link 
                                className={styles.linkforget} 
                                onClick={handleCreateAccountClick}
                                style={isLoading ? { pointerEvents: 'none', opacity: 0.7 } : {}}
                            >
                                إنشاء حساب
                            </Link>
                        </div>
                        <Link 
                            className={styles.linkforget} 
                            onClick={() => !isLoading && setVisibleForget(true)}
                            style={isLoading ? { pointerEvents: 'none', opacity: 0.7 } : {}}
                        >
                            هل نسيت كلمة المرور؟
                        </Link>

                        <Modal 
                            isOpen={visibleForget} 
                            onRequestClose={() => setVisibleForget(false)} 
                            style={forgetStyles}
                            ariaHideApp={false}
                        >
                            <button 
                                onClick={() => setVisibleForget(false)}
                                disabled={isLoading}
                            >
                                <i className="fa-solid fa-xmark" style={{
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    fontSize: '24px',
                                    color: '#333',
                                    cursor: 'pointer',
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px'
                                }}></i>
                            </button>
                            <Forget />
                        </Modal>
                    </div>
                </form>
                <img 
                    className={styles.logimg} 
                    src="/assets/Rectangle (2).png" 
                    alt="Login" 
                />
            </div>
        </div>
    );
}
