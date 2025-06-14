// ViewCrops.jsx
import React, { useState, useEffect } from "react";
import styles from "../../Styles/style.module.css";
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import Addcrop from "./addcrop";
import Cropcard from "./cropcard";
import NavbarF from "./Main/NavbarF";
import FooterF from "./Main/FooterF";
import NavSideF from "./Main/NavSideF";
import api from "../../API/axiosInstance";

export default function ViewCrops() {
  const [visiblecrop, setVisiblecrop] = useState(false);
  const [crops, setCrops] = useState([]);
  const [seecrop, setSeecrop] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user_data"));
  const farmerId = userData?.LoggedId;
  useEffect(() => {
        api .post(`Harvest/GetAllHarvestsForFarmer`)
        .then((response)=>{
          setCrops(response.data);
          console.log(response.data);

        })
       .catch ((error)=> {
        console.error("Error fetching crops:", error);
       });

  }, []);
  
  //ViewCrops.jsx
  const handleCropUpdated = (updatedCrop) => {
    console.log("ViewCrops - handleCropUpdated - Updated Crop Data:", updatedCrop);
    setCrops((prevCrops) => {
      const updatedCrops = prevCrops.map((crop) => {
        if (crop.harvestId === updatedCrop.harvestId) {
          // Merge the updated properties into the existing crop object
          return { ...crop, ...updatedCrop };
        }
        return crop;
      });
      console.log("ViewCrops - handleCropUpdated - After setCrops Data:", updatedCrops);
      return updatedCrops
    });
    // Make sure to also update the selectedCrop if it's the one being edited
    setSelectedCrop((prevSelectedCrop) => {
      if (prevSelectedCrop && prevSelectedCrop.harvestId === updatedCrop.harvestId) {
        return { ...prevSelectedCrop, ...updatedCrop };
      }
      return prevSelectedCrop;
    });
  };
const handleCropDeleted = (deletedId) => {
    setCrops(crops.filter(crop => crop.harvestId !== deletedId));
    setSeecrop(false);
    setSelectedCrop(null);
};

  const filteredCrops = crops.filter((crop) => {
    const lowercasedSearchTerm = searchTerm.trim().toLowerCase();

    return (
      (crop.name && crop.name.toLowerCase().startsWith(lowercasedSearchTerm)) ||
      (crop.price && crop.price.toString().startsWith(lowercasedSearchTerm)) ||
      (crop.yield && crop.yield.toString().startsWith(lowercasedSearchTerm)) ||
      (crop.status && crop.status.toLowerCase().startsWith(lowercasedSearchTerm))
    );
  });

  const cropStyles = {
    content: {
      maxWidth: '70%',
      margin: 'auto',
      padding: '10px',
      borderRadius: '30px',
      maxHeight: '85%',
      backgroundColor: "#F5F5F5"
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  };

  const cropbuttonStyles = {
    content: {
      maxWidth: '65%',
      margin: 'auto',
      padding: '10px',
      borderRadius: '30px',
      maxHeight: '475px',
      backgroundColor: "#F5F5F5"

    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  };

  // const handleaddSuccess = () => {
  //   setVisiblecrop(false);
  //   navigate("/viewcrops");
  // };
  // ViewCrops.jsx

// THIS IS THE NEW, COMBINED FUNCTION
const handleCropAdded = (newCrop) => {
    // 1. Add the new crop to the top of the list for immediate visibility
    setCrops(prevCrops => [newCrop, ...prevCrops]);
    
    // 2. Close the "Add Crop" modal
    setVisiblecrop(false);
};

  return (
    <>
      <NavbarF />
      <div className="d-flex flex-grow-1">
        <NavSideF />
        <main className="flex-grow-1">
          <div className="crops" style={{ backgroundColor: "#fff", padding: "50px" }}>
            <div
              className="d-flex align-items-center justify-content-between"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <button
                className={styles.plus}
                onClick={() => setVisiblecrop(true)}
              >
                <i className="fa-solid fa-plus" style={{ fontSize: "40px" }}></i>
              </button>
              <div className={styles.hide}>اضافه محصول</div>

              <Modal
                isOpen={visiblecrop}
                onRequestClose={() => setVisiblecrop(false)}
                ariaHideApp={false}
                style={cropStyles}
              >
                <button onClick={() => setVisiblecrop(false)}><i className="fa-solid fa-xmark"
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    fontSize: "20px",
                    color: "#333",
                    cursor: "pointer",
                    position: "absolute",
                    top: "35px",
                    right: "30px",
                  }}>
                </i></button>
<Addcrop onCropAdded={handleCropAdded} />              </Modal>

              <div
                className="d-flex align-items-center justify-content-center flex-grow-1"
                style={{
                  textAlign: "center",
                }}
              >
                {!showSearch ? (
                  <h3 className={styles.croptitle}>جميع المحاصيل التي اضافها المزارع</h3>
                ) : (
                  <form className={`d-flex align-items-center ${styles.cropinput}`} role="search">
                    <input
                      className="form-control me-2"
                      type="search"
                      placeholder="ابحث..."
                      aria-label="Search"
                      style={{
                        marginRight: "10px",
                        border: "2px solid #000",
                      }}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
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
                {filteredCrops.map((crop) => (
                  <div className="col-lg-2 col-md-4 col-12 mb-4" key={crop.harvestId}>
                    <div className="card text-center" style={{ width: "100%", padding: "15px" }}>
                      <div className="card-body">
                        <h5 className="card-title">{crop.name}</h5>
                        <p className={`card-text ${styles.cropdesc}`}>{crop.price} جنيه / للكيلو</p>
                        <p className="card-text">
                          الكمية: <span className={styles.propspan}>{crop.yield}</span>
                        </p>
                   <button
  className={`btn ${crop.status === 'تحت_الطلب' ? styles.croppending : crop.status === 'نفذت_الكميه' ? styles.cropempty : styles.cropava}`}
  onClick={() => {
    console.log("Selected Crop:", crop); // ✅ Console log the full crop object
    setSelectedCrop(crop);
    setSeecrop(true);
  }}
>
  {crop.status}
</button>

                      </div>
                    </div>
                  </div>
                ))}

                {/* Use selectedCrop to pass the data to Cropcard Modal */}
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
                        right: "30px",
                      }}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                    {/* Pass the selected crop here to the Modal */}
                    <Cropcard
                      crop={selectedCrop}
                      onCropDeleted={handleCropDeleted}
                      onCropUpdated={handleCropUpdated}
                    />
                  </Modal>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      <FooterF />
    </>
  );
}