import React, { useState, useEffect } from "react";
import axios from "axios";
// import Navbar from "../Navbar";
import styles from "../../Styles/style.module.css";
import NavbarF from "./Main/NavbarF";
import FooterF from "./Main/FooterF";

const Shopping = () => {
    const [plants, setPlants] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get("http://localhost:3100/plant")
            .then((response) => {
                setPlants(response.data);
            })
            .catch((error) => {
                console.error("Error fetching plant data:", error);
                setError("حدث خطأ أثناء تحميل البيانات");
            });
    }, []);

    return (
        <>
            <NavbarF/>
            <div className={styles.soppingpage}>
                <div className="container">
                    <div className={styles.shopping_title}>
                        <img src="/assets/Heading.png" />
                    </div>
                    <h4 className={styles.prodect} >المنتجات الحالية</h4>
                    {error && <p className="text-danger">{error}</p>} {/* عرض رسالة الخطأ */}
                    <div className="container">
                        <div className="row" style={{ margin: "30px" }}>
                            {plants.map((item) => (
                                <div
                                    className="col-sm-12 col-md-4 col-lg-3 mb-4"
                                    key={item.id}

                                >
                                    <div
                                        className={`${styles.shoppingcard} card`}   >
                                        <img src={item.imageUrl} className={`${styles.imgcard_shopping} card-img-center`} alt={item.name} />
                                        <div
                                            className="card-body d-flex flex-column"
                                            style={{ flex: 1 }}
                                        >
                                            <h5 className={`${styles.titlecardshooping}card-title`}><b>{item.name}</b></h5>
                                            <h5 className={`${styles.price_cardshopping} card-text`}>السعر الحالي: {item.currentPrice} جنيه/كجم.</h5>
                                            <div className={styles.descshopping}><h5 className={` card-text`}><b> التوقع المستقبلي: {item.riskDescription}</b></h5>
                                                <span className={`${styles.exprice_cardshopping} card-text`}>
                                                    سيصل الي {item.expectedPriceChange} جنيه/كجم.
                                                    {item.currentPrice > item.expectedPriceChange ? (
                                                        <img src="/assets/ArrowDown.png" alt="Down Arrow" />
                                                    ) : item.currentPrice < item.expectedPriceChange ? (
                                                        <img src="/assets/ArrowUp.png" alt="Up Arrow" />
                                                    ) : null}
                                                </span>

                                            </div>
                                            <div className={styles.riskcard}>
                                                <h5><b>مستوي الخطورة: <span className={styles.graytxt}>{item.riskLevel}
                                                    {item.riskLevel=="منخفض"?(
                                                       <img src="/assets/Protect.png" alt="Protect"/>)
                                                       :item.riskLevel=="متوسط" ?
                                                       (<img src="/assets/Error.png" alt="error"/>)
                                                       : <img src="/assets/HighRisk.png" alt="HighRisk"/>
                                                    }
                                                    </span></b></h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <FooterF/>
        </>
    );
};

export default Shopping;
