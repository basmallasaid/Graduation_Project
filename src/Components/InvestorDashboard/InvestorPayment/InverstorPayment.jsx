import React, { useEffect, useState } from 'react';
import YearlyChartsInv from './YearlyChartsInv';
import FooterInv from '../Main/FooterInv';
import TransactionModalInv from './TransactionModalInv';
import NavSideInv from '../Main/NavSideInv';
import NavbarInv from '../Main/NavbarInv';
import styles from "../../../Styles/style.module.css";
import stylesInv from "../StylesInv/stylesInv.module.css";
import axios from 'axios';
import api from '../../../API/axiosInstance';

// --- دالة مساعد لترجمة أنواع المعاملات ---
const translateType = (type) => {
    const translations = {
        'Investment': 'استثمار',
        'Profit': 'أرباح',
        'Withdrawal': 'سحب',
        'Capital Return': 'إرجاع رأس مال',
        // أضف أي ترجمات أخرى محتملة هنا
    };
    // إذا لم يتم العثور على ترجمة، قم بإرجاع النوع الأصلي
    return translations[type] || type;
};

const InverstorPayment = () => {
    // --- State Declarations (Keep EXACTLY as provided) ---
    const [transactionsInv, settransactionsInv] = useState({
        payments: [],
        paymentsSummary: [],
        paymentDetails: [],
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
    const [minPrice, setMinPrice] = useState();
    const [maxPrice, setMaxPrice] = useState();
    const [showPriceDropdown, setShowPriceDropdown] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cycles, setCycles] = useState([]);
    const [totalInvestment, setTotalInvestment] = useState(0);

    // --- User Data Extraction (Keep EXACTLY as provided) ---
    const userData = JSON.parse(localStorage.getItem("user_data"));
    const userId = userData?.userId;

    // --- useEffect Hook (MODIFIED to handle new API structure and translate the 'type' property) ---
    useEffect(() => {
        if (!userId) {
            setError("معرف المستخدم غير متوفر.");
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        api
        .get(`Payments/GetInvestorPayments?Id=${userId}`)
            .then((res) => {
                if (res.data && Array.isArray(res.data.payments) && Array.isArray(res.data.paymentsSummary)) {

                    // **ADAPTATION & TRANSLATION STEP**: Transform API 'payments'
                    // This makes the data compatible with the rest of the component
                    const transformedPaymentDetails = res.data.payments.map(payment => ({
                        ...payment, // نسخ جميع خصائص الدفع الأصلية
                        type: translateType(payment.type), // **MODIFIED**: ترجمة نوع المعاملة إلى العربية
                        CycleName: payment.associatedCycle?.cycleName ?? null // إضافة اسم الدورة
                    }));

                    // تخزين البيانات المحولة في الحالة الرئيسية تحت المفتاح المتوقع
                    settransactionsInv({
                        payments: res.data.payments, // تخزين البيانات الأصلية إذا لزم الأمر
                        paymentsSummary: res.data.paymentsSummary,
                        paymentDetails: transformedPaymentDetails // تخزين البيانات المعدلة
                    });

                    // تعيين الحالة المصفاة باستخدام البيانات المحولة
                    setFilteredtransactionsInv({
                        paymentDetails: transformedPaymentDetails,
                        paymentsSummary: res.data.paymentsSummary
                    });

                    // استخراج الدورات الفريدة من البيانات المحولة
                    const uniqueCycles = [...new Set(
                        transformedPaymentDetails
                            .map(transaction => transaction.CycleName)
                            .filter(name => name != null && name !== '')
                    )];
                    setCycles(uniqueCycles);

                    // حساب الإجمالي الأولي باستخدام البيانات المحولة. الآن سيعمل فلتر 'استثمار' بشكل صحيح
                    const totalInvestmentValue = transformedPaymentDetails
                        .filter(transaction => transaction.type === 'استثمار') // هذا الفلتر يعتمد على النوع المترجم
                        .reduce((sum, transaction) => sum + (transaction.amount || 0), 0);
                    setTotalInvestment(totalInvestmentValue);

                } else {
                    console.error("Unexpected data format:", res.data);
                    setError("تنسيق البيانات المستلمة من الخادم غير متوقع.");
                    settransactionsInv({ payments: [], paymentsSummary: [], paymentDetails: [] });
                    setFilteredtransactionsInv({ paymentDetails: [], paymentsSummary: [] });
                }
            })
            .catch((err) => {
                console.error("Error fetching data:", err);
                setError(`حدث خطأ أثناء جلب البيانات: ${err.message || ''}`);
                 settransactionsInv({ payments: [], paymentsSummary: [], paymentDetails: [] });
                 setFilteredtransactionsInv({ paymentDetails: [], paymentsSummary: [] });
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);


    // --- Other Functions (Keep EXACTLY as provided in the previous full version) ---

    const applyFilters = (type, dateRange, minPrice, maxPrice, cycle) => {
        // This function reads from transactionsInv.paymentDetails
        // It should now work correctly because useEffect populated this key
        // with the transformed and translated data.
        let filtered = transactionsInv.paymentDetails || [];

        // Filter logic remains exactly as provided
        // The type filter will now correctly match the Arabic types.
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
            try {
                const fromDate = new Date(dateRange.from);
                const toDate = new Date(dateRange.to);
                 fromDate.setHours(0, 0, 0, 0);
                 toDate.setHours(23, 59, 59, 999);
                 filtered = filtered.filter(transaction => {
                     const transDate = new Date(transaction.paymentDate);
                     return !isNaN(transDate) && transDate >= fromDate && transDate <= toDate;
                 });
            } catch(e) { console.error("Error parsing dates", e); }
        }
        const effectiveMin = minPrice === undefined || minPrice === '' || isNaN(Number(minPrice)) ? 0 : Number(minPrice);
        const effectiveMax = maxPrice === undefined || maxPrice === '' || isNaN(Number(maxPrice)) ? Infinity : Number(maxPrice);
        filtered = filtered.filter(transaction =>
             (transaction.amount ?? 0) >= effectiveMin &&
             (transaction.amount ?? 0) <= effectiveMax
        );

        setFilteredtransactionsInv(prevState => ({
             ...prevState,
             paymentDetails: filtered
            }));
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
            if (new Date(newDateRange.to) < new Date(newDateRange.from)) {
                 console.warn("Invalid date range selected.");
            } else {
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
                if (!dateRange.from || !dateRange.to) {
                     console.warn("Apply custom clicked without setting both dates.");
                }
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
        // This function correctly filters by the translated Arabic 'استثمار'
        const dataToProcess = Array.isArray(filteredData) ? filteredData : [];
        const totalInvestmentValue = dataToProcess
            .filter(transaction => transaction.type === 'استثمار')
            .reduce((sum, transaction) => sum + (transaction.amount || 0), 0);

        setTotalInvestment(totalInvestmentValue);
    };

    const formatCurrency = (amount) => {
        const number = Number(amount);
        if (isNaN(number)) return amount;
        return number.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' });
    };

    // --- Render Logic (Keep EXACTLY as provided) ---
    return (
        <div className="d-flex flex-column min-vh-100">
            <NavbarInv />
            <div className="d-flex flex-grow-1 ">
                <NavSideInv />
                <main className={` flex-grow-1 ${styles.hid} `}>
                    <div className={` ${stylesInv.tabsec} `}>
                        {loading && <div className={stylesInv.loading_message || ''}>جاري تحميل البيانات...</div>}
                        {error && <div className={stylesInv.error_message || ''} style={{ color: 'red' }}>{error}</div>}

                        {!loading && !error && (
                        <>
                           {/* Filters Section (Structure kept exactly as provided) */}
                            <div className={styles.filter_section}>
                                <div className={`${styles.filter_dropdown} ${stylesInv.cycle_price_filter_container}`}>
                                    <select
                                        value={activeCycleFilter}
                                        onChange={(e) => handleCycleFilter(e.target.value)}
                                        className={`${styles.filter_button} ${stylesInv.parentfilter} ${stylesInv.cycle_select}`}
                                        aria-label="Filter by cycle"
                                    >
                                        <option value="all">كل الدورات</option>
                                        {cycles.map((cycle, index) => (
                                            <option key={index} value={cycle}>{cycle}</option>
                                        ))}
                                    </select>
                                    <div className={styles.filter_dropdown}>
                                        <button
                                            className={`${styles.filter_button} ${stylesInv.price_button}`}
                                            onClick={() => setShowPriceDropdown(!showPriceDropdown)}
                                            aria-expanded={showPriceDropdown}
                                            aria-label="Filter by price"
                                        >
                                            <span>تصفية بالسعر</span>
                                            <span className={styles.arrow_icon}>▼</span>
                                        </button>
                                        {showPriceDropdown && (
                                            <div className={`${styles.dropdown_menu} ${stylesInv.price_dropdown_menu}`} onClick={e => e.stopPropagation()}>
                                                <div className={stylesInv.down}>
                                                    <label htmlFor='minPriceInvLabel'>الحد الأدنى:</label>
                                                    <input id='minPriceInvLabel' className={styles.dropdown_item} type="number" placeholder="0" value={minPrice === undefined ? '' : minPrice} onChange={(e) => setMinPrice(e.target.value === '' ? undefined : Number(e.target.value))} />
                                                </div>
                                                <div className={stylesInv.down}>
                                                    <label htmlFor='maxPriceInvLabel'>الحد الأقصى:</label>
                                                    <input id='maxPriceInvLabel' className={styles.dropdown_item} type="number" placeholder="غير محدود" value={maxPrice === undefined ? '' : maxPrice} onChange={(e) => setMaxPrice(e.target.value === '' ? undefined : Number(e.target.value))} />
                                                </div>
                                                <div className={`${styles.dropdown_item} ${stylesInv.down} ${stylesInv.apply_button}`} onClick={() => {
                                                    setShowPriceDropdown(false);
                                                    applyFilters(activeTypeFilter, dateRange, minPrice, maxPrice, activeCycleFilter);
                                                }}>تطبيق</div>
                                                <div className={`${styles.dropdown_item} ${stylesInv.down} ${stylesInv.cancel_button}`} onClick={resetFilters}>إلغاء</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.filter_dropdown}>
                                    {/* <button
                                        className={`${styles.filter_button} ${stylesInv.parentfilter} `}
                                        onClick={() => { setShowDateDropdown(!showDateDropdown); setShowTypeDropdown(false); setShowPriceDropdown(false); }}
                                        aria-label="Filter by return type"
                                    >
                                        <span>تصفية بنوع العائد</span>
                                        <span className={styles.calendar_icon}>📅</span>
                                    </button> */}
                                    <button
                                        className={styles.filter_button}
                                        onClick={() => { setShowDateDropdown(!showDateDropdown); setShowTypeDropdown(false); setShowPriceDropdown(false); }}
                                        aria-label="Filter by date"
                                        aria-expanded={showDateDropdown}
                                    >
                                        <span>تصفية بالتاريخ</span>
                                        <span className={styles.calendar_icon}>📅</span>
                                    </button>
                                    {showDateDropdown && (
                                        <div className={`${styles.dropdown_menu} ${stylesInv.date_dropdown_menu}`} onClick={e => e.stopPropagation()}>
                                            <div className={styles.date_range_container}>
                                                <div className={styles.date_range_row}>
                                                    <div className={styles.date_field}>
                                                        <label htmlFor='dateFromInvLabel' className={styles.date_label}>من</label>
                                                        <input id='dateFromInvLabel' type="date" value={dateRange.from} onChange={(e) => handleDateRangeChange('from', e.target.value)} className={styles.date_input} />
                                                    </div>
                                                    <div className={styles.date_field}>
                                                        <label htmlFor='dateToInvLabel' className={styles.date_label}>الى</label>
                                                        <input id='dateToInvLabel' type="date" value={dateRange.to} onChange={(e) => handleDateRangeChange('to', e.target.value)} className={styles.date_input} min={dateRange.from || undefined}/>
                                                    </div>
                                                </div>
                                            </div>
                                            <button className={styles.dropdown_item} onClick={() => handleDateFilter('day')}>اليوم</button>
                                            <button className={styles.dropdown_item} onClick={() => handleDateFilter('week')}>اسبوع</button>
                                            <button className={styles.dropdown_item} onClick={() => handleDateFilter('month')}>شهر</button>
                                            <button className={styles.dropdown_item} onClick={() => handleDateFilter('custom')}>تطبيق</button>
                                            <button className={`${styles.dropdown_item} ${stylesInv.cancel_item}`} onClick={() => handleDateFilter('cancel')}>الغاء</button>
                                        </div>
                                    )}
                                </div>
                            </div>
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
                                                    {/* الآن سيتم عرض النوع المترجم باللغة العربية */}
                                                    <td>{transaction.type}</td>
                                                    <td>{transaction.CycleName ?? 'N/A'}</td>
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
                             


                             {/* Totals */}
                             <div className={styles.totals_section}>
                                <div className={styles.total_item}>
                                    إجمالي الاستثمارات (المصفاة): <span>{formatCurrency(totalInvestment)}</span>
                                </div>
                            </div>
                        </>
                        )} {/* End !loading && !error */}

                        {/* Modal */}
                        {selectedTransaction && (
                            <TransactionModalInv
                                transaction={selectedTransaction}
                                onClose={() => setSelectedTransaction(null)}
                            />
                        )}

                    </div> {/* End table_section */}

                    {/* Yearly Charts */}
                     {!loading && !error && transactionsInv.paymentsSummary?.length > 0 && (
                        <YearlyChartsInv summaryData={transactionsInv.paymentsSummary}/>
                     )}
                </main>
            </div>
            <FooterInv />
        </div>
    );
};

export default InverstorPayment;