import React, { useState, useEffect, useRef } from "react";
import NavbarInv from "../../Main/NavbarInv";
import NavSideInv from "../../Main/NavSideInv";
import FooterInv from "../../Main/FooterInv";
import styles from "../../../../Styles/style.module.css";
import Invnewupdates from './Invnewupdates';
// import axios from "axios"; // Keep for localhost calls - Not used directly here
import Paypal from "./paypal";
import Modal from 'react-modal';
import InvestmentRequest from "./InvestmentRequest";
import api from "../../../../API/axiosInstance"; // Axios instance for cityroots API
import { Link, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Import toastify
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS

export default function SeeDetails({ farmer: initialFarmerProp }) {
    const [isClicked, setIsClicked] = useState(false);
    const [visible, setVisible] = useState(false);
    const [visibleInvestment, setvisibleInvestment] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [rating, setRating] = useState(0); // Investor's rating for this farmer, initialized from API
    const [hoverRating, setHoverRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [buttonText, setButtonText] = useState("اشترك الان");

    const timerRef = useRef(null);
    const [cycleDetails, setCycleDetails] = useState(null);

    const userData = JSON.parse(localStorage.getItem("user_data"));
    const InvestorId = userData?.loggedId;
    const { cycleId: cycleIdFromUrl } = useParams();
    const currentCycleId = parseInt(cycleIdFromUrl, 10);

    const fetchCycleDetails = async () => {
        if (currentCycleId === undefined || currentCycleId === null || isNaN(currentCycleId)) {
            setError("Cycle ID is not specified or invalid.");
            setLoading(false);
            toast.error("Cycle ID is not specified or invalid.");
            return;
        }

        // setLoading(true); // Keep true if not already loading from initial load
        setError(null);
        try {
            const response = await api.get(
                `Cycle/GetCycleForInvestor?cycleId=${currentCycleId}&InvestorId=${InvestorId}`
            );

            if (response.data) {
                setCycleDetails(response.data);
                console.log("cycleDetails set from API:", response.data);

                setIsFavorite(response.data.isFarmerInFav || false);
                setIsClicked(response.data.requestReview || false);

                if (typeof response.data.investorRatingForThisFarmer === 'number') {
                    setRating(response.data.investorRatingForThisFarmer);
                } else {
                    setRating(0); 
                }

            } else {
                setError("Invalid data format from the server");
                toast.error("Received invalid data from server.");
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "Failed to fetch cycle details.";
            setError(`Failed to fetch cycle details. ${errorMessage}`);
            console.error("Error fetching cycle details:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true); 
        fetchCycleDetails();
    }, [currentCycleId, InvestorId]);
    
const handleRating = async (clickedRating) => {
    if (!cycleDetails?.farmer?.userId) {
        toast.error("Cannot rate: Missing farmer user ID.");
        return;
    }

    const farmerIdToRate = cycleDetails.farmer.userId;
    const previousLocalRating = rating; // Store previous state for rollback on error

    // --- Case 1: DELETING the rating ---
    if (rating === clickedRating) {
        // Optimistic UI update: Immediately reset the user's rating
        setRating(0);
        setHoverRating(0);

        try {
            const response = await api.delete("Rate", {
                data: { farmerId: farmerIdToRate },
            });

            toast.success("تم ازاله التقييم بنجاح");

            // Update the overall farmer rate with the new value from the API
            const newAverage = response.data.newAverageRating;
            setCycleDetails(prevDetails => ({
                ...prevDetails,
                farmer: {
                    ...prevDetails.farmer,
                    rate: newAverage,
                },
            }));

        } catch (error) {
            console.error("خطا في ازاله التقييم:", error);
            const errorMessage = error.response?.data?.message || "Failed to remove rating.";
            toast.error(errorMessage);
            // Rollback on failure
            setRating(previousLocalRating);
        }
    }
    // --- Case 2: ADDING or UPDATING the rating ---
    else {
        // Optimistic UI update: Immediately set the new rating
        setRating(clickedRating);

        try {
            const response = await api.post("Rate", {
                farmerId: farmerIdToRate,
                rating: clickedRating,
            });

            toast.success("تم تقييم المزارع بنجاح");

            // Update the overall farmer rate with the new value from the API
            const newAverage = response.data.newAverageRating;
            setCycleDetails(prevDetails => ({
                ...prevDetails,
                farmer: {
                    ...prevDetails.farmer,
                    rate: newAverage,
                },
            }));

        } catch (error) {
            console.error("Error sending rating:", error);
            const errorMessage = error.response?.data?.message || "Failed to submit rating.";
            toast.error(errorMessage);
            // Rollback on failure
            setRating(previousLocalRating);
        }
    }
};

    const handleFavoriteToggle = async () => {
        if (!cycleDetails?.farmer?.userId) {
            toast.error("Cannot toggle favorite: Missing farmer user ID.");
            return;
        }

        const farmerIdToToggle = cycleDetails.farmer.userId;
        const newFavoriteStatus = !isFavorite;

        try {
            if (newFavoriteStatus) {
                await api.post("FavouriteFarmer", { farmerId: farmerIdToToggle });
                toast.success("تم اضافه المزارع للمفضله");
            } else {
                await api.delete("FavouriteFarmer", { data: { farmerId: farmerIdToToggle } });
                toast.success("تم ازاله المزارع من المفضله");
            }
            setIsFavorite(newFavoriteStatus); 
        } catch (error) {
            console.error("Error updating favorite status:", error);
            const errorMessage = error.response?.data?.message || "Failed to update favorite status.";
            toast.error(errorMessage);
        }
    };

    const handleSubscription = () => {
        setvisibleInvestment(true);
    };

    const handleCancelRequest = async () => {
        const requestId = cycleDetails?.investmentRequestId;
        if (!requestId) {
            toast.error("معرف طلب الاستثمار غير موجود. لا يمكن الإلغاء.");
            return;
        }
        try {
            await api.delete(`InvestmentRequest/${requestId}`);
            toast.success("تم إلغاء طلب الاستثمار بنجاح!");
            setIsClicked(false);
            await fetchCycleDetails(); 
        } catch (error) {
            console.error("Error canceling investment request:", error);
            const errorMessage = error.response?.data?.message || "فشل إلغاء طلب الاستثمار.";
            toast.error(errorMessage);
        }
    };

    const Paypalstyles = {
        content: { maxWidth: '530px', margin: 'auto', padding: '10px', borderRadius: '10px', height: '450px' },
        overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    };
    const Investmentstyles = {
        content: { maxWidth: '550px', margin: 'auto', padding: '10px', borderRadius: '10px', backgroundColor: "#fff", height: '400px' },
        overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    };

    useEffect(() => {
        if (InvestorId && !isNaN(currentCycleId)) {
            timerRef.current = setTimeout(async () => {
                try {
                    await api.post(`Interactions/LogCycleForInvestor?cycleId=${currentCycleId}`, null);
                    console.log("Interaction log data sent");
                } catch (error) {
                    console.error("Error sending interaction log:", error);
                }
            }, 10000);
        }
        return () => clearTimeout(timerRef.current);
    }, [InvestorId, currentCycleId]);

    if (loading && !cycleDetails) { 
        return <div className="d-flex justify-content-center align-items-center min-vh-100">Loading cycle details...</div>;
    }

    if (error && !cycleDetails) {
        return <div className="alert alert-danger m-3" role="alert">Error: {error}</div>;
    }

    if (!cycleDetails) {
        return <div className="alert alert-warning m-3" role="alert">No cycle details found for cycle ID {currentCycleId}.</div>;
    }

    const { farmer, landParcel, investmentCycle, cycleName: pageCycleName, isInvestorSub, cycleUpdates } = cycleDetails;
    const farmerName = farmer?.name || "N/A";
    const farmerPhone = farmer?.phone || "N/A";
    const farmerEmail = farmer?.email || "N/A";
    const farmerImageUrl = farmer?.imageUrl ? `https://cityroots.runasp.net/${farmer.imageUrl}` : "/assets/default-farmer.png";
    const farmerBio = farmer?.bio || "No biography available.";
    const farmerOverallRate = farmer?.rate || 0;

    let landParcelImageUrl = landParcel?.imageUrl || "/assets/default-land.png";
    if (landParcel?.imageUrl && !landParcel.imageUrl.startsWith('http') && !landParcel.imageUrl.startsWith('/')) {
        landParcelImageUrl = `https://cityroots.runasp.net/${landParcel.imageUrl}`;
    }

    const landParcelLocation = landParcel?.farmLocation || "N/A";
    const currentTotalInvestment = investmentCycle?.openInvestmentCycleDTO?.currentTotalInvestment ?? "N/A";
    const startDate = investmentCycle?.startDate ? new Date(investmentCycle.startDate).toLocaleDateString() : "N/A";
    const endDate = investmentCycle?.endDate ? new Date(investmentCycle.endDate).toLocaleDateString() : "N/A";
    const expectedFinancialGoal = investmentCycle?.openInvestmentCycleDTO?.expectedFinancialGoal ?? "N/A";
    const availableProfitTypes = investmentCycle?.openInvestmentCycleDTO?.availableProfitTypes || "N/A";
    const minimumInvestment = investmentCycle?.openInvestmentCycleDTO?.minimumInvestment ?? "N/A";
    const maximumInvestment = investmentCycle?.openInvestmentCycleDTO?.maximumInvestment ?? "N/A";
    const maxInvestorsAllowed = investmentCycle?.openInvestmentCycleDTO?.maxInvestorsAllowed ?? "N/A";

    return (
        <div className="d-flex flex-column min-vh-100">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={true} pauseOnFocusLoss draggable pauseOnHover />
            <NavbarInv />
            <div className="d-flex flex-grow-1">
                <NavSideInv />
                <main className={` flex-grow-1 ${styles.hid} `}>
                    {error && cycleDetails && <div className="alert alert-warning m-3" role="alert">Minor issue during data refresh: {error}</div>}

                    <div style={{ display: "flex", justifyContent: isInvestorSub ? "space-between" : "flex-end", margin: "30px 70px", gap: "10px", flexWrap: "wrap" }}>
                        {isInvestorSub ? (
                            <>
                                <h3 className={styles.Invsubscribe}>انت بالفعل مشترك في هذه الدوره</h3>
                                <button className={styles.InvButtsubscribe} onClick={() => setVisible(true)}>اضغط للدفع</button>
                                <Modal isOpen={visible} onRequestClose={() => setVisible(false)} ariaHideApp={false} style={Paypalstyles}>
                                    <button onClick={() => setVisible(false)} style={{ backgroundColor: 'transparent', border: 'none', fontSize: '24px', color: '#333', cursor: 'pointer', position: 'absolute', top: '10px', right: '10px' }}><i className="fa-solid fa-xmark"></i></button>
                                    <Paypal cycleId={currentCycleId} />
                                </Modal>
                            </>
                        ) : (
                            <>
                                {!isClicked && (
                                    <p className="fs-5 mx-3 text-center text-md-start" style={{ marginTop: "7px" }}>
                                        فرصتك للاستثمار تبدأ هنا! أنت غير مشترك في هذه الدورة، اضغط للاشتراك الآن وابدأ في جني الأرباح!
                                        <i className="fa-solid fa-sack-dollar text-warning mx-1"></i>
                                        <i className="fa-solid fa-seedling text-success mx-1"></i>
                                    </p>
                                )}
                                {!isClicked ? (
                                    <div className="text-center text-md-start">
                                        <button className={`btn w-100 w-md-auto mt-2 ${styles.InvButtsubscribe}`} onClick={handleSubscription}>{buttonText}</button>
                                    </div>
                                ) : (
                                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", width: "100%" }} >
                                        <div>
                                            <button style={{ marginLeft: "auto", marginRight: "auto", marginTop: "10px", border: "none", padding: "10px 20px", borderRadius: "10px", backgroundColor: "rgb(208, 4, 4)", color: "#fff" }} onClick={handleCancelRequest}>الغاء طلب الاستثمار</button>
                                        </div>
                                        <div style={{ marginRight: "auto", marginLeft: "auto" }}>
                                            <p style={{ color: "black", marginTop: "10px", fontSize: "1.5rem", textAlign: "center" }}>
                                                <i className="fa-solid fa-hourglass-start" style={{ marginLeft: "10px" }}></i> طلبك قيد المراجعه
                                            </p>
                                        </div>
                                    </div>
                                )}
                                <Modal isOpen={visibleInvestment} onRequestClose={() => setvisibleInvestment(false)} ariaHideApp={false} style={Investmentstyles}>
                                    <button onClick={() => setvisibleInvestment(false)} style={{ backgroundColor: "transparent", border: "none", fontSize: "24px", color: "#333", cursor: "pointer", position: "absolute", top: "10px", right: "10px", }}><i className="fa-solid fa-xmark"></i></button>
                                    <InvestmentRequest setIsClicked={setIsClicked} setvisibleInvestment={setvisibleInvestment} cycleId={currentCycleId} onSuccessRequest={fetchCycleDetails} />
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
                                <div className="col-12 col-md-4 text-center"><img className="img-fluid" style={{ width: "400px", height: "300px", objectFit: "cover", borderRadius: "8px" }} src={farmerImageUrl} alt="Farmer" /></div>
                            </div>
                            <div className="mb-3 align-items-center" style={{ display: "flex", gap: "15px" }}><label className="form-label">السيره الذاتيه</label><textarea readOnly rows={4} className="form-control" style={{ backgroundColor: "rgb(231, 231, 231)", width: "90%", fontSize: "1rem" }} value={farmerBio} /></div>
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center" style={{ margin: "5px 20px 5px 100px" }}>
                               <div className="text-warning fs-4 mb-2 mb-md-0" style={{ display: "flex", gap: "12px", alignItems: "center" }}>
    <p style={{ color: "black", marginLeft: "20px", marginBottom: 0 }}> التقييم </p>
    {[1, 2, 3, 4, 5].map((star) => {
        // This logic correctly prioritizes the user's immediate action
        const effectiveRating = hoverRating > 0
                                ? hoverRating
                                : (rating > 0
                                    ? rating
                                    // Use the live value from the state
                                    : Math.round(cycleDetails?.farmer?.rate || 0));
        return (
            <i
                key={star}
                className={
                    effectiveRating >= star
                        ? "fa-solid fa-star text-warning"
                        : "fa-regular fa-star"
                }
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
<div className="d-flex justify-content-end " style={{ marginLeft: "30px", marginTop: "10px" }}>
                                <Link
                                    to="/Chatinterface"
                                    state={{ 
                                        farmerToChatWith: {
                                            userId: farmer?.userId, // farmer is from harvestDetails
                                            name: farmer?.name,
                                            imageUrl: farmer?.imageUrl 
                                        }
                                    }}
                                    type="button"
                                    className="btn fs-5"
                                >
                                    <span style={{ color: "#6C4C94" }}>تواصل مع المزارع</span>
                                    <i className="fa-solid fa-message"></i>
                                </Link>
                            </div>                        </form>
                    </div>

               <div className="container mt-4" style={{ marginBottom: "20px" }}>
    <h2 className={styles.Invtitledetails}>تفاصيل عن الدوره</h2>
    <form className="p-4 rounded" style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px", backgroundImage: "url('/assets/landinv.jpg')", backgroundSize: "cover", backgroundPosition: "center", padding: 0, height: "400px" }}>
        
        {/* This div gets the white background */}
        <div style={{ 
            width: "100%", 
            height: "100%", 
            overflow: "hidden", 
            borderRadius: "0.25rem",
            backgroundColor: "white" // <-- ADDED: This fills the extra space
        }}>
            <img 
                className="img-fluid w-100" 
                style={{ 
                    height: "100%", 
                    objectFit: "contain" // <-- CHANGED: This fits the entire image
                }} 
                src={landParcelImageUrl} 
                alt="Land Parcel" 
            />
        </div>
        
    </form>
</div>

                    <div className="container mt-4" style={{ marginBottom: "70px" }}>
                        <form className="p-4 rounded d-flex justify-content-center" style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px", fontSize: "1.3rem", backgroundImage: "url('/assets/forminv.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
                            <div className="row justify-content-center mb-3 w-100">
                                <div className="col-12 col-md-10 col-lg-8">
                                    {[
                                        { label: "اسم الدوره", value: pageCycleName }, { label: "الموقع", value: landParcelLocation },
                                        { label: "المبلغ المجمع", value: currentTotalInvestment }, { label: "تاريخ البدايه", value: startDate },
                                        { label: "تاريخ النهايه", value: endDate }, { label: "الهدف الاستثماري", value: expectedFinancialGoal },
                                        { label: "نوع العائد", value: availableProfitTypes }, { label: "اقل مبلغ للاستثمار", value: minimumInvestment },
                                        { label: "اعلي مبلغ للاستثمار", value: maximumInvestment }, { label: "عدد المستثمرين المسموح", value: maxInvestorsAllowed },
                                    ].map(item => (
                                        <div className="mb-3 d-flex align-items-center" key={item.label}>
                                            <label className="form-label" style={{ width: '35%', minWidth: '150px' }}>{item.label}</label>
                                            <input readOnly value={item.value ?? "N/A"} className="form-control" style={{ backgroundColor: "rgb(231, 231, 231)", width: '65%', fontSize: "1rem" }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </form>
                    </div>

                    {isInvestorSub && cycleUpdates && (
                        <div className="container mt-4" style={{ marginBottom: "20px" }}>
                            <h2 className={styles.Invtitledetails}>تفاصيل عن التحديثات علي الدوره</h2>
                            <form className="p-4 rounded" style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px", fontSize: "1.5rem", backgroundImage: "url('/assets/landinv.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
                                <Invnewupdates cycleId={currentCycleId} cycleUpdates={cycleUpdates || []} />
                            </form>
                        </div>
                    )}
                </main>
            </div>
            <FooterInv />
        </div>
    );
}