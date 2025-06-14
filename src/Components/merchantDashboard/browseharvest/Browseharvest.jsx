import React, { useState, useEffect } from 'react';
import NavbarMer from '../Main/NavbarMer';
import NavSideMer from '../Main/NavSideMer';
import FooterMer from '../Main/FooterMer';
import api from '../../../API/axiosInstance';
import { Link } from 'react-router-dom';
import styles from "../../../Styles/style.module.css";

const Browseharvest = () => {
    const [harvests, setHarvests] = useState([]);
    const [recommendedCycles, setRecommendedCycles] = useState([]);
    const [showRecommended, setShowRecommended] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCropName, setSelectedCropName] = useState('');
    const [selectedCropType, setSelectedCropType] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [selectedRating, setSelectedRating] = useState('');
    const [cropTypes, setCropTypes] = useState([]);
    const [minQuantity, setMinQuantity] = useState('');
    const [maxQuantity, setMaxQuantity] = useState('');
    const [loadingRecommended, setLoadingRecommended] = useState(false);
    const [loadingHarvests, setLoadingHarvests] = useState(true); // New loading state
  const userData = JSON.parse(localStorage.getItem("user_data"));
    const MerchantId = userData?.LoggedId;
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
    setLoadingHarvests(true);
    try {
        const response = await api.get(`Harvest/BrowsinHarvestsForMerchant?MerchantId=${MerchantId}`);
        const data = response.data; // Axios stores parsed JSON in `data`

        console.log("Harvests API Data:", data);

        const harvestsWithRatings = data.map(harvest => ({ ...harvest, rate: harvest.rate || 0 }));
        setHarvests([...harvestsWithRatings]);

        const uniqueCropTypes = [...new Set(data.map(harvest => harvest.cropType))];
        setCropTypes(uniqueCropTypes);

    } catch (error) {
        console.error("Could not fetch harvests:", error);
    } finally {
        setLoadingHarvests(false);
    }
};

