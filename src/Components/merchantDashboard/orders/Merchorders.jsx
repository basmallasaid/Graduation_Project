import React, { useState, useEffect } from 'react';
import NavbarMer from '../Main/NavbarMer';
import NavSideMer from '../Main/NavSideMer';
import FooterMer from '../Main/FooterMer';
import styles from "../../.././Styles/style.module.css";
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import api from '../../../API/axiosInstance';

const Merchorders = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [harvestNames, setHarvestNames] = useState([]); // For Harvest Name Filter
    const [searchTerm, setSearchTerm] = useState('');
     const [loading, setLoading] = useState(true); // Added loading state for initial fetch

    const userData = JSON.parse(localStorage.getItem("user_data"));
    const merchantId = userData?.loggedId;

    useEffect(() => {
        const fetchOrders = async () => {
            if (!merchantId) {
                console.error("Merchant ID is missing.");
                Swal.fire({
                    icon: 'error',
                    title: 'خطأ في المصادقة!',
                    text: 'لم يتم العثور على معرف التاجر. يرجى تسجيل الدخول مرة أخرى.',
                    allowOutsideClick: false,
                    showConfirmButton: true
                });
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const response = await api.get(`PurchaseRequest/GetAllRequestsForMerchant/${merchantId}`);
                const data = response.data;
                console.log(data);
                setOrders(data);
                setFilteredOrders(data);

                const uniqueHarvestNames = [...new Set(data.map(order => order.harvestName).filter(Boolean))];
                setHarvestNames(uniqueHarvestNames);

            } catch (error) {
                console.error("Could not fetch orders:", error.response || error.message);
                const errorMessage = error.response?.data?.message || 'فشل تحميل الطلبات. حاول مرة أخرى لاحقًا.';
                Swal.fire({
                    icon: 'error',
                    title: 'خطأ!',
                    text: errorMessage,
                    allowOutsideClick: false,
                    showConfirmButton: true
                });
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [merchantId]);

    useEffect(() => {
        const handleSearch = () => {
            if (!searchTerm) {
                setFilteredOrders(orders);
                return;
            }

            const filtered = orders.filter(order => {
                const searchTermLower = searchTerm.toLowerCase();

                return (
                    String(order.purchaseRequestId).includes(searchTerm) ||
                    order.farmerName.toLowerCase().includes(searchTermLower) ||
                    order.harvestName.toLowerCase().includes(searchTermLower) ||
                    String(order.requestedAmount).includes(searchTerm) ||
                    String(order.requestedPrice).includes(searchTerm) ||
                    order.requestStatus.toLowerCase().includes(searchTermLower)
                );
            });
            setFilteredOrders(filtered);
        };
        handleSearch();
    }, [searchTerm, orders]);


    const statusStyle = (status) => {
        switch (status) {
            case "قيد_الانتظار":
                return { backgroundColor: "#EEC044", color: "black" };
            case "مقبول":
                return { backgroundColor: "green", color: "white" };
            case "مرفوض":
            case "مكتمله":
                return { backgroundColor: "red", color: "white" };
            default:
                return { backgroundColor: "gray", color: "white" };
        }
    };

   const handleDeleteOrder = async (purchaseRequestId, event) => {
    event.preventDefault();
    event.stopPropagation();

    const result = await Swal.fire({
        title: 'هل أنت متأكد؟',
        text: 'هل تريد حقا إلغاء هذا الطلب؟',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'نعم ، الغي الطلب!',
        cancelButtonText: 'لا ، ابقى الطلب',
        allowOutsideClick: false,
        showConfirmButton: true,
        focusConfirm: false
    });

    if (result.isConfirmed) {
        try {
            await api.delete(`PurchaseRequest/${purchaseRequestId}`);

            setOrders(prevOrders => prevOrders.filter(order => order.purchaseRequestId !== purchaseRequestId));
            setFilteredOrders(prevOrders => prevOrders.filter(order => order.purchaseRequestId !== purchaseRequestId));

            await Swal.fire({
                title: 'تم الحذف!',
                text: 'تم إلغاء الطلب بنجاح.',
                icon: 'success',
                allowOutsideClick: false,
                focusConfirm: false
            });
        } catch (error) {
            console.error("Could not delete order:", error);
            const errorMsg = error.response?.data?.message || 'حدث خطأ أثناء إلغاء الطلب.';
            await Swal.fire({
                title: 'خطأ!',
                text: errorMsg,
                icon: 'error',
                allowOutsideClick: false,
                focusConfirm: false
            });
        }
    }
};


    const filterByHarvestName = (harvestName) => {
        if (harvestName === 'الكل') {
            setFilteredOrders(orders);
        } else {
            const filtered = orders.filter(order => order.harvestName === harvestName);
            setFilteredOrders(filtered);
        }
    };

    const filterByStatus = (status) => {
        if (status === 'الكل') {
            setFilteredOrders(orders);
        } else {
            const filtered = orders.filter(order => order.requestStatus === status);
            setFilteredOrders(filtered);
        }
    };

    const filterByDate = (order) => {
        const sorted = [...filteredOrders].sort((a, b) => {
            const dateA = new Date(a.requestDate);
            const dateB = new Date(b.requestDate);
            return order === "الاحدث" ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
        });
        setFilteredOrders(sorted);
    };

    const filterByAmount = (order) => {
        const sorted = [...filteredOrders].sort((a, b) => order === "اعلي مبلغ" ? b.requestedAmount - a.requestedAmount : a.requestedAmount - b.requestedAmount);
        setFilteredOrders(sorted);
    };


    return (
        <div className="d-flex flex-column min-vh-100">
            <NavbarMer />
            <div className="d-flex flex-grow-1">
                <NavSideMer />
                <main className={`flex-grow-1 ${styles.hid}`}>

                    {/* Container for Search Bar and Filter Buttons */}
                    <div
                        style={{
                            marginTop: '20px',
                            marginBottom: '20px',
                            width: '80%',
                            maxWidth: '800px',
                            padding: '0 10px',
                            marginRight:"30px"
                        }}
                    >
                        {/* Search Bar */}
                        <div
                            className="search-bar"
                            style={{
                                width: '300px',
                                flexShrink: 0,
                                display:"flex",
                                justifyContent:"start"

                            }}
                        >
                            <div
                                className="input-group"
                                style={{
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    backgroundColor: '#D3D3D3',
                                    border: '1px solid #D3D3D3',
                                }}
                            >
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="ابحث..."
                                    style={{
                                        textAlign: 'right',
                                        border: 'none',
                                        backgroundColor: 'transparent',
                                        boxShadow: 'none',
                                    }}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    style={{
                                        backgroundColor: '#D3D3D3',
                                        border: 'none',
                                        padding: '0.375rem 0.75rem',
                                        cursor: 'pointer',
                                        color: 'black',
                                    }}
                                >
                                    <i className="fa fa-search"></i>
                                </button>
                            </div>
                        </div>
                    </div>
<div style={{display:"flex",justifyContent:"end",marginLeft:"80px"}}>
                    {/* Filter Buttons */}
                    <div className="d-flex flex-wrap justify-content-end mt-2" style={{ maxWidth: "800px", gap: "25px" }}>
                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false"
                                style={{ padding: "5px 10px", backgroundColor: "#4DB9B5", color: "black" }}
                            >
                                تصفيه باسم المحصول
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li><a className="dropdown-item" href="#" onClick={() => filterByHarvestName('الكل')}>الكل</a></li>
                                {harvestNames.map(name => (
                                    <li key={name}><a className="dropdown-item" href="#" onClick={() => filterByHarvestName(name)}>{name}</a></li>
                                ))}
                            </ul>
                        </div>

                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false"
                                style={{ padding: "5px 15px", backgroundColor: "#4DB9B5", color: "black" }}
                            >
                                تصفيه حسب المبلغ
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li><Link className="dropdown-item" onClick={() => filterByAmount("اعلي مبلغ")} to="#">اعلي مبلغ</Link></li>
                                <li><Link className="dropdown-item" onClick={() => filterByAmount("اقل مبلغ")} to="#">اقل مبلغ  </Link></li>
                            </ul>
                        </div>
                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false"
                                style={{ padding: "5px 15px", backgroundColor: "#4DB9B5", color: "black" }}
                            >
                                تصفيه حسب الطلب
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li><Link className="dropdown-item" onClick={() => filterByStatus("قيد_الانتظار")} to="#">قيد_الانتظار</Link></li>
                                <li><Link className="dropdown-item" onClick={() => filterByStatus("مقبول")} to="#">مقبوله</Link></li>
                                <li><Link className="dropdown-item" onClick={() => filterByStatus("مرفوض")} to="#">مرفوضه</Link></li>
                            </ul>
                        </div>
                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false"
                                style={{ padding: "5px 10px", backgroundColor: "#4DB9B5", color: "black" }}
                            >
                                تصفيه حسب التاريخ
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li><Link className="dropdown-item" onClick={() => filterByDate("الاقدم")} to="#">الاقدم</Link></li>
                                <li><Link className="dropdown-item" onClick={() => filterByDate("الاحدث")} to="#">الاحدث</Link></li>
                            </ul>
                        </div>

                    </div>
                    </div>
                    {/* Orders List */}
                    <div className="d-flex flex-column align-items-center" style={{ width: '100%' }}>
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => (
                                <form
                                    key={order.purchaseRequestId}
                                    className="p-4 rounded mb-4"
                                    style={{
                                        boxShadow:
                                            "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
                                        fontSize: "1.3rem",
                                        width: "80%",
                                        maxWidth: "700px",
                                        backgroundColor: "#fff",
                                        marginTop: "30px",
                                        marginBottom: "30px",
                                        backgroundImage: "url('/assets/orderbackground.jpeg')",
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }}
                                >

                                    <div className="row justify-content-center mb-3 w-100">
                                        <div className="col-12">
                                            {[
                                                { label: "رقم الطلب", value: order.purchaseRequestId },
                                                { label: "اسم المحصول", value: order.harvestName },
                                                { label: "تاريخ تقديم الطلب", value: new Date(order.requestDate).toLocaleDateString() },
                                                { label: " المبلغ المطلوب للشراء", value: order.requestedAmount },
                                                { label: " السعر المطلوب", value: order.requestedPrice },
                                            ].map((item, index) => (
                                                <div key={index} className="mb-3 d-flex align-items-center"
                                                     style={{ justifyContent: "space-around" }}>
                                                    <label className="form-label" style={{ width: '30%', marginRight: "50px" }}>{item.label}</label>
                                                    <input
                                                        readOnly
                                                        value={item.value}
                                                        className="form-control"
                                                        style={{ backgroundColor: "#cacac6", maxWidth: '260px', textAlign: "center" }}
                                                    />
                                                </div>
                                            ))}
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around" }}>
                                                <label>حاله الطلب </label>
                                                <button
                                                    style={{
                                                        width: "150px",
                                                        padding: "2px 20px",
                                                        border: "none",
                                                        borderRadius: "7px",
                                                        ...statusStyle(order.requestStatus)
                                                    }}
                                                >
                                                    {order.requestStatus}
                                                </button>
                                                
                                                {/* --- MODIFICATION START --- */}
                                                {/* Conditionally render the "View Details" link only if status is 'مقبول' */}
                                                {order.requestStatus === "مقبول" && (
                                                     <Link
                                                        style={{
                                                            border: "none",
                                                            borderRadius: "10px",
                                                            backgroundColor: "black",
                                                            color: "#fff",
                                                            padding: "5px 30px",
                                                            textDecoration: "none",
                                                            marginRight:"5px"
                                                        }}
                                                        // Correctly pass the harvestId from the order object
                                                        to={`/Seedetailsmerch/${order.harvestId}`} 
                                                    >
                                                        عرض التفاصيل
                                                    </Link>
                                                )}
                                                {/* --- MODIFICATION END --- */}
                                            </div>

                                            <div className="align-items-center" style={{ display: "flex", gap: "10px", marginTop: "30px" }}>
                                            <label style={{ marginRight: "30px" }}>اسم المزارع المسئول عن الدوره</label>
                                            <input
                                                readOnly
                                                value={ order.farmerName}
                                                className="form-control"
                                                style={{ backgroundColor: "#cacac6", maxWidth: '270px', textAlign: "center" }}
                                            />
                                        </div>
                                            {order.requestStatus === "قيد_الانتظار" && (
                                                <div className="d-flex " style={{ marginTop: "10px", justifyContent: "end" }}>
                                                    <button
                                                        className={styles.InvButtsubscribe}
                                                        onClick={(event) => handleDeleteOrder(order.purchaseRequestId, event)}
                                                    >
                                                        الغاء الطلب
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </form>
                            ))
                        ) : (
                            // Show a more informative message while loading or if no orders are found
                            loading ? <p>جاري تحميل الطلبات...</p> : <p>لم يتم العثور على طلبات.</p>
                        )}
                    </div>
                </main>
            </div>
            <FooterMer />
        </div>
    );
};

export default Merchorders;