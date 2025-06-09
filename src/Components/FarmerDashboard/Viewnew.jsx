import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import Editupdateoncycle from './Editupdateoncycle';
import ReactModal from "react-modal";
import api from "../../API/axiosInstance";

const modalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
        padding: '20px',
        borderRadius: '30px',
        backgroundColor: '#fff',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
};

export default function Viewnew({ selectedCardId }) {
    const [cycles, setCycles] = useState([]);
    const [selectedCycle, setSelectedCycle] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    // Fetch cycle data
   const fetchCycles = async () => {
    setLoading(true);
    setError(null); // Good practice to clear previous errors
    try {
        const response = await api.get(`CycleUpdate/cycle/${selectedCardId}`);

        // With axios, data is directly in response.data for successful requests.
        // Axios throws an error for HTTP error codes, so no need for response.ok check here.
        const data = response.data;

        setCycles(Array.isArray(data) ? data : data.cyclestatues || []);

    } catch (err) {
        // Handle errors, including HTTP errors thrown by axios
        if (err.response) {
         
            const status = err.response.status;
            const errorDataMessage = err.response.data?.message || err.response.data || "Server error"; // Try to get a message
            const errorMessage = `HTTP error! Status: ${status}. Message: ${errorDataMessage}`;
            setError(errorMessage);
           
        } else if (err.request) {
            setError("Network error: No response received from server.");
        } else {
            setError(`Error: ${err.message}`);
        }
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    if (selectedCardId) {
        fetchCycles();
    }
}, [selectedCardId]); 

    const handleDelete = async (updateId) => {
        try {
            const result = await Swal.fire({
                title: "هل أنت متأكد؟",
                text: "لن تتمكن من التراجع عن هذا!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#28a745",
                cancelButtonColor: "#d33",
                confirmButtonText: "نعم، احذفها!",
                cancelButtonText: "إلغاء"
            });

            if (result.isConfirmed) {
                await api.delete(`CycleUpdate/${updateId}`); // Changed API URL
                setCycles(cycles.filter(cycle => cycle.updateId !== updateId)); // Changed to updateId
                Swal.fire({
                    title: "تم!",
                    text: "تم حذف التحديث بنجاح",
                    icon: "success",
                    confirmButtonColor: '#28a745'
                });
            }
        } catch (error) {
           console.error(
                "Error deleting cycle:",
                error.response ? error.response.data : error
            );
            Swal.fire({
                title: "خطأ!",
                text: "حدث خطأ أثناء حذف التحديث",
                icon: "error"
            });
        }
    };

    const handleEdit = (cycle) => {
        setSelectedCycle(cycle);
        setIsModalOpen(true);
    };

    const handleUpdateSuccess = (updatedCycle) => {
        setCycles((prevCycles) => {
            return prevCycles.map((cycle) =>
                cycle.updateId === updatedCycle.updateId ? updatedCycle : cycle // Changed to updateId
            );
        });
        setIsModalOpen(false);
        toast.success("تم تحديث التحديث بنجاح");
    };
    const getImageUrl = (imageUrl) => {
        
        if (!imageUrl) return "";
        return `https://cityroots.runasp.net/${imageUrl.replace(/^\/+/, "")}`;
    };
    const ProgressBar = ({ progress }) => (
        <div style={{ position: "relative", height: "20px" }}>
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
                  transform: "translate(-50%, -50%)",
                  fontSize: "16px",
                  color: "#333",
                  marginTop: "25px",
              }}
            >
                {Math.round(progress)}%
            </span>
        </div>
    );
      if (loading) {
          return <div>جاري التحميل...</div>;
      }

      if (error) {
          return <div>حدث خطأ: {error}</div>;
      }

    return (
        <div className="container py-2 ">
            <ToastContainer position="top-right" rtl={true} />

            <div className="row ">
                {cycles.length > 0 ? (
                    cycles.map((cycle) => (
                        <div key={cycle.updateId} className="col-12 "> {/* Changed to updateId */}
                            <div className="card shadow-sm" style={{marginBottom:"10px"}}>
                                <div className="card-body " >
                                    <div className="row">
                                        <div className="col-lg-8 col-md-12">
                                            {/* Header with actions */}
                                            <div className="d-flex justify-content-end ">
                                                <button
                                                    className="btn  me-2"
                                                    onClick={() => handleEdit(cycle)}
                                                >
                                                    <i className="fa-solid fa-pen"></i>
                                                </button>
                                                <button
                                                    className="btn"
                                                    onClick={() => handleDelete(cycle.updateId)} // Changed to updateId
                                                >
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </div>

                                            {/* Cycle details */}
                                            <div className="mb-3">
                                                <label className="form-label">عنوان التحديث</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={cycle.title} // Changed to title
                                                    readOnly
                                                />
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <label className="form-label">الحالة الحالية للمحصول</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={cycle.qualityCheck} // Changed to qualityCheck
                                                        readOnly
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">التاريخ</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        value={cycle.updateDate ? new Date(cycle.updateDate).toISOString().split('T')[0] : ''} // Changed to updateDate and formatted
                                                        readOnly
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">الوصف</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={cycle.description} // Changed to description
                                                    readOnly
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">ملاحظات</label>
                                                <textarea
                                                    className="form-control"
                                                    rows="4"
                                                    value={cycle.additionalNotes} // Changed to additionalNotes
                                                    readOnly
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">مستوى التقدم</label>
                                                <ProgressBar progress={cycle.growthRate} />
                                            </div>
                                        </div>

                                        {/* Image section */}
                                        <div className="col-lg-4 col-md-12">
                                        <img src={getImageUrl(cycle.imageUrl)} alt="صورة المحصول" className="img-fluid rounded"
    style={{ width: "100%", height: "300px", objectFit: "cover", marginTop: "50px" }}
/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center">
                        <p className="h5">لا توجد بيانات للدورات لعرضها</p>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            <ReactModal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                style={modalStyles}
                ariaHideApp={false}
            >
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="btn-close"
                  style={{
                      position: "absolute",
                      top: "20px",
                      right: "20px",
                  }}
                />
                <Editupdateoncycle
                  cycle={selectedCycle}
                  onupdateSuccess={handleUpdateSuccess}
                />
            </ReactModal>
        </div>
    );
}