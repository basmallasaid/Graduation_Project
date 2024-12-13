import React,{useState} from "react";
import styles from "../../Styles/style.module.css";
import Modal from "react-modal";
import Addcrop from "./addcrop";
export default function Cropcard({ crop }) {
  const [visibleeditcrop, setVisibleeditcrop] = useState(false);

  if (!crop) return null; 
  const cropStyles = {
    content: {
      maxWidth: '70%', // Set your desired width
      margin: 'auto', // Centers the modal horizontally
      padding: '10px', // Add padding for better spacing
      borderRadius: '10px', // Optional: round corners
      maxHeight: '650px', // Set a fixed height
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: dim background
    },
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
                  <button className={styles.buttfaedit}  onClick={()=>setVisibleeditcrop(true)}
                  >
                    <i className="fa-solid fa-pen"></i>
                  </button>
                    <Modal isOpen={visibleeditcrop} onRequestClose={()=>setVisibleeditcrop(false)}
                                ariaHideApp={false}
                  
                               style={cropStyles}>
                                <button onClick={()=>setVisibleeditcrop(false)}><i className="fa-solid fa-xmark"
                                  style={{
                                    backgroundColor: 'transparent', 
                                    border: 'none', 
                                    fontSize: '20px', 
                                    color: '#333', 
                                    cursor: 'pointer', 
                                    position: 'absolute',
                                    top: '10px', 
                                    right: '10px', 
                                  }} ></i></button>
                                  <Addcrop/>
                  
                              </Modal>
                  <button className={styles.buttfadel}>
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
                <div className="col-md-12">
                  <label className="form-label" style={{ fontSize: "35px" }}>
                    {crop.name}
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
                    {crop.price}
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
                      padding: "5px",
                    }}
                  >
                    {crop.quantity}
                  </span>
                </div>
                <div className="col-md-12">
                  <label className="form-label" style={{ fontSize: "23px" }}>
                    تاريخ الانتاج:
                  </label>
                  <span style={{ color: "#49A760", marginRight: "10px" }}>
                    {crop.productionDate}
                  </span>
                </div>
                <div className="col-md-12">
                  <label
                    className="form-label"
                    style={{ fontSize: "23px", marginLeft: "10px" }}
                  >
                    حالة المحصول:
                  </label>
                  <button className={styles.croppending}>{crop.status}</button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Image Section */}
        <div className="col-lg-6 col-md-6 col-12 d-flex justify-content-center">
          <img
            className="crop-image"
            src={crop.image || "default-image.jpg"} // Replace with a default image or crop.image
            alt={`صورة ${crop.name}`}
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
