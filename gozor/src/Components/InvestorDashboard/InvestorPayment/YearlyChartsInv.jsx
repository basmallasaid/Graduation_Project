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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const YearlyChartsInv = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [transactions, setTransactions] = useState({
    paymentsSummary: []
  });

  useEffect(() => {

    axios.get("http://localhost:3100/transactions")
      .then((response) => {
        setTransactions(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const months = ['يناير', 'فبراير', 'مارس', 'ابريل', 'مايو', 'يونيو', 'يوليو', 'اغسطس', 'سبتمبر', 'اكتوبر', 'نوفمبر', 'ديسمبر'];

  const selectedSummary = transactions.paymentsSummary.find(summary => summary.year.toString() === selectedYear);


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
        max: 1000000,
      },
    },
  };

  return (
    <div className={styles.ChartPage}>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <span style={{ margin: "5px" }}>ادخل السنة لعرض التقارير</span>
        <select className={styles.SelectYearly}
          value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} >
          {transactions.paymentsSummary.map((summary) => (
            <option key={summary.year} value={summary.year}>{summary.year}</option>
          ))}
        </select>
      </div>
      <div  className={`${stylesInv.ChartInv}`}>
       
        <div className={styles.Bar}>
          <Bar data={investmentsData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default YearlyChartsInv;
