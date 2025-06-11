import React, { useState, useEffect } from "react";
import styles from "../../Styles/style.module.css";
import Modal from "react-modal";
import Swal from 'sweetalert2';
import Croprequests from "./croprequests";
import Editcrop from "./Editcrop";
import api from "../../API/axiosInstance";

// Define a placeholder image URL for cases where an image is missing
const PLACEHOLDER_IMAGE_URL = "https://via.placeholder.com/400x400.png?text=No+Image+Available";

export default function Cropcard({ crop, onCropDeleted, onCropUpdated }) {
    const [visibleEditCrop, setVisibleEditCrop] = useState(false);
    const [visibletalabatCrop, setVisibletalabatCrop] = useState(false);
    
    // This local state holds the data this card displays.
    const [currentCrop, setCurrentCrop] = useState(crop);

    // =======================================================================
    //  THE FIX: This `useEffect` hook listens for changes to the `crop` prop.
    //  When the parent component updates its state and passes a new `crop`
    //  object down, this effect runs and updates the card's local state,
    //  triggering an instant re-render with the new data.
    // =======================================================================
    useEffect(() => {
        setCurrentCrop(crop);
    }, [crop]); // Dependency array: This effect re-runs whenever the 'crop' prop changes.

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
                if (onCropDeleted) {
                    onCropDeleted(harvestId); // Notify parent component
                }
            } catch (error) {
                Swal.fire("حدث خطأ", "فشل حذف المحصول.", "error");
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "غير محدد";
        return new Date(dateString).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    // This function is called by the Editcrop modal upon a successful update.
    const handleeditSuccess = (updatedCropData) => {
        setVisibleEditCrop(false); // Close the modal

        // Notify the parent component about the update.
        // The parent will update its master list, which triggers the 'useEffect' in this component.
        if (onCropUpdated) {
            onCropUpdated(updatedCropData);
        }
    };

    // Render guard: don't render if essential data is missing
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

    return (
        <div className="container" style={{ backgroundColor: "#F5F5F5" }}>
            <div className="row d-flex flex-column flex-md-row align-items-start align-items-md-center">
                {/* Form Section */}
                <div className="col-lg-6 col-md-6 col-12 mb-4">
                    <div className="border rounded p-4 shadow">
                        <form style={{ padding: "30px" }}>
                            <div className="row mb-3">
                                <div className={styles.cropsfa}>
                                    <button className={styles.buttfaedit} onClick={(e) => { e.preventDefault(); setVisibleEditCrop(true); }}>
                                        <i className="fa-solid fa-pen"></i>
                                    </button>
                                    <Modal isOpen={visibleEditCrop} onRequestClose={() => setVisibleEditCrop(false)} ariaHideApp={false} style={cropStyles}>
                                        <button onClick={() => setVisibleEditCrop(false)} style={{ backgroundColor: "transparent", border: "none", fontSize: "20px", cursor: "pointer", position: "absolute", top: "10px", right: "10px" }}>
                                            <i className="fa-solid fa-xmark"></i>
                                        </button>
                                        <Editcrop crop={currentCrop} oneditSuccess={handleeditSuccess} />
                                    </Modal>

                                    <button className={styles.buttfadel} onClick={(e) => { e.preventDefault(); deletePost(); }}>
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                                {/* All JSX now correctly uses the local 'currentCrop' state */}
                                <div className="col-md-12"><label className="form-label" style={{ fontSize: "35px" }}>{currentCrop.name}</label></div>
                                <div className="col-md-12">
                                    <label className="form-label" style={{ fontSize: "23px" }}>السعر:</label>
                                    <span style={{ marginRight: "10px", color: "#49A760", fontSize: "17px" }}>{currentCrop.price}</span>
                                </div>
                                <div className="col-md-12">
                                    <label className="form-label" style={{ fontSize: "23px" }}>الكمية:</label>
                                    <span style={{ marginRight: "10px", boxShadow: "rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset", padding: "7px", borderRadius: "7px" }}>{currentCrop.yield}</span>
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
                                    <button className={styles.talabat} onClick={(e) => { e.preventDefault(); setVisibletalabatCrop(true); }}>
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
                        className="crop-image"
                        src={currentCrop.imageUrl ? `https://cityroots.runasp.net/${currentCrop.imageUrl}` : PLACEHOLDER_IMAGE_URL}
                        alt={`صورة ${currentCrop.name}`}
                        style={{ maxWidth: "80%", borderRadius: "8px", maxHeight: "400px", objectFit: "cover" }}
                    />
                </div>
            </div>
        </div>
    );
}