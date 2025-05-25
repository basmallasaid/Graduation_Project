// axiosInstance.js
import axios from 'axios';
import Cookies from 'js-cookie'; // تأكد من أنك قمت بتثبيت مكتبة js-cookie

const api = axios.create({
    baseURL: 'https://cityroots.runasp.net/api/', // تأكد من استخدام الـ API المناسب
    timeout: 10000, // مهلة الطلب
});

// إضافة التوكن إلى كل طلب يتم إرساله
api.interceptors.request.use(
    (config) => {
        const token = Cookies.get("access_token"); // استرجاع التوكن من الكوكيز
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // إضافة التوكن إلى رأس الطلب
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