const fetchRecommendedCycles = async () => {
    setLoadingRecommended(true);
    try {
        const response = await api.get(`Recommendation/ReccommendationForMerchant?MerchantId=${MerchantId}`);
        const data = response.data; // Axios stores parsed JSON in `data`

        console.log("Recommended API Data:", data);

        const cyclesWithRatings = data.map(cycle => ({
            ...cycle,
            rate: cycle.rate || 0,
            harvestId: cycle.harvestId,
        }));
        setRecommendedCycles([...cyclesWithRatings]);
    } catch (error) {
        console.error("Could not fetch recommended cycles:", error);
    } finally {
        setLoadingRecommended(false);
    }
};


    const handleCropNameChange = (name) => {
        setSelectedCropName(name);
    };

    const handleCropTypeChange = (type) => {
        setSelectedCropType(type);
    };

    const handleMinPriceChange = (e) => {
        setMinPrice(e.target.value);
    };

    const handleMaxPriceChange = (e) => {
        setMaxPrice(e.target.value);
    };

    const handleRatingChange = (rating) => {
        setSelectedRating(rating);
    };

    const handleMinQuantityChange = (e) => {
        setMinQuantity(e.target.value);
    };

    const handleMaxQuantityChange = (e) => {
        setMaxQuantity(e.target.value);
    };

    const handleToggleRecommended = () => {
        setShowRecommended(!showRecommended);

        if (!showRecommended && recommendedCycles.length === 0 && !loadingRecommended) {
            fetchRecommendedCycles();
        }
    };

    const filterHarvests = (data) => {
        const harvestsToFilter = data || harvests;

        return harvestsToFilter.filter(harvest => {
            const cropNameMatch = selectedCropName ? harvest.cropName === selectedCropName : true;
            const cropTypeMatch = selectedCropType ? harvest.cropType === selectedCropType : true;
            const minPriceMatch = minPrice ? harvest.pricePerUnit >= parseFloat(minPrice) : true;
            const maxPriceMatch = maxPrice ? harvest.pricePerUnit <= parseFloat(maxPrice) : true;
            const ratingMatch = selectedRating ? harvest.rate >= parseInt(selectedRating, 10) : true;
            const minQuantityMatch = minQuantity ? harvest.availableQuantity >= parseFloat(minQuantity) : true;
            const maxQuantityMatch = maxQuantity ? harvest.availableQuantity <= parseFloat(maxQuantity) : true;

            const searchMatch = searchTerm ?
                harvest.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                harvest.cropType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                harvest.farmLocation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(harvest.availableQuantity).includes(searchTerm) ||
                String(harvest.pricePerUnit).includes(searchTerm) ||
                formatDate(harvest.harvestDate).includes(searchTerm)
                : true;

            return cropNameMatch && cropTypeMatch && minPriceMatch && maxPriceMatch && searchMatch && ratingMatch && minQuantityMatch && maxQuantityMatch;
        });
    };

    const filteredHarvests = filterHarvests(harvests);
    const filteredRecommendedCycles = filterHarvests(recommendedCycles);

    const HarvestCard = ({ harvest, isRecommended = false }) => {
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
                    {/* Image Display - Always a Square */}
                    <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '200px', height: '200px', border: '1px solid #ccc', margin: '0 auto' }}>
                        {harvest.imageUrl ? (
                        <img
    src={`https://cityroots.runasp.net/${encodeURI(harvest.imageUrl)}`}
    alt={harvest.cropName}
    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
/>

                        ) : (
                            <div style={{ textAlign: 'center', color: '#888' }}>لا توجد صورة</div>
                        )}
                    </div>

                    {/* Harvest details inputs */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <label style={{ fontSize: "1.5rem", marginRight: "5px", fontWeight: "600" }}>اسم المحصول</label>
                        <input readOnly value={harvest.cropName} style={{ borderRadius: "5px", borderColor: "#B4D3E0", border: "solid #B4D3E0 1px", padding: "3px 0px", width: "60%", textAlign: "center" }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <label style={{ fontSize: "1.5rem", marginRight: "5px", fontWeight: "600" }}>نوع المحصول</label>
                        <input readOnly value={harvest.cropType} style={{ borderRadius: "5px", borderColor: "#B4D3E0", border: "solid #B4D3E0 1px", padding: "3px 0px", width: "60%", textAlign: "center" }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <label style={{ fontSize: "1.5rem", marginRight: "5px", fontWeight: "600" }}> الموقع الجغرافي </label>
                        <input readOnly value={harvest.farmLocation || "غير محدد"} style={{ borderRadius: "5px", borderColor: "#B4D3E0", border: "solid #B4D3E0 1px", padding: "3px 0px", width: "60%", textAlign: "center" }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <label style={{ fontSize: "1.5rem", marginRight: "5px", fontWeight: "600" }}> الكميه المتاحه</label>
                        <input readOnly value={harvest.availableQuantity} style={{ borderRadius: "5px", borderColor: "#B4D3E0", border: "solid #B4D3E0 1px", padding: "3px 0px", width: "60%", textAlign: "center" }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <label style={{ fontSize: "1.5rem", marginRight: "5px", fontWeight: "600" }}>   السعر لكل وحده</label>
                        <input readOnly value={harvest.pricePerUnit} style={{ borderRadius: "5px", borderColor: "#B4D3E0", border: "solid #B4D3E0 1px", padding: "3px 0px", width: "60%", textAlign: "center" }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <label style={{ fontSize: "1.5rem", marginRight: "5px", fontWeight: "600" }}>   تاريخ الحصاد</label>
                        <input readOnly value={formatDate(harvest.harvestDate)} style={{ borderRadius: "5px", borderColor: "#B4D3E0", border: "solid #B4D3E0 1px", padding: "3px 0px", width: "60%", textAlign: "center" }} />
                    </div>
                </div>

                <div style={{ display: "flex", justifyContent: "center", alignItems: "start", marginTop: "30px" }}>
                    <div style={{ display: "flex", flexDirection: "column", width: "50%" }}>
                        <div className="text-warning fs-4 mb-2 mb-md-0" style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
                            <p style={{ color: "black", marginLeft: "20px" }}> تقييم المزارع </p>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <i key={star} className={star <= harvest.rate ? "fa-solid fa-star text-warning" : "fa-regular fa-star"} style={{ cursor: "default" }}></i>
                            ))}
                        </div>
                    </div>
                </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}> {/* Added some margin-top for spacing */}
                    <Link
                        style={{
                            border: "none",
                            borderRadius: "10px",
                            backgroundColor: "black",
                            color: "#fff",
                            padding: "10px 30px", // Added vertical padding
                            textDecoration: "none" // Good practice for button-like links
                        }}
                        to={`/Seedetailsmerch/${harvest.harvestId}`} 
                    >
                        عرض التفاصيل
                    </Link>
                </div>
            </form>
        );
    };

    return (
        <div className="d-flex flex-column min-vh-100" style={almaraiFont}>
            <NavbarMer />
            <div className="d-flex flex-grow-1">
                <NavSideMer />
                <main className={`flex-grow-1 ${styles.hid}`}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 50px' }}>
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


                    <div style={{ display: "flex", justifyContent: "end", marginLeft: "80px", marginRight: "50px", alignItems: "center" }}>

                        {/* Filter Dropdowns */}
                        <div className="d-flex flex-wrap justify-content-end mt-2" style={{ maxWidth: "800px", gap: "25px" }}>
                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle" type="button" id="cropNameDropdown" data-bs-toggle="dropdown" aria-expanded="false"
                                    style={{ padding: "5px 5px", backgroundColor: "#4DB9B5", color: "black" }}
                                >
                                    تصفيه باسم المحصول
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="cropNameDropdown">
                                    <li><button className="dropdown-item" onClick={() => handleCropNameChange('')}>الكل</button></li>
                                    {harvests.map(harvest => (
                                        <li key={harvest.harvestId}><button className="dropdown-item" onClick={() => handleCropNameChange(harvest.cropName)}>{harvest.cropName}</button></li>
                                    ))}
                                </ul>
                            </div>

                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle" type="button" id="cropTypeDropdown" data-bs-toggle="dropdown" aria-expanded="false"
                                    style={{ padding: "5px 5px", backgroundColor: "#4DB9B5", color: "black" }}
                                >
                                    تصفيه بنوع المحصول
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="cropTypeDropdown">
                                    <li><button className="dropdown-item" onClick={() => handleCropTypeChange('')}>الكل</button></li>
                                    {cropTypes.map(type => (
                                        <li key={type}><button className="dropdown-item" onClick={() => handleCropTypeChange(type)}>{type}</button></li>
                                    ))}
                                </ul>
                            </div>
                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle" type="button" id="quantityRangeDropdown" data-bs-toggle="dropdown" aria-expanded="false"
                                    style={{ padding: "5px 5px", backgroundColor: "#4DB9B5", color: "black" }}
                                >
                                    تصفيه بالكمية المتاحة
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="quantityRangeDropdown" style={{ borderColor: "#B4D3E0", border: "solid #B4D3E0 1px" }}>

                                    <div style={{ display: "flex", gap: "10px", margin: "0px 10px" }}>
                                        <div>
                                            <label>اقل كميه</label>
                                            <input
                                                type='number'
                                                min={0}
                                                placeholder='ادخل الكميه...'
                                                style={{ borderRadius: "5px", borderColor: "#4DB9B5", border: "solid #B4D3E0 1px", padding: "2px 0px", maxWidth: "170px" }}
                                                value={minQuantity}
                                                onChange={handleMinQuantityChange}
                                            />
                                        </div>
                                        <div>
                                            <label>اعلي كميه</label>
                                            <input
                                                type='number'
                                                min={0}
                                                placeholder='ادخل الكميه...'
                                                style={{ borderRadius: "5px", borderColor: "#4DB9B5", border: "solid #B4D3E0 1px", padding: "2px 0px", maxWidth: "170px" }}
                                                value={maxQuantity}
                                                onChange={handleMaxQuantityChange}
                                            />
                                        </div>
                                    </div>
                                </ul>
                            </div>

                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle" type="button" id="priceRangeDropdown" data-bs-toggle="dropdown" aria-expanded="false"
                                    style={{ padding: "5px 5px", backgroundColor: "#4DB9B5", color: "black" }}
                                >
                                    تصفيه بتحديد السعر
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="priceRangeDropdown" style={{ borderColor: "#B4D3E0", border: "solid #B4D3E0 1px" }}>

                                    <div style={{ display: "flex", gap: "10px", margin: "0px 10px" }}>
                                        <div>
                                            <label>اقل سعر</label>
                                            <input
                                                type='number'
                                                min={0}
                                                placeholder='ادخل السعر...'
                                                style={{ borderRadius: "5px", borderColor: "#4DB9B5", border: "solid #B4D3E0 1px", padding: "2px 0px", maxWidth: "170px" }}
                                                value={minPrice}
                                                onChange={handleMinPriceChange}
                                            />
                                        </div>
                                        <div>
                                            <label>اعلي سعر</label>
                                            <input
                                                type='number'
                                                min={0}
                                                placeholder='ادخل السعر...'
                                                style={{ borderRadius: "5px", borderColor: "#4DB9B5", border: "solid #B4D3E0 1px", padding: "2px 0px", maxWidth: "170px" }}
                                                value={maxPrice}
                                                onChange={handleMaxPriceChange}
                                            />
                                        </div>
                                    </div>
                                </ul>
                            </div>
                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle" type="button" id="ratingDropdown" data-bs-toggle="dropdown" aria-expanded="false"
                                    style={{ padding: "5px 5px", backgroundColor: "#4DB9B5", color: "black" }}
                                >
                                    تصفيه حسب تقييم المزارع
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="ratingDropdown">
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
                        <h4 style={{ color: "#2D625A", marginBottom: "10px" }}>
                            {showRecommended ? "عرض جميع المحاصيل" : "لعرض المحاصيل المقترحة خصيصًا لك اضغط الزر الأسفل"}
                        </h4>
                        <button
                            style={{ border: "none", borderRadius: "10px", background: "#2D625A", padding: "7px 30px", color: "white" }}
                            onClick={handleToggleRecommended}
                        >
                            {showRecommended ? "عرض جميع المحاصيل" : "المحاصيل المقترحه لي"}
                        </button>
                    </div>

                     {loadingHarvests ? (
                        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                            جاري تحميل المحاصيل......
                        </div>
                     ) : (
                        <div className="d-flex flex-column align-items-center" style={{ width: '100%' }}>
                            {showRecommended ? (
                                loadingRecommended ? (
                                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                                        جاري تحميل المحاصيل المقترحه.....
                                    </div>
                                ) : (
                                    filteredRecommendedCycles.map(harvest => (
                                        <HarvestCard key={harvest.harvestId} harvest={harvest} isRecommended={true} />
                                    ))
                                )
                            ) : (
                                filteredHarvests.map(harvest => (
                                    <HarvestCard key={harvest.harvestId} harvest={harvest} />
                                ))
                            )}
                        </div>
                     )}

                </main>
            </div>
            <FooterMer />
        </div>
    );
};

export default Browseharvest;