// Cropcard.jsx
import React, { useState, useEffect } from "react";
import styles from "../../Styles/style.module.css";
import Modal from "react-modal";
import Swal from 'sweetalert2';
import Croprequests from "./croprequests";
import Editcrop from "./Editcrop";
import api from "../../API/axiosInstance";

const PLACEHOLDER_IMAGE_URL = "https://via.placeholder.com/400x400.png?text=No+Image+Available";

export default function Cropcard({ crop, onCropDeleted, onCropUpdated }) {
    const [visibleEditCrop, setVisibleEditCrop] = useState(false);
    const [visibletalabatCrop, setVisibletalabatCrop] = useState(false);
    const [currentCrop, setCurrentCrop] = useState(crop);
    const [imageVersion, setImageVersion] = useState(Date.now());

    useEffect(() => {
        setCurrentCrop(crop);
    }, [crop]);

    // ... (deletePost and formatDate functions remain the same) ...
    const deletePost = async () => {
        const harvestId = currentCrop?.harvestId;
        if (!harvestId) return;

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
            try {
                await api.delete(`Harvest/${harvestId}`);
                Swal.fire("تم الحذف!", "تم حذف المحصول بنجاح.", "success");
                onCropDeleted?.(harvestId); // Notify parent component
            } catch (error) {
                Swal.fire("حدث خطأ", "فشل حذف المحصول.", "error");
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "غير محدد";
        return new Date(dateString).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const handleeditSuccess = (updatedCropData) => {
        setVisibleEditCrop(false); 
        
        // IMPORTANT: The API response 'updatedCropData' contains the NEW relative URL.
        // We update the state with this new data.
        setCurrentCrop(prev => ({ ...prev, ...updatedCropData }));

        // We update the image version to bust the cache for the NEW relative URL.
        setImageVersion(Date.now());

        if (onCropUpdated) {
            onCropUpdated(updatedCropData);
        }
    };

    if (!currentCrop || !currentCrop.harvestId) {
        return null; 
    }

    const cropStyles = {
        content: { maxWidth: "70%", margin: "auto", padding: "10px", borderRadius: "10px", maxHeight: "600px", backgroundColor: "#F5F5F5" },
        overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
    };
    const talabatStyles = {
        content: { maxWidth: "60%", margin: "auto", padding: "10px", borderRadius: "30px", maxHeight: "320px" },
        overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
    };

    // THIS IS THE CORRECTED LOGIC
    let displayImageUrl = PLACEHOLDER_IMAGE_URL;
    if (currentCrop.imageUrl) {
        // Check if it's a Base64 Data URL
        if (currentCrop.imageUrl.startsWith('data:image')) {
            displayImageUrl = currentCrop.imageUrl;
        } else {
            // Otherwise, treat it as a relative path and build the full URL with cache-busting
            const imagePath = currentCrop.imageUrl.startsWith('/') ? currentCrop.imageUrl.substring(1) : currentCrop.imageUrl;
            displayImageUrl = `https://cityroots.runasp.net/${imagePath}?v=${imageVersion}`;
        }
    }

    return (
        <div className="container" style={{ backgroundColor: "#F5F5F5" }}>
            <div className="row d-flex flex-column flex-md-row align-items-start align-items-md-center">
                {/* Form Section */}
                <div className="col-lg-6 col-md-6 col-12 mb-4">
                    <div className="border rounded p-4 shadow">
                        <form style={{ padding: "30px" }} onSubmit={(e) => e.preventDefault()}>
                            <div className="row mb-3">
                                <div className={styles.cropsfa}>
                                    <button className={styles.buttfaedit} onClick={() => setVisibleEditCrop(true)}>
                                        <i className="fa-solid fa-pen"></i>
                                    </button>
                                    <Modal isOpen={visibleEditCrop} onRequestClose={() => setVisibleEditCrop(false)} ariaHideApp={false} style={cropStyles}>
                                        <button onClick={() => setVisibleEditCrop(false)} style={{ backgroundColor: "transparent", border: "none", fontSize: "20px", cursor: "pointer", position: "absolute", top: "10px", right: "10px" }}>
                                            <i className="fa-solid fa-xmark"></i>
                                        </button>
                                        <Editcrop crop={currentCrop} oneditSuccess={handleeditSuccess} />
                                    </Modal>
                                    {/* ... rest of the form buttons and fields ... */}
                                    <button className={styles.buttfadel} onClick={deletePost}>
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                                <div className="col-md-12"><label className="form-label" style={{ fontSize: "35px" }}>{currentCrop.name}</label></div>
                                <div className="col-md-12">
                                    <label className="form-label" style={{ fontSize: "23px" }}>السعر:</label>
                                    <span style={{ marginRight: "10px", color: "#49A760", fontSize: "17px" }}>{currentCrop.price} جنيه</span>
                                </div>
                                <div className="col-md-12">
                                    <label className="form-label" style={{ fontSize: "23px" }}>الكمية:</label>
                                    <span style={{ marginRight: "10px", boxShadow: "rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset", padding: "7px", borderRadius: "7px" }}>{currentCrop.yield} كيلو</span>
                                </div>
                                <div className="col-md-12">
                                    <label className="form-label" style={{ fontSize: "23px" }}>تاريخ الانتاج:</label>
                                    <span style={{ color: "#49A760", marginRight: "10px" }}>{formatDate(currentCrop.productionDate)}</span>
                                </div>
                                <div className="col-md-12">
                                    <label className="form-label" style={{ fontSize: "23px", marginLeft: "10px" }}>حالة المحصول:</label>
                                    <button className={`btn ${currentCrop.status === 'تحت_الطلب' ? styles.croppending : currentCrop.status === 'نفذت_الكميه' ? styles.cropempty : styles.cropava}`}>{currentCrop.status}</button>
                                </div>
                                {currentCrop.reuestsCount > 0 && (
                                    <button className={styles.talabat} onClick={() => setVisibletalabatCrop(true)}>
                                        عرض تفاصيل الطلبات ({currentCrop.reuestsCount})
                                    </button>
                                )}
                                <Modal isOpen={visibletalabatCrop} onRequestClose={() => setVisibletalabatCrop(false)} ariaHideApp={false} style={talabatStyles}>
                                    <button onClick={() => setVisibletalabatCrop(false)} style={{ backgroundColor: "transparent", border: "none", fontSize: "20px", color: "#333", cursor: "pointer", position: "absolute", top: "10px", right: "10px" }}>
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                    <Croprequests purchaseRequests={currentCrop.purchases}/>
                                </Modal>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Image Section */}
                <div className="col-lg-6 col-md-6 col-12 d-flex justify-content-center">
                    <img
                        key={imageVersion} // The key now reliably changes on every successful update
                        className="crop-image"
                        src={displayImageUrl} // Use the correctly constructed URL
                        alt={`صورة ${currentCrop.name}`}
                        style={{ maxWidth: "80%", borderRadius: "8px", maxHeight: "400px", objectFit: "cover" }}
                    />
                </div>
            </div>
        </div>
    );
}