import React, { useState, useEffect, useRef } from "react";
import NavbarMer from '../Main/NavbarMer';
import NavSideMer from '../Main/NavSideMer';
import FooterMer from '../Main/FooterMer';
import styles from "../../../Styles/style.module.css";
import Merchnewupdates from './Merchnewupdates';
import Paypal from "./Paypal";
import Modal from 'react-modal';
import BuyRequest from "./Buyrequest";
import api from "../../../API/axiosInstance";
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Seedetailsmerch() {
    const [isClicked, setIsClicked] = useState(false); // True if a buy request is pending (derived from requestReview)
    const [visiblePaypalModal, setVisiblePaypalModal] = useState(false);
    const [visibleBuyRequestModal, setVisibleBuyRequestModal] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false); // If farmer is favorited by merchant
    const [rating, setRating] = useState(0); // Merchant's rating for this farmer
    const [hoverRating, setHoverRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const timerRef = useRef(null);
    const [harvestDetails, setHarvestDetails] = useState(null);

    const userData = JSON.parse(localStorage.getItem("user_data"));
    const MerchantId = userData?.loggedId; // Or userData?.LoggedId if that's the case
    const { harvestId: harvestIdFromUrl } = useParams();
    const currentHarvestId = parseInt(harvestIdFromUrl, 10);

    const fetchHarvestDetails = async () => {
        if (currentHarvestId === undefined || currentHarvestId === null || isNaN(currentHarvestId)) {
            setError("Harvest ID is not specified or invalid.");
            setLoading(false);
            toast.error("Harvest ID is not specified or invalid.");
            return;
        }

        if (!MerchantId) {
            setError("Merchant ID not found. Please log in.");
            setLoading(false);
            toast.error("Merchant ID not found. Please log in.");
            return;
        }

        setError(null);
        try {
            // The endpoint in your curl doesn't use MerchantId in the query string,
            // assuming it's inferred from the Auth token.
            const response = await api.get(
                `Harvest/GetHarvestForMerchant?HarvestId=${currentHarvestId}`
            );

            if (response.data) {
                setHarvestDetails(response.data);
                console.log("HarvestDetails set from API:", response.data);

                // Match response structure:
                setIsFavorite(response.data.farmer?.isFarmerInFav || false); // From farmer object
                setIsClicked(response.data.requestReview || false); // Directly from root

             
                setRating(0); // Initialize to 0, will be updated if user rates or if you fetch specific merchant rating.

            } else {
                setError("Invalid data format from the server");
                toast.error("Received invalid data from server.");
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "Failed to fetch harvest details.";
            setError(`Failed to fetch harvest details. ${errorMessage}`);
            console.error("Error fetching harvest details:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchHarvestDetails();
    }, [currentHarvestId]); // MerchantId removed as dependency if not in GET URL

    const handleRating = async (clickedRating) => {
        if (!harvestDetails?.farmer?.userId) {
            toast.error("Cannot rate: Missing farmer user ID.");
            return;
        }
        const farmerIdToRate = harvestDetails.farmer.userId;
        const rateEndpoint = "Rate"; // Endpoint for submitting/deleting rating

        if (rating === clickedRating) {
            try {
                await api.delete(rateEndpoint, {
                    // MerchantId is typically sent via Auth token, data might only need farmerId
                    data: { farmerId: farmerIdToRate }
                });
                toast.success("تم حذف التقييم");
                setRating(0);
                setHoverRating(0);
                await fetchHarvestDetails(); // Re-fetch to update overall farmer rate etc.
            } catch (error) {
                console.error("Error removing rating:", error);
                const errorMessage = error.response?.data?.message || "Failed to remove rating.";
                toast.error(errorMessage);
            }
        } else {
            try {
                await api.post(rateEndpoint, {
                    farmerId: farmerIdToRate,
                    rating: clickedRating,
                    // MerchantId likely implicit via Auth token
                });
                toast.success("تم اضافه التقييم بنجاح");
                setRating(clickedRating);
                await fetchHarvestDetails(); // Re-fetch
            } catch (error) {
                console.error("حدث خطا اثناء التقييم", error);
                const errorMessage = error.response?.data?.message || "حدث خطا اثناء التقييم";
                toast.error(errorMessage);
            }
        }
    };

    const handleFavoriteToggle = async () => {
        if (!harvestDetails?.farmer?.userId) {
            toast.error("Cannot toggle favorite: Missing farmer user ID.");
            return;
        }
        const farmerIdToToggle = harvestDetails.farmer.userId;
        const newFavoriteStatus = !isFavorite;
        const favoriteEndpoint = "FavouriteFarmer"; // Endpoint for favoriting

        try {
            if (newFavoriteStatus) {
                await api.post(favoriteEndpoint, { farmerId: farmerIdToToggle });
                toast.success("تم اضافه المزارع الي المفضله");
            } else {
                await api.delete(favoriteEndpoint, { data: { farmerId: farmerIdToToggle } });
                toast.success("تم ازاله المزارع من المفضله");
            }
            setIsFavorite(newFavoriteStatus);
            // No need to refetchHarvestDetails unless the API response for it changes based on favorite status.
            // The `isFarmerInFav` is set directly in fetchHarvestDetails, so this toggle should just update the UI state.
        } catch (error) {
            console.error("Error updating favorite status:", error);
            const errorMessage = error.response?.data?.message || "حدث خطا في اتمام العمليه";
            toast.error(errorMessage);
        }
    };

    const handleBuyNow = () => {
        setVisibleBuyRequestModal(true);
    };

    const handleCancelBuyRequest = async () => {
        // Using purchaseRequestId from the API response
        const purchaseReqId = harvestDetails?.purchaseRequestId;
        if (!purchaseReqId) {
            toast.error("معرف طلب الشراء غير موجود. لا يمكن الإلغاء.");
            return;
        }
        try {
            // Assuming endpoint for deleting a buy request uses the purchaseRequestId
            await api.delete(`PurchaseRequest/${purchaseReqId}`); // ADJUST ENDPOINT IF NEEDED
            toast.success("تم إلغاء طلب الشراء بنجاح!");
            setIsClicked(false);
            await fetchHarvestDetails();
        } catch (error) {
            console.error("Error canceling buy request:", error);
            const errorMessage = error.response?.data?.message || "فشل إلغاء طلب الشراء.";
            toast.error(errorMessage);
        }
    };

    const Paypalstyles = {
        content: { maxWidth: '530px', margin: 'auto', padding: '10px', borderRadius: '10px', height: '450px' },
        overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    };
    const BuyRequestStyles = {
        content: { maxWidth: '550px', margin: 'auto', padding: '10px', borderRadius: '10px', backgroundColor: "#fff", height: 'auto', minHeight: '350px' },
        overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    };

    useEffect(() => {
        if (MerchantId && !isNaN(currentHarvestId)) { // Assuming MerchantId is still relevant for logging
            timerRef.current = setTimeout(async () => {
                try {
                    await api.post(`Interactions/LogHarvestForMerchant?HarvestId=${currentHarvestId}`, null); // MerchantId implicit
                    console.log("Interaction log for merchant harvest view sent");
                } catch (error) {
                    console.error("Error sending interaction log:", error);
                }
            }, 10000);
        }
        return () => clearTimeout(timerRef.current);
    }, [MerchantId, currentHarvestId]);


    if (loading && !harvestDetails) {
        return <div className="d-flex justify-content-center align-items-center min-vh-100">Loading harvest details...</div>;
    }
    if (error && !harvestDetails) {
        return <div className="alert alert-danger m-3" role="alert">Error: {error}</div>;
    }
    if (!harvestDetails) {
        return <div className="alert alert-warning m-3" role="alert">No harvest details found for ID {currentHarvestId}.</div>;
    }

    // Destructure based on the provided API response
    const { farmer, harvestDetails: apiHarvestData, isMerchantBuyer, requestReview, cycleUpdates, purchaseRequestId } = harvestDetails;

    const farmerName = farmer?.name || "N/A";
    const farmerPhone = farmer?.phone || "N/A";
    const farmerEmail = farmer?.email || "N/A";
    const farmerImageUrl = farmer?.imageUrl ? (farmer.imageUrl.startsWith('http') ? farmer.imageUrl : `https://cityroots.runasp.net/${farmer.imageUrl}`) : "/assets/default-farmer.png";
    const farmerBio = farmer?.bio || "No biography available.";
    const farmerOverallRate = farmer?.rate || 0;

    let harvestDisplayImageUrl = apiHarvestData?.imageUrl ? (apiHarvestData.imageUrl.startsWith('http') ? apiHarvestData.imageUrl : `https://cityroots.runasp.net/${apiHarvestData.imageUrl}`) : "/assets/default-harvest.png";

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleDateString('ar-EG'); // Using Arabic locale for date
        } catch (e) {
            return "Invalid Date";
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={true} pauseOnFocusLoss draggable pauseOnHover />
            <NavbarMer />
            <div className="d-flex flex-grow-1">
                <NavSideMer />
                <main className="flex-grow-1">
                    {error && harvestDetails && <div className="alert alert-warning m-3" role="alert">Minor issue during data refresh: {error}</div>}

                    <div style={{ display: "flex", justifyContent: isMerchantBuyer ? "space-between" : "flex-end", margin: "30px 70px", gap: "10px", flexWrap: "wrap" }}>
                        {isMerchantBuyer && !requestReview ? ( // Bought and request is NOT under review (i.e., completed)
                            <>
                                <h3 className={styles.Invsubscribe}>لقد قمت بشراء هذا الحصاد بالفعل</h3>
                                <button className={styles.InvButtsubscribe} onClick={() => setVisiblePaypalModal(true)}> اتمام عمليه الدفع</button>
                                <Modal isOpen={visiblePaypalModal} onRequestClose={() => setVisiblePaypalModal(false)} ariaHideApp={false} style={Paypalstyles}>
                                    <button onClick={() => setVisiblePaypalModal(false)} style={{ backgroundColor: 'transparent', border: 'none', fontSize: '24px', color: '#333', cursor: 'pointer', position: 'absolute', top: '10px', right: '10px' }}><i className="fa-solid fa-xmark"></i></button>
                                    <Paypal harvestId={currentHarvestId} purchaseRequestId={purchaseRequestId} type="merchant" />
                                </Modal>
                            </>
                        ) : requestReview ? ( // Request is under review (isClicked will be true here)
                            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", width: "100%" }} >
                                <div>
                                    <button style={{ marginLeft: "auto", marginRight: "auto", marginTop: "10px", border: "none", padding: "10px 20px", borderRadius: "10px", backgroundColor: "rgb(208, 4, 4)", color: "#fff" }} onClick={handleCancelBuyRequest}>الغاء طلب الشراء</button>
                                </div>
                                <div style={{ marginRight: "auto", marginLeft: "auto" }}>
                                    <p style={{ color: "black", marginTop: "10px", fontSize: "1.5rem", textAlign: "center" }}>
                                        <i className="fa-solid fa-hourglass-start" style={{ marginLeft: "10px" }}></i> طلب الشراء الخاص بك قيد المراجعة
                                    </p>
                                </div>
                            </div>
                        ) : ( // Not bought, no request pending
                            <>
                                <p className="fs-5 mx-3 text-center text-md-start" style={{ marginTop: "7px" }}>
                                    فرصة لشراء محصول طازج! قم بتقديم طلب شراء الآن.
                                    <i className="fa-solid fa-carrot text-warning mx-1"></i>
                                    <i className="fa-solid fa-truck text-primary mx-1"></i>
                                </p>
                                <div className="text-center text-md-start">
                                    <button className={`btn w-100 w-md-auto mt-2 ${styles.InvButtsubscribe}`} onClick={handleBuyNow}>اطلب الشراء الآن</button>
                                </div>
                                <Modal isOpen={visibleBuyRequestModal} onRequestClose={() => setVisibleBuyRequestModal(false)} ariaHideApp={false} style={BuyRequestStyles}>
                                    <button onClick={() => setVisibleBuyRequestModal(false)} style={{ backgroundColor: "transparent", border: "none", fontSize: "24px", color: "#333", cursor: "pointer", position: "absolute", top: "10px", right: "10px", }}><i className="fa-solid fa-xmark"></i></button>
                                    <BuyRequest
                                        setIsClicked={setIsClicked} // This will be set to true if request is successful
                                        setvisibleBuyRequestModal={setVisibleBuyRequestModal}
                                        harvestId={currentHarvestId}
                                        onSuccessRequest={fetchHarvestDetails}
                                    />
                                </Modal>
                            </>
                        )}
                    </div>

                    <div className="container mt-4" style={{ marginBottom: "20px" }}>
                        <h2 className={styles.Invtitledetails}>تفاصيل عن المزارع</h2>
                        <form className="p-4 rounded" style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px", fontSize: "1.5rem", backgroundImage: "url('/assets/seedetails.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
                            <div className="row align-items-center mb-3">
                                <div className="col-12 col-md-8 mb-3 mb-md-0">
                                    <div className="mb-3 align-items-center" style={{ display: "flex", gap: "15px" }}><label className="form-label">اسم المزارع</label><input readOnly value={farmerName} className="form-control" style={{ backgroundColor: "rgb(231, 231, 231)", width: "50%", textAlign: "center", fontSize: "1rem" }} /></div>
                                    <div className="mb-3 align-items-center" style={{ display: "flex", gap: "15px" }}><label className="form-label">رقم المحمول</label><input readOnly value={farmerPhone} className="form-control" style={{ backgroundColor: "rgb(231, 231, 231)", width: "50%", textAlign: "center", fontSize: "1rem" }} /></div>
                                    <div className="mb-3 align-items-center" style={{ display: "flex", gap: "15px" }}><label className="form-label">البريد الالكتروني</label><input readOnly value={farmerEmail} className="form-control" style={{ backgroundColor: "rgb(231, 231, 231)", width: "70%", textAlign: "center", fontSize: "1rem" }} /></div>
                                </div>
                                <div className="col-12 col-md-4 text-center">
                                    <img className="img-fluid" style={{ width: "400px", height: "300px", objectFit: "cover", borderRadius: "8px" }} src={farmerImageUrl || '/assets/default-farmer.png'} alt="Farmer" />
                                </div>
                            </div>
                            <div className="mb-3 align-items-center" style={{ display: "flex", gap: "15px" }}><label className="form-label">السيره الذاتيه</label><textarea readOnly rows={4} className="form-control" style={{ backgroundColor: "rgb(231, 231, 231)", width: "90%", fontSize: "1rem" }} value={farmerBio} /></div>
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center" style={{ margin: "5px 20px 5px 100px" }}>
                                <div className="text-warning fs-4 mb-2 mb-md-0" style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                                    <p style={{ color: "black", marginLeft: "20px", marginBottom: 0 }}> التقييم </p>
                                    {[1, 2, 3, 4, 5].map((star) => {
                                        // Use farmerOverallRate for display, `rating` state for merchant's own interaction
                                        const displayRating = hoverRating > 0 ? hoverRating : (rating > 0 ? rating : Math.round(farmerOverallRate));
                                        return (
                                            <i
                                                key={star}
                                                className={displayRating >= star ? "fa-solid fa-star text-warning" : "fa-regular fa-star"}
                                                onClick={() => handleRating(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                style={{ cursor: "pointer" }}
                                            ></i>
                                        );
                                    })}
                                </div>
                                <button type="button" className="btn mb-2 fs-4 mb-md-0" onClick={handleFavoriteToggle}>
                                    <span style={{ marginLeft: "10px" }}>اضافه الي المفضله</span>
                                    {isFavorite ? <i className="fa-solid fa-heart text-danger"></i> : <i className="fa-regular fa-heart"></i>}
                                </button>
                            </div>
                            <div className="d-flex justify-content-end " style={{ marginLeft: "30px", marginTop: "10px" }}><button type="button" className="btn fs-5" >  <span style={{ color: "#6C4C94" }}>تواصل مع المزارع</span>  <i className="fa-solid fa-message"></i></button></div>
                        </form>
                    </div>

                    <div className="container mt-4" style={{ marginBottom: "20px" }}>
                        <h2 className={styles.Invtitledetails}>صورة الحصاد</h2>
                        <form className="p-4 rounded" style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px", backgroundImage: "url('/assets/landinv.jpg')", backgroundSize: "cover", backgroundPosition: "center", padding: 0, height: "400px" }}>
                            <div style={{ width: "100%", height: "100%", overflow: "hidden", borderRadius: "0.25rem" }}>
                                <img className="img-fluid w-100" style={{ height: "100%", objectFit: "cover" }} src={harvestDisplayImageUrl} alt="Harvest" />
                            </div>
                        </form>
                    </div>

                    <div className="container mt-4" style={{ marginBottom: "70px" }}>
                        <h2 className={styles.Invtitledetails}>تفاصيل عن الحصاد</h2>
                        <form className="p-4 rounded d-flex justify-content-center" style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px", fontSize: "1.3rem", backgroundImage: "url('/assets/forminv.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
                            <div className="row justify-content-center mb-3 w-100">
                                <div className="col-12 col-md-10 col-lg-8">
                                    {[
                                        { label: "نوع المحصول", value: apiHarvestData?.cropType },
                                        { label: "اسم المحصول", value: apiHarvestData?.cropName },
                                        { label: "السعر (للوحدة)", value: apiHarvestData?.price ? `${apiHarvestData.price} ${apiHarvestData.currency || 'ج.م'}` : "N/A" }, // Assuming currency might be EGP if not specified
                                        { label: "الكمية المتاحة", value: apiHarvestData?.quantityAvailable ? `${apiHarvestData.quantityAvailable} ${apiHarvestData.quantityUnit || 'وحدة'}` : "N/A" }, // Assuming unit if not specified
                                        { label: "حالة الحصاد", value: apiHarvestData?.harvestStatus },
                                        { label: "تاريخ الحصاد", value: formatDate(apiHarvestData?.harvestDate) },
                                        // { label: "وصف إضافي", value: apiHarvestData?.description }, // Description not in new API response
                                    ].map(item => (
                                        (item.value !== undefined && item.value !== null) &&
                                        <div className="mb-3 d-flex align-items-center" key={item.label}>
                                            <label className="form-label" style={{ width: '35%', minWidth: '150px' }}>{item.label}</label>
                                            <input readOnly value={item.value ?? "N/A"} className="form-control" style={{ backgroundColor: "rgb(231, 231, 231)", width: '65%', fontSize: "1rem" }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </form>
                    </div>

                    {isMerchantBuyer && cycleUpdates && Array.isArray(cycleUpdates) && cycleUpdates.length > 0 && (
                        <div className="container mt-4" style={{ marginBottom: "20px" }}>
                            <h2 className={styles.Invtitledetails}>تحديثات عن هذا الحصاد</h2>
                            <form className="p-4 rounded" style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px", fontSize: "1.5rem", backgroundImage: "url('/assets/landinv.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
<Merchnewupdates cycleId={currentHarvestId} cycleUpdates={cycleUpdates} />                            </form>
                        </div>
                    )}
                </main>
            </div>
            <FooterMer />
        </div>
    );
}