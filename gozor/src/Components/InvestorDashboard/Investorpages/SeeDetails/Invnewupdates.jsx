import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import styles from "../../../../Styles/style.module.css";

export default function Invnewupdates() {
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch cycle data
  const fetchCycles = async () => {
    setLoading(true);
    setError(null); // Clear any previous errors
    try {
      const response = await axios.get("http://localhost:8000/cycleUpdates");

      // Ensure response is correctly structured
      if (Array.isArray(response.data)) {
        // only set the state if the data changed
         if (JSON.stringify(response.data) !== JSON.stringify(cycles))
          setCycles(response.data);
      } else if (response.data && Array.isArray(response.data.cycleUpdates)) {
        // only set the state if the data changed
          if (JSON.stringify(response.data.cycleUpdates) !== JSON.stringify(cycles))
          setCycles(response.data.cycleUpdates);
      } else {
        throw new Error("Invalid data format received from the server.");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch cycle updates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCycles();
  }, []);


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
    return <div className="container py-2 text-center">جاري التحميل...</div>;
  }

  if (error) {
    return <div className="container py-2 text-center">حدث خطأ: {error}</div>;
  }

  return (
    <div className="container py-2 " >
      <ToastContainer position="top-right" rtl={true} />
      
      <div
                className={`row ${styles.customscrollbar}`}
                style={{
                    maxHeight: "400px", // Adjust this value as needed
                    overflowY: "auto",   // Enable vertical scrolling
                    paddingRight: "10px", // Add padding to prevent scrollbar from overlaying content
                }}
            >        {cycles.length > 0 ? (
          cycles.map((cycle) => (
            <div key={cycle.updateId} className="col-12 ">
              <div className="card shadow-sm" style={{marginBottom:"10px"}}>
                <div className="card-body " >
                  <div className="row">
                    <div className="col-lg-8 col-md-12">
                  

                      {/* Cycle details */}
                      <div className="mb-3">
                        <label className="form-label">عنوان التحديث</label>
                        <input style={{borderRadius:"20px"}}
                          type="text"
                          className="form-control"
                          value={cycle.title}
                          readOnly
                        />
                      </div>

                      <div className="row mb-3">
                       
                        <div className="col-md-6">
                        <label className="form-label">فحص الجودة</label>
                          <input style={{borderRadius:"20px"}} 
                            type="text"
                            className="form-control"
                            value={cycle.qualityCheck}
                            readOnly
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">التاريخ</label>
                          <input style={{borderRadius:"20px"}}
                            type="date"
                            className="form-control"
                            value={cycle.updateDate.split('T')[0]}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">الوصف</label>
                        <input style={{borderRadius:"20px"}}
                          type="text"
                          className="form-control"
                          value={cycle.description}
                          readOnly
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">ملاحظات</label>
                        <textarea style={{borderRadius:"20px"}}
                          className="form-control"
                          rows="4"
                          value={cycle.additionalNotes}
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
                      {cycle.imageUrl && (
                        <img
                          src={cycle.imageUrl}
                          alt="صورة المحصول"
                          className="img-fluid rounded"
                          style={{
                            width: "100%",
                            height: "300px",
                            objectFit: "cover",
                            marginTop:"50px"
                          }}
                        />
                      )}
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
    </div>
  );
}