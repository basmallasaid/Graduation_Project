import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import api from '../API/axiosInstance';
import { useSignalR } from '../contexts/SignalRContext'; // Adjust path if necessary
import Forget from '../Authentication/Forget';
import styles from '../Styles/style.module.css';

export default function Login({ onLoginSuccess, setVisibleLogin, setVisibleRegister }) {
    // --- STATE MANAGEMENT ---
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [visibleForget, setVisibleForget] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // --- HOOKS ---
    const navigate = useNavigate();
    const { startConnection } = useSignalR(); // Get startConnection function from SignalR context

    // Modal styles for the "Forget Password" popup
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

    // --- EFFECTS ---
    // On component mount, check if "Remember Me" was previously selected
    useEffect(() => {
        const isRemembered = Cookies.get("rememberMe") === "true";
        if (isRemembered) {
            const savedEmail = Cookies.get("email");
            if (savedEmail) {
                setEmail(savedEmail);
            }
            setRememberMe(true);
        }
    }, []); // Empty dependency array ensures this runs only once on mount

    // --- FORM VALIDATION ---
    const validate = () => {
        if (!email.trim() || !password.trim()) {
            toast.error("الرجاء إدخال البريد الإلكتروني وكلمة المرور", { duration: 3000 });
            return false;
        }
        // Optional: Add more specific validation like email format
        // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // if (!emailRegex.test(email)) {
        //     toast.error("الرجاء إدخال بريد إلكتروني صالح", { duration: 3000 });
        //     return false;
        // }
        return true;
    };

    // --- CORE LOGIN LOGIC ---
    const proceedLogin = async (e) => {
        e.preventDefault(); // Prevent default form submission
        if (!validate()) return; // Stop if validation fails

        setIsLoading(true);

        try {
            const response = await api.post("/Authentication/login", {
                email,
                password
            });

            const { token, role } = response.data;

            if (!token || !role) {
                // This is a safeguard in case the API response is malformed
                throw new Error("لم يتم استلام بيانات الدخول بشكل صحيح");
            }

            // Configure cookie options for security and persistence
            const cookieOptions = {
                secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                sameSite: 'Strict',
                // Set expiry based on "Remember Me" checkbox
                expires: rememberMe ? 7 : undefined // 7 days if checked, otherwise it's a session cookie
            };

            // Set the main authentication token
            Cookies.set("access_token", token, cookieOptions);

            // Store user data in localStorage for easy access across the app
            localStorage.setItem("user_data", JSON.stringify(response.data));
            localStorage.setItem("name", email); // Keep this if other parts of your app use it

            // Handle "Remember Me" persistence
            if (rememberMe) {
                Cookies.set("email", email, cookieOptions);
                Cookies.set("rememberMe", "true", cookieOptions);
            } else {
                // If not checked, ensure old cookies are removed
                Cookies.remove("email");
                Cookies.remove("rememberMe");
            }

            // Start SignalR connection immediately after getting the token
            if (token) {
                console.log("Login successful, attempting to start SignalR connection...");
                await startConnection(token);
            } else {
                console.error("Login successful, but no token found to start SignalR.");
            }

            toast.success("تم تسجيل الدخول بنجاح!", { duration: 1500 });

            // If a success callback was passed, call it (e.g., for analytics)
            if (onLoginSuccess) onLoginSuccess();

            // Redirect user to their specific dashboard after a short delay
            setTimeout(() => {
                if (role === "Farmer") {
                    navigate("/HomeFarmer");
                } else if (role === "Investor") {
                    navigate("/InvestorHome");
                } else if (role === "Merchant") {
                    navigate("/MerchentHome");
                } else {
                    // Fallback to home page if role is unknown
                    navigate("/");
                }
                // Close the login modal if it's being used
                if (setVisibleLogin) setVisibleLogin(false);
            }, 1500);

        } catch (error) {
            console.error("Login error:", error);
            // Enhanced error handling for user feedback
            if (error.response && error.response.data) {
                const errorMessage = typeof error.response.data === 'string'
                    ? error.response.data
                    : error.response.data.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة";
                toast.error(errorMessage, { duration: 4000 });
            } else if (error.request) {
                toast.error("فشل الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.", { duration: 3000 });
            } else {
                toast.error(error.message || "حدث خطأ غير متوقع", { duration: 3000 });
            }
        } finally {
            setIsLoading(false); // Ensure loading state is reset
        }
    };

    // --- NAVIGATION HANDLERS ---
    const handleCreateAccountClick = (e) => {
        e.preventDefault();
        // This logic allows the component to work both as a modal and a standalone page
        if (setVisibleLogin && setVisibleRegister) {
            setVisibleLogin(false);
            setVisibleRegister(true);
        } else {
            navigate('/register');
        }
    };

    // This callback function is passed to the <Forget /> component.
    // It defines what should happen after the entire password reset flow is completed.
    const handlePasswordResetSuccess = () => {
        setVisibleForget(false); // Close the 'Forget Password' modal
        if (setVisibleLogin) {
            setVisibleLogin(false); // Also close the main 'Login' modal
        }
        navigate('/'); // Navigate to the home page
        toast.success("تم تحديث كلمة المرور. يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.");
    };

    // --- JSX RENDER ---
    return (
        <div>
            <Toaster position="top-center" reverseOrder={false} />
            <div className={styles.logcontainer}>
                <form className={styles.logform} onSubmit={proceedLogin}>
                    <h1 className={styles.firsttitle}>تسجيل الدخول</h1>
                    <p className={styles.subtitlee}>أهلاً بك في جذور</p>
                    <hr className={styles.hr} />
                    <div className={styles.holder}>
                        <div className={styles.reginput}>
                            <label htmlFor="email" className={styles.reglabel}>
                                <i className="fa-solid fa-envelope" style={{ paddingLeft: "15px" }}></i>البريد الإلكتروني
                            </label>
                            <input
                                id="email"
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
                                id="password"
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
                                onChange={(e) => setRememberMe(e.target.checked)}
                                disabled={isLoading}
                                style={{ marginLeft: '5px', cursor: 'pointer' }}
                            />
                            <label htmlFor="rememberMe" style={{ marginRight: "10px", cursor: 'pointer' }}>تذكرني</label>
                        </div>

                        <button type="submit" className={styles.logButton} disabled={isLoading}>
                            {isLoading ? 'جاري التحميل...' : 'دخول'}
                        </button>
                    </div>

                    <div className={styles.forget}>
                        <div style={{ display: "flex", gap: "5px" }}>
                            <p>ليس لديك حساب؟</p>
                            <Link
                                to="#"
                                className={styles.linkforget}
                                onClick={handleCreateAccountClick}
                                style={isLoading ? { pointerEvents: 'none', opacity: 0.7 } : {}}
                            >
                                إنشاء حساب
                            </Link>
                        </div>
                        <Link
                            to="#"
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
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    fontSize: '24px',
                                    color: '#333',
                                    cursor: 'pointer',
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px'
                                }}
                                disabled={isLoading}
                                aria-label="Close"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                            <Forget onFlowComplete={handlePasswordResetSuccess} />
                        </Modal>
                    </div>
                </form>
                <img
                    className={styles.logimg}
                    src="/assets/Rectangle (2).png"
                    alt="Decorative login visual"
                />
            </div>
        </div>
    );
}