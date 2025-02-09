import React, { useState, useEffect } from 'react';
import styles from '../Styles/style.module.css';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import Forget from '../Authentication/Forget';
import toast, { Toaster } from "react-hot-toast";
import axios from 'axios';
import Cookies from "js-cookie";
import Register from './Register';

export default function Login({ onLoginSuccess, setVisibleLogin, setVisibleRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [visibleForget, setVisibleForget] = useState(false);

    const [users, setUsers] = useState([]);

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
        // Fetch users on component mount
        fetchUsers();
    }, []);

    const validate = () => {
        if (email === "" || password === "") {
            toast.error("برجاء ادخال البريد الالكتروني او كلمه المرور", { duration: 3000 });
            return false;
        }
        return true;
    };

    // Fetch all users
    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:3100/users");
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to load user data.", { duration: 3000 });
        }
    };

    const proceedLogin = async (e) => {
        e.preventDefault();

        if (validate()) {
            const user = users.find(u => u.email === email);

            if (!user) {
                toast.error("لا يوجد هذا البريد الالكتروني", { duration: 3000 });
                return;
            }

            if (user.password !== password) {
                toast.error("خطأ في كلمة المرور", { duration: 3000 });
                return;
            }

            Cookies.set("user", JSON.stringify(user), { expires: 1 });

            if (rememberMe) {
                Cookies.set("email", email, { expires: 7 });
                Cookies.set("rememberMe", "true", { expires: 7 });
            } else {
                Cookies.remove("email");
                Cookies.remove("rememberMe");
            }

            toast.success("تم تسجيل الدخول بنجاح !", { duration: 4000 });
             // Delay navigation and modal close after toast
            setTimeout(() => {
                onLoginSuccess(); // Navigate home
                setVisibleLogin(false) // Close the modal
             }, 2000);

        }
    };
    const handleCreateAccountClick = (e) => {
        e.preventDefault();
        setVisibleLogin(false);  // Close the Login modal
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
                                <i className="fa-solid fa-envelope" style={{ paddingLeft: "15px" }}></i>البريد الالكتروني
                            </label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                name="email"
                                placeholder="البريد الالكتروني"
                                className={styles.loginput}
                            />
                        </div>

                        <div className={styles.reginput}>
                            <label htmlFor="password" className={styles.reglabel}>
                                <i className="fa-solid fa-lock" style={{ paddingLeft: "15px" }}></i>كلمه المرور
                            </label>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                name="password"
                                placeholder="كلمه المرور"
                                className={styles.loginput}
                            />
                        </div>

                        <div className="loginput" style={{ marginRight: "50px" }}>
                            <input
                                type="checkbox"
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={() => setRememberMe(prevState => !prevState)} // Use functional update
                            />
                            <label htmlFor="rememberMe" style={{ marginRight: "10px" }}>تذكرني</label>
                        </div>

                        <button type="submit" className={styles.logButton}>
                            دخول
                        </button>
                    </div>

                    <div className={styles.forget}>
                      <div style={{display:"flex",gap:"5px"}}>
                        <p>ليس لديك حساب؟ </p>
                        <Link className={styles.linkforget} onClick={handleCreateAccountClick}>انشاء حساب</Link>
                        </div>
                        <Link className={styles.linkforget} onClick={() => setVisibleForget(true)}>هل نسيت كلمه المرور؟</Link>

                        <Modal isOpen={visibleForget} onRequestClose={() => setVisibleForget(false)} style={forgetStyles}>
                            <button onClick={() => setVisibleForget(false)}>
                                <i className="fa-solid fa-xmark" style={{ backgroundColor: 'transparent', border: 'none', fontSize: '24px', color: '#333', cursor: 'pointer', position: 'absolute', top: '10px', right: '10px' }}></i>
                            </button>
                            <Forget />
                        </Modal>
                    </div>
                </form>
                <img className={styles.logimg} src="/assets/Rectangle (2).png" alt="Login" />
            </div>
        </div>
    );
}