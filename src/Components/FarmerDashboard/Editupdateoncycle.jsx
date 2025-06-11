import React, { useState, useRef, useEffect } from "react";
import styles from "../../Styles/style.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from 'sweetalert2';
import api from "../../API/axiosInstance";

export default function Editupdateoncycle({ cycle, onupdateSuccess }) {
  console.log("Editupdateoncycle received cycle:", cycle);

  const [formData, setFormData] = useState({
    imageSrc: "", // This will hold either the server path or a local data URL
    progress: 0,
    title: "",
    status: "",
    description: "",
    AdditionalNotes: "",
    date: "",
    cycleId: ""
  });

  // This state will hold the file object itself if a new one is selected
  const [newImageFile, setNewImageFile] = useState(null);

  const lineRef = useRef(null);
  const circleRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (cycle) {
      console.log("Initializing form with cycle data:", cycle);
      setFormData({
        imageSrc: cycle.imageUrl || "",
        progress: cycle.growthRate || 0,
        title: cycle.title || "",
        status: cycle.qualityCheck || "",
        description: cycle.description || "",
        AdditionalNotes: cycle.additionalNotes || "",
        date: cycle.updateDate ? new Date(cycle.updateDate).toISOString().split('T')[0] : "",
        cycleId: cycle.cycleId
      });
      // Reset the new image file when the cycle prop changes
      setNewImageFile(null);
    }
  }, [cycle]);

  const handleMouseMove = (event) => {
    if (isDragging) {
      const rect = lineRef.current.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const width = rect.width;
      const newProgress = Math.min(Math.max(0, (mouseX / width) * 100), 100);
      setFormData(prev => ({ ...prev, progress: newProgress }));
    }
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDrag = (event) => {
    const rect = lineRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const width = rect.width;
    const newProgress = Math.min(Math.max(0, (mouseX / width) * 100), 100);
    setFormData(prev => ({ ...prev, progress: newProgress }));
  };

  const validateForm = () => {
    const { title, status, description, AdditionalNotes, imageSrc, date, progress } = formData;
    if (!title || !status || !description || !AdditionalNotes || !imageSrc || !date || progress === undefined) {
      toast.error("جميع الحقول مطلوبة!");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formDataForUpload = new FormData();
    formDataForUpload.append('title', formData.title);
    formDataForUpload.append('description', formData.description);
    formDataForUpload.append('additionalNotes', formData.AdditionalNotes);
    formDataForUpload.append('growthRate', Number(formData.progress));
    formDataForUpload.append('qualityCheck', formData.status);
    formDataForUpload.append('updateId', cycle.updateId);
    formDataForUpload.append('updateDate', new Date(formData.date).toISOString());

    // *** CHANGE HERE ***
    // Only append the 'image' if a new file was actually selected.
    if (newImageFile) {
        formDataForUpload.append('image', newImageFile);
    }

    try {
      const response = await api.put(`CycleUpdate/${cycle.updateId}`, formDataForUpload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const updatedData = response.data;
      Swal.fire({
        title: "تم التحديث!",
        text: "تم تحديث الدورة بنجاح",
        icon: "success",
        confirmButtonColor: "#28a745"
      });
      onupdateSuccess(updatedData);
    } catch (error) {
      console.error('Error updating cycle:', error);
      Swal.fire({
        title: "خطأ!",
        text: "حدث خطأ أثناء تحديث الدورة",
        icon: "error",
        confirmButtonColor: "#dc3545"
      });
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('الرجاء اختيار ملف صورة');
        return;
      }

      // Store the file object for submission
      setNewImageFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        // Set imageSrc to the Data URL for immediate preview
        setFormData(prev => ({ ...prev, imageSrc: e.target.result }));
      };
      reader.onerror = () => {
        toast.error('حدث خطأ أثناء قراءة الملف');
      };
      reader.readAsDataURL(file);
    }
  };

  // *** SOLUTION LOGIC ***
  // Decide what the image source URL should be.
  const getImagePreviewUrl = () => {
    if (!formData.imageSrc) {
        return ""; // No image to show
    }
    // If it's a Data URL (from the new file upload), use it directly.
    if (formData.imageSrc.startsWith('data:image')) {
        return formData.imageSrc;
    }
    // Otherwise, it's a path from the server, so build the full URL.
    return `https://cityroots.runasp.net/${formData.imageSrc}`;
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
            {/* ... (rest of your form is unchanged) ... */}
            {/* Title Input */}
            <div className="row mb-3">
              <div className="col-md-3 d-flex align-items-center">
                <label className="form-label">عنوان التحديث</label>
              </div>
              <div className="col-md-9">
                <input
                  type="text"
                  className="form-control"
                  style={{ borderRadius: "12px" ,  borderRadius: "10px",
                    borderColor: "#1F4E3D", }}
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
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
                  style={{ borderRadius: "12px" ,borderColor: "#1F4E3D",
                  }}
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                />
              </div>
              <div className="col-md-3 d-flex align-items-center">
                <label className="form-label" style={{marginRight:"70px"}}>التاريخ</label>
              </div>
              <div className="col-md-3">
                <input
                  type="date"
                  className="form-control"
                  style={{ borderRadius: "12px",                borderColor: "#1F4E3D",
                  }}
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
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
                  style={{ borderRadius: "12px" ,                borderColor: "#1F4E3D",
                  }}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
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
                  style={{ borderRadius: "12px",  borderColor: "#1F4E3D",
                  }}
                  value={formData.AdditionalNotes}
                  onChange={(e) => setFormData(prev => ({ ...prev, AdditionalNotes: e.target.value }))}
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
                onMouseUp={handleMouseUp}
                ref={lineRef}
                onMouseDown={handleMouseDown}
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
                    width: `${formData.progress}%`,
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
                    left: `${formData.progress}%`,
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
                    left: `${formData.progress}%`,
                    transform: "translate(-50%, -50%)",
                    fontSize: "20px",
                    color: "#333",
                    transition: "left 0.3s ease",
                  }}
                >
                  {Math.round(formData.progress)}%
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
          {formData.imageSrc ? (
            <img
              // *** APPLY THE SOLUTION HERE ***
              src={getImagePreviewUrl()}
              alt="صورة المحصول"
              style={{
                width: "100%",
                height: "300px",
                borderRadius: "8px",
                objectFit: "cover",
                marginBottom: "10px",
                marginTop: "50px",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "300px",
                borderRadius: "8px",
                backgroundColor: "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "10px",
                marginTop: "50px",
              }}
            >
              <span>اختر صورة</span>
            </div>
          )}
          <label htmlFor="fileInput" className={styles.updatecyclebutt}>
            اختر صورة
          </label>
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            id="fileInput"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );
}