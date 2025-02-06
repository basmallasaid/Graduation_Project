import React, { useState, useEffect, useRef } from "react";
import NavbarInv from "../../Main/NavbarInv";
import NavSideInv from "../../Main/NavSideInv";
import FooterInv from "../../Main/FooterInv";
import styles from "../../../../Styles/style.module.css";
import Invnewupdates from './Invnewupdates';
import axios from "axios";
import Paypal from "./paypal";
import Modal from 'react-modal';
import InvestmentRequest from "./InvestmentRequest";

export default function SeeDetails() {
    const [isClicked, setIsClicked] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visibleInvestment, setvisibleInvestment] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [rating, setRating] = useState(0);
    const [imageUrl, setImageUrl] = useState('');
    const [farmLocation, setFarmLocation] = useState("");
    const [isInvestorSub, setIsInvestorSub] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [buttonText, setButtonText] = useState("اشترك الان");
    const [cycleId, setCycleId] = useState(null);
    const [isInReview, setIsInReview] = useState(false)



    const investorId = 123; 
    // const cycleId=19;
   const timerRef = useRef(null); 

    const [farmer, setFarmer] = useState({
        name: "",
        email: "",
        phone: "",
        bio: "",
        imageUrl:""
    });
    const [cycle, setCycle] = useState({
        cycleName: "",
        farmLocation: "",
        startDate: "",
        endDate: "",
        expectedYield: "",
        openInvestmentCycleDTO: {
            expectedFinancialGoal: "",
            minimumInvestment: "",
            maximumInvestment: "",
            maxInvestorsAllowed: "",
            availableProfitTypes: "",
        }
    });

   



