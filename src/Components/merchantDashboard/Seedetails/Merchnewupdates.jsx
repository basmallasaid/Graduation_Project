// Invnewupdates.js
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios"; // Using axios directly
import "react-toastify/dist/ReactToastify.css";
import styles from "../../../Styles/style.module.css";
import api from "../../../API/axiosInstance"; // You have this, so you can use it instead of direct axios

export default function Merchnewupdates({ cycleId, cycleUpdates }) {
    const [updatesToDisplay, setUpdatesToDisplay] = useState([]);
    const [loading, setLoading] = useState(true); // Default to true if we might fetch
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("Merchnewupdates useEffect triggered. PROPS:", { cycleId, cycleUpdates });

        // Determine if we have updates directly from props
        const hasUpdatesFromProp = cycleUpdates && Array.isArray(cycleUpdates) && cycleUpdates.length > 0;
        // Determine if we have a valid cycleId to fetch
        const canFetchWithCycleId = cycleId !== undefined && cycleId !== null;

        if (hasUpdatesFromProp) {
            console.log("Merchnewupdates: Using provided cycleUpdates prop.");
            setUpdatesToDisplay(cycleUpdates);
            setLoading(false);
            setError(null);
        } else if (canFetchWithCycleId) {
            console.log(`Invnewupdates: Fetching updates for cycleId: ${cycleId}`);
            setLoading(true); // Explicitly set loading before fetch
            setError(null);
            const fetchApiData = async () => {
                try {
                    const response = await api.get(`CycleUpdate/cycle/${cycleId}`);
                    if (Array.isArray(response.data)) {
                        setUpdatesToDisplay(response.data);
                    } else if (response.data === null || response.data === undefined) {
                        setUpdatesToDisplay([]); // No updates from API
                    } else {
                        console.warn("Merchnewupdates: API returned non-array data:", response.data);
                        setUpdatesToDisplay([]); // Default to empty
                    }
                } catch (err) {
                    console.error("Merchnewupdates: Error fetching cycle updates:", err);
                    setError(err.response?.data?.message || err.message || "فشل في تحميل تحديثات الدورة.");
                    setUpdatesToDisplay([]);
                } finally {
                    setLoading(false);
                }
            };
            fetchApiData();
        } else {
            // Neither direct updates nor a way to fetch them
            console.log("Merchnewupdates: No sufficient props (cycleUpdates or cycleId). Displaying no updates.");
            setUpdatesToDisplay([]);
            setLoading(false); // Not loading, nothing to do
            setError(null); // No error, just no data
        }
    }, [cycleId, cycleUpdates]); // Dependencies

    const ProgressBar = ({ progress }) => (
        <div style={{ position: "relative", height: "20px", marginTop:"20px" /* Added margin for better spacing */ }}>
            <div
                style={{
                    width: "100%",
                    height: "10px",
                    backgroundColor: "#d3d3d3",
                    position: "absolute",
                    top: "50%",
                    left: "0",
                    transform: "translateY(-50%)",
                    borderRadius: "5px",
                }}
            />
            <div
                style={{
                    width: `${progress}%`,
                    height: "10px",
                    backgroundColor: "#4caf50",
                    position: "absolute",
                    top: "50%",
                    left: "0",
                    transform: "translateY(-50%)",
                    borderRadius: "5px",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: `${progress}%`,
                    transform: "translate(-50%, -50%)",
                    width: "20px",
                    height: "20px",
                    backgroundColor: "#fff",
                    borderRadius: "50%",
                    border: "2px solid #4caf50",
                    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                }}
            />
            <span
                style={{
                    position: "absolute",
                    top: "50%",
                    left: `${progress}%`,
                    transform: "translate(-50%, -50%)", // Centering text
                    fontSize: "12px", // Smaller font for the % inside the circle
                    color: "#333",
                    // marginTop: "25px", // Removed, text is now inside the circle
                    width: "100%", // Ensure text can be centered
                    textAlign: "center", // Center text
                    lineHeight: "20px" // Vertically align in circle
                }}
            >
                {Math.round(progress)}%
            </span>
        </div>
    );

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        // Using Arabic locale for date display as an example
        return date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    if (loading) {
        return <div className="container py-2 text-center">جاري تحميل تحديثات الدورة...</div>;
    }

    if (error) {
        return <div className="container py-2 text-center alert alert-danger">حدث خطأ: {error}</div>;
    }

    return (
        <div className="container py-2">
            {/* Consider moving ToastContainer to a higher-level component like App.js */}
            {/* <ToastContainer position="top-right" rtl={true} /> */}

            <div
                className={`row ${styles.customscrollbar}`}
                style={{
                    maxHeight: "400px",
                    overflowY: "auto",
                    paddingRight: "15px", // Ensure scrollbar doesn't overlay content
                    paddingLeft: "5px", // Balance padding
                }}
            >
                {updatesToDisplay.length > 0 ? (
                    updatesToDisplay.map((update) => ( // Changed 'cycle' to 'update' for clarity
                        <div key={update.updateId || update.id} className="col-12"> {/* Use update.id if updateId is not always present */}
                            <div className="card shadow-sm" style={{ marginBottom: "15px" }}>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-lg-8 col-md-12">
                                            <div className="mb-3">
                                                <label className="form-label fw-bold">عنوان التحديث</label>
                                                <input
                                                    style={{ borderRadius: "10px", backgroundColor: "#f8f9fa" }}
                                                    type="text"
                                                    className="form-control"
                                                    value={update.title || "لا يوجد عنوان"}
                                                    readOnly
                                                />
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <label className="form-label fw-bold">فحص الجودة</label>
                                                    <input
                                                        style={{ borderRadius: "10px", backgroundColor: "#f8f9fa" }}
                                                        type="text"
                                                        className="form-control"
                                                        value={update.qualityCheck || "غير محدد"}
                                                        readOnly
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label fw-bold">التاريخ</label>
                                                    <input
                                                        style={{ borderRadius: "10px", backgroundColor: "#f8f9fa" }}
                                                        type="text"
                                                        className="form-control"
                                                        value={formatDate(update.updateDate)}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label fw-bold">الوصف</label>
                                                <textarea // Changed to textarea for potentially longer descriptions
                                                    style={{ borderRadius: "10px", backgroundColor: "#f8f9fa", minHeight: "80px" }}
                                                    className="form-control"
                                                    rows="3"
                                                    value={update.description || "لا يوجد وصف"}
                                                    readOnly
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label fw-bold">ملاحظات إضافية</label>
                                                <textarea
                                                    style={{ borderRadius: "10px", backgroundColor: "#f8f9fa", minHeight: "100px" }}
                                                    className="form-control"
                                                    rows="4"
                                                    value={update.additionalNotes || "لا توجد ملاحظات"}
                                                    readOnly
                                                />
                                            </div>

                                            { (update.growthRate !== undefined && update.growthRate !== null) && // Conditionally render progress bar
                                                <div className="mb-3">
                                                    <label className="form-label fw-bold">مستوى التقدم</label>
                                                    <ProgressBar progress={update.growthRate} />
                                                </div>
                                            }
                                        </div>

                                        <div className="col-lg-4 col-md-12 d-flex align-items-center justify-content-center">
                                            {update.imageUrl ? (
                                                <img
                                                    src={update.imageUrl.startsWith('http') ? update.imageUrl : `https://cityroots.runasp.net/${update.imageUrl}`}
                                                    alt="صورة التحديث"
                                                    className="img-fluid rounded"
                                                    style={{
                                                        maxWidth: "100%", // Use maxWidth
                                                        maxHeight: "300px", // Use maxHeight
                                                        objectFit: "contain", // Changed to contain to see full image
                                                        border: "1px solid #eee" // Added a light border
                                                    }}
                                                />
                                            ) : (
                                                <div style={{width: "100%", height: "200px", backgroundColor: "#f0f0f0", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"8px", color:"#777"}}>
                                                    لا توجد صورة
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center">
                        <p className="h5" style={{ color: "#6c757d", marginTop: "20px" }}>
                            لا توجد تحديثات لعرضها حاليًا.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );

}