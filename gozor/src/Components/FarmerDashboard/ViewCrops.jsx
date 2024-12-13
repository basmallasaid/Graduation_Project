import React, { useState,useEffect } from "react";
import styles from "../../Styles/style.module.css"; 
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import Addcrop from "./addcrop";
import Cropcard from "./cropcard";
export default function ViewCrops() {
  const [visiblecrop, setVisiblecrop] = useState(false);

  const [crops, setCrops] = useState([]); // Store crops data
  const [seecrop, setSeecrop] = useState(false); // Modal visibility
  const [selectedCrop, setSelectedCrop] = useState(null); // Selected crop data

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const response = await fetch("http://localhost:8000/cropview"); // Replace with your API URL
        const data = await response.json();
        setCrops(data); // Set crops data
      } catch (error) {
        console.error("Error fetching crops:", error);
      }
    };

    fetchCrops();
  }, []);

  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const cropStyles = {
    content: {
      maxWidth: '70%', // Set your desired width
      margin: 'auto', // Centers the modal horizontally
      padding: '10px', // Add padding for better spacing
      borderRadius: '10px', // Optional: round corners
      maxHeight: '85%', // Set a fixed height
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: dim background
    },
  };
  const cropbuttonStyles = {
    content: {
      maxWidth: '65%', // Set your desired width
      margin: 'auto', // Centers the modal horizontally
      padding: '10px', // Add padding for better spacing
      borderRadius: '10px', // Optional: round corners
      maxHeight: '450px', // Set a fixed height
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: dim background
    },
  };
  return (
    <>
      <div className="crops" style={{ backgroundColor: "#fff", padding: "50px" }}>
        {/* Flex container for Plus Icon, Title, and Search */}
        <div
          className="d-flex align-items-center justify-content-between"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Plus Icon */}
          <button
            className={styles.plus}
            style={{
          
            }}
            onClick={()=>setVisiblecrop(true)}
          >
            <i className="fa-solid fa-plus" style={{ fontSize: "40px" }}></i>
          </button>
          <div className={styles.hide} >اضافه محصول</div>
   <Modal isOpen={visiblecrop} onRequestClose={()=>setVisiblecrop(false)}
              ariaHideApp={false}

             style={cropStyles}>
              <button onClick={()=>setVisiblecrop(false)}><i className="fa-solid fa-xmark"
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
          {/* Center Content (h3 and Search Bar) */}
          <div
            className="d-flex align-items-center justify-content-center flex-grow-1"
            style={{
              textAlign: "center",
            }}
          >
            {!showSearch ? (
              <h3 className={styles.croptitle} >
                جميع المحاصيل التي اضافها المزارع
              </h3>
            ) : (
              <form
                className={`d-flex align-items-center ${styles.cropinput}`}
                role="search"
                
              >
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="ابحث..."
                  aria-label="Search"
                  style={{
                    marginRight: "10px",
                    border: "2px solid #000",
                  }}
                />
              </form>
            )}
            <button
              className="btn btn-outline-success"
              onClick={() => setShowSearch(!showSearch)}
              style={{
                background: "none",
                border: "none",
                padding: "0",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                style={{
                  width: "30px",
                  height: "24px",
                  fill: "black",
                  marginRight: "30px",
                }}
              >
                <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6 .1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="container my-5">
      <div className="row justify-content-center">
      {crops.map((crop) => (
          <div className="col-lg-2 col-md-4 col-6 mb-4" key={crop.id}>
            <div className="card text-center" style={{ width: "100%", padding: "15px" }}>
              <div className="card-body">
                <h5 className="card-title">{crop.name}</h5>
                <p className={`card-text ${styles.cropdesc}`}>{crop.price}</p>
                {/* <p className={`card-text ${styles.cropdesc}`}>
                  تاريخ الانتاج: {crop.productionDate}
                </p> */}
                <p className="card-text">
                  الكمية: <span className={styles.propspan}>{crop.quantity}</span>
                </p>
                <button
                  className={`btn ${styles.croppending}`}
                  onClick={() => {
                    setSelectedCrop(crop); // Set the selected crop data
                    setSeecrop(true); // Open the modal
                  }}
                >
                  {crop.status}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedCrop && (
        <Modal
          isOpen={seecrop}
          onRequestClose={() => setSeecrop(false)}
          ariaHideApp={false}
          style={cropbuttonStyles}
        >
          <button
            onClick={() => setSeecrop(false)}
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
          <Cropcard crop={selectedCrop} /> {/* Pass crop data to Cropcard */}
        </Modal>
      )}
      
      
    </div>
      </div>
    </>
  );
}
