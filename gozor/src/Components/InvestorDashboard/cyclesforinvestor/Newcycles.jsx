import React, { useState, useEffect } from 'react';
import NavbarInv from '../Main/NavbarInv';
import NavSideInv from '../Main/NavSideInv';
import FooterInv from '../Main/FooterInv';
import api from '../../../API/axiosInstance';
import { Link } from 'react-router-dom';
import SeeDetails from '../Investorpages/SeeDetails/SeeDetails';

const Newcycles = () => {
    const [cycles, setCycles] = useState([]);
    const [recommendedCycles, setRecommendedCycles] = useState([]);
    const [showRecommended, setShowRecommended] = useState(false);
    const [selectedCycleName, setSelectedCycleName] = useState('');
    const [selectedCropName, setSelectedCropName] = useState('');
    const [selectedReturnType, setSelectedReturnType] = useState('');
    const [minInvestment, setMinInvestment] = useState('');
    const [maxInvestment, setMaxInvestment] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRating, setSelectedRating] = useState('');
    const userData = JSON.parse(localStorage.getItem("user_data"));
    const InvestorId = userData?.LoggedId;
    const almaraiFont = {
        fontFamily: 'Almarai, sans-serif',
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US');
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.get('Cycle/BrowsingCycleasForInvestors');
            const data = response.data;
            if (data) {
                const cyclesWithRatings = Array.isArray(data)
                    ? data.map(cycle => ({ ...cycle, rating: cycle.rate !== undefined ? cycle.rate : 0 }))
                    : [{ ...data, rating: data.rate !== undefined ? data.rate : 0 }];
                setCycles(cyclesWithRatings);
            } else {
                setCycles([]);
            }
        } catch (error) {
            console.error("Could not fetch cycles:", error);
            setCycles([]);
        }
    };

    const fetchRecommendedCycles = async () => {
        try {
            const response = await api.get('Recommendation/ReccommendationForInvestor');
            const data = response.data;
            const cyclesWithRatings = data.map(cycle => ({ ...cycle }));
            setRecommendedCycles(cyclesWithRatings);
        } catch (error) {
            console.error("Could not fetch recommended cycles:", error);
        }
    };
    const handleCycleNameChange = (name) => {
        setSelectedCycleName(name);
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

    const handleRatingChange = (rating) => {
        setSelectedRating(rating);
    };

    const handleToggleRecommended = () => {
        setShowRecommended(!showRecommended);

        if (!showRecommended && recommendedCycles.length === 0) {
            fetchRecommendedCycles();
        }
    };

    const filterCycles = (cyclesToFilter) => {
        return cyclesToFilter.filter(cycle => {
            const cycleNameMatch = selectedCycleName ? cycle.cycleName === selectedCycleName : true;
            const cropNameMatch = selectedCropName ? cycle.cropName === selectedCropName : true;
            const returnTypeMatch = selectedReturnType ? cycle.openInvestmentCycleDTO.availableProfitTypes.includes(selectedReturnType) : true;
            const minInvestmentMatch = minInvestment ? cycle.openInvestmentCycleDTO.minimumInvestment >= parseFloat(minInvestment) : true;
            const maxInvestmentMatch = maxInvestment ? cycle.openInvestmentCycleDTO.maximumInvestment <= parseFloat(maxInvestment) : true;
            const ratingMatch = selectedRating ? cycle.rating >= parseInt(selectedRating, 10) : true;

            const searchMatch = searchTerm ?
                cycle.cycleName.includes(searchTerm) ||
                cycle.cropName.includes(searchTerm) ||
                cycle.timeToStart.includes(searchTerm) ||
                formatDate(cycle.startDate).includes(searchTerm) ||
                formatDate(cycle.endDate).includes(searchTerm) ||
                String(cycle.openInvestmentCycleDTO.minimumInvestment).includes(searchTerm) ||
                String(cycle.openInvestmentCycleDTO.maximumInvestment).includes(searchTerm) ||
                String(cycle.openInvestmentCycleDTO.expectedFinancialGoal).includes(searchTerm) ||
                String(cycle.openInvestmentCycleDTO.currentTotalInvestment).includes(searchTerm) ||
                String(cycle.openInvestmentCycleDTO.currentInvestorCount).includes(searchTerm) ||
                cycle.openInvestmentCycleDTO.availableProfitTypes.includes(searchTerm)
                : true;

            return cycleNameMatch && cropNameMatch && returnTypeMatch && minInvestmentMatch && maxInvestmentMatch && searchMatch && ratingMatch;
        });
    };

    const filteredCycles = filterCycles(cycles);
    const filteredRecommendedCycles = filterCycles(recommendedCycles);

    const CycleCard = ({ cycle }) => {
        return (
            <form className="p-4 rounded mb-4"
                style={{
                    boxShadow:
                        "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
                    fontSize: "1.3rem",
                    width: "100%",
                    maxWidth: "950px",
                    backgroundColor: "#fff",
                    marginTop: "30px",
                    marginBottom: "30px",
                    backgroundImage: "url('/assets/Newcycles.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}
            >
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
                    {/* Cycle details inputs - same as before */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <label style={{ fontSize: "1.5rem", marginRight: "5px", fontWeight: "600" }}>اسم الدورة</label>
                        <input readOnly value={cycle.cycleName} style={{ borderRadius: "5px", borderColor: "#B4D3E0", border: "solid #B4D3E0 1px", padding: "3px 0px", width: "60%", textAlign: "center" }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <label style={{ fontSize: "1.5rem", marginRight: "5px", fontWeight: "600" }}>نوع المحصول</label>
                        <input readOnly value={cycle.cropName} style={{ borderRadius: "5px", borderColor: "#B4D3E0", border: "solid #B4D3E0 1px", padding: "3px 0px", width: "60%", textAlign: "center" }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <label style={{ fontSize: "1.5rem", marginRight: "5px", fontWeight: "600" }}>تاريخ البداية</label>
                        <input readOnly value={formatDate(cycle.startDate)} style={{ borderRadius: "5px", borderColor: "#B4D3E0", border: "solid #B4D3E0 1px", padding: "3px 0px", width: "60%", textAlign: "center" }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <label style={{ fontSize: "1.5rem", marginRight: "5px", fontWeight: "600" }}>تاريخ النهاية</label>
                        <input readOnly value={formatDate(cycle.endDate)} style={{ borderRadius: "5px", borderColor: "#B4D3E0", border: "solid #B4D3E0 1px", padding: "3px 0px", width: "60%", textAlign: "center" }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <label style={{ fontSize: "1.5rem", marginRight: "5px", fontWeight: "600" }}> اقل مبلغ للاستثمار</label>
                        <input readOnly value={cycle.openInvestmentCycleDTO.minimumInvestment} style={{ borderRadius: "5px", borderColor: "#B4D3E0", border: "solid #B4D3E0 1px", padding: "3px 0px", width: "40%", textAlign: "center" }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <label style={{ fontSize: "1.5rem", marginRight: "5px", fontWeight: "600" }}> اعلي مبلغ للاستثمار</label>
                        <input readOnly value={cycle.openInvestmentCycleDTO.maximumInvestment} style={{ borderRadius: "5px", borderColor: "#B4D3E0", border: "solid #B4D3E0 1px", padding: "3px 0px", width: "40%", textAlign: "center" }} />
                    </div>

                </div>

                <div style={{ display: "flex", justifyContent: "center", alignItems: "start", marginTop: "30px" }}>

                    <div style={{ display: "flex", flexDirection: "column", width: "50%" }}>
                        <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px", width: "100%" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <label style={{ fontSize: "1.3rem", marginRight: "10px", fontWeight: "600" }}> الهدف الاستثماري</label>
                                <input
                                    readOnly
                                    value={cycle.openInvestmentCycleDTO.expectedFinancialGoal}
                                    style={{
                                        borderRadius: "5px",
                                        borderColor: "#B4D3E0",
                                        border: "solid #B4D3E0 1px",
                                        padding: "3px 0",
                                        width: "50%",
                                        textAlign: "center"
                                    }} />
                            </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px", width: "100%" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <label style={{ fontSize: "1.3rem", marginRight: "10px", fontWeight: "600" }}>المبلغ المجمع</label>
                                <input
                                    readOnly
                                    value={cycle.openInvestmentCycleDTO.currentTotalInvestment}
                                    style={{
                                        borderRadius: "5px",
                                        borderColor: "#B4D3E0",
                                        border: "solid #B4D3E0 1px",
                                        padding: "3px 0",
                                        width: "50%",
                                        textAlign: "center"
                                    }} />
                            </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px", width: "100%" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <label style={{ fontSize: "1.3rem", marginRight: "10px", fontWeight: "600" }}>عدد المستثمرين الحالين</label>
                                <input
                                    readOnly
                                    value={cycle.openInvestmentCycleDTO.currentInvestorCount}
                                    style={{
                                        borderRadius: "5px",
                                        borderColor: "#B4D3E0",
                                        border: "solid #B4D3E0 1px",
                                        padding: "3px 0",
                                        width: "50%",
                                        textAlign: "center"
                                    }} />
                            </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", marginBottom: "10px", width: "100%" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <label style={{ fontSize: "1.3rem", marginRight: "10px", fontWeight: "600" }}>نوع العائد</label>
                                <input
                                    readOnly
                                    value={cycle.openInvestmentCycleDTO.availableProfitTypes}
                                    style={{
                                        borderRadius: "5px",
                                        borderColor: "#B4D3E0",
                                        border: "solid #B4D3E0 1px",
                                        padding: "3px 0",
                                        width: "50%",
                                        textAlign: "center"
                                    }} />
                            </div>
                        </div>
                        <div className="text-warning fs-4 mb-2 mb-md-0" style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
                            <p style={{ color: "black", marginLeft: "20px" }}> تقييم المزارع </p>

                            {[1, 2, 3, 4, 5].map((star) => (
                                <i key={star} className={star <= cycle.rating ? "fa-solid fa-star text-warning" : "fa-regular fa-star"} style={{ cursor: "default" }}></i>  // No onClick, read-only
                            ))}
                        </div>
                    </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Link 
    to={`/SeeDetails/${cycle.cycleId}`} // Changed from to="/SeeDetails"
    style={{ border: "none", borderRadius: "10px", backgroundColor: "black", color: "#fff", padding: "7px 30px", textDecoration:"none", fontSize:"1.2rem" }}
>
    عرض التفاصيل
</Link>
                    <h4 style={{ background: "#6C4C94", color: "white", padding: "5px 30px", borderRadius: "7px" }}>
                        <i className="fa-solid fa-hourglass-end"></i>  {cycle.timeToStart}
                    </h4>
                </div>
            </form>
        );
    };

    return (
        <div className="d-flex flex-column min-vh-100" style={almaraiFont}>
            <NavbarInv />
            <div className="d-flex flex-grow-1">
                <NavSideInv />
                <main className="flex-grow-1 d-flex flex-column">
                    <div
                        style={{
                            marginTop: '20px',
                            marginBottom: '20px',
                            width: '80%',
                            maxWidth: '800px',
                            padding: '0 10px',
                            marginRight: "50px"
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
                        {/* Filter Dropdowns - same as before */}
                        <div className="d-flex flex-wrap justify-content-end mt-2" style={{ maxWidth: "800px", gap: "25px" }}>
                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle" type="button" id="cycleNameDropdown" data-bs-toggle="dropdown" aria-expanded="false"
                                    style={{ padding: "5px 5px", backgroundColor: "#B4D3E0", color: "black" }}
                                >
                                    تصفيه باسم الدوره
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="cycleNameDropdown">
                                    <li><button className="dropdown-item" onClick={() => handleCycleNameChange('')}>الكل</button></li>
                                    {cycles.map(cycle => (
                                        <li key={cycle.cycleId}><button className="dropdown-item" onClick={() => handleCycleNameChange(cycle.cycleName)}>{cycle.cycleName}</button></li>
                                    ))}
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
                                    {cycles.map(cycle => (
                                        <li key={cycle.cycleId}><button className="dropdown-item" onClick={() => handleCropNameChange(cycle.cropName)}>{cycle.cropName}</button></li>
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
                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle" type="button" id="requestStatusDropdown" data-bs-toggle="dropdown" aria-expanded="false"
                                    style={{ padding: "5px 10px", backgroundColor: "#B4D3E0", color: "black" }}
                                >
                                    تصفيه حسب تقييم المزارع
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="requestStatusDropdown">
                                    <li><button className="dropdown-item" onClick={() => handleRatingChange('')}>الكل</button></li>
                                    <li><button className="dropdown-item" onClick={() => handleRatingChange('0')}>ولا نجمة</button></li>
                                    <li><button className="dropdown-item" onClick={() => handleRatingChange('1')}>نجمة واحدة</button></li>
                                    <li><button className="dropdown-item" onClick={() => handleRatingChange('2')}>نجمتين</button></li>
                                    <li><button className="dropdown-item" onClick={() => handleRatingChange('3')}>ثلاثة نجوم</button></li>
                                    <li><button className="dropdown-item" onClick={() => handleRatingChange('4')}>أربعة نجوم</button></li>
                                    <li><button className="dropdown-item" onClick={() => handleRatingChange('5')}>خمسة نجوم</button></li>
                                </ul>
                            </div>

                        </div>
                    </div>
                    <div style={{ marginRight: "40px", marginTop: "20px" }}>
                        <h4 style={{ color: "#6C4C94", marginBottom: "10px" }}>
                            {showRecommended ? "عرض جميع الدورات" : "لعرض الدورات المقترحة خصيصًا لك اضغط الزر الأسفل"}
                        </h4>
                        <button
                            style={{ border: "none", borderRadius: "10px", background: "#6C4C94", padding: "7px 30px", color: "white" }}
                            onClick={handleToggleRecommended}
                        >
                            {showRecommended ? "عرض جميع الدورات" : "الدورات المقترحه لي"}
                        </button>
                    </div>

                    <div className="d-flex flex-column align-items-center" style={{ width: '100%' }}>
                        {showRecommended && (
                            <>
                                <h4>هذه الدورات المقترحه لك</h4>
                                {filteredRecommendedCycles.map(cycle => (
                                    <CycleCard key={cycle.cycleId} cycle={cycle} />
                                ))}
                            </>
                        )}

                        {!showRecommended && (
                            filteredCycles.map(cycle => (
                                <CycleCard key={cycle.cycleId} cycle={cycle} />
                            ))
                        )}
                    </div>
                </main>
            </div>
            <FooterInv />
        </div>
    );
};

export default Newcycles;