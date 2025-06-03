// Login.jsx
import React, { useState, useEffect } from 'react';
import styles from '../Styles/style.module.css';
import { Link, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import Forget from '../Authentication/Forget';
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import api from '../API/axiosInstance';
import { useSignalR } from '../contexts/SignalRContext'; // Adjust path to SignalRContext.js

export default function Login({ onLoginSuccess, setVisibleLogin, setVisibleRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [visibleForget, setVisibleForget] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { startConnection } = useSignalR(); // Get startConnection from context

    // ... (forgetStyles, useEffect for rememberMe, validate function are the same)
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
                secure: process.env.NODE_ENV === 'production', // More secure for production
                sameSite: 'Strict',
                expires: rememberMe ? 7 : 1
            };

            Cookies.set("access_token", token, cookieOptions);
            localStorage.setItem("user_data", JSON.stringify(response.data));
            localStorage.setItem("name", email);

            if (rememberMe) {
                Cookies.set("email", email, cookieOptions);
                Cookies.set("rememberMe", "true", cookieOptions);
            } else {
                Cookies.remove("email");
                Cookies.remove("rememberMe");
            }

            // START SIGNALR CONNECTION
            if (token) {
                console.log("Login successful, attempting to start SignalR connection with token...");
                await startConnection(token); // Pass the token
            } else {
                console.error("Login successful, but no token found to start SignalR.");
            }

            toast.success("تم تسجيل الدخول بنجاح!", { duration: 1000 });

            // Call onLoginSuccess which might update App's state
            if (onLoginSuccess) onLoginSuccess();


            // Delay navigation slightly to allow toast and potential state updates
            setTimeout(() => {
                if (role === "Farmer") {
                    navigate("/HomeFarmer");
                } else if (role === "Investor") {
                    navigate("/InvestorHome");
                } else if (role === "Merchant") {
                    navigate("/MerchentHome");
                } else {
                    navigate("/"); // Fallback, or a dashboard
                }
                // setVisibleLogin is likely for a modal, ensure it's handled if this isn't a page
                if (setVisibleLogin) setVisibleLogin(false);

                // Consider removing window.location.reload() if state management handles updates correctly
                // If Navbar and other components correctly re-render based on login state, reload is often not needed.
                // window.location.reload();
            }, 1500); // Increased delay slightly

        } catch (error) {
            console.error("Login error:", error);
            if (error.response) {
                if (error.response.status === 401) {
                    toast.error("البريد الإلكتروني أو كلمة المرور غير صحيحة", { duration: 3000 });
                } else {
                    toast.error(`حدث خطأ في الخادم: ${error.response.data?.message || error.response.statusText || 'Unknown server error'}`, { duration: 3000 });
                }
            } else if (error.message === "لم يتم استلام بيانات الدخول بشكل صحيح") {
                 toast.error(error.message, { duration: 3000 });
            }
            else {
                toast.error("فشل الاتصال بالخادم أو خطأ في إعداد الطلب", { duration: 3000 });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateAccountClick = (e) => {
        e.preventDefault();
        if (setVisibleLogin && setVisibleRegister) {
            setVisibleLogin(false);
            setVisibleRegister(true);
        } else {
            navigate('/register'); // Fallback if modal props not passed
        }
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
                                autoComplete="email"
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
                                autoComplete="current-password"
                            />
                        </div>

                        <div className="loginput" style={{ marginRight: "50px", display: 'flex', alignItems: 'center' }}>
                            <input
                                type="checkbox"
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={() => setRememberMe(prev => !prev)}
                                disabled={isLoading}
                                style={{ marginLeft: '5px' }}
                            />
                            <label htmlFor="rememberMe" style={{ marginRight: "10px", cursor: 'pointer' }}>تذكرني</label>
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
                                style={{ // Basic styling for close button
                                    background: 'transparent',
                                    border: 'none',
                                    fontSize: '24px',
                                    color: '#333',
                                    cursor: 'pointer',
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px'
                                }}
                                disabled={isLoading} // Disable if main form is loading
                            >
                                <i className="fa-solid fa-xmark"></i>
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