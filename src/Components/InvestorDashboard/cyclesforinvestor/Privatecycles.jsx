import React, { useState, useEffect } from 'react';
import NavbarInv from '../Main/NavbarInv';
import NavSideInv from '../Main/NavSideInv';
import FooterInv from '../Main/FooterInv';
import { Link } from 'react-router-dom';
import axios from 'axios';
import api from '../../../API/axiosInstance';
import styles from "../.././../Styles/style.module.css";

const Privatecyles = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [cycles, setCycles] = useState([]);
    const [cycleNames, setCycleNames] = useState([]);
    const [cropNames, setCropNames] = useState([]);
    const [selectedCycleName, setSelectedCycleName] = useState('');
    const [selectedRequestStatus, setSelectedRequestStatus] = useState('');
    const [selectedCropName, setSelectedCropName] = useState('');
    const [selectedReturnType, setSelectedReturnType] = useState('');
    const [minInvestment, setMinInvestment] = useState('');
    const [maxInvestment, setMaxInvestment] = useState('');
    const [filteredCycles, setFilteredCycles] = useState([]); // Add this state
    const almaraiFont = {
        fontFamily: 'Almarai, sans-serif',
    };
  const userData = JSON.parse(localStorage.getItem("user_data"));
    const InvestorId = userData?.LoggedId;
    useEffect(() => {
        const fetchCycles = async () => {
            try {
                const response = await api.get(`Cycle/GetAllCycleasOfInvestor?InvestorId=${InvestorId }`);
                setCycles(response.data);
                const uniqueCycleNames = [...new Set(response.data.map(cycle => cycle.cycleName))];
                setCycleNames(uniqueCycleNames);
                const uniqueCropNames = [...new Set(response.data.map(cycle => cycle.cropName))];
                setCropNames(uniqueCropNames);
            } catch (error) {
                console.error('Error fetching cycles:', error);
            }
        };

        fetchCycles();
    }, []);

    const getStatusColor = (status) => {
        if (status === "قيد الانتظار") {
            return "#EEC044";
        } else if (status === "نشطه") {
            return "#49A760";
        } else if (status === "منتهيه") {
            return "red";
        }
        return "#EEC044";
    };

    useEffect(() => {  // Use useEffect to calculate filteredCycles
        const calculateFilteredCycles = () => {
            const filtered = cycles.filter(cycle => {
                const dateFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };  // Customize format as needed
                const formattedStartDate = new Date(cycle.startDate).toLocaleDateString(undefined, dateFormatOptions);
                const formattedEndDate = new Date(cycle.endDate).toLocaleDateString(undefined, dateFormatOptions);

                const searchTermMatch = searchTerm
                    ? cycle.cycleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      cycle.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      String(cycle.investmentOfInvestor).includes(searchTerm) ||
                      String(cycle.openInvestmentCycleDTO?.currentTotalInvestment || '').includes(searchTerm) ||
                      String(cycle.openInvestmentCycleDTO?.currentInvestorCount || '').includes(searchTerm) ||
                      cycle.statue.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      cycle.timeToStart.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (cycle.openInvestmentCycleDTO?.availableProfitTypes || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                      formattedStartDate.includes(searchTerm) ||  // added start date search
                      formattedEndDate.includes(searchTerm)    // added end date search
                    : true;

                const cycleNameMatch = selectedCycleName ? cycle.cycleName === selectedCycleName : true;
                const requestStatusMatch = selectedRequestStatus ? cycle.statue === selectedRequestStatus : true;
                const cropNameMatch = selectedCropName ? cycle.cropName === selectedCropName : true;
                const returnTypeMatch = selectedReturnType ? cycle.openInvestmentCycleDTO?.availableProfitTypes === selectedReturnType : true;

                const investmentAmountMatch =
                    (!minInvestment || cycle.investmentOfInvestor >= parseFloat(minInvestment)) &&
                    (!maxInvestment || cycle.investmentOfInvestor <= parseFloat(maxInvestment));

                return (
                    searchTermMatch &&
                    cycleNameMatch &&
                    requestStatusMatch &&
                    cropNameMatch &&
                    returnTypeMatch &&
                    investmentAmountMatch
                );
            });
            setFilteredCycles(filtered);
        };

        calculateFilteredCycles();
    }, [cycles, searchTerm, selectedCycleName, selectedRequestStatus, selectedCropName, selectedReturnType, minInvestment, maxInvestment]);  

    // Handler functions for filter changes
    const handleCycleNameChange = (name) => {
        setSelectedCycleName(name);
    };

    const handleRequestStatusChange = (status) => {
        setSelectedRequestStatus(status);
    };

    const handleCropNameChange = (name) => {
        setSelectedCropName(name);
    };

    const handleReturnTypeChange = (type) => {
        setSelectedReturnType(type);
    };

    const handleMinInvestmentChange = (e) => {
        setMinInvestment(e.target.value);
    };

    const handleMaxInvestmentChange = (e) => {
        setMaxInvestment(e.target.value);
    };


    return (
        <div className="d-flex flex-column min-vh-100" style={almaraiFont}>
            <NavbarInv />
            <div className="d-flex flex-grow-1">
                <NavSideInv />
                <main className={` flex-grow-1 ${styles.hid} `}>
                    <div
                        style={{
                            marginTop: '20px',
                            marginBottom: '20px',
                            width: '80%',
                            maxWidth: '800px',
                            padding: '0 10px',
                            marginRight: "30px"
                        }}
                    >
                        <div
                            className="search-bar"
                            style={{
                                width: '300px',
                                flexShrink: 0,
                                display: "flex",
                                justifyContent: "start"

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
                    <div style={{ display: "flex", justifyContent: "end", marginLeft: "80px" }}>
                        <div className="d-flex flex-wrap justify-content-end mt-2" style={{ maxWidth: "800px", gap: "25px" }}>
                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle" type="button" id="cycleNameDropdown" data-bs-toggle="dropdown" aria-expanded="false"
                                    style={{ padding: "5px 15px", backgroundColor: "#B4D3E0", color: "black" }}
                                >
                                    تصفيه باسم الدوره
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="cycleNameDropdown">
                                    <li><button className="dropdown-item" onClick={() => handleCycleNameChange('')}>الكل</button></li>
                                    {cycleNames.map(name => (
                                        <li key={name}><button className="dropdown-item" onClick={() => handleCycleNameChange(name)}>{name}</button></li>
                                    ))}
                                </ul>
                            </div>
                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle" type="button" id="requestStatusDropdown" data-bs-toggle="dropdown" aria-expanded="false"
                                    style={{ padding: "5px 15px", backgroundColor: "#B4D3E0", color: "black" }}
                                >
                                    تصفيه بحاله الدوره
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="requestStatusDropdown">
                                    <li><button className="dropdown-item" onClick={() => handleRequestStatusChange('')}>الكل</button></li>
                                    <li><button className="dropdown-item" onClick={() => handleRequestStatusChange('قيد الانتظار')}>قيد_الانتظار</button></li>
                                    <li><button className="dropdown-item" onClick={() => handleRequestStatusChange('نشطه')}>نشطه</button></li>
                                    <li><button className="dropdown-item" onClick={() => handleRequestStatusChange('منتهيه')}>منتهيه</button></li>
                                </ul>
                            </div>
                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle" type="button" id="cropNameDropdown" data-bs-toggle="dropdown" aria-expanded="false"
                                    style={{ padding: "5px 10px", backgroundColor: "#B4D3E0", color: "black" }}
                                >
                                    تصفيه باسم المحصول
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="cropNameDropdown">
                                     <li><button className="dropdown-item" onClick={() => handleCropNameChange('')}>الكل</button></li>
                                    {cropNames.map(name => (
                                        <li key={name}><button className="dropdown-item" onClick={() => handleCropNameChange(name)}>{name}</button></li>
                                    ))}
                                </ul>
                            </div>
                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle" type="button" id="returnTypeDropdown" data-bs-toggle="dropdown" aria-expanded="false"
                                    style={{ padding: "5px 10px", backgroundColor: "#B4D3E0", color: "black" }}
                                >
                                    تصفيه بنوع العائد
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="returnTypeDropdown">
                                    <li><button className="dropdown-item" onClick={() => handleReturnTypeChange('')}>الكل</button></li>
                                    <li><button className="dropdown-item" onClick={() => handleReturnTypeChange('كاش')}>كاش</button></li>
                                    <li><button className="dropdown-item" onClick={() => handleReturnTypeChange('محصول')}>محصول</button></li>
                                </ul>
                            </div>
                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle" type="button" id="investmentAmountDropdown" data-bs-toggle="dropdown" aria-expanded="false"
                                    style={{ padding: "5px 10px", backgroundColor: "#B4D3E0", color: "black" }}
                                >
                                    تصفيه بتحديد المبلغ
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="investmentAmountDropdown" style={{ borderColor: "#B4D3E0", border: "solid #B4D3E0 1px" }}>

                                    <div style={{ display: "flex", gap: "10px", margin: "0px 10px" }}>
                                        <div>
                                            <label>اقل مبلغ للاستثمار</label>
                                            <input
                                                type='number'
                                                min={0}
                                                placeholder='ادخل المبلغ...'
                                                style={{ borderRadius: "5px", borderColor: "#B4D3E0", border: "solid #B4D3E0 1px", padding: "2px 0px", maxWidth: "170px" }}
                                                value={minInvestment}
                                                onChange={handleMinInvestmentChange}
                                            />
                                        </div>
                                        <div>
                                            <label>اعلي مبلغ للاستثمار</label>
                                            <input
                                                type='number'
                                                min={0}
                                                placeholder='ادخل المبلغ...'
                                                style={{ borderRadius: "5px", borderColor: "#B4D3E0", border: "solid #B4D3E0 1px", padding: "2px 0px", maxWidth: "170px" }}
                                                value={maxInvestment}
                                                onChange={handleMaxInvestmentChange}
                                            />
                                        </div>
                                    </div>
                                </ul>
                            </div>
                          
                        </div>
                    </div>
                    <div className="d-flex flex-column align-items-center" style={{ width: '100%' }}>
                        {filteredCycles.length > 0 ? (
                            filteredCycles.map(cycle => (
                                <form className="p-4 rounded mb-4" key={cycle.cycleId}
                                    style={{
                                        boxShadow:
                                            "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
                                        fontSize: "1.3rem",
                                        width: "100%",
                                        maxWidth: "950px",
                                        backgroundColor: "#fff",
                                        marginTop: "30px",
                                        marginBottom: "30px",
                                        backgroundImage: "url('/assets/privatecycles.jpg')",
                                        backgroundSize: "cover",
                                    }}>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                            <label style={{ fontSize: "1.5rem", marginRight: "5px", fontWeight: "600" }}>اسم الدورة</label>
                                            <input readOnly style={{ borderRadius: "5px", borderColor: "#B4D3E0", border: "solid #B4D3E0 1px", padding: "3px 0px", width: "60%", textAlign: "center" }} value={cycle.cycleName} />
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                            <label style={{ fontSize: "1.5rem", marginRight: "5px", fontWeight: "600" }}>نوع المحصول</label>
                                            <input readOnly style={{ borderRadius: "5px", borderColor: "#B4D3E0", border: "solid #B4D3E0 1px", padding: "3px 0px", width: "60%", textAlign: "center" }} value={cycle.cropName} />
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                            <label style={{ fontSize: "1.5rem", marginRight: "5px", fontWeight: "600" }}>تاريخ البداية</label>
                                            <input readOnly style={{ borderRadius: "5px", borderColor: "#B4D3E0", border: "solid #B4D3E0 1px", padding: "3px 0px", width: "60%", textAlign: "center" }} value={new Date(cycle.startDate).toLocaleDateString('en-US')} />
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                            <label style={{ fontSize: "1.5rem", marginRight: "5px", fontWeight: "600" }}>تاريخ النهاية</label>
                                            <input readOnly style={{ borderRadius: "5px", borderColor: "#B4D3E0", border: "solid #B4D3E0 1px", padding: "3px 0px", width: "60%", textAlign: "center" }} value={new Date(cycle.endDate).toLocaleDateString('en-US')} />
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", marginTop: "30px", marginRight: "60px", gap: "20px" }}>

                                        <p style={{ fontSize: "1.5rem", color: "white" }}>الوقت المتبقي لبدأ الدوره:</p>
                                        <p style={{ fontSize: "1.5rem", color: "red" }}>{cycle.timeToStart}</p>

                                    </div>

                                    <div style={{ display: "flex", justifyContent: "space-around", alignItems: "start" }}>
                                 <div >
    <p style={{ fontSize: "1.5rem", marginBottom: "15px", fontWeight: "600" }}>حاله الدوره</p>
    
    {/* This new div will act as a flex container for the buttons */}
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '15px' }}>
        
        {/* Status Button */}
        <button style={{ 
            border: "none", 
            borderRadius: "5px", 
            padding: "2px 40px", 
            backgroundColor: getStatusColor(cycle.statue) 
        }}>
            {cycle.statue}
        </button>
        
        {/* Details Link/Button */}
        <Link 
            to={`/SeeDetails/${cycle.cycleId}`}
            style={{ 
                border: "none", 
                borderRadius: "10px", 
                backgroundColor: "black", 
                color: "#fff", 
                padding: "7px 30px", 
                textDecoration: "none", 
                fontSize: "1.2rem" 
            }}
        >
            عرض التفاصيل
        </Link>
    </div>
</div>
                                        <div style={{ display: "flex", flexDirection: "column", width: "50%" }}>
                                            <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px", width: "100%" }}>
                                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                    <label style={{ fontSize: "1.3rem", marginRight: "10px", fontWeight: "600" }}>المبلغ المدفوع</label>
                                                    <input
                                                        readOnly
                                                        style={{
                                                            borderRadius: "5px",
                                                            borderColor: "#B4D3E0",
                                                            border: "solid #B4D3E0 1px",
                                                            padding: "3px 0",
                                                            width: "50%",
                                                            textAlign: "center"
                                                        }} value={cycle.investmentOfInvestor} />
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px", width: "100%" }}>
                                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                    <label style={{ fontSize: "1.3rem", marginRight: "10px", fontWeight: "600" }}>المبلغ المجمع</label>
                                                    <input
                                                        readOnly
                                                        style={{
                                                            borderRadius: "5px",
                                                            borderColor: "#B4D3E0",
                                                            border: "solid #B4D3E0 1px",
                                                            padding: "3px 0",
                                                            width: "50%",
                                                            textAlign: "center"
                                                        }} value={cycle.openInvestmentCycleDTO?.currentTotalInvestment || '0 '} />
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px", width: "100%" }}>
                                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                    <label style={{ fontSize: "1.3rem", marginRight: "10px", fontWeight: "600" }}>عدد المستثمرين الحالين</label>
                                                    <input
                                                        readOnly
                                                        style={{
                                                            borderRadius: "5px",
                                                            borderColor: "#B4D3E0",
                                                            border: "solid #B4D3E0 1px",
                                                            padding: "3px 0",
                                                            width: "50%",
                                                            textAlign: "center"
                                                        }} value={cycle.openInvestmentCycleDTO?.currentInvestorCount || '0 '} />
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px", width: "100%" }}>
                                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                    <label style={{ fontSize: "1.3rem", marginRight: "10px", fontWeight: "600" }}>نوع العائد</label>
                                                    <input
                                                        readOnly
                                                        style={{
                                                            borderRadius: "5px",
                                                            borderColor: "#B4D3E0",
                                                            border: "solid #B4D3E0 1px",
                                                            padding: "3px 0",
                                                            width: "50%",
                                                            textAlign: "center"
                                                        }} value={cycle.openInvestmentCycleDTO?.availableProfitTypes || 'لا يوجد'} />
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </form>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <p>لا توجد دورات تطابق معايير البحث.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
            <FooterInv />
        </div>
    );
};

export default Privatecyles;