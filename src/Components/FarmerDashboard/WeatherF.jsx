import React, { useEffect, useState } from 'react';
import styles from "../../Styles/style.module.css";
import Swal from "sweetalert2";
import NavbarF from '../FarmerDashboard/Main/NavbarF';
import FooterF from './Main/FooterF';
import api from '../../API/axiosInstance';

const WeatherF = () => {
    const [weatherData, setWeatherData] = useState({
        weatherDetails: {},
        agriculturalRecommendations: [],
        plantHealthStatus: {}
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // تثبيت المدينة والدولة
    const [city, setCity] = useState('Cairo');
    const [country, setCountry] = useState('Egypt');

    // استعلام بيانات الطقس بناءً على المدينة والدولة
    useEffect(() => {
        if (city && country) {
            setLoading(true);
            api.get(`/Weather/${city}/${country}`)
                .then((response) => {
                    setWeatherData(response.data);
                    setLoading(false);
                })
                .catch((err) => {
                    setError('حدث خطأ أثناء تحميل بيانات الطقس.');
                    setLoading(false);
                    console.error(err);
                });
        }
    }, [city, country]);

    if (loading) return <p>جاري تحميل البيانات...</p>;
    if (error) return <p>{error}</p>;

    const getWeatherIcon = (description) => {
        switch (description) {
            case 'غائم جزئي':
                return (
                    <div className={styles.cloud}>
                        <img src='/assets/partlycloudy.png' alt='غائم جزئي' />
                        <span style={{ margin: "0px 4px" }}>{description}</span>
                    </div>
                );
            case 'غائم كليًا':
                return (
                    <div className={styles.cloud}>
                        <img src='/assets/cloudy.png' alt='غائم كلي' />
                        <span style={{ margin: "0px 4px" }}>{description}</span>
                    </div>
                );
            case 'مغبر':
                return (
                    <div className={styles.dust}>
                        <img src='/assets/dust.png' alt='مغبر' />
                        <span style={{ margin: "0px 4px" }}>{description}</span>
                    </div>
                );
            case 'ضباب':
                return (
                    <div className={styles.dust}>
                        <img src='/assets/fog.png' alt='ضباب' />
                        <span style={{ margin: "0px 4px" }}>{description}</span>
                    </div>
                );
            case 'عاصفة رعدية':
                return (
                    <div className={styles.dust}>
                        <img src='/assets/storm.png' alt='عاصفة رعدية' />
                        <span style={{ margin: "0px 4px" }}>{description}</span>
                    </div>
                );
            case 'مطر':
                return (
                    <div className={styles.rain}>
                        <img src='/assets/rain.png' alt='مطر' />
                        <span style={{ margin: "0px 4px" }}>{description}</span>
                    </div>
                );
            case 'رياح قوية':
                return (
                    <div className={styles.rain}>
                        <img src='/assets/windy.png' alt='رياح قوية' />
                        <span style={{ margin: "0px 4px" }}>{description}</span>
                    </div>
                );
            case 'ثلوج':
                return (
                    <div className={styles.rain}>
                        <img src='/assets/snow.png' alt='ثلوج' />
                        <span style={{ margin: "0px 4px" }}>{description}</span>
                    </div>
                );
            case 'مشمس':
                return (
                    <div className={styles.sunny}>
                        <img src='/assets/sunny.png' alt='مشمس' />
                        <span style={{ margin: "0px 4px" }}>{description}</span>
                    </div>
                );
            default:
                return (
                    <div className={styles.cloud}>
                        <img src='/assets/cloud.png' alt='حالة الطقس الافتراضية' />
                        <span style={{ margin: "0px 4px" }}>{description}</span>
                    </div>
                );
        }
    };

    return (
        <>
            <NavbarF />
            <div className={styles.containerf}>
                <div className={styles.headerf}>
                    <div className={styles.cweather}>
                        <h2 >حالة الطقس اليوم</h2>
                        <div className={styles.currentweather}>
                            {weatherData.weatherDetails.description ? (
                                getWeatherIcon(weatherData.weatherDetails.description)
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

                {/* بيانات الطقس */}
                {weatherData.weatherDetails.temperature && (
                    <div className={`row ${styles.weather}`}>
                        <div className={`col-12 col-lg-4 col-md-6`}>
                            <span >
                                <img src='/assets/Temperature.png' alt='درجة الحرارة' />
                                درجة الحرارة
                            </span>
                            <div className={`${styles.Temperature}`}>
                                <p>{weatherData.weatherDetails.temperature}</p>
                            </div>
                        </div>
                        <div className={`col-12 col-lg-4 col-md-6`}>
                            <span>
                                <img src='/assets/Humidity.png' alt='رطوبة' />
                                الرطوبة
                            </span>
                            <div className={`${styles.Humidity}`}>
                                <p>{weatherData.weatherDetails.humidity}</p>
                            </div>
                        </div>
                        <div className={`col-12 col-lg-4 col-md-6`}>
                            <span>
                                <img src='/assets/Air.png' alt='سرعة الرياح' />
                                سرعة الرياح
                            </span>
                            <div className={`${styles.Air}`}>
                                <p>{weatherData.weatherDetails.windSpeed}</p>
                            </div>
                        </div>
                    </div>
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

                {/* حالة صحة النباتات */}
                {weatherData.plantHealthStatus.healthIndex && (
                    <div className={styles.infoweather}>
                        <h4>حالة صحة النباتات</h4>
                        <p>مؤشر الصحة: {weatherData.plantHealthStatus.healthIndex}</p>
                        <p>{weatherData.plantHealthStatus.details}</p>
                    </div>
                )}
            </div>
            <FooterF />
        </>
    );
};

export default WeatherF;
