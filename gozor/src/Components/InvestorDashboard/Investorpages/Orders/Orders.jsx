import React, { useState, useEffect } from 'react';
import NavbarInv from '../../Main/NavbarInv';
import NavSideInv from '../../Main/NavSideInv';
import FooterInv from '../../Main/FooterInv';
import styles from "../../../../Styles/style.module.css";
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import api from '../../../../API/axiosInstance';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [cycleNames, setCycleNames] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
        const userData = JSON.parse(localStorage.getItem("user_data"));

  console.log("User Data (from localStorage):", userData); 
const InvestorId = userData?.loggedId;
  useEffect(() => {
    const fetchOrders = async () => {
        try {
            const response = await api.get(`InvestmentRequest/GetAllForInvestor/${InvestorId}`);
            const data = response.data;
            setOrders(data);
            setFilteredOrders(data);
            const uniqueCycleNames = [...new Set(data.map(order => order.cycleName))];
            setCycleNames(uniqueCycleNames);
        } catch (error) {
            console.error("Could not fetch orders:", error);
            Swal.fire({
                icon: 'error',
                title: 'خطأ!',
                text: 'فشل تحميل الطلبات. حاول مرة أخرى لاحقًا.',
                allowOutsideClick: false,
                showConfirmButton: true
            });
        }
    };

    if (InvestorId) {
        fetchOrders();
    }
}, [InvestorId]);


    useEffect(() => {
        const handleSearch = () => {
            if (!searchTerm) {
                setFilteredOrders(orders);
                return;
            }

            const filtered = orders.filter(order => {
                return (
                    String(order.investmentRequestId).includes(searchTerm) ||
                    order.cycleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    String(order.cycleId).includes(searchTerm) ||
                    order.farmerName.toLowerCase().includes(searchTerm.toLowerCase())
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
            case "نشطه":
                return { backgroundColor: "green", color: "white" };
            case "مرفوض":
            case "مكتمله":
                return { backgroundColor: "red", color: "white" };
            default:
                return { backgroundColor: "gray", color: "white" };
        }
    };

   const handleDeleteOrder = async (investmentRequestId, event) => {
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
        focusConfirm: false
    });

    if (result.isConfirmed) {
        try {
            await api.delete(`InvestmentRequest/${investmentRequestId}`);

            setOrders(prevOrders => prevOrders.filter(order => order.investmentRequestId !== investmentRequestId));
            setFilteredOrders(prevOrders => prevOrders.filter(order => order.investmentRequestId !== investmentRequestId));

            await Swal.fire({
                title: 'تم الحذف!',
                text: 'تم إلغاء الطلب بنجاح.',
                icon: 'success',
                allowOutsideClick: false,
                focusConfirm: false
            });
        } catch (error) {
            console.error("Could not delete order:", error);
            await Swal.fire({
                title: 'خطأ!',
                text: 'حدث خطأ أثناء إلغاء الطلب.',
                icon: 'error',
                allowOutsideClick: false,
                focusConfirm: false
            });
        }
    }
};


    const filterByCycleName = (cycleName) => {
        if (cycleName === 'الكل') {
            setFilteredOrders(orders);
        } else {
            const filtered = orders.filter(order => order.cycleName === cycleName);
            setFilteredOrders(filtered);
        }
    };

    const filterByAmount = (order) => {
        const sorted = [...filteredOrders].sort((a, b) => order === "اعلي مبلغ" ? b.requestedAmount - a.requestedAmount : a.requestedAmount - b.requestedAmount);
        setFilteredOrders(sorted);
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

    const filterByType = (type) => {
        if (type === 'الكل') {
            setFilteredOrders(orders);
        } else {
            const filtered = orders.filter(order => order.requestedProfitType === type);
            setFilteredOrders(filtered);
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <NavbarInv />
            <div className="d-flex flex-grow-1">
                <NavSideInv />
                <main className="flex-grow-1 d-flex flex-column ">

                    {/* Container for Search Bar and Filter Buttons */}
                    <div
                        style={{
                            marginTop: '20px',
                            marginBottom: '20px',
                            width: '80%',  // Adjusted width
                            maxWidth: '800px', // Adjusted max width
                            padding: '0 10px',//add padding to the edges
                            marginRight:"50px"
                        }}
                    >
                        {/* Search Bar */}
                        <div
                            className="search-bar"
                            style={{
                                width: '300px',
                                flexShrink: 0, // Prevent shrinking
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
                                style={{ padding: "5px 15px", backgroundColor: "#B4D3E0", color: "black" }}
                            >
                                تصفيه باسم الدوره
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li><a className="dropdown-item" href="#" onClick={() => filterByCycleName('الكل')}>الكل</a></li>
                                {cycleNames.map(name => (
                                    <li key={name}><a className="dropdown-item" href="#" onClick={() => filterByCycleName(name)}>{name}</a></li>
                                ))}
                            </ul>
                        </div>
                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false"
                                style={{ padding: "5px 15px", backgroundColor: "#B4D3E0", color: "black" }}
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
                                style={{ padding: "5px 15px", backgroundColor: "#B4D3E0", color: "black" }}
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
                                style={{ padding: "5px 10px", backgroundColor: "#B4D3E0", color: "black" }}
                            >
                                تصفيه حسب الاقدميه
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li><Link className="dropdown-item" onClick={() => filterByDate("الاقدم")} to="#">الاقدم</Link></li>
                                <li><Link className="dropdown-item" onClick={() => filterByDate("الاحدث")} to="#">الاحدث</Link></li>
                            </ul>
                        </div>
                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false"
                                style={{ padding: "5px 10px", backgroundColor: "#B4D3E0", color: "black" }}
                            >
                                تصفيه بنوع العائد
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li><Link className="dropdown-item" onClick={() => filterByType("مالي")} to="#">مالي</Link></li>
                                <li><Link className="dropdown-item" onClick={() => filterByType("محصول")} to="#">محصول </Link></li>
                            </ul>
                        </div>
                    </div>
                    </div>
                    {/* Orders List */}
                    <div className="d-flex flex-column align-items-center" style={{ width: '100%' }}>
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => (
                                <form
                                key={order.investmentRequestId}
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
                                                { label: "رقم الطلب", value: order.investmentRequestId },
                                                { label: "اسم الدوره", value: order.cycleName },
                                                { label: " رقم الدوره", value: order.cycleId },
                                                { label: "تاريخ تقديم الطلب", value: new Date(order.requestDate).toLocaleDateString() },
                                                { label: " المبلغ المطلوب للاستثمار", value: order.requestedAmount },
                                                { label: " نوع العائدالمطلوب", value: order.requestedProfitType },
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
                                            </div>
                                            <div className="align-items-center" style={{ display: "flex", gap: "10px", marginTop: "30px" }}>
                                                <label style={{ marginRight: "30px" }}>اسم المزارع المسئول عن الدوره</label>
                                                <input
                                                    readOnly
                                                    value={order.farmerName}
                                                    className="form-control"
                                                    style={{ backgroundColor: "#cacac6", maxWidth: '270px', textAlign: "center" }}
                                                />
                                            </div>
                                            <div className="d-flex " style={{ marginLeft: "30px", marginTop: "10px", alignItems: "center", justifyContent: "center" }}>
                                                <button className="btn fs-5">
                                                    <span style={{ color: "#6C4C94", marginLeft: "5px" }}>تواصل مع المزارع</span>
                                                    <i className="fa-solid fa-message"></i>
                                                </button>
                                            </div>
                                            {order.requestStatus === "قيد_الانتظار" && (
                                                <div className="d-flex " style={{ marginTop: "10px", justifyContent: "end" }}>
                                                    <button
                                                        className={styles.InvButtsubscribe}
                                                        onClick={(event) => handleDeleteOrder(order.investmentRequestId, event)}
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
                            <p>No orders found.</p>
                        )}
                    </div>
                </main>
            </div>
            <FooterInv />
        </div>
    );
};

export default Orders;