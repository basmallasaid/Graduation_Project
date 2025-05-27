import React, { useState, useRef } from "react";
import styles from "../../Styles/style.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../API/axiosInstance";

export default function UpdateNewCycle({ selectedCardId, onupdateSuccess }) {
  const [imageSrc, setImageSrc] = useState("");
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(""); // State for the date input

  const lineRef = useRef(null);
  const circleRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImageSrc(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleMouseMove = (event) => {
    const rect = lineRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const width = rect.width;

    const newProgress = Math.min(Math.max(0, (mouseX / width) * 100), 100);
    setProgress(newProgress);
  };

  const handleDrag = (event) => {
    const rect = lineRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const width = rect.width;

    const newProgress = Math.min(Math.max(0, (mouseX / width) * 100), 100);
    setProgress(newProgress);
  };

  const validateForm = () => {
    if (!title || !status || !description || !notes || !imageSrc || !date || !progress) {
      toast.error("جميع الحقول مطلوبة!");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("CycleId", selectedCardId);
    formData.append("GrowthRate", progress);
    formData.append("QualityCheck", status);
    formData.append("AdditionalNotes", notes);
    formData.append("Title", title);
    formData.append("Description", description);

    // Handle the image file
    const fileInput = document.getElementById("fileInput"); // Get the file input element
    if (fileInput && fileInput.files && fileInput.files[0]) {
        formData.append("Image", fileInput.files[0]);
    } else {
        // if no image is chosen send default image
        console.log('no image ');
    }

try {
  const response = await api.post("https://cityroots.runasp.net/api/CycleUpdate", formData);

  if (response.status === 200 || response.status === 201) {
    toast.success("تم تحديث الدورة بنجاح!");
    setTimeout(() => {
      onupdateSuccess();
    }, 2000);
  } else {
    toast.error(`فشل في تحديث الدورة. Status: ${response.status}, Message: ${response.statusText}`);
  }
} catch (error) {
  const message = error.response?.data?.message || error.message;
  toast.error(`حدث خطأ أثناء العملية: ${message}`);
}

  };

  return (
    <div className="container" style={{ padding: "20px", fontSize: "20px", fontWeight: "500" }}>
      <ToastContainer />
      <div className="row align-items-start">
        {/* Form Section */}
        <div className="col-lg-8 col-md-6 col-12">
          <form
            onSubmit={handleSubmit}
            style={{ backgroundColor: "#FFF", padding: "20px", borderRadius: "8px" }}
          >
            {/* Title Input */}
            <div className="row mb-3">
              <div className="col-md-3 d-flex align-items-center">
                <label className="form-label">عنوان التحديث</label>
              </div>
              <div className="col-md-9">
                <input
                  type="text"
                  className="form-control"
                  style={{ borderRadius: "12px", borderRadius: "10px", borderColor: "#1F4E3D" }}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>

            {/* Crop Status Input */}
            <div className="row mb-3">
              <div className="col-md-3 d-flex align-items-center">
                <label className="form-label">الحالة الحالية للمحصول</label>
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  style={{ borderRadius: "12px", borderColor: "#1F4E3D" }}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                />
              </div>
              <div className="col-md-3 d-flex align-items-center">
                <label className="form-label" style={{ marginRight: "70px" }}>
                  التاريخ
                </label>
              </div>
              <div className="col-md-3">
                <input
                  type="date"
                  className="form-control"
                  style={{ borderRadius: "12px", borderColor: "#1F4E3D" }}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            {/* Description Input */}
            <div className="row mb-3">
              <div className="col-md-3 d-flex align-items-center">
                <label className="form-label">الوصف</label>
              </div>
              <div className="col-md-9">
                <input
                  type="text"
                  className="form-control"
                  style={{ borderRadius: "12px", borderColor: "#1F4E3D" }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            {/* Notes Textarea */}
            <div className="row mb-3">
              <div className="col-md-3 d-flex align-items-center">
                <label className="form-label">ملاحظات</label>
              </div>
              <div className="col-md-9">
                <textarea
                  rows={5}
                  className="form-control"
                  style={{ borderRadius: "12px", borderColor: "#1F4E3D" }}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            {/* Progress Line Section */}
            <div className="row mb-3">
              <div className="col-md-3 d-flex align-items-center">
                <label className="form-label">مستوى التقدم</label>
              </div>
              <div
                className="col-md-9 d-flex align-items-center"
                style={{ position: "relative", height: "20px" }}
                onMouseMove={handleMouseMove}
                ref={lineRef}
                onMouseDown={(e) => e.preventDefault()}
              >
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
                ></div>

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
                    transition: "width 0.3s ease",
                  }}
                ></div>

                <div
                  ref={circleRef}
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
                    cursor: "pointer",
                    transition: "left 0.3s ease",
                    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                  }}
                  draggable
                  onDrag={handleDrag}
                ></div>

                <span
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: `${progress}%`,
                    transform: "translate(-50%, -50%)",
                    fontSize: "20px",
                    color: "#333",
                    transition: "left 0.3s ease",
                  }}
                >
                  {Math.round(progress)}%
                </span>
              </div>
            </div>

            <button type="submit" className={styles.updatecyclebutt}>
              حفظ
            </button>
          </form>
        </div>

        {/* Image Section */}
        <div className="col-lg-4 col-md-6 col-12 d-flex flex-column align-items-center mb-4">
          <img
            className="crop-image"
            src={imageSrc || ""}
            alt="اضف صوره المحصول"
            style={{
              maxWidth: "100%",
              borderRadius: "8px",
              maxHeight: "500px",
              objectFit: "cover",
              marginBottom: "10px",
              marginTop: "50px",
            }}
          />
          <label htmlFor="fileInput" className={styles.updatecyclebutt}>
            اختر صورة
          </label>
          <input
            type="file"
            style={{ display: "none" }}
            id="fileInput"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );
}