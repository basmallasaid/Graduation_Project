import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from "../../../Styles/style.module.css";
import { Bar } from 'react-chartjs-2';
import stylesInv from "../StylesInv/stylesInv.module.css"
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

const YearlyChartsInv = () => {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [transactions, setTransactions] = useState({
    paymentsSummary: []
  });
  const userData = JSON.parse(localStorage.getItem("user_data"));
  const userId = userData?.userId;
  useEffect(() => {
    if(userId){
    // Adjust axios to get your data as per your backend
    api.get(`Payments/GetInvestorPayments?Id=${userId}`)
      .then((response) => {
        if(response.data&&response.data.paymentsSummary){
        setTransactions(response.data);}
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
    }
  }, [userId]);
   useEffect(() => {
      if (transactions.paymentsSummary.length > 0 && !selectedYear) {
        setSelectedYear(transactions.paymentsSummary[0].year.toString());
      }
    }, [transactions]);

  const months = ['يناير', 'فبراير', 'مارس', 'ابريل', 'مايو', 'يونيو', 'يوليو', 'اغسطس', 'سبتمبر', 'اكتوبر', 'نوفمبر', 'ديسمبر'];

  // Get the selected year summary
  const selectedSummary = transactions.paymentsSummary.find(
    summary => summary.year.toString() === selectedYear
  );

  const investmentsData = {
    labels: months,
    datasets: [
      {
        label: 'تقرير عمليات الاستثمار',
        data: selectedSummary ? selectedSummary.investmentsPerMonth : Array(12).fill(0),
        backgroundColor: '#00C7BE',
      },
    ],
  };

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
        // Adjust this based on your data needs
      },
    },
  };

  return (
    <div className={styles.ChartPage}>
      <div style={{ marginBottom: '50px' }} className={`${styles.btnselectyear}`}>
        <span style={{ margin: "5px" }}>ادخل السنة لعرض التقارير</span>
        <select className={styles.SelectYearly}
          value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} >
          {transactions.paymentsSummary.map((summary) => (
            <option key={summary.year} value={summary.year}>{summary.year}</option>
          ))}
        </select>
      </div>
      <div className={`${stylesInv.ChartInv}`}>
        <div className={stylesInv.Bar}>
          <Bar data={investmentsData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default YearlyChartsInv;
