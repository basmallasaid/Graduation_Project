import React, { useEffect, useState } from 'react';
import YearlyChartsInv from './YearlyChartsInv';
import FooterInv from '../Main/FooterInv';
import TransactionModalInv from './TransactionModalInv';
import NavSideInv from '../Main/NavSideInv';
import NavbarInv from '../Main/NavbarInv';
import styles from "../../../Styles/style.module.css";
import stylesInv from "../StylesInv/stylesInv.module.css";
import axios from 'axios';

const InverstorPayment = () => {
    const [transactionsInv, settransactionsInv] = useState({
        paymentDetails: [],
        paymentsSummary: [],
    });
    const [filteredtransactionsInv, setFilteredtransactionsInv] = useState({
        paymentDetails: [],
        paymentsSummary: [],
    });
    const [showTypeDropdown, setShowTypeDropdown] = useState(false);
    const [showDateDropdown, setShowDateDropdown] = useState(false);
    const [dateRange, setDateRange] = useState({ from: '', to: '' });
    const [activeTypeFilter, setActiveTypeFilter] = useState('all');
    const [activeCycleFilter, setActiveCycleFilter] = useState('all'); // فلتر الدورة
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [minPrice, setMinPrice] = useState();
    const [maxPrice, setMaxPrice] = useState();
    const [showPriceDropdown, setShowPriceDropdown] = useState(false);
    const [loading, setLoading] = useState(true); // حالة التحميل
    const [error, setError] = useState(null); // حالة الخطأ
    const [cycles, setCycles] = useState([]); // حالة لتخزين الدورات
    const [totalInvestment, setTotalInvestment] = useState(0); // حالة لتخزين إجمالي الاستثمار

    useEffect(() => {
        setLoading(true); // تعيين حالة التحميل إلى true
        axios
            .get("http://localhost:3100/transactionsInv")
            .then((res) => {
                if (res.data && res.data.paymentDetails) {
                    settransactionsInv(res.data);
                    setFilteredtransactionsInv(res.data);
                    // استخراج الدورات الفريدة من البيانات
                    const uniqueCycles = [...new Set(res.data.paymentDetails.map(transaction => transaction.CycleName))];
                    setCycles(uniqueCycles);
                    
                    // حساب إجمالي الاستثمار عند تحميل البيانات
                    const totalInvestmentValue = res.data.paymentDetails
                        .filter(transaction => transaction.type === 'استثمار')
                        .reduce((sum, transaction) => sum + transaction.amount, 0);
                    setTotalInvestment(totalInvestmentValue); // تعيين إجمالي الاستثمار
                } else {
                    console.error("Unexpected data format:", res.data);
                    setError("تنسيق البيانات غير متوقع."); // تعيين رسالة الخطأ
                }
            })
            .catch((err) => {
                console.error("Error fetching data:", err);
                setError("حدث خطأ أثناء جلب البيانات."); // تعيين رسالة الخطأ
            })
            .finally(() => {
                setLoading(false); // تعيين حالة التحميل إلى false
            });
    }, []);

    const applyFilters = (type, dateRange, minPrice, maxPrice, cycle) => {
        let filtered = transactionsInv.paymentDetails;

        // فلترة حسب النوع
        if (type !== 'الغاء' && type !== 'all') {
            filtered = filtered.filter(transaction => transaction.type === type);
        }

        // فلترة حسب الدورة
        if (cycle !== 'all' && cycle) {
            filtered = filtered.filter(transaction => transaction.CycleName === cycle);
        }

        // فلترة حسب التاريخ
        if (dateRange && dateRange.from && dateRange.to) {
            if (new Date(dateRange.from) > new Date(dateRange.to)) {
                console.error("Invalid date range: 'From' date cannot be after 'To' date.");
                return;
            }
            filtered = filtered.filter(transaction => {
                const transDate = new Date(transaction.paymentDate);
                return transDate >= new Date(dateRange.from) && transDate <= new Date(dateRange.to);
            });
        }

        // فلترة حسب السعر
        filtered = filtered.filter(transaction => transaction.amount >= (minPrice || 0) && transaction.amount <= (maxPrice || Infinity));

        setFilteredtransactionsInv({ ...transactionsInv, paymentDetails: filtered });
        calculateTotals(filtered); // حساب الإجماليات بعد الفلترة
    };

    const resetFilters = () => {
        setActiveTypeFilter('all');
        setActiveCycleFilter('all'); // إعادة تعيين فلتر الدورة
        setDateRange({ from: '', to: '' });
        setMinPrice(0);
        setMaxPrice(0);
        setFilteredtransactionsInv(transactionsInv);
    };

    const handleCycleFilter = (cycle) => {
        setActiveCycleFilter(cycle);
        applyFilters(activeTypeFilter, dateRange, minPrice, maxPrice, cycle);
    };

    const handleDateRangeChange = (field, value) => {
        const newDateRange = { ...dateRange, [field]: value };
        setDateRange(newDateRange);
        if (newDateRange.from && newDateRange.to) {
            applyFilters(activeTypeFilter, newDateRange, minPrice, maxPrice, activeCycleFilter);
        }
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
        applyFilters(activeTypeFilter, newDateRange, minPrice, maxPrice, activeCycleFilter);
        setShowDateDropdown(false);
    };

    const calculateTotals = (filteredData) => {
        const totalInvestment = filteredData
            .filter(transaction => transaction.type === 'استثمار')
            .reduce((sum, transaction) => sum + transaction.amount, 0);

        setTotalInvestment(totalInvestment); // تحديث الحالة الإجمالية
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <NavbarInv />
            <div className="d-flex flex-grow-1 ">
                <NavSideInv />
                <main className={` flex-grow-1  `}>
                    <div className={styles.table_section} >
                        {loading && <div>جاري تحميل البيانات...</div>} {/* رسالة التحميل */}
                        {error && <div style={{ color: 'red' }}>{error}</div>} {/* رسالة الخطأ */}
                        {/* Table */}
                        <div className={`${styles.table_container} ${styles.tablePay}`} >
                            <table className={styles.transactions_table}>
                                <thead>
                                    <tr>
                                        <th>رقم المعاملة</th>
                                        <th>تاريخ المعاملة</th>
                                        <th>المبلغ</th>
                                        <th>نوع المعاملة</th>
                                        <th>اسم الدورة</th>
                                        <th>الطرف المستقبل</th>
                                        <th>طريقة الدفع</th>
                                        <th>حالة الدفع</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(filteredtransactionsInv.paymentDetails) &&
                                        filteredtransactionsInv.paymentDetails.map((transaction) => (
                                            <tr
                                                key={transaction.paymentId}
                                                onClick={() => setSelectedTransaction(transaction)}
                                                className={styles.clickable_row}
                                                aria-label={`Transaction ID: ${transaction.paymentId}`} // تحسين إمكانية الوصول
                                            >
                                                <td>{transaction.paymentId}</td>
                                                <td>{new Date(transaction.paymentDate).toLocaleDateString('ar-EG')}</td>
                                                <td>{transaction.amount} ج.م</td>
                                                <td>{transaction.type}</td>
                                                <td>{transaction.CycleName}</td>
                                                <td>{transaction.payeeName}</td>
                                                <td>{transaction.paymentMethod}</td>
                                                <td>{transaction.status}</td>
                                            </tr>
                                        ))}

                                    {filteredtransactionsInv.paymentDetails.length === 0 && (
                                        <tr>
                                            <td colSpan="8" style={{ textAlign: "center" }}>لا توجد معاملات لعرضها</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {selectedTransaction && (
                                <TransactionModalInv
                                    transaction={selectedTransaction}
                                    onClose={() => setSelectedTransaction(null)}
                                />
                            )}
                        </div>
                        {/* Filters */}
                        <div className={styles.filter_section}>
                            <div className={`${styles.filter_dropdown} `}>
                                <span>
                                    <select
                                        value={activeCycleFilter}
                                        onChange={(e) => handleCycleFilter(e.target.value)}
                                        className={`${styles.filter_button} ${stylesInv.parentfilter}`}
                                    >
                                        <option value="all">كل الدورات</option>
                                        {cycles.map((cycle, index) => (
                                            <option key={index} value={cycle}>{cycle}</option>
                                        ))}
                                    </select>
                                </span>

                                <button
                                    className={styles.filter_button}
                                    onClick={() => setShowPriceDropdown(!showPriceDropdown)}
                                    aria-label="Filter by price" // تحسين إمكانية الوصول
                                >
                                    <span>تصفية بالسعر</span>
                                    <span className={styles.arrow_icon}>▼</span>
                                </button>

                                {showPriceDropdown && (
                                    <div className={styles.dropdown_menu}>
                                        <div className={`${stylesInv.down}`}>
                                            <label>الحد الأدني للسعر:</label>
                                            <input className={`${styles.dropdown_item} `} type="number" value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value))} />
                                        </div>
                                        <div className={`${stylesInv.down}`}>
                                            <label>الحد الأقصي للسعر:</label>
                                            <input className={`${styles.dropdown_item} `} type="number" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} />
                                        </div>
                                        <div className={`${styles.dropdown_item} ${stylesInv.down}`} onClick={() => {
                                            setShowPriceDropdown(false);
                                            applyFilters(activeTypeFilter, dateRange || { from: '', to: '' }, minPrice || 0, maxPrice || Infinity, activeCycleFilter);
                                        }}>تطبيق</div>
                                        <div className={`${styles.dropdown_item} ${stylesInv.down}`} onClick={resetFilters}>إلغاء</div>
                                    </div>
                                )}
                            </div>

                            <div className={styles.filter_dropdown}>
                                <button
                                    className={`${styles.filter_button} ${stylesInv.parentfilter} `}
                                    onClick={() => {
                                        setShowDateDropdown(!showDateDropdown);
                                        setShowTypeDropdown(false);
                                    }}
                                    aria-label="Filter by return type" // تحسين إمكانية الوصول
                                >
                                    <span>تصفية بنوع العائد</span>
                                    <span className={styles.calendar_icon}>📅</span>
                                </button>
                                <button
                                    className={styles.filter_button}
                                    onClick={() => {
                                        setShowDateDropdown(!showDateDropdown);
                                        setShowTypeDropdown(false);
                                    }}
                                    aria-label="Filter by date" // تحسين إمكانية الوصول
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
                                إجمالي الإيرادات الناتجة من عمليات الاستثمار: <span>{totalInvestment} ج.م</span>
                            </div>
                        </div>
                    </div>
                    <YearlyChartsInv />
                </main>
            </div>
            <FooterInv />
        </div>
    );
};

export default InverstorPayment;