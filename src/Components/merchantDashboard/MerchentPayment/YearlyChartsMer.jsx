import React, { useState, useEffect } from 'react';
import styles from "../../../Styles/style.module.css";
import { Bar } from 'react-chartjs-2';
import stylesmer from "../StylesMer/stylesmer.module.css";
import stylesInv from "../../InvestorDashboard/StylesInv/stylesInv.module.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '../../../API/axiosInstance';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const YearlyChartsMer = () => {
  // الحالة لتخزين السنة المحددة، تم تغيير القيمة الأولية لتكون ديناميكية
  const [selectedYear, setSelectedYear] = useState('');
  // الحالة لتخزين البيانات التي يتم جلبها من الـ API
  const [transactions, setTransactions] = useState({
    paymentsSummary: []
  });

  // استخراج معرف المستخدم من التخزين المحلي
  const userData = JSON.parse(localStorage.getItem("user_data"));
  const userId = userData?.userId;

  // useEffect لجلب البيانات عند تحميل المكون
  useEffect(() => {
    if (userId) {
      // استدعاء API لجلب بيانات التاجر
      api.get(`Payments/GetMerchantPayments?Id=${userId}`)
        .then((response) => {
          // التحقق من أن البيانات موجودة وبالشكل الصحيح قبل تحديث الحالة
          if (response.data && response.data.paymentsSummary) {
            setTransactions(response.data);
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  }, [userId]); // يتم تشغيل هذا التأثير فقط عند تغيير userId

  // useEffect لتعيين السنة الافتراضية بعد وصول البيانات
  useEffect(() => {
      // إذا كانت هناك بيانات ولم يتم تحديد سنة بعد، قم بتعيين أول سنة متاحة
      if (transactions.paymentsSummary.length > 0 && !selectedYear) {
        setSelectedYear(transactions.paymentsSummary[0].year.toString());
      }
    }, [transactions, selectedYear]); // يتم تشغيله عند تغيير البيانات أو السنة

  // تعريف الأشهر باللغة العربية للرسم البياني
  const months = ['يناير', 'فبراير', 'مارس', 'ابريل', 'مايو', 'يونيو', 'يوليو', 'اغسطس', 'سبتمبر', 'اكتوبر', 'نوفمبر', 'ديسمبر'];

  // البحث عن ملخص السنة المحددة ضمن البيانات
  const selectedSummary = transactions.paymentsSummary.find(summary => summary.year.toString() === selectedYear);

  // إعداد البيانات الخاصة بالرسم البياني (تم الاحتفاظ باسم المتغير الأصلي)
  const investmentsData = {
    labels: months,
    datasets: [
      {
        label: 'تقرير عمليات الشراء ',
        // استخدام بيانات السنة المحددة، أو مصفوفة من الأصفار في حالة عدم وجودها
        data: selectedSummary ? selectedSummary.purchasesPerMonth : Array(12).fill(0),
        backgroundColor: '#459595',
      },
    ],
  };

  // إعداد خيارات العرض للرسم البياني
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className={styles.ChartPage}>
      <div style={{marginBottom: '50px' }} className={`${styles.btnselectyear}`}>
        <span style={{ margin: "5px" }}>ادخل السنة لعرض التقارير</span>
        <select 
          className={styles.SelectYearly}
          value={selectedYear} 
          onChange={(e) => setSelectedYear(e.target.value)} 
        >
          {/* عرض السنوات المتاحة في قائمة منسدلة */}
          {transactions.paymentsSummary.map((summary) => (
            <option key={summary.year} value={summary.year}>{summary.year}</option>
          ))}
        </select>
      </div>
      <div className={`${stylesInv.ChartInv}`}>
        <div className={`${stylesInv.Bar}`}>
          {/* عرض الرسم البياني */}
          <Bar data={investmentsData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default YearlyChartsMer;