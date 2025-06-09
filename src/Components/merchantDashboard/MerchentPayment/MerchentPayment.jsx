import React, { useEffect, useState } from 'react';
import styles from "../../../Styles/style.module.css";
import stylesmer from "../StylesMer/stylesmer.module.css";
import NavSideMer from '../Main/NavSideMer';
import NavbarMer from '../Main/NavbarMer';
import FooterMer from '../Main/FooterMer';
import YearlyChartsMer from './YearlyChartsMer';
import TransactionModalMer from './TransactionModalMer';
import api from '../../../API/axiosInstance';

// --- دالة مساعد لترجمة أنواع معاملات التاجر ---
const translateTypeMer = (type) => {
    const translations = {
        'Purchase': 'شراء',
        'Sale': 'بيع',
        'Expense': 'مصروفات',
        // أضف أي ترجمات أخرى محتملة هنا
    };
    return translations[type] || type;
};

// --- دالة مساعد لتنسيق العملة ---
const formatCurrency = (amount) => {
    const number = Number(amount);
    if (isNaN(number)) return amount;
    return number.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' });
};

const MerchentPayment = () => {
    // --- State Declarations ---
    const [transactionsInv, settransactionsInv] = useState({
        payments: [], // لتخزين البيانات الأصلية
        paymentDetails: [], // لتخزين البيانات المحولة
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
    const [activeCycleFilter, setActiveCycleFilter] = useState('all');
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [minPrice, setMinPrice] = useState(undefined); // استخدام undefined أفضل للحقول الفارغة
    const [maxPrice, setMaxPrice] = useState(undefined); // استخدام undefined أفضل للحقول الفارغة
    const [showPriceDropdown, setShowPriceDropdown] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cycles, setCycles] = useState([]);
    const [totalPurchases, setTotalPurchases] = useState(0); // تم تغيير الاسم ليعكس المعنى

    // --- User Data Extraction ---
    const userData = JSON.parse(localStorage.getItem("user_data"));
    const userId = userData?.userId;

    // --- useEffect Hook (MODIFIED to handle new API structure and data transformation) ---
    useEffect(() => {
        if (!userId) {
            setError("معرف المستخدم غير متوفر.");
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        api.get(`Payments/GetMerchantPayments?Id=${userId}`)
            .then((res) => {
                // MODIFIED: التحقق من بنية الـ API الصحيحة
                if (res.data && Array.isArray(res.data.payments) && Array.isArray(res.data.paymentsSummary)) {
                    
                    // ADAPTATION & TRANSLATION STEP: تحويل وترجمة البيانات
                    const transformedPaymentDetails = res.data.payments.map(payment => ({
                        ...payment,
                        type: translateTypeMer(payment.type), // ترجمة النوع إلى العربية
                        CycleName: payment.associatedCycle?.cycleName ?? 'N/A', // استخراج اسم المحصول
                    }));

                    settransactionsInv({
                        payments: res.data.payments,
                        paymentsSummary: res.data.paymentsSummary,
                        paymentDetails: transformedPaymentDetails
                    });

                    setFilteredtransactionsInv({
                        paymentDetails: transformedPaymentDetails,
                        paymentsSummary: res.data.paymentsSummary
                    });

                    const uniqueCycles = [...new Set(
                        transformedPaymentDetails
                            .map(transaction => transaction.CycleName)
                            .filter(name => name != null && name !== '')
                    )];
                    setCycles(uniqueCycles);
                    
                    // حساب إجمالي المشتريات عند تحميل البيانات
                    const totalPurchasesValue = transformedPaymentDetails
                        .filter(transaction => transaction.type === 'شراء') // استخدام النوع المترجم
                        .reduce((sum, transaction) => sum + (transaction.amount || 0), 0);
                    setTotalPurchases(totalPurchasesValue);

                } else {
                    console.error("Unexpected data format:", res.data);
                    setError("تنسيق البيانات المستلمة من الخادم غير متوقع.");
                    settransactionsInv({ payments: [], paymentDetails: [], paymentsSummary: [] });
                    setFilteredtransactionsInv({ paymentDetails: [], paymentsSummary: [] });
                }
            })
            .catch((err) => {
                console.error("Error fetching data:", err);
                setError(`حدث خطأ أثناء جلب البيانات: ${err.message || ''}`);
                settransactionsInv({ payments: [], paymentDetails: [], paymentsSummary: [] });
                setFilteredtransactionsInv({ paymentDetails: [], paymentsSummary: [] });
            })
            .finally(() => {
                setLoading(false);
            });
    }, [userId]); // إضافة userId إلى مصفوفة الاعتماديات

    const applyFilters = (type, dateRange, minPrice, maxPrice, cycle) => {
        let filtered = transactionsInv.paymentDetails || [];

        if (type !== 'الغاء' && type !== 'all') {
            filtered = filtered.filter(transaction => transaction.type === type);
        }

        if (cycle !== 'all' && cycle) {
            filtered = filtered.filter(transaction => transaction.CycleName === cycle);
        }

        if (dateRange && dateRange.from && dateRange.to) {
             if (new Date(dateRange.from) > new Date(dateRange.to)) {
                 console.error("Invalid date range: 'From' date cannot be after 'To' date.");
                 return;
             }
            const fromDate = new Date(dateRange.from);
            const toDate = new Date(dateRange.to);
            fromDate.setHours(0, 0, 0, 0);
            toDate.setHours(23, 59, 59, 999);
            filtered = filtered.filter(transaction => {
                const transDate = new Date(transaction.paymentDate);
                return !isNaN(transDate) && transDate >= fromDate && transDate <= toDate;
            });
        }
        
        // تحسين منطق فلترة السعر
        const effectiveMin = minPrice === undefined || minPrice === '' || isNaN(Number(minPrice)) ? 0 : Number(minPrice);
        const effectiveMax = maxPrice === undefined || maxPrice === '' || isNaN(Number(maxPrice)) ? Infinity : Number(maxPrice);
        filtered = filtered.filter(transaction =>
            (transaction.amount ?? 0) >= effectiveMin &&
            (transaction.amount ?? 0) <= effectiveMax
        );

        setFilteredtransactionsInv(prevState => ({ ...prevState, paymentDetails: filtered }));
        calculateTotals(filtered);
    };

    const resetFilters = () => {
        setActiveTypeFilter('all');
        setActiveCycleFilter('all');
        setDateRange({ from: '', to: '' });
        setMinPrice(undefined);
        setMaxPrice(undefined);
        setFilteredtransactionsInv({
            paymentDetails: transactionsInv.paymentDetails || [],
            paymentsSummary: transactionsInv.paymentsSummary || []
        });
        calculateTotals(transactionsInv.paymentDetails || []);
        setShowDateDropdown(false);
        setShowPriceDropdown(false);
        setShowTypeDropdown(false);
    };

    const handleCycleFilter = (cycle) => {
        setActiveCycleFilter(cycle);
        applyFilters(activeTypeFilter, dateRange, minPrice, maxPrice, cycle);
    };

    const handleDateRangeChange = (field, value) => {
        const newDateRange = { ...dateRange, [field]: value };
        setDateRange(newDateRange);
        if (newDateRange.from && newDateRange.to) {
            if (new Date(newDateRange.to) >= new Date(newDateRange.from)) {
                 applyFilters(activeTypeFilter, newDateRange, minPrice, maxPrice, activeCycleFilter);
            }
        }
    };

    const handleDateFilter = (filterType) => {
        let newDateRange = { ...dateRange };
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        switch (filterType) {
            case 'day':
                newDateRange = { from: todayStr, to: todayStr };
                break;
            case 'week':
                const weekAgo = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
                newDateRange = { from: weekAgo.toISOString().split('T')[0], to: todayStr };
                break;
            case 'month':
                const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
                newDateRange = { from: monthStart.toISOString().split('T')[0], to: todayStr };
                break;
            case 'cancel':
                newDateRange = { from: '', to: '' };
                break;
            case 'custom':
                 // لا يتم تغيير النطاق، سيتم استخدام النطاق الحالي في applyFilters
                break;
            default:
                newDateRange = { from: '', to: '' };
        }

        if (filterType !== 'custom') {
            setDateRange(newDateRange);
        }
        
        applyFilters(activeTypeFilter, filterType === 'custom' ? dateRange : newDateRange, minPrice, maxPrice, activeCycleFilter);
        setShowDateDropdown(false);
    };

    const calculateTotals = (filteredData) => {
        const dataToProcess = Array.isArray(filteredData) ? filteredData : [];
        const totalPurchasesValue = dataToProcess
            .filter(transaction => transaction.type === 'شراء') // استخدام النوع المترجم
            .reduce((sum, transaction) => sum + (transaction.amount || 0), 0);
        setTotalPurchases(totalPurchasesValue);
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <NavbarMer />
            <div className="d-flex flex-grow-1 ">
                <NavSideMer />
                <main className={`flex-grow-1`}>
                    <div className={styles.table_section}>
                        {loading && <div className={stylesmer.loading_message || ''}>جاري تحميل البيانات...</div>}
                        {error && <div className={stylesmer.error_message || ''} style={{ color: 'red' }}>{error}</div>}

                        {!loading && !error && (
                            <>
                                {/* Table */}
                                <div className={`${styles.table_container} ${styles.tablePay}`}>
                                    <table className={styles.transactions_table}>
                                        <thead>
                                            <tr>
                                                <th>رقم المعاملة</th>
                                                <th>تاريخ المعاملة</th>
                                                <th>المبلغ</th>
                                                <th>نوع المعاملة</th>
                                                <th>اسم المحصول</th>
                                                <th>الطرف المستقبل</th>
                                                <th>طريقة الدفع</th>
                                                <th>حالة الدفع</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(filteredtransactionsInv.paymentDetails) && filteredtransactionsInv.paymentDetails.length > 0 ? (
                                                filteredtransactionsInv.paymentDetails.map((transaction) => (
                                                    <tr
                                                        key={transaction.paymentId}
                                                        onClick={() => setSelectedTransaction(transaction)}
                                                        className={styles.clickable_row}
                                                        aria-label={`Transaction ID: ${transaction.paymentId}`}
                                                    >
                                                        <td>{transaction.paymentId}</td>
                                                        <td>{new Date(transaction.paymentDate).toLocaleDateString('ar-EG')}</td>
                                                        <td>{formatCurrency(transaction.amount)}</td>
                                                        <td>{transaction.type}</td>
                                                        <td>{transaction.CycleName}</td>
                                                        <td>{transaction.payeeName}</td>
                                                        <td>{transaction.paymentMethod}</td>
                                                        <td>{transaction.status}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>لا توجد معاملات لعرضها</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                
                                {/* Filters */}
                                <div className={styles.filter_section}>
                                    <div className={`${styles.filter_dropdown}`}>
                                        <select
                                            value={activeCycleFilter}
                                            onChange={(e) => handleCycleFilter(e.target.value)}
                                            className={`${styles.filter_button} ${stylesmer.parentfilter}`}
                                            aria-label="Filter by crop"
                                        >
                                            <option value="all">كل المحاصيل</option>
                                            {cycles.map((cycle, index) => (
                                                <option key={index} value={cycle}>{cycle}</option>
                                            ))}
                                        </select>
                                        <div className={styles.filter_dropdown}>
                                            <button
                                                className={styles.filter_button}
                                                onClick={() => setShowPriceDropdown(!showPriceDropdown)}
                                                aria-expanded={showPriceDropdown}
                                                aria-label="Filter by price"
                                            >
                                                <span>تصفية بالسعر</span>
                                                <span className={styles.arrow_icon}>▼</span>
                                            </button>
                                            {showPriceDropdown && (
                                                <div className={styles.dropdown_menu} onClick={e => e.stopPropagation()}>
                                                    <div className={stylesmer.down}>
                                                        <label htmlFor='minPriceMerLabel'>الحد الأدنى:</label>
                                                        <input id='minPriceMerLabel' className={styles.dropdown_item} type="number" placeholder="0" value={minPrice === undefined ? '' : minPrice} onChange={(e) => setMinPrice(e.target.value === '' ? undefined : Number(e.target.value))} />
                                                    </div>
                                                    <div className={stylesmer.down}>
                                                        <label htmlFor='maxPriceMerLabel'>الحد الأقصى:</label>
                                                        <input id='maxPriceMerLabel' className={styles.dropdown_item} type="number" placeholder="غير محدود" value={maxPrice === undefined ? '' : maxPrice} onChange={(e) => setMaxPrice(e.target.value === '' ? undefined : Number(e.target.value))} />
                                                    </div>
                                                    <div className={`${styles.dropdown_item} ${stylesmer.down}`} onClick={() => {
                                                        setShowPriceDropdown(false);
                                                        applyFilters(activeTypeFilter, dateRange, minPrice, maxPrice, activeCycleFilter);
                                                    }}>تطبيق</div>
                                                    <div className={`${styles.dropdown_item} ${stylesmer.down}`} onClick={resetFilters}>إلغاء</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className={styles.filter_dropdown}>
                                        {/* <button
                                            className={`${styles.filter_button} ${stylesmer.parentfilter}`}
                                            onClick={() => { setShowTypeDropdown(!showTypeDropdown); setShowDateDropdown(false);}}
                                            aria-label="Filter by return type"
                                        >
                                            <span>تصفية بنوع العائد</span>
                                            <span className={styles.calendar_icon}>📅</span>
                                        </button> */}
                                        <button
                                            className={styles.filter_button}
                                            onClick={() => { setShowDateDropdown(!showDateDropdown); setShowTypeDropdown(false);}}
                                            aria-expanded={showDateDropdown}
                                            aria-label="Filter by date"
                                        >
                                            <span>تصفية بالتاريخ</span>
                                            <span className={styles.calendar_icon}>📅</span>
                                        </button>
                                        {showDateDropdown && (
                                            <div className={styles.dropdown_menu} onClick={e => e.stopPropagation()}>
                                                <div className={styles.date_range_container}>
                                                     <div className={styles.date_range_row}>
                                                        <div className={styles.date_field}>
                                                            <label htmlFor='dateFromMerLabel' className={styles.date_label}>من</label>
                                                            <input id='dateFromMerLabel' type="date" value={dateRange.from} onChange={(e) => handleDateRangeChange('from', e.target.value)} className={styles.date_input} />
                                                        </div>
                                                        <div className={styles.date_field}>
                                                            <label htmlFor='dateToMerLabel' className={styles.date_label}>الى</label>
                                                            <input id='dateToMerLabel' type="date" value={dateRange.to} onChange={(e) => handleDateRangeChange('to', e.target.value)} className={styles.date_input} min={dateRange.from || undefined} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <button className={styles.dropdown_item} onClick={() => handleDateFilter('day')}>اليوم</button>
                                                <button className={styles.dropdown_item} onClick={() => handleDateFilter('week')}>اسبوع</button>
                                                <button className={styles.dropdown_item} onClick={() => handleDateFilter('month')}>شهر</button>
                                                <button className={styles.dropdown_item} onClick={() => handleDateFilter('custom')}>تطبيق</button>
                                                <button className={styles.dropdown_item} onClick={() => handleDateFilter('cancel')}>الغاء</button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Totals */}
                                <div className={styles.totals_section}>
                                    <div className={styles.total_item}>
                                        إجمالي المشتريات (المصفاة): <span>{formatCurrency(totalPurchases)}</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {selectedTransaction && (
                        <TransactionModalMer
                            transaction={selectedTransaction}
                            onClose={() => setSelectedTransaction(null)}
                        />
                    )}

                    {/* MODIFIED: Pass summaryData to YearlyChartsMer */}
                    {!loading && !error && transactionsInv.paymentsSummary?.length > 0 && (
                        <YearlyChartsMer summaryData={transactionsInv.paymentsSummary} />
                    )}
                </main>
            </div>
            <FooterMer />
        </div>
    );
};

export default MerchentPayment;