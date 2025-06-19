import React, { useState, useEffect } from 'react';
import styles from "../../../Styles/style.module.css";
import { Bar } from 'react-chartjs-2';
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

const YearlyCharts = () => {
  const [selectedYear, setSelectedYear] = useState('');
  const [transactions, setTransactions] = useState({
    paymentsSummary: []
  });

  const userData = JSON.parse(localStorage.getItem("user_data"));
  const userId = userData?.userId;

  useEffect(() => {
    if (userId) {
      api.get(`/Payments?Id=${userId}`)
        .then((response) => {
          if (response.data && response.data.paymentsSummary) {
            setTransactions(response.data);
          }
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

  const selectedSummary = transactions.paymentsSummary.find(
    summary => summary.year.toString() === selectedYear
  );

  const purchasesData = {
    labels: months,
    datasets: [
      {
        label: 'تقرير عمليات الشراء',
        data: selectedSummary ? selectedSummary.purchasesPerMonth : Array(12).fill(0),
        backgroundColor: 'rgb(75, 192, 192)',
      },
    ],
  };

  const investmentsData = {
    labels: months,
    datasets: [
      {
        label: 'تقرير عمليات الاستثمار',
        data: selectedSummary ? selectedSummary.investmentsPerMonth: Array(12).fill(0),
        backgroundColor: 'rgb(153, 102, 255)',
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
        // Remove or comment out the max property:
        // max: 1000000,
      },
    },
  };

  return (
    <div className={styles.ChartPage}>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <span style={{ margin: "5px" }}>ادخل السنة لعرض التقارير</span>
        <select
          className={styles.SelectYearly}
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {transactions.paymentsSummary.map((summary) => (
            <option key={summary.year} value={summary.year}>
              {summary.year}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.Chart}>
        <div className={styles.Bar}>
          <Bar data={purchasesData} options={options} />
        </div>
        <div className={styles.Bar}>
          <Bar data={investmentsData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default YearlyCharts;
