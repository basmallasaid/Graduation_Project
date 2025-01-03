import React, { useState } from "react";
import styles from "../../Styles/style.module.css";
import Modal from "react-modal";
import axios from "axios";
import Editcrop from "./Editcrop";
import Croprequests from "./Croprequests";
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

export default function Cropcard({ crop, onCropDeleted, onCropUpdated }) {
  const [visibleEditCrop, setVisibleEditCrop] = useState(false);
  const [visibletalabatCrop, setVisibletalabatCrop] = useState(false);
  const [currentCrop, setCurrentCrop] = useState(crop); // Local state for crop data
  

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
        console.log(`Attempting to delete crop with ID: ${currentCrop.id}`);
        await axios.delete(`http://localhost:8000/cropview/${currentCrop.id}`);
        Swal.fire({
          title: "تم الحذف!",
          text: "تم حذف المحصول بنجاح.",
          icon: "success",
          confirmButtonColor: "#28a745" // Set the color of the confirm button to green

        });
  
        if (onCropDeleted) {
          onCropDeleted(currentCrop.id); // Notify parent about deletion
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

  const handleCropUpdated = async (updatedCrop) => {
    // Show SweetAlert2 confirmation dialog
    const result = await Swal.fire({
      title: "هل أنت متأكد من تعديل المحصول؟",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "تعديل",
      confirmButtonColor: "#28a745", // Set color of "تم التعديل" button to green
      denyButtonText: "الغاء التعديل", // Change "Don't save" to "الغاء التعديل"
      cancelButtonText: "الغاء" // Change "Cancel" to "الغاء"
    });
  
    if (result.isConfirmed) {
      // If user clicks "Save"
      setCurrentCrop(updatedCrop); // Update local state with new crop data
      if (onCropUpdated) {
        onCropUpdated(updatedCrop); // Notify parent component about the update
      }
      setVisibleEditCrop(false); // Close the modal
      Swal.fire({
        title: "تم التعديل!",
        text: "تم التعديل بنجاح.",
        icon: "success",
        confirmButtonColor: "#28a745" // Set color of "تم التعديل" button to green
      });
    }else if (result.isDenied) {
      // If user clicks "الغاء التعديل"
      Swal.fire({
        title: "لم يتم حفظ التعديلات",
        icon: "info",  // Use "info" icon for the denied message
        confirmButtonColor: "#28a745" // Set the color of the confirm button to green
      });
      
      setVisibleEditCrop(false); // Close the modal without saving
    }
  };
  if (!currentCrop) return null;

  const cropStyles = {
    content: {
      maxWidth: "70%",
      margin: "auto",
      padding: "10px",
      borderRadius: "10px",
      maxHeight: "600px",
      backgroundColor:"#F5F5F5"

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
  const handleeditSuccess = () => {
    setVisibleEditCrop(false); // Close the modal
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
                    <Editcrop crop={currentCrop} onCropUpdated={handleCropUpdated} oneditSuccess={handleeditSuccess} />
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
                    {currentCrop.productionDate}
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
                      className={`btn ${crop.status === 'تحت الطلب' ? styles.croppending : crop.status === 'نفذت الكمية' ? styles.cropempty : styles.cropava}`}
                   
                    >
                      {crop.status}
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
            src={currentCrop.imageUrl || "default-image.jpg"}
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
