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

const InverstorPayment = () => {
    // --- State Declarations (Keep EXACTLY as provided) ---
    const [transactionsInv, settransactionsInv] = useState({
        payments: [],
        paymentsSummary: [],
        // Add paymentDetails key to store the transformed data
        paymentDetails: [],
    });
    const [filteredtransactionsInv, setFilteredtransactionsInv] = useState({
        paymentDetails: [], // This is the key the rest of the code uses
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

    // --- useEffect Hook (MODIFIED to handle new API structure and adapt for existing code) ---
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
                // MODIFIED: Check based on the NEW SAMPLE API structure
                if (res.data && Array.isArray(res.data.payments) && Array.isArray(res.data.paymentsSummary)) {

                    // **ADAPTATION STEP**: Transform API 'payments' to include top-level 'CycleName'
                    // This makes the data compatible with the rest of the component (filters, table)
                    const transformedPaymentDetails = res.data.payments.map(payment => ({
                        ...payment, // Copy all original payment properties
                        // Add the CycleName property, handling null associatedCycle
                        CycleName: payment.associatedCycle?.cycleName ?? null // Use null or empty string if needed
                    }));

                    // Store the transformed data in the main state under the expected key
                    settransactionsInv({
                        payments: res.data.payments, // Store original API payments if needed elsewhere
                        paymentsSummary: res.data.paymentsSummary,
                        paymentDetails: transformedPaymentDetails // Store the adapted data
                    });

                    // Set the filtered state using the TRANSFORMED data under the 'paymentDetails' key
                    setFilteredtransactionsInv({
                        paymentDetails: transformedPaymentDetails,
                        paymentsSummary: res.data.paymentsSummary
                    });

                    // Extract unique cycles from the TRANSFORMED data's 'CycleName' property
                    const uniqueCycles = [...new Set(
                        transformedPaymentDetails
                            .map(transaction => transaction.CycleName) // Use the added CycleName
                            .filter(name => name != null && name !== '') // Filter out nulls/empties
                    )];
                    setCycles(uniqueCycles);

                    // Calculate initial total using the TRANSFORMED data and keep the original type filter 'استثمار'
                    const totalInvestmentValue = transformedPaymentDetails // Use transformed data
                        .filter(transaction => transaction.type === 'استثمار') // Keep original filter string 'استثمار'
                        .reduce((sum, transaction) => sum + (transaction.amount || 0), 0);
                    setTotalInvestment(totalInvestmentValue);

                } else {
                    // Keep original error handling for unexpected format
                    console.error("Unexpected data format:", res.data);
                    setError("تنسيق البيانات المستلمة من الخادم غير متوقع.");
                    // Reset state consistently
                    settransactionsInv({ payments: [], paymentsSummary: [], paymentDetails: [] });
                    setFilteredtransactionsInv({ paymentDetails: [], paymentsSummary: [] });
                }
            })
            .catch((err) => {
                // Keep original error handling for fetch errors
                console.error("Error fetching data:", err);
                setError(`حدث خطأ أثناء جلب البيانات: ${err.message || ''}`);
                 // Reset state consistently
                 settransactionsInv({ payments: [], paymentsSummary: [], paymentDetails: [] });
                 setFilteredtransactionsInv({ paymentDetails: [], paymentsSummary: [] });
            })
            .finally(() => {
                // Keep original finally block
                setLoading(false);
            });
    // Keep original empty dependency array []
    }, []);


    // --- Other Functions (Keep EXACTLY as provided in the previous full version) ---

    const applyFilters = (type, dateRange, minPrice, maxPrice, cycle) => {
        // This function reads from transactionsInv.paymentDetails
        // It should now work correctly because useEffect populated this key
        // with the transformed data (including CycleName).
        let filtered = transactionsInv.paymentDetails || []; // Read from the correct state key

        // Filter logic remains exactly as provided by the user previously
        // (Including potential mismatches like type filter and CycleName access)
        if (type !== 'الغاء' && type !== 'all') {
            filtered = filtered.filter(transaction => transaction.type === type);
        }
        if (cycle !== 'all' && cycle) {
            // This filter now works because 'CycleName' was added in useEffect
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

        // Update the filtered state object using the key 'paymentDetails'
        setFilteredtransactionsInv(prevState => ({
             ...prevState,
             paymentDetails: filtered
            }));
        // Calculate totals based on this newly filtered list
        calculateTotals(filtered);
    };

    const resetFilters = () => {
        setActiveTypeFilter('all');
        setActiveCycleFilter('all');
        setDateRange({ from: '', to: '' });
        // Reset price state based on original function (using 0)
        // Changed to undefined to match initial state better for placeholders
        setMinPrice(undefined);
        setMaxPrice(undefined);
        // Reset filtered data using the transformed data from main state
        setFilteredtransactionsInv({
            paymentDetails: transactionsInv.paymentDetails || [], // Use original *transformed* paymentDetails
            paymentsSummary: transactionsInv.paymentsSummary || []
        });
        // Recalculate totals based on the original *transformed* full list
        calculateTotals(transactionsInv.paymentDetails || []);
        // Close dropdowns
        setShowDateDropdown(false);
        setShowPriceDropdown(false);
        setShowTypeDropdown(false);
    };

    const handleCycleFilter = (cycle) => {
        setActiveCycleFilter(cycle);
        // Directly calls applyFilters (as provided)
        applyFilters(activeTypeFilter, dateRange, minPrice, maxPrice, cycle);
    };

    const handleDateRangeChange = (field, value) => {
        const newDateRange = { ...dateRange, [field]: value };
        setDateRange(newDateRange);
        // Directly calls applyFilters if both dates set (as provided)
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
                     // Maybe reset dateRange here? Keeping original behavior implicitly doing nothing
                }
                 // No dateRange update needed, applyFilters below uses current state
                break;
            default:
                newDateRange = { from: '', to: '' };
        }

        // Update state only if not 'custom' case
        if (filterType !== 'custom') {
             setDateRange(newDateRange);
        }

        // Directly calls applyFilters (as provided) using the relevant date range
        applyFilters(activeTypeFilter, filterType === 'custom' ? dateRange : newDateRange, minPrice, maxPrice, activeCycleFilter);
        setShowDateDropdown(false); // Close dropdown
    };

    const calculateTotals = (filteredData) => {
        // This function still uses the Arabic 'استثمار' as provided
        const dataToProcess = Array.isArray(filteredData) ? filteredData : [];
        const totalInvestmentValue = dataToProcess
            .filter(transaction => transaction.type === 'استثمار') // Uses 'استثمار'
            .reduce((sum, transaction) => sum + (transaction.amount || 0), 0);

        setTotalInvestment(totalInvestmentValue);
    };

    // --- Helper to format currency --- (Keep as provided)
    const formatCurrency = (amount) => {
        const number = Number(amount);
        if (isNaN(number)) return amount;
        return number.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' });
    };

    // --- Render Logic (Keep EXACTLY as provided in the previous full version) ---
    return (
        <div className="d-flex flex-column min-vh-100">
            <NavbarInv />
            <div className="d-flex flex-grow-1 ">
                <NavSideInv />
                <main className={` flex-grow-1  `}>
                    <div className={styles.table_section} >
                        {loading && <div className={stylesInv.loading_message || ''}>جاري تحميل البيانات...</div>}
                        {error && <div className={stylesInv.error_message || ''} style={{ color: 'red' }}>{error}</div>}

                        {!loading && !error && (
                        <>
                           
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
                                        {/* Map from filteredtransactionsInv.paymentDetails */}
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
                                                    <td>{transaction.type}</td> {/* Display raw API type */}
                                                     {/* Display the transformed CycleName property */}
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
                                    <button
                                        className={`${styles.filter_button} ${stylesInv.parentfilter} `}
                                        onClick={() => { setShowDateDropdown(!showDateDropdown); setShowTypeDropdown(false); setShowPriceDropdown(false); }}
                                        aria-label="Filter by return type"
                                    >
                                        <span>تصفية بنوع العائد</span>
                                        <span className={styles.calendar_icon}>📅</span>
                                    </button>
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
                                // Pass the selected transaction *after* transformation if modal needs CycleName
                                // Or pass the original payment object if modal can handle associatedCycle
                                transaction={selectedTransaction} // Assumes modal can handle the object structure
                                onClose={() => setSelectedTransaction(null)}
                            />
                        )}

                    </div> {/* End table_section */}

                    {/* Yearly Charts */}
                     {!loading && !error && transactionsInv.paymentsSummary?.length > 0 && (
                        // Pass the original summary data from main state
                        <YearlyChartsInv summaryData={transactionsInv.paymentsSummary}/>
                     )}
                </main>
            </div>
            <FooterInv />
        </div>
    );
};

export default InverstorPayment;