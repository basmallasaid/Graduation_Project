import React, { useState, useEffect, useRef } from "react";
import NavbarInv from "../../Main/NavbarInv";
import NavSideInv from "../../Main/NavSideInv";
import FooterInv from "../../Main/FooterInv";
import styles from "../../../../Styles/style.module.css";
import Invnewupdates from './Invnewupdates';
import axios from "axios"; // Keep for localhost calls
import Paypal from "./paypal";
import Modal from 'react-modal';
import InvestmentRequest from "./InvestmentRequest";
import api from "../../../../API/axiosInstance"; // Axios instance for cityroots API
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Import toastify
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS

export default function SeeDetails() {
    const [isClicked, setIsClicked] = useState(false); // For "request investment" status
    const [visible, setVisible] = useState(false); // Paypal modal
    const [visibleInvestment, setvisibleInvestment] = useState(false); // InvestmentRequest modal
    const [isFavorite, setIsFavorite] = useState(false);
    const [rating, setRating] = useState(0); // Investor's rating for this farmer
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [buttonText, setButtonText] = useState("اشترك الان"); // Initial button text

    const timerRef = useRef(null);

    const [cycleDetails, setCycleDetails] = useState(null); // State to hold all cycle details
    
    const userData = JSON.parse(localStorage.getItem("user_data"));
    console.log("User Data (from localStorage):", userData); 
    const InvestorId = userData?.LoggedId;
    const { cycleId: cycleIdFromUrl } = useParams();
    const currentCycleId = parseInt(cycleIdFromUrl, 10);

    useEffect(() => {
        const fetchCycleDetails = async () => {
            if (currentCycleId === undefined || currentCycleId === null) {
                setError("Cycle ID is not specified.");
                setLoading(false);
                toast.error("Cycle ID is not specified.");
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const response = await api.get(
                    `Cycle/GetCycleForInvestor?cycleId=${currentCycleId}&InvestorId=${InvestorId}`
                );

                if (response.data) {
                    setCycleDetails(response.data);
                    setIsFavorite(response.data.isFarmerInFav || false);
                    setIsClicked(response.data.requestReview || false);

                    
                    if (typeof response.data.investorRatingForThisFarmer === 'number') { // Check if the field exists and is a number
                        setRating(response.data.investorRatingForThisFarmer);
                    } else {
                        setRating(0); // Default to 0 if no prior rating by this investor
                    }

                } else {
                    setError("Invalid data format from the server");
                    toast.error("Received invalid data from server.");
                }
            } catch (err) {
                const errorMessage = err.response?.data?.message || err.message || "Failed to fetch cycle details.";
                setError(`Failed to fetch cycle details. ${errorMessage}`);
                toast.error(errorMessage);
                console.error("Error fetching cycle details:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCycleDetails();
    }, [currentCycleId, InvestorId]);

    const handleRating = async (newRating) => {
        if (!cycleDetails?.farmer?.farmerId) {
            setError("Cannot rate: Missing farmer information.");
            toast.error("Cannot rate: Missing farmer information.");
            return;
        }

        try {
            await api.post("Rate", { // Endpoint for rating
                farmerId: cycleDetails.farmer.farmerId.toString(),
                rating: newRating,
            });
            setRating(newRating); // Update UI to show the new rating immediately
            toast.success("Rating submitted successfully!");
 
        } catch (error) {
            console.error("Error sending rating:", error);
            const errorMessage = error.response?.data?.message || "Failed to submit rating.";
            setError(`Failed to send rating: ${errorMessage}`);
            toast.error(errorMessage);
        }
    };

    const handleFavoriteToggle = async () => {
        if (!cycleDetails?.farmer?.farmerId) {
            setError("Cannot toggle favorite: Missing farmer information.");
            toast.error("Cannot toggle favorite: Missing farmer information.");
            return;
        }
        
        const newFavoriteStatus = !isFavorite;
        // Optimistically update UI
        setIsFavorite(newFavoriteStatus);

        try {
            await api.post("FavouriteFarmer", { // Endpoint for favoriting
                farmerId: cycleDetails.farmer.farmerId.toString(),
                // InvestorId is assumed to be handled by JWT token
            });
            toast.success(newFavoriteStatus ? "Farmer added to favorites!" : "Farmer removed from favorites!");
        } catch (error) {
            console.error("Error updating favorite status:", error);
            // Revert UI on error
            setIsFavorite(!newFavoriteStatus); 
            const errorMessage = error.response?.data?.message || "Failed to update favorite status.";
            setError(`Failed to update favorite status: ${errorMessage}`);
            toast.error(errorMessage);
        }
    };

    const handleSubscription = () => {
        setvisibleInvestment(true);
    };

    const Paypalstyles = {
        content: {
            maxWidth: '530px',
            margin: 'auto',
            padding: '10px',
            borderRadius: '10px',
            height: '450px'
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
    };
    const Investmentstyles = {
        content: {
            maxWidth: '550px',
            margin: 'auto',
            padding: '10px',
            borderRadius: '10px',
            backgroundColor: "#fff",
            height: '400px'
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
    };

    useEffect(() => {
        if (InvestorId && currentCycleId !== null && currentCycleId !== undefined) { 
            timerRef.current = setTimeout(async () => {
                try {
                    await axios.post("http://localhost:8000/recommandation", {
                        InvestorId,
                        cycleId: currentCycleId,
                    });
                    console.log("Recommendation data sent after 10 seconds for cycle:", currentCycleId);
                } catch (error) {
                    console.error("Error sending recommendation:", error);
                    // toast.warn("Could not send recommendation data (dev only)."); // Optional toast for dev
                }
            }, 10000);

            return () => {
                if (timerRef.current) {
                    clearTimeout(timerRef.current);
                }
            };
        }
    }, [InvestorId, currentCycleId]);

    if (loading) {
        return <div className="d-flex justify-content-center align-items-center min-vh-100">Loading cycle details...</div>;
    }

    if (error && !cycleDetails) { // Show main error if cycleDetails couldn't be loaded
        return <div className="alert alert-danger m-3" role="alert">Error: {error}</div>;
    }
    
    if (!cycleDetails) {
        return <div className="alert alert-warning m-3" role="alert">No cycle details found for cycle ID {currentCycleId}.</div>;
    }

    const farmerName = cycleDetails.farmer?.name || "N/A";
    const farmerPhone = cycleDetails.farmer?.phone || "N/A";
    const farmerEmail = cycleDetails.farmer?.email || "N/A";
    const farmerImageUrl = cycleDetails.farmer?.imageUrl || "/assets/default-farmer.png";
    const farmerBio = cycleDetails.farmer?.bio || "No biography available.";
    const farmerOverallRate = cycleDetails.farmer?.rate || 0; 

    const landParcelImageUrl = cycleDetails.landParcel?.imageUrl || "/assets/default-land.png";
    const landParcelLocation = cycleDetails.landParcel?.farmLocation || "N/A";

    const cycleName = cycleDetails.cycleName || "N/A";
    const currentTotalInvestment = cycleDetails.investmentCycle?.openInvestmentCycleDTO?.currentTotalInvestment ?? "N/A";
    const startDate = cycleDetails.investmentCycle?.startDate ? new Date(cycleDetails.investmentCycle.startDate).toLocaleDateString() : "N/A";
    const endDate = cycleDetails.investmentCycle?.endDate ? new Date(cycleDetails.investmentCycle.endDate).toLocaleDateString() : "N/A";
    const expectedFinancialGoal = cycleDetails.investmentCycle?.openInvestmentCycleDTO?.expectedFinancialGoal ?? "N/A";
    const availableProfitTypes = cycleDetails.investmentCycle?.openInvestmentCycleDTO?.availableProfitTypes || "N/A";
    const minimumInvestment = cycleDetails.investmentCycle?.openInvestmentCycleDTO?.minimumInvestment ?? "N/A";
    const maximumInvestment = cycleDetails.investmentCycle?.openInvestmentCycleDTO?.maximumInvestment ?? "N/A";
    const maxInvestorsAllowed = cycleDetails.investmentCycle?.openInvestmentCycleDTO?.maxInvestorsAllowed ?? "N/A";
    
    return (
        <div className="d-flex flex-column min-vh-100">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={true} // Set to true for Arabic
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <NavbarInv />
            <div className="d-flex flex-grow-1">
                <NavSideInv />
                <main className="flex-grow-1">
                    {error && <div className="alert alert-danger m-3" role="alert">Minor Error: {error}</div>} {/* For non-critical errors after load */}
                    <div style={{ display: "flex", justifyContent: cycleDetails.isInvestorSub ? "space-between" : "flex-end", margin: "30px 70px", gap: "10px", flexWrap: "wrap" }}>
                        {cycleDetails.isInvestorSub ? (
                            <>
                                <h3 className={styles.Invsubscribe}>انت بالفعل مشترك في هذه الدوره</h3>
                                <button className={styles.InvButtsubscribe} onClick={() => setVisible(true)}>اضغط للدفع</button>
                                <Modal isOpen={visible} onRequestClose={() => setVisible(false)}
                                    ariaHideApp={false}
                                    style={Paypalstyles}>
                                    <button onClick={() => setVisible(false)} style={{
                                        backgroundColor: 'transparent', border: 'none', fontSize: '24px', color: '#333',
                                        cursor: 'pointer', position: 'absolute', top: '10px', right: '10px',
                                    }}><i className="fa-solid fa-xmark"></i></button>
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
                                        <button
                                            className={`btn w-100 w-md-auto mt-2 ${styles.InvButtsubscribe}`}
                                            onClick={handleSubscription}
                                        >
                                            {buttonText}
                                        </button>
                                    </div>
                                ) : (
                                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent:"space-between", width:"100%" }} >
                                        <div>
                                            <button style={{ marginLeft: "auto", marginRight:"auto", marginTop: "10px", border: "none", padding: "10px 20px", borderRadius: "10px", backgroundColor: "rgb(208, 4, 4)", color: "#fff" }}
                                            // onClick={() => {/* Handle cancel request logic here */ toast.info("Cancel request clicked (not implemented)"); }}
                                            > 
                                            الغاء طلب الاستثمار 
                                            </button>
                                        </div>
                                        <div style={{ marginRight: "auto", marginLeft:"auto" }}>
                                            <p style={{ color: "black", marginTop: "10px", fontSize: "1.5rem", textAlign:"center" }}>
                                                <i className="fa-solid fa-hourglass-start" style={{ marginLeft: "10px" }}></i>
                                                طلبك قيد المراجعه
                                            </p>
                                        </div>
                                    </div>
                                )}
                                <Modal
                                    isOpen={visibleInvestment}
                                    onRequestClose={() => setvisibleInvestment(false)}
                                    ariaHideApp={false}
                                    style={Investmentstyles}
                                >
                                    <button
                                        onClick={() => setvisibleInvestment(false)}
                                        style={{
                                            backgroundColor: "transparent", border: "none", fontSize: "24px", color: "#333",
                                            cursor: "pointer", position: "absolute", top: "10px", right: "10px",
                                        }}
                                    >
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                    <InvestmentRequest setIsClicked={setIsClicked} setvisibleInvestment={setvisibleInvestment} cycleId={currentCycleId} />
                                </Modal>
                            </>
                        )}
                    </div>

                    <div className="container mt-4" style={{ marginBottom: "20px" }}>
                        <h2 className={styles.Invtitledetails}>تفاصيل عن المزارع</h2>
                        <form className="p-4 rounded" style={{
                             boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px", fontSize: "1.5rem" ,
                             backgroundImage: "url('/assets/seedetails.jpg')",
                             backgroundSize: "cover", backgroundPosition: "center",
                        }}>
                            <div className="row align-items-center mb-3">
                                <div className="col-12 col-md-8 mb-3 mb-md-0">
                                    <div className="mb-3 align-items-center" style={{ display: "flex", gap: "15px" }}>
                                        <label className="form-label">اسم المزارع</label>
                                        <input readOnly value={farmerName} className="form-control" style={{ backgroundColor: "rgb(231, 231, 231)", width: "50%", textAlign: "center", fontSize: "1rem" }} />
                                    </div>
                                    <div className="mb-3 align-items-center" style={{ display: "flex", gap: "15px" }}>
                                        <label className="form-label">رقم المحمول</label>
                                        <input readOnly value={farmerPhone} className="form-control" style={{ backgroundColor: "rgb(231, 231, 231)", width: "50%", textAlign: "center", fontSize: "1rem" }} />
                                    </div>
                                    <div className="mb-3 align-items-center" style={{ display: "flex", gap: "15px" }}>
                                        <label className="form-label">البريد الالكتروني</label>
                                        <input readOnly value={farmerEmail} className="form-control" style={{ backgroundColor: "rgb(231, 231, 231)", width: "70%", textAlign: "center", fontSize: "1rem" }} />
                                    </div>
                                </div>
                                <div className="col-12 col-md-4 text-center">
                                    <img className="img-fluid" style={{ width: "400px", height: "300px", objectFit: "cover", borderRadius:"8px" }} src={farmerImageUrl} alt="Farmer" />
                                </div>
                            </div>
                            <div className="mb-3 align-items-center" style={{ display: "flex", gap: "15px" }}>
                                <label className="form-label">السيره الذاتيه</label>
                                <textarea readOnly rows={4} className="form-control" style={{ backgroundColor: "rgb(231, 231, 231)", width: "90%", fontSize: "1rem" }} value={farmerBio} />
                            </div>
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center" style={{ margin: "5px 20px 5px 100px" }}>
                                <div className="text-warning fs-4 mb-2 mb-md-0" style={{ display: "flex", gap: "12px", alignItems:"center" }}>
                                    <p style={{ color: "black", marginLeft: "20px", marginBottom:0 }}> التقييم </p>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <i key={star} className={star <= rating ? "fa-solid fa-star text-warning" : "fa-regular fa-star"} onClick={() => handleRating(star)} style={{ cursor: "pointer" }}></i>
                                    ))}
                                    <span style={{color: "grey", fontSize:"1rem", marginLeft:"5px"}}>({farmerOverallRate}/5)</span>
                                </div>
                                <button
                                    type="button"
                                    className="btn mb-2 fs-4 mb-md-0"
                                    onClick={handleFavoriteToggle}
                                >
                                    <span style={{ marginLeft: "10px" }}>اضافه الي المفضله</span>
                                    {isFavorite
                                        ? <i className="fa-solid fa-heart text-danger"></i>
                                        : <i className="fa-regular fa-heart"></i>
                                    }
                                </button>
                            </div>
                            <div className="d-flex justify-content-end " style={{ marginLeft: "30px", marginTop: "10px" }}>
                                <button type="button" className="btn fs-5" >  <span style={{ color: "#6C4C94" }}>تواصل مع المزارع</span>  <i className="fa-solid fa-message"></i></button>
                            </div>
                        </form>
                    </div>

                    <div className="container mt-4" style={{ marginBottom: "20px" }}>
                        <h2 className={styles.Invtitledetails}>تفاصيل عن الدوره</h2>
                        <form
                            className="p-4 rounded"
                            style={{
                                boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
                                backgroundImage: "url('/assets/landinv.jpg')",
                                backgroundSize: "cover", backgroundPosition: "center", padding:0, height:"400px"
                            }}
                        >
                            <div style={{ width: "100%", height: "100%", overflow: "hidden", borderRadius:"0.25rem" }}>
                                <img
                                    className="img-fluid w-100"
                                    style={{ height: "100%", objectFit: "cover" }}
                                     src={`https://cityroots.runasp.net/${landParcelImageUrl}`}
                                    alt="Land Parcel"
                                />
                            </div>
                        </form>
                    </div>
                    <div className="container mt-4" style={{ marginBottom: "70px" }}>
                        <form
                            className="p-4 rounded d-flex justify-content-center"
                            style={{
                                boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
                                fontSize: "1.3rem", backgroundImage: "url('/assets/forminv.jpg')",
                                backgroundSize: "cover", backgroundPosition: "center",
                            }}
                        >
                            <div className="row justify-content-center mb-3 w-100">
                                <div className="col-12 col-md-10 col-lg-8">
                                    {[
                                        { label: "اسم الدوره", value: cycleName },
                                        { label: "الموقع", value: landParcelLocation },
                                        { label: "المبلغ المجمع", value: currentTotalInvestment },
                                        { label: "تاريخ البدايه", value: startDate },
                                        { label: "تاريخ النهايه", value: endDate },
                                        { label: "الهدف الاستثماري", value: expectedFinancialGoal },
                                        { label: "نوع العائد", value: availableProfitTypes },
                                        { label: "اقل مبلغ للاستثمار", value: minimumInvestment },
                                        { label: "اعلي مبلغ للاستثمار", value: maximumInvestment },
                                        { label: "عدد المستثمرين المسموح", value: maxInvestorsAllowed },
                                    ].map(item => (
                                        <div className="mb-3 d-flex align-items-center" key={item.label}>
                                            <label className="form-label" style={{ width: '35%', minWidth:'150px' }}>{item.label}</label>
                                            <input
                                                readOnly
                                                value={item.value}
                                                className="form-control"
                                                style={{ backgroundColor: "rgb(231, 231, 231)", width: '65%', fontSize: "1rem" }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </form>
                    </div>

                    {cycleDetails.isInvestorSub && (
                        <div
                            className="container mt-4"
                            style={{ marginBottom: "20px" }}
                        >
                            <h2 className={styles.Invtitledetails}>تفاصيل عن التحديثات علي الدوره</h2>
                            <form
                                className="p-4 rounded"
                                style={{
                                    boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
                                    fontSize: "1.5rem",
                                    backgroundImage: "url('/assets/landinv.jpg')",
                                    backgroundSize: "cover", backgroundPosition: "center",
                                }}
                            >
                                <Invnewupdates cycleId={currentCycleId} cycleUpdates={cycleDetails.cycleUpdates || []} />
                            </form>
                        </div>
                    )}
                </main>
            </div>
            <FooterInv />
        </div>
    );
}