// farmer details
    useEffect(() => {
        const fetchFarmerData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get("http://localhost:8000/farmer");

                // console.log("API Response (Farmer):", response);
                if (response.data) {
                    setFarmer(response.data);
                } else {
                    setError("Invalid data format from the server (Farmer)");
                }
            } catch (err) {
                setError("Failed to fetch farmer data.");
                console.error("Error fetching farmer data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFarmerData();
    }, []);
    
//cycle details
useEffect(() => {
    const fetchCycleData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("http://localhost:8000/investmentCycle");
  
        if (response.data) {
          const cycleData = response.data;
  
          setCycle({
            cycleName: cycleData.cycleName,
            farmLocation: cycleData.farmLocation,
            startDate: cycleData.startDate,
            endDate: cycleData.endDate,
            expectedYield: cycleData.expectedYield,
            openInvestmentCycleDTO: cycleData.openInvestmentCycleDTO,
          });
  
          // Set cycleId here
          setCycleId(cycleData.cycleId);  // assuming the cycleId is in the response
        } else {
          setError("Invalid data format from the server (Investment Cycle)");
        }
      } catch (err) {
        setError("Failed to fetch investment cycle data.");
        console.error("Error fetching investment cycle data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCycleData();
  }, []);

//    rating farmer
const handleRating = async (newRating) => {
    setRating(newRating);

    try {
        await axios.post("http://localhost:8000/farmerRate", {
            farmerId: farmer?.farmerId,  // Ensure farmer data is loaded before using
            investorId,
            ratingValue: newRating,
        });

        console.log("Rating sent successfully!");
    } catch (error) {
        console.error("Error sending rating:", error);
        setError("Failed to send rating");
    }
};
//favorite farmer
const handleFavoriteToggle = async () => {
    // Toggle the favorite state
    setIsFavorite(!isFavorite);

    try {
        await axios.post("http://localhost:8000/favorite", {
            farmerId: farmer?.farmerId,  // Ensure farmer data is loaded before using
            investorId,
        });

        console.log("Favorite status updated!");
    } catch (error) {
        console.error("Error updating favorite status:", error);
        setError("Failed to update favorite status");
    }
};
    // subscribe button endpoint
   
    useEffect(() => {
        fetch("http://localhost:8000/isInvestorSub") 
            .then((response) => response.json())
            .then((data) => {
                // console.log("API Response:", data); // Log API response
                setIsInvestorSub(data); 
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);


    const handleSubscription = async () => {
        setvisibleInvestment(true);
      };
    
      const checkSubscriptionStatus = async () => {
        try {
          const response = await fetch("http://localhost:8000/requestReview"); // Replace with your actual endpoint
          const data = await response.json();
    
          console.log("API Response:", data);
    
          if (data === true) {
            setButtonText("طلبك تحت المراجعه");
            setIsInReview(true);
            setIsClicked(true);
          } else {
              setButtonText("اشترك الان");
            setIsInReview(false);
            setIsClicked(false)
    
          }
    
    
        } catch (error) {
          console.error("Error checking subscription status:", error);
        }
      };
    
      useEffect(() => {
        checkSubscriptionStatus();
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
    
      useEffect(() => {
        if (isClicked) {
            checkSubscriptionStatus();
        }
      }, [isClicked])

    // console.log("Current isInvestorSub state:", isInvestorSub); // Log updated state
    const Paypalstyles = {
        content: {
          maxWidth: '530px', // Set your desired width
          margin: 'auto', // Centers the modal horizontally
          padding: '10px', // Add padding for better spacing
          borderRadius: '10px', // Optional: round corners
          height:'450px'
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: dim background
        },
      };
    const Investmentstyles = {
        content: {
          maxWidth: '550px', // Set your desired width
          margin: 'auto', // Centers the modal horizontally
          padding: '10px', // Add padding for better spacing
          borderRadius: '10px', // Optional: round corners
          backgroundColor:"#fff",
          height:'400px'
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: dim background
        },
      };

      useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8000/landParcel");
                console.log("API Response:", response.data);
                
                if (response.data) {
                    if (response.data.imageUrl) {
                        console.log("Final Image URL:", response.data.imageUrl);
                        setImageUrl(response.data.imageUrl);
                    } else {
                        console.error("Image data structure is incorrect or missing");
                    }

                    if (response.data.farmLocation) {
                        setFarmLocation(response.data.farmLocation);
                    } else {
                        console.error("farmLocation data is missing in API response.");
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);
        // Recommendation Logic

        useEffect(() => {
            if (cycleId !== null) { // Ensure cycleId is available before sending the request
              timerRef.current = setTimeout(async () => {
                try {
                  await axios.post("http://localhost:8000/recommandation", {
                    investorId,
                    cycleId, // cycleId from the first useEffect
                  });
                  console.log("Recommendation data sent after 10 seconds");
                } catch (error) {
                  console.error("Error sending recommendation:", error);
                }
              }, 10000);
          
              return () => {
                if (timerRef.current) {
                  clearTimeout(timerRef.current);
                }
              };
            }
          }, [investorId, cycleId]);

    return (
        <div className="d-flex flex-column min-vh-100">
            <NavbarInv />
            <div className="d-flex flex-grow-1">
                <NavSideInv />
                <main className="flex-grow-1">
                <div style={{ display: "flex", justifyContent: isInvestorSub ? "space-between" : "flex-end", margin: "30px 70px",gap:"10px" }}>
      {isInvestorSub ? (
        <>
          <h3 className={styles.Invsubscribe}>انت بالفعل مشترك في هذه الدوره</h3>
          <button className={styles.InvButtsubscribe} onClick={() => setVisible(true)}>اضغط للدفع</button>
             <Modal isOpen={visible} onRequestClose={() => setVisible(false)}
                          ariaHideApp={false}
          
                          style={Paypalstyles}>
                          <button onClick={() => setVisible(false)}><i className="fa-solid fa-xmark"
                            style={{
                              backgroundColor: 'transparent',
                              border: 'none',
                              fontSize: '24px',
                              color: '#333',
                              cursor: 'pointer',
                              position: 'absolute',
                              top: '10px',
                              right: '10px',
                            }} ></i></button>
        {cycleId !== null && <Paypal cycleId={cycleId} />}
          
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
                <p
                    style={{
                        color: "black",
                        marginTop: "10px",
                        fontSize: "1.8rem",
                        marginLeft: "20px",
                    }}
                >
                    <i className="fa-solid fa-hourglass-start" style={{ marginLeft: "10px" }}></i>
                    {buttonText}
                </p>
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
                        backgroundColor: "transparent",
                        border: "none",
                        fontSize: "24px",
                        color: "#333",
                        cursor: "pointer",
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                    }}
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>
                <InvestmentRequest setIsClicked={setIsClicked}  setvisibleInvestment={setvisibleInvestment} />
            </Modal>
        </>
      )}
    </div>

                    <div className="container mt-4" style={{ marginBottom: "20px" }}>
                        <h2 className={styles.Invtitledetails}>تفاصيل عن المزارع</h2>
                        <form className="p-4 rounded" style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px", fontSize: "1.5rem" }}>
                            <div className="row align-items-center mb-3">
                                <div className="col-12 col-md-8 mb-3 mb-md-0">
                                    <div className="mb-3 align-items-center" style={{display:"flex",gap:"15px"}}>
                                        <label className="form-label">اسم المزارع</label>
                                        <input readOnly value={farmer.name} className="form-control" style={{ backgroundColor: "rgb(231, 231, 231)",width:"50%",textAlign:"center",fontSize:"1rem" }} />
                                    </div>
                                    <div className="mb-3 align-items-center" style={{display:"flex",gap:"15px"}}>
                                        <label className="form-label">رقم المحمول</label>
                                        <input readOnly value={farmer.phone} className="form-control" style={{ backgroundColor: "rgb(231, 231, 231)",width:"50%" ,textAlign:"center"}} />
                                    </div>
                                    <div className="mb-3 align-items-center" style={{display:"flex",gap:"15px"}}
                                    
                    >
                                        <label className="form-label">البريد الالكتروني</label>
                                        <input readOnly value={farmer.email} className="form-control" style={{ backgroundColor: "rgb(231, 231, 231)" ,width:"70%",textAlign:"center"}} />
                                    </div>
                                </div>
                                <div className="col-12 col-md-4 text-center">
                                    <img className="img-fluid" style={{ width: "400px", height: "300px", objectFit: "cover" }} src={farmer.imageUrl} alt="Farmer" />
                                </div>
                            </div>
                            <div className="mb-3 align-items-center" style={{display:"flex",gap:"15px"}}>
                                <label className="form-label">السيره الذاتيه</label>
                                <textarea readOnly rows={4} className="form-control" style={{ backgroundColor: "rgb(231, 231, 231)" ,width:"90%"}} value={farmer.bio} />
                            </div>
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center" style={{margin:"5px 100px"}}>
                            <div className="text-warning fs-4 mb-2 mb-md-0" style={{display:"flex",gap:"12px"}}>
                                <p style={{color:"black",marginLeft:"20px"}}> التقييم </p>

                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <i key={star} className={star <= rating ? "fa-solid fa-star text-warning" : "fa-regular fa-star"} onClick={() => handleRating(star)} style={{ cursor: "pointer" }}></i> 
                                    ))}
                                </div>
                                <button 
        className="btn mb-2 fs-4 mb-md-0" 
        onClick={(e) => {
            e.preventDefault(); 
            handleFavoriteToggle();
        }}
    >
        <span style={{marginLeft:"10px"}}>اضافه الي المفضله</span>
        {isFavorite 
            ? <i className="fa-solid fa-heart text-danger"></i> 
            : <i className="fa-regular fa-heart"></i>
        }   
    </button>
            
                            </div>
                            <div className="d-flex justify-content-end " style={{marginLeft:"30px",marginTop:"10px"}}>
                                <button className="btn fs-5" >  <span style={{color:"#6C4C94"}}>تواصل مع المزارع</span>  <i className="fa-solid fa-message"></i></button>
                                </div>
                        </form>

                    </div>

                    <div className="container mt-4" style={{ marginBottom: "20px" }}>
                        <h2 className={styles.Invtitledetails}>تفاصيل عن الدوره</h2>
                        <form
                            className="p-4 rounded"
                            style={{
                                boxShadow:
                                    "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",

                            }}
                        >
                         <div style={{ width: "100%", height: "50%", overflow: "hidden" }}>
          {imageUrl ?  
                <img
                    className="img-fluid w-100"
                    style={{ height: "100%", objectFit: "cover" }}
                    src={imageUrl}
                    alt="Land Parcel"
                />
          : <div>Loading Image...</div>  
        }
                                     
      </div>
                        </form>
                    </div>
                    <div className="container mt-4" style={{ marginBottom: "70px" }}>
                        <form
                            className="p-4 rounded d-flex justify-content-center"
                            style={{
                                boxShadow:
                                    "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
                                fontSize: "1.3rem"

                            }}
                        >
                            <div className="row justify-content-center mb-3 w-100">
                                <div className="col-12 col-md-8">
                                    <div className="mb-3 d-flex align-items-center">
                                        <label className="form-label" style={{ width: '25%' }}>اسم الدوره</label>
                                        <input
                                            readOnly
                                            value={cycle.cycleName}
                                            className="form-control"
                                            style={{ backgroundColor: "rgb(231, 231, 231)", width: '75%' }}
                                        />
                                    </div>
                                    <div className="mb-3 d-flex align-items-center">
                                        <label className="form-label" style={{ width: '25%' }}>الموقع</label>
                                        <input
                                            readOnly
                                            value={farmLocation}
                                            className="form-control"
                                            style={{ backgroundColor: "rgb(231, 231, 231)", width: '75%' }}
                                        />
                                    </div>
                                    <div className="mb-3 d-flex align-items-center">
                                        <label className="form-label" style={{ width: '25%' }}>المبلغ المجمع</label>
                                        <input
                                            readOnly
                                            value={cycle.openInvestmentCycleDTO.currentTotalInvestment}
                                            className="form-control"
                                            style={{ backgroundColor: "rgb(231, 231, 231)", width: '75%' }}
                                        />
                                    </div>
                                    <div className="mb-3 d-flex align-items-center">
                                        <label className="form-label" style={{ width: '25%' }}>تاريخ البدايه</label>
                                        <input
                                            readOnly
                                            value={cycle.startDate}
                                            className="form-control"
                                            style={{ backgroundColor: "rgb(231, 231, 231)", width: '75%' }}
                                        />
                                    </div>
                                    <div className="mb-3 d-flex align-items-center">
                                        <label className="form-label" style={{ width: '25%' }}>تاريخ النهايه</label>
                                        <input
                                            readOnly
                                            value={cycle.endDate}
                                            className="form-control"
                                            style={{ backgroundColor: "rgb(231, 231, 231)", width: '75%' }}
                                        />
                                    </div>
                                    <div className="mb-3 d-flex align-items-center">
                                        <label className="form-label" style={{ width: '25%' }}>الهدف الاستثماري</label>
                                        <input
                                            readOnly
                                            value={cycle.openInvestmentCycleDTO.expectedFinancialGoal}
                                            className="form-control"
                                            style={{ backgroundColor: "rgb(231, 231, 231)", width: '75%' }}
                                        />
                                    </div>
                                    <div className="mb-3 d-flex align-items-center">
                                        <label className="form-label" style={{ width: '25%' }}>نوع العائد</label>
                                        <input
                                            readOnly
                                            value={cycle.openInvestmentCycleDTO.availableProfitTypes}
                                            className="form-control"
                                            style={{ backgroundColor: "rgb(231, 231, 231)", width: '75%' }}
                                        />
                                    </div>
                                    <div className="mb-3 d-flex align-items-center">
                                        <label className="form-label" style={{ width: '25%' }}>اقل مبلغ للاستثمار</label>
                                        <input
                                            readOnly
                                            value={cycle.openInvestmentCycleDTO.minimumInvestment}
                                            className="form-control"
                                            style={{ backgroundColor: "rgb(231, 231, 231)", width: '75%' }}
                                        />
                                    </div>
                                    <div className="mb-3 d-flex align-items-center">
                                        <label className="form-label" style={{ width: '25%' }}>اعلي مبلغ للاستثمار</label>
                                        <input
                                            readOnly
                                            value={cycle.openInvestmentCycleDTO.maximumInvestment}
                                            className="form-control"
                                            style={{ backgroundColor: "rgb(231, 231, 231)", width: '75%' }}
                                        />
                                    </div>
                                    <div className="mb-3 d-flex align-items-center">
                                        <label className="form-label" style={{ width: '25%' }}>عدد المستثمرين المسموح</label>
                                        <input
                                            readOnly
                                            value={cycle.openInvestmentCycleDTO.maxInvestorsAllowed}
                                            className="form-control"
                                            style={{ backgroundColor: "rgb(231, 231, 231)", width: '75%' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>


                    <div
    className="container mt-4"
    style={{
        marginBottom: "20px",
        display: isInvestorSub ? "block" : "none" // Hide the div when isInvestorSub is false
    }}
>
    <h2 className={styles.Invtitledetails}>تفاصيل عن التحديثات علي الدوره</h2>
    <form
        className="p-4 rounded"
        style={{
            boxShadow:
                "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
            fontSize: "1.5rem"
        }}
    >
        <Invnewupdates />
    </form>
</div>

                </main>
            </div>
            <FooterInv />
        </div>
    );
}