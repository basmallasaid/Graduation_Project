// src/components/Farmer/Payment/PaymentF.js
import React, { useEffect, useState, useCallback } from 'react';
import YearlyCharts from './YearlyCharts'; // Import the charts component
import TransactionModal from './TransactionModal';
import styles from "../../../Styles/style.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import NavbarF from '../Main/NavbarF';
import FooterF from '../Main/FooterF';
import NavSideF from '../Main/NavSideF';
import api from '../../../API/axiosInstance';

// Define mapping for transaction types between API (English) and UI (Arabic)
const transactionTypeMap = {
    'استثمار': 'Investment',
    'شراء': 'Purchase',
};
const reverseTransactionTypeMap = Object.fromEntries(
    Object.entries(transactionTypeMap).map(([key, value]) => [value, key])
);

const PaymentF = () => {
    // --- State Declarations ---
    // Initialize state to hold both payments and summary
    const [paymentData, setPaymentData] = useState({
        payments: [], // Renamed from paymentDetails to match sample response
        paymentsSummary: []
    });
    const [filteredTransactions, setFilteredTransactions] = useState([]); // Still based on paymentData.payments
    const [showTypeDropdown, setShowTypeDropdown] = useState(false);
    const [showDateDropdown, setShowDateDropdown] = useState(false);
    const [dateRange, setDateRange] = useState({ from: '', to: '' });
    const [activeTypeFilter, setActiveTypeFilter] = useState('all');
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- User Data ---
    let userId = null;
    try {
        const userDataString = localStorage.getItem("user_data");
        if (userDataString) {
            const userData = JSON.parse(userDataString);
            userId = userData?.userId;
        } else {
            console.warn("User data not found in localStorage.");
            setError("لم يتم العثور على بيانات المستخدم.");
        }
    } catch (e) {
        console.error("Error accessing localStorage or parsing user data:", e);
        setError("خطأ في الوصول إلى بيانات المستخدم.");
    }

    // --- Data Fetching ---
    useEffect(() => {
        if (!userId) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        api
            .get(`/Payments?Id=${userId}`)
            .then((res) => {
                 // Check if the expected structure is present
                if (res.data && Array.isArray(res.data.payments) && Array.isArray(res.data.paymentsSummary)) {
                     // Sort transactions by date descending
                    const sortedPayments = [...res.data.payments].sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate));
                    setPaymentData({
                        payments: sortedPayments,
                        paymentsSummary: res.data.paymentsSummary
                    });
                    setFilteredTransactions(sortedPayments); // Initialize filtered list
                } else {
                    console.error("Unexpected data format received from API:", res.data);
                    setError("تم استلام بيانات غير متوقعة من الخادم.");
                    setPaymentData({ payments: [], paymentsSummary: [] }); // Reset state
                    setFilteredTransactions([]);
                }
            })
            .catch((err) => {
                console.error("Error fetching payment data:", err);
                // More specific error message if possible (e.g., check err.response)
                setError(`فشل في تحميل بيانات الدفع: ${err.message || 'يرجى المحاولة مرة أخرى.'}`);
                setPaymentData({ payments: [], paymentsSummary: [] }); // Reset state
                setFilteredTransactions([]);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [userId]);

    // --- Filtering Logic ---
    const applyFilters = useCallback((typeFilter, dateFilterRange) => {
        // Filter based on the 'payments' array in the main state
        let filtered = [...paymentData.payments];

        // Apply type filter
        const apiType = transactionTypeMap[typeFilter];
        if (typeFilter !== 'all' && apiType) {
            filtered = filtered.filter(transaction => transaction.type === apiType);
        }

        // Apply date filter
        const { from, to } = dateFilterRange;
        if (from && to) {
            try {
                const fromDate = new Date(from);
                const toDate = new Date(to);
                fromDate.setHours(0, 0, 0, 0);
                toDate.setHours(23, 59, 59, 999);

                if (fromDate > toDate) {
                    console.error("Invalid date range: 'From' date cannot be after 'To' date.");
                    return; // Keep previous filter state on error
                }

                filtered = filtered.filter(transaction => {
                    const transDate = new Date(transaction.paymentDate);
                    return transDate >= fromDate && transDate <= toDate;
                });
            } catch (e) {
                console.error("Error parsing dates for filtering:", e);
            }
        } else if (from) {
             try {
                 const fromDate = new Date(from);
                 fromDate.setHours(0, 0, 0, 0);
                 filtered = filtered.filter(transaction => new Date(transaction.paymentDate) >= fromDate);
             } catch(e) { console.error("Error parsing 'from' date:", e);}
        } else if (to) {
             try {
                 const toDate = new Date(to);
                 toDate.setHours(23, 59, 59, 999);
                 filtered = filtered.filter(transaction => new Date(transaction.paymentDate) <= toDate);
             } catch(e) { console.error("Error parsing 'to' date:", e);}
        }

        setFilteredTransactions(filtered); // Update only the filtered list

    }, [paymentData.payments]); // Depend on the source payments array

    // --- Filter Event Handlers --- (Keep existing handlers: handleTypeFilter, handleDateFilter, handleDateRangeChange)
        const handleTypeFilter = (type) => {
        setActiveTypeFilter(type);
        applyFilters(type, dateRange);
        setShowTypeDropdown(false);
    };

    const handleDateFilter = (filterType) => {
        let newDateRange = { ...dateRange };
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        switch (filterType) {
            case 'day':
                const todayEnd = new Date();
                todayEnd.setHours(23, 59, 59, 999);
                newDateRange = {
                    from: today.toISOString().split('T')[0],
                    to: todayEnd.toISOString().split('T')[0]
                };
                break;
            case 'week':
                const weekAgo = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
                weekAgo.setHours(0, 0, 0, 0);
                const todayEndWeek = new Date();
                todayEndWeek.setHours(23, 59, 59, 999);
                newDateRange = {
                    from: weekAgo.toISOString().split('T')[0],
                    to: todayEndWeek.toISOString().split('T')[0]
                };
                break;
            case 'month':
                const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
                const todayEndMonth = new Date();
                todayEndMonth.setHours(23, 59, 59, 999);
                newDateRange = {
                    from: monthStart.toISOString().split('T')[0],
                    to: todayEndMonth.toISOString().split('T')[0]
                };
                break;
            case 'cancel':
                newDateRange = { from: '', to: '' };
                break;
            case 'custom':
                if (!dateRange.from || !dateRange.to) {
                    console.warn("Both 'from' and 'to' dates are required for custom range.");
                    setShowDateDropdown(false);
                    return;
                }
                if (new Date(dateRange.from) > new Date(dateRange.to)) {
                    console.error("Invalid date range: 'From' date cannot be after 'To' date.");
                    setShowDateDropdown(false);
                    return;
                }
                newDateRange = { ...dateRange };
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
    };

    // --- Totals Calculation --- (Based on *filtered* transactions)
    const { totalInvestment, totalPurchase } = React.useMemo(() => {
        const investmentTypeApi = transactionTypeMap['استثمار'];
        const purchaseTypeApi = transactionTypeMap['شراء'];

        const totalInvestment = filteredTransactions // Use filteredTransactions here
            .filter(transaction => transaction.type === investmentTypeApi)
            .reduce((sum, transaction) => sum + (transaction.amount || 0), 0);

        const totalPurchase = filteredTransactions // Use filteredTransactions here
            .filter(transaction => transaction.type === purchaseTypeApi)
            .reduce((sum, transaction) => sum + (transaction.amount || 0), 0);

        return { totalInvestment, totalPurchase };
    }, [filteredTransactions]); // Depend on filteredTransactions

    // --- Render Logic ---
    return (
        <div className="d-flex flex-column min-vh-100">
            <NavbarF />
            <div className="d-flex flex-grow-1 ">
                <NavSideF />
                <main className={` flex-grow-1  `}>
                    <div className={styles.table_section} >

                        {/* --- Filters Section --- */}
                        <div className={styles.filter_section}>
                            {/* Type Filter Dropdown */}
                            <div className={styles.filter_dropdown}>
                                <button
                                    className={styles.filter_button}
                                    onClick={() => {
                                        setShowTypeDropdown(!showTypeDropdown);
                                        setShowDateDropdown(false);
                                    }}
                                >
                                    <span>{activeTypeFilter === 'all' ? 'تصفية بنوع المعاملة' : activeTypeFilter}</span>
                                    <span className={styles.arrow_icon}>▼</span>
                                </button>
                                {showTypeDropdown && (
                                    <div className={styles.dropdown_menu}>
                                        <div className={styles.dropdown_item} onClick={() => handleTypeFilter("all")}>الكل</div>
                                        <div className={styles.dropdown_item} onClick={() => handleTypeFilter("استثمار")}>استثمار</div>
                                        <div className={styles.dropdown_item} onClick={() => handleTypeFilter('شراء')}>شراء</div>
                                    </div>
                                )}
                            </div>

                            {/* Date Filter Dropdown */}
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
                                    <div className={`${styles.dropdown_menu} ${styles.date_dropdown_menu}`} onClick={e => e.stopPropagation()}>
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
                                                            min={dateRange.from || undefined}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                              className={styles.apply_date_button}
                                              onClick={() => handleDateFilter('custom')}
                                             >
                                                تطبيق التواريخ المخصصة
                                            </button>
                                        </div>
                                        <div className={styles.dropdown_item} onClick={() => handleDateFilter('day')}>اليوم</div>
                                        <div className={styles.dropdown_item} onClick={() => handleDateFilter('week')}>اسبوع</div>
                                        <div className={styles.dropdown_item} onClick={() => handleDateFilter('month')}>شهر</div>
                                        <div className={`${styles.dropdown_item} ${styles.cancel_item}`} onClick={() => handleDateFilter('cancel')}>الغاء تصفية التاريخ</div>
                                    </div>
                                )}
                            </div>
                        </div>

                         {/* --- Loading & Error States --- */}
                        {isLoading && <div className={styles.loading_indicator}>جار التحميل...</div>}
                        {error && <div className={styles.error_message}>{error}</div>}

                        {/* --- Table & Totals (Render only when not loading and no error) --- */}
                        {!isLoading && !error && (
                            <>
                                {/* Table Container */}
                                <div className={`${styles.table_container} ${styles.tablePay}`} >
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
                                            {filteredTransactions?.length > 0 ? (
                                                filteredTransactions.map((transaction) => (
                                                    <tr
                                                        key={transaction.paymentId}
                                                        onClick={() => setSelectedTransaction(transaction)}
                                                        className={styles.clickable_row}
                                                    >
                                                        <td>{transaction.paymentId}</td>
                                                        <td>{new Date(transaction.paymentDate).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                                        <td>{transaction.amount?.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' }) ?? 'N/A'}</td>
                                                        <td>{reverseTransactionTypeMap[transaction.type] || transaction.type}</td>
                                                        <td>{transaction.payerName}</td>
                                                        <td>{transaction.payeeName}</td>
                                                        <td>{transaction.paymentMethod}</td>
                                                        <td>{transaction.status}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="8" style={{ textAlign: "center", padding: '20px' }}>
                                                        {/* Differentiate between no data and no matching filters */}
                                                        {paymentData.payments.length === 0 ? "لا توجد معاملات لعرضها." : "لا توجد معاملات تطابق معايير التصفية."}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Totals Section (Show only if there are transactions) */}
                                {paymentData.payments.length > 0 && (
                                    <div className={styles.totals_section}>
                                        <div className={styles.total_item}>
                                            إجمالي إيرادات الشراء (المصفاة): <span>{totalPurchase.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</span>
                                        </div>
                                        <div className={styles.total_item}>
                                             إجمالي إيرادات الاستثمار (المصفاة): <span>{totalInvestment.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</span>
                                        </div>
                                    </div>
                                )}
                            </>
                         )}

                        {/* --- Modal --- */}
                        {selectedTransaction && (
                            <TransactionModal
                                transaction={selectedTransaction}
                                onClose={() => setSelectedTransaction(null)}
                            />
                        )}

                    </div>{/* End table_section */}

                    {/* --- Yearly Charts (Render only when not loading, no error, and summary data exists) --- */}
                     {!isLoading && !error && paymentData.paymentsSummary && paymentData.paymentsSummary.length > 0 && (
                        <YearlyCharts summaryData={paymentData.paymentsSummary} />
                     )}

                </main>
            </div>
            <FooterF />
        </div>
    );
};

export default PaymentF;