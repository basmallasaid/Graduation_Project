import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import YearlyCharts from './YearlyCharts';
import TransactionModal from './TransactionModal';
import styles from "../../../Styles/style.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import NavbarF from '../Main/NavbarF';
import FooterF from '../Main/FooterF';
import NavSideF from '../Main/NavSideF';

const PaymentF = () => {
    const [transactions, setTransactions] = useState({
        paymentDetails: [],
        paymentsSummary: [

        ],

    });
    const [filteredTransactions, setFilteredTransactions] = useState({
        paymentDetails: [],
        paymentsSummary: [],

    });
    const [showTypeDropdown, setShowTypeDropdown] = useState(false);
    const [showDateDropdown, setShowDateDropdown] = useState(false);
    const [dateRange, setDateRange] = useState({ from: '', to: '' });
    const [activeTypeFilter, setActiveTypeFilter] = useState('all');
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    useEffect(() => {
        axios
            .get("http://localhost:3100/transactions")
            .then((res) => {
                if (res.data && res.data.paymentDetails) {
                    setTransactions(res.data);
                    setFilteredTransactions(res.data);
                } else {
                    console.error("Unexpected data format:", res.data);
                }
            })
            .catch((err) => console.error("Error fetching data:", err));
    }, []);

    const applyFilters = (type, dateRange) => {
        let filtered = transactions.paymentDetails;

        // Apply type filter
        if (type !== 'الغاء' && type !== 'all') {
            filtered = filtered.filter(transaction => transaction.type === type);
        }

        // Apply date filter
        if (dateRange.from && dateRange.to) {
            if (new Date(dateRange.from) > new Date(dateRange.to)) {
                console.error("Invalid date range: 'From' date cannot be after 'To' date.");
                return;
            }
            filtered = filtered.filter(transaction => {
                const transDate = new Date(transaction.paymentDate);
                return transDate >= new Date(dateRange.from) && transDate <= new Date(dateRange.to);
            });
        }

        setFilteredTransactions({ ...transactions, paymentDetails: filtered });
    };

    const handleTypeFilter = (type) => {
        setActiveTypeFilter(type);
        applyFilters(type, dateRange);
        setShowTypeDropdown(false);
    };

    const handleDateFilter = (filterType) => {
        let newDateRange = { ...dateRange };
        const today = new Date();

        switch (filterType) {
            case 'day':
                newDateRange = {
                    from: today.toISOString().split('T')[0],
                    to: today.toISOString().split('T')[0]
                };
                break;
            case 'week':
                const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                newDateRange = {
                    from: weekAgo.toISOString().split('T')[0],
                    to: today.toISOString().split('T')[0]
                };
                break;
            case 'month':
                const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
                newDateRange = {
                    from: monthStart.toISOString().split('T')[0],
                    to: today.toISOString().split('T')[0]
                };
                break;
            case 'cancel':
                newDateRange = { from: '', to: '' };
                break;
            case 'custom':
                if (dateRange.from && dateRange.to) {
                    newDateRange = dateRange;
                }
                break;
            default:
                newDateRange = { from: '', to: '' };
        }

        setDateRange(newDateRange);
        applyFilters(activeTypeFilter, newDateRange);
        setShowDateDropdown(false);
    };

    const handleDateRangeChange = (field, value) => {
        const newDateRange = { ...dateRange, [field]: value };
        setDateRange(newDateRange);
        if (newDateRange.from && newDateRange.to) {
            applyFilters(activeTypeFilter, newDateRange);
        }
    };

    const calculateTotals = () => {
        const totalInvestment = filteredTransactions.paymentDetails
            .filter(transaction => transaction.type === 'استثمار')
            .reduce((sum, transaction) => sum + transaction.amount, 0);

        const totalPurchase = filteredTransactions.paymentDetails
            .filter(transaction => transaction.type === 'شراء')
            .reduce((sum, transaction) => sum + transaction.amount, 0);

        return { totalInvestment, totalPurchase };
    };
    const { totalInvestment, totalPurchase } = calculateTotals();

    return (
        <div className="d-flex flex-column min-vh-100">
            <NavbarF/>
            <div className="d-flex flex-grow-1 ">
                <NavSideF/>
                <main className={` flex-grow-1  `}>
                    <div className={styles.table_section} >
                        {/* Table */}
                        <div className={styles.table_container} >
                            <table className={styles.transactions_table}>
                                <thead>
                                    <tr>
                                        <th>رقم المعاملة</th>
                                        <th>تاريخ المعاملة</th>
                                        <th>المبلغ</th>
                                        <th>نوع المعاملة</th>
                                        <th>الطرف الدافع</th>
                                        <th>الطرف المستقبل</th>
                                        <th>طريقة الدفع</th>
                                        <th>حالة الدفع</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(filteredTransactions.paymentDetails) &&
                                        filteredTransactions.paymentDetails.map((transaction) => (
                                            <tr
                                                key={transaction.paymentId}
                                                onClick={() => setSelectedTransaction(transaction)}
                                                className={styles.clickable_row}
                                            >
                                                <td>{transaction.paymentId}</td>
                                                <td>{new Date(transaction.paymentDate).toLocaleDateString('ar-EG')}</td>
                                                <td>{transaction.amount} ج.م</td>
                                                <td>{transaction.type}</td>
                                                <td>{transaction.payerName}</td>
                                                <td>{transaction.payeeName}</td>
                                                <td>{transaction.paymentMethod}</td>
                                                <td>{transaction.status}</td>
                                            </tr>
                                        ))}

                                    {filteredTransactions.paymentDetails.length === 0 && (
                                        <tr>
                                            <td colSpan="8" style={{ textAlign: "center" }}>لا توجد معاملات لعرضها</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {selectedTransaction && (
                                <TransactionModal
                                    transaction={selectedTransaction}
                                    onClose={() => setSelectedTransaction(null)}
                                />
                            )}
                        </div>
                        {/* Filters */}
                        <div className={styles.filter_section}>
                            <div className={styles.filter_dropdown}>
                                <button
                                    className={styles.filter_button}
                                    onClick={() => {
                                        setShowTypeDropdown(!showTypeDropdown);
                                        setShowDateDropdown(false);
                                    }}
                                >
                                    <span>تصفية بنوع المعاملة</span>
                                    <span className={styles.arrow_icon}>▼</span>
                                </button>
                                {showTypeDropdown && (
                                    <div className={styles.dropdown_menu}>
                                        <div className={styles.dropdown_item} onClick={() => handleTypeFilter("استثمار")}>استثمار</div>
                                        <div className={styles.dropdown_item} onClick={() => handleTypeFilter('شراء')}>شراء</div>
                                        <div className={styles.dropdown_item} onClick={() => handleTypeFilter('الغاء')}>الغاء</div>
                                    </div>
                                )}
                            </div>

                            <div className={styles.filter_dropdown}>
                                <button
                                    className={styles.filter_button}
                                    onClick={() => {
                                        setShowDateDropdown(!showDateDropdown);
                                        setShowTypeDropdown(false);
                                    }}
                                >
                                    <span>تصفية بالتاريخ</span>
                                    <span className={styles.calendar_icon}>📅</span>
                                </button>
                                {showDateDropdown && (
                                    <div className={styles.dropdown_menu}>
                                        <div className={styles.date_range_container}>
                                            <div className={styles.date_range_row}>
                                                <div className={styles.date_field}>
                                                    <span className={styles.date_label}>من</span>
                                                    <div className={styles.date_input_container}>
                                                        <input
                                                            type="date"
                                                            value={dateRange.from}
                                                            onChange={(e) => handleDateRangeChange('from', e.target.value)}
                                                            className={styles.date_input}
                                                        />
                                                    </div>
                                                </div>
                                                <div className={styles.date_field}>
                                                    <span className={styles.date_label}>الى</span>
                                                    <div className={styles.date_input_container}>
                                                        <input
                                                            type="date"
                                                            value={dateRange.to}
                                                            onChange={(e) => handleDateRangeChange('to', e.target.value)}
                                                            className={styles.date_input}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.dropdown_item} onClick={() => handleDateFilter('day')}>اليوم</div>
                                        <div className={styles.dropdown_item} onClick={() => handleDateFilter('week')}>اسبوع</div>
                                        <div className={styles.dropdown_item} onClick={() => handleDateFilter('month')}>شهر</div>
                                        <div className={styles.dropdown_item} onClick={() => handleDateFilter('custom')}>تطبيق</div>
                                        <div className={styles.dropdown_item} onClick={() => handleDateFilter('cancel')}>الغاء</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Totals */}
                        <div className={styles.totals_section}>
                            <div className={styles.total_item}>
                                إجمالي الإيرادات الناتجة من عمليات الشراء: <span>{totalPurchase} ج.م</span>
                            </div>
                            <div className={styles.total_item}>
                                إجمالي الإيرادات الناتجة من عمليات الاستثمار: <span>{totalInvestment} ج.م</span>
                            </div>
                        </div>
                     </div>
                    <YearlyCharts />
                </main>
            </div>
           <FooterF/>
        </div>
    );
};

export default PaymentF;
