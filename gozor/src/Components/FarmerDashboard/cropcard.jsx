// Cropcard.jsx
import React, { useState, useEffect } from "react";
import styles from "../../Styles/style.module.css";
import Modal from "react-modal";
import axios from "axios";
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import Croprequests from "./Cardrequets";
import Editcrop from "./Editcrop";
import api from "../../API/axiosInstance";

export default function Cropcard({ crop, onCropDeleted, onCropUpdated }) {
    const [visibleEditCrop, setVisibleEditCrop] = useState(false);
    const [visibletalabatCrop, setVisibletalabatCrop] = useState(false);
    const [currentCrop, setCurrentCrop] = useState(crop); // Local state for crop data

    //  Check that crop is defined before accessing its harvestId
    const harvestId = crop?.harvestId;

    useEffect(() => {
        // Update currentCrop when the crop prop changes
        setCurrentCrop(crop);
    }, [crop]); // This useEffect runs whenever the 'crop' prop changes

    const deletePost = async () => {
        // Show the SweetAlert2 confirmation dialog
        const isConfirmed = await Swal.fire({
            title: "هل أنت متأكد؟",
            text: "لن تتمكن من التراجع عن هذا!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#28a745",
            cancelButtonColor: "#d33",
            confirmButtonText: "نعم، احذفها!"
        });

        // If the user confirms the deletion
        if (isConfirmed.isConfirmed) {
            try {
                console.log(`Attempting to delete crop with ID: ${harvestId}`);
                // No need to pass data with DELETE request. Just the URL is sufficient.
                await api.delete(`Harvest/${harvestId}`); // Removed the second argument (data)

                Swal.fire({
                    title: "تم الحذف!",
                    text: "تم حذف المحصول بنجاح.",
                    icon: "success",
                    confirmButtonColor: "#28a745" // Set the color of the confirm button to green
                });

                if (onCropDeleted) {
                    onCropDeleted(currentCrop.harvestId); // Notify parent about deletion
                }
            } catch (error) {
                console.error("Error deleting crop:", error.response ? error.response.data : error);
                Swal.fire({
                    title: "حدث خطأ",
                    text: "حدث خطأ أثناء حذف المحصول.",
                    icon: "error"
                });
            }
        }
    };

    const formatDate = (dateString) => {
      if (!dateString) return ""; // Handle null or undefined date strings

      try {
          const date = new Date(dateString);
          // Use toLocaleDateString with options to format the date
          return date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric'
          });
      } catch (error) {
          console.error("Error formatting date:", error);
          return "Invalid Date"; // Handle cases where the date string is invalid
      }
  };
    // Add a check here to prevent rendering if crop is undefined
    if (!crop) return null;

    const cropStyles = {
        content: {
            maxWidth: "70%",
            margin: "auto",
            padding: "10px",
            borderRadius: "10px",
            maxHeight: "600px",
            backgroundColor: "#F5F5F5"

        },
        overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
    };
    const talabatStyles = {
        content: {
            maxWidth: "40%",
            margin: "auto",
            padding: "10px",
            borderRadius: "30px",
            maxHeight: "320px",
        },
        overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
    };
    const handleeditSuccess = (updatedCropData) => {
        setVisibleEditCrop(false); // Close the modal
        setCurrentCrop(updatedCropData);
    };
    // Function to update the local currentCrop state

    return (
        <div className="container" style={{ backgroundColor: "#F5F5F5" }}>
            <div className="row d-flex flex-column flex-md-row align-items-start align-items-md-center">
                {/* Form Section */}
                <div className="col-lg-6 col-md-6 col-12 mb-4">
                    <div className="border rounded p-4 shadow">
                        <form style={{ padding: "30px" }}>
                            <div className="row mb-3">
                                <div className={styles.cropsfa}>
                                    {/* Edit Button */}
                                    <button
                                        className={styles.buttfaedit}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setVisibleEditCrop(true);
                                        }}
                                    >
                                        <i className="fa-solid fa-pen"></i>
                                    </button>
                                    <Modal
                                        isOpen={visibleEditCrop}
                                        onRequestClose={() => setVisibleEditCrop(false)}
                                        ariaHideApp={false}
                                        style={cropStyles}
                                    >
                                        <button
                                            onClick={() => setVisibleEditCrop(false)}
                                            style={{
                                                backgroundColor: "transparent",
                                                border: "none",
                                                fontSize: "20px",
                                                color: "#333",
                                                cursor: "pointer",
                                                position: "absolute",
                                                top: "10px",
                                                right: "10px",
                                            }}
                                        >
                                            <i className="fa-solid fa-xmark"></i>
                                        </button>
                                        {/* Pass the current crop to the Editcrop modal */}
                                        <Editcrop crop={crop} onCropUpdated={onCropUpdated} oneditSuccess={handleeditSuccess} />
                                    </Modal>

                                    {/* Delete Button */}
                                    <button
                                        className={styles.buttfadel}
                                        onClick={(e) => {
                                            e.preventDefault(); // Prevent form submission
                                            deletePost();
                                        }}
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                                <div className="col-md-12">
                                    <label className="form-label" style={{ fontSize: "35px" }}>
                                        {currentCrop.name}
                                    </label>
                                </div>

                                <div className="col-md-12">
                                    <label className="form-label" style={{ fontSize: "23px" }}>
                                        السعر:
                                    </label>
                                    <span
                                        style={{
                                            marginRight: "10px",
                                            color: "#49A760",
                                            fontSize: "17px",
                                        }}
                                    >
                                        {currentCrop.price}
                                    </span>
                                </div>
                                <div className="col-md-12">
                                    <label className="form-label" style={{ fontSize: "23px" }}>
                                        الكمية:
                                    </label>
                                    <span
                                        style={{
                                            marginRight: "10px",
                                            boxShadow:
                                                "rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset",
                                            padding: "7px",
                                            borderRadius: "7px",
                                        }}
                                    >
                                        {currentCrop.yield}
                                    </span>
                                </div>
                                <div className="col-md-12">
                                    <label className="form-label" style={{ fontSize: "23px" }}>
                                        تاريخ الانتاج:
                                    </label>
                                    <span style={{ color: "#49A760", marginRight: "10px" }}>
                                    {formatDate(currentCrop.productionDate)}
                                    </span>
                                </div>
                                <div className="col-md-12">
                                    <label
                                        className="form-label"
                                        style={{ fontSize: "23px", marginLeft: "10px" }}
                                    >
                                        حالة المحصول:
                                    </label>
                                    <button
                                        className={`btn ${currentCrop.status === 'تحت_الطلب' ? styles.croppending : currentCrop.status === 'نفذت_الكميه' ? styles.cropempty : styles.cropava}`}

                                    >
                                        {currentCrop.status}
                                    </button>

                                </div>
                                {/* Show the button only if there are requests */}
                                {currentCrop.reuestsCount > 0 && (
                                    <button
                                        className={styles.talabat}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setVisibletalabatCrop(true);
                                        }}
                                    >
                                        عرض تفاصيل الطلبات
                                    </button>
                                )}
                                <Modal
                                    isOpen={visibletalabatCrop}
                                    onRequestClose={() => setVisibletalabatCrop(false)}
                                    ariaHideApp={false}
                                    style={talabatStyles}
                                >
                                    <button
                                        onClick={() => setVisibletalabatCrop(false)}
                                        style={{
                                            backgroundColor: "transparent",
                                            border: "none",
                                            fontSize: "20px",
                                            color: "#333",
                                            cursor: "pointer",
                                            position: "absolute",
                                            top: "10px",
                                            right: "10px",
                                        }}
                                    >
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                    <Croprequests purchaseRequests={currentCrop.purchases} />
                                </Modal>


                            </div>
                        </form>
                    </div>
                </div>

                {/* Image Section */}
                <div className="col-lg-6 col-md-6 col-12 d-flex justify-content-center">
                    <img
                        className="crop-image"
                        src={`https://cityroots.runasp.net/${currentCrop.imageUrl} `}
                        alt={`صورة ${currentCrop.name}`}
                        style={{
                            maxWidth: "80%",
                            borderRadius: "8px",
                            maxHeight: "400px",
                            objectFit: "cover",
                        }}
                    />
                </div>
            </div>
        </div>
    );
}