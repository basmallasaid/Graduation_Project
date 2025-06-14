import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../API/axiosInstance";

export default function Addcycletasks({ selectedCardId, onaddtasksSuccess }) {
    const [formData, setFormData] = useState({
        taskName: "",
        startDate: "",
        endDate: "",
        status: "لم تبدأ",
        TaskDescription: "",
    });
    const [isLoading, setIsLoading] = useState(false); // Add loading state

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (Object.values(formData).some((value) => !value)) {
            toast.error("جميع الحقول مطلوبة");
            return;
        }
    
        // Convert dates to ISO format:
        const startDateISO = new Date(formData.startDate).toISOString();
        const endDateISO = new Date(formData.endDate).toISOString();
    
        const dataToSubmit = {
            ...formData,
            startDate: startDateISO,  // Use the ISO formatted dates
            endDate: endDateISO,
            cycleId: selectedCardId
        };
    
        console.log("Data to Submit:", dataToSubmit);
    
             try {
            const response = await api.post(
                "Schedule/AddTask",
                dataToSubmit,
                { headers: { "Content-Type": "application/json" } }
            );
            
            // A successful response is typically 200 (OK) or 201 (Created)
            if (response.status === 200 || response.status === 201) {
                toast.success("تم الحفظ بنجاح");
                setTimeout(() => onaddtasksSuccess(), 1500); // Call success callback after a short delay
            }
        } catch (error) {
            console.error("Error submitting form:", error);

            // --- ENHANCED ERROR HANDLING ---
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                const responseData = error.response.data;

                if (typeof responseData === 'string' && responseData) {
                    // **THIS IS THE KEY PART FOR YOUR ERROR**
                    // The server returned a plain text error message.
                    toast.error(responseData);
                } else if (responseData && responseData.errors) {
                    // The server returned a structured validation error object.
                    const errorMessages = Object.values(responseData.errors).flat().join('\n');
                    toast.error(`حدث خطأ في التحقق من الصحة:\n${errorMessages}`);
                } else if (responseData && responseData.message) {
                    // The server returned an object with a 'message' property.
                    toast.error(responseData.message);
                } else {
                    // Generic server error with an unknown format.
                    toast.error(`حدث خطأ من الخادم: ${error.response.statusText || 'Error'}`);
                }
            } else if (error.request) {
                // The request was made but no response was received
                toast.error("لا يمكن الوصول إلى الخادم. يرجى التحقق من اتصالك بالإنترنت.");
            } else {
                // Something happened in setting up the request that triggered an Error
                toast.error(`حدث خطأ غير متوقع: ${error.message}`);
            }
        } finally {
            setIsLoading(false); // Set loading to false in all cases
        }
    };
    return (
        <>
            <form onSubmit={handleSubmit} style={{padding:"20px"}}>
                <div className="container">
                    <div className="row mb-3">
                        <div className="col-md-4 mb-2">
                            <label className="form-label" style={{ fontSize: "18px", fontWeight: "600" }}>اسم المهمة</label>
                            <input type="text" name="taskName" value={formData.taskName} onChange={handleChange} className="form-control" 
                            style={{borderRadius:"10px",borderColor:"#1F4E3D"}} />
                        </div>
                        <div className="col-md-4 mb-2">
                            <label className="form-label" style={{ fontSize: "18px", fontWeight: "600" }}>تاريخ البداية</label>
                            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="form-control"
                            style={{borderRadius:"10px",borderColor:"#1F4E3D"}}  />
                        </div>
                        <div className="col-md-4 mb-2">
                            <label className="form-label" style={{ fontSize: "18px", fontWeight: "600" }}>تاريخ النهاية</label>
                            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="form-control"
                            style={{borderRadius:"10px",borderColor:"#1F4E3D"}}  />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="TaskDescription" className="form-label" style={{ fontSize: "18px", fontWeight: "600" ,marginRight: "10px" }}>
                            الوصف
                        </label>
                        <textarea
                            id="TaskDescription"
                            name="TaskDescription"
                            value={formData.TaskDescription}
                            onChange={handleChange}
                            rows={5}
                            className="form-control"
                            style={{borderColor:"#1F4E3D",padding:"8px",borderRadius:"10px"}}
                        ></textarea>
                    </div>
                </div>
                <div className="d-flex justify-content-end">
                    <button
                        type="submit"
                        className="btn"
                        style={{
                            width: "120px",
                            padding: "10px",
                            backgroundColor: "#1F4E3D",
                            color: "white",
                            borderRadius: "10px",
                            marginLeft: "10px"
                        }}
                    >
                        حفظ
                    </button>
                </div>
            </form>
            <ToastContainer />
        </>
    );
}