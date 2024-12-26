import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from "../../Styles/style.module.css";
import FooterF from './FooterF';
import Navbar from '../Navbar';

const WeatherF = () => {
    const [weatherData, setWeatherData] = useState({ /*note*/
        weatherDetails: [],
        agriculturalRecommendations: [],
        plantHealthStatus: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3100/weather')
            .then((response) => {
                setWeatherData(response.data);
                setLoading(false);
            })
            .catch((err) => {
                setError('حدث خطأ أثناء تحميل بيانات الطقس.');
                setLoading(false);
                console.error(err);
            });
    }, []);

    if (loading) return <p>جاري تحميل البيانات...</p>;
    if (error) return <p>{error}</p>;

    return (
        <>
            <Navbar />
            <div className={styles.containerf}>
                <div className={styles.headerf}>
                    <div className={styles.cweather}>
                        <h2>حالة الطقس اليوم</h2>
                        <div className={styles.currentweather}>
                            {weatherData.weatherDetails.length > 0 ? (
                                weatherData.weatherDetails.map((detail, index) => (
                                    <div key={index}>
                                        {detail.description === "ممطر" ? (
                                            <div className={styles.rain}>
                                                <img src='/assets/rain.png' alt='cloud' />
                                                <span>{detail.description}</span>
                                            </div>
                                        ) : detail.description === "غيوم متفرقه" ? (
                                            <div className={styles.cloud}>
                                                <img src='/assets/cloud.png' alt='cloud' />
                                                <span>{detail.description}</span>
                                            </div>
                                        ) : (
                                            <div className={styles.sunny}>
                                                <img src='/assets/sunny.png' alt='cloud' />
                                                <span>{detail.description}</span>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p>لا توجد بيانات لعرضها</p>
                            )}
                        </div>
                    </div>

                    <h4>{new Date().toLocaleDateString('ar-EG', {
                        weekday: 'long',
                        month: "long",
                        day: "numeric",
                    })}</h4>
                </div>

                {weatherData.weatherDetails.length > 0 ? (
                    weatherData.weatherDetails.map((detail, index) => (
                        <div key={index} className={`row ${styles.weather}`}>
                            <div className={`col-4`}>
                                <span>
                                    <img src='/assets/Temperature.png' alt='Temperature' />
                                    درجة الحرارة
                                </span>
                                <div className={`${styles.Temperature}`}>
                                    <p>{detail.temperature}</p>
                                </div>
                            </div>
                            <div className={`col-4`}>
                                <span>
                                    <img src='/assets/Humidity.png' alt='Humidity' />
                                    الرطوبة
                                </span>
                                <div className={`${styles.Humidity}`}>
                                    <p>{detail.humidity}</p>
                                </div>
                            </div>
                            <div className={`col-4`}>
                                <span>
                                    <img src='/assets/Air.png' alt='Wind Speed' />
                                    سرعة الرياح
                                </span>
                                <div className={`${styles.Air}`}>
                                    <p>{detail.windSpeed}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>لا توجد بيانات لعرضها</p>
                )}

                {/* توصيات زراعية */}
                {weatherData.agriculturalRecommendations.length > 0 ? (
                    weatherData.agriculturalRecommendations.map((recommendation, index) => (
                        <div key={index} className={`${styles.infoweather} row`}>
                            <div className='col'>
                                <h4>{recommendation.activity}</h4>
                                <h4 className={styles.graytxt}>{recommendation.details}</h4>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>لا توجد توصيات زراعية في الوقت الحالي.</p>
                )}
            </div>
            <FooterF />
        </>
    );
};

export default WeatherF;