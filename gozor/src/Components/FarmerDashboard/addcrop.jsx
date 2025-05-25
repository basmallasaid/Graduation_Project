import styles from "../../Styles/style.module.css";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import api from "../../API/axiosInstance";

export default function Addcrop({ onCropAdded, onaddSuccess }) {
    const [imageFile, setImageFile] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [isCropAllowVisible, setIsCropAllowVisible] = useState(false);
    const [cropNames, setCropNames] = useState([]);
    const [selectedCrop, setSelectedCrop] = useState("اختر المحصول");
    const [productionDate, setProductionDate] = useState("");
    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState("");
    const [selectedCycle, setSelectedCycle] = useState("no"); // Initialize with 'no'
    const [cycleOptions, setCycleOptions] = useState([]);
    const [allowUpdates, setAllowUpdates] = useState(null);
    const [error, setError] = useState(null);
    const [cropError, setCropError] = useState(null); // Add cropError state
    const [cycleError, setCycleError] = useState(null); // Add cycleError state

    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem("user_data"));
    const farmerId = userData?.LoggedId;
 

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setImageFile(file);

        const reader = new FileReader();
        reader.onload = () => {
            setImageSrc(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleCycleChange = (e) => {
        const value = e.target.value;
        console.log("Selected cycle value:", value);
        setSelectedCycle(value); 
        setIsCropAllowVisible(value !== "no");
    };

    const handleCropSelect = (cropName) => {
        setSelectedCrop(cropName);
    };

    const handleFormSubmit = (event) => {
      event.preventDefault();
  
      if (
          !selectedCrop ||
          selectedCrop === "اختر المحصول" ||
          !productionDate ||
          !quantity ||
          !price ||
          !imageFile
      ) {
          toast.error("يرجى ملء جميع الحقول!");
          return;
      }
  
      const formData = new FormData();
  
      const cropId = cropNames.find((crop) => crop.cropName === selectedCrop)?.cropId || 0;
      formData.append("CropId", cropId);
  
      if (selectedCycle !== "no") {
          formData.append("CycleId", parseInt(selectedCycle, 10));
      }
  
      formData.append("Yield", parseFloat(quantity));
      formData.append("Price", parseFloat(price));
      formData.append("ProductionDate", new Date(productionDate).toISOString());
      formData.append("IsAlLowedToShowUpdatesToMerchant", allowUpdates === "yes");
      formData.append("Image", imageFile);
  
      api.post(`Harvest?farmerId=${farmerId}`, formData)
          .then((response) => {
              toast.success("تم إضافة المحصول بنجاح!");
  
              setTimeout(() => {
                  onaddSuccess();
              }, 2000);
  
              if (onCropAdded) {
                  onCropAdded({
                      id: response.data.id,
                      name: selectedCrop,
                      yield: quantity,
                      price: price,
                      status: quantity > 0 ? "متاح" : "نفذت الكمية",
                  });
              }
          })
          .catch((error) => {
              console.error("Error submitting data:", error);
              console.error("Response data from server:", error.response?.data);
              setError("Failed to submit data. Please try again.");
              toast.error("فشل في إرسال البيانات. يرجى المحاولة مرة أخرى.");
          });
  };

  useEffect(() => {
    api.get('Crop/CropsOfType?CropTypeId=0')
        .then((response) => {
            setCropNames(response.data);
            if (!response.data || response.data.length === 0) {
                setCropError("No crops found.");
            } else {
                setCropError(null);
            }
        })
        .catch((err) => {
            console.error(err);
            setCropError("Failed to load crops.");
        });
}, []);

    useEffect(() => {
        const fetchCycleData = async () => {
            try {
                console.log("Fetching cycle data...");
                const response = await api.get(
                    `Cycle/GetAllOpenCyclesOfFarmer?FarmerId=${farmerId}`);
                console.log("Raw cycle data:", response.data); // Inspect raw API response

                if (response.data && Array.isArray(response.data)) {
                    // Map the API response to the format expected by the select options
                    const formattedCycleOptions = response.data.map((cycle) => ({
                        cycleId: cycle.id,
                        cycleName: cycle.nameCycle,
                    }));
                    console.log("Formatted cycle options:", formattedCycleOptions); // Inspect formatted data
                    setCycleOptions(formattedCycleOptions);

                    if (formattedCycleOptions.length === 0) {
                        setCycleError("No cycles found.");
                    } else {
                        setCycleError(null);
                    }
                } else {
                    console.error("Invalid cycle data received:", response.data);
                    setCycleError("Failed to load cycle options.");
                }
            } catch (err) {
                console.error("Failed to fetch cycle options:", err);
                setCycleError("Failed to load cycle options.");
            }
        };

        fetchCycleData();
    }, [farmerId]);

    return (
        <div className="container" style={{ backgroundColor: "#F5F5F5" }}>
            <div className="row d-flex flex-column flex-md-row align-items-start align-items-md-center">
                {/* Form Section */}
                <div className="col-lg-6 col-md-6 col-12 mb-4">
                    <div className="border rounded p-4 shadow">
                        <form style={{ padding: "30px" }} onSubmit={handleFormSubmit}>
                            {/* Upload Section */}
                            <div className="text-center" style={{ maxwidth: "40%" }}>
                                <div className={styles.bordercrop}>
                                    <p>اسحب الصور هنا لتحميلها</p>
                                    <button
                                        type="button"
                                        className={styles.bordercropbtn}
                                        onClick={() => document.getElementById("fileInput").click()}
                                    >
                                        استعراض الصور
                                    </button>
                                    <p className="text-muted mt-2">
                                        5MB الحجم الاقصى للصور | PNG, JPG
                                    </p>
                                </div>
                            </div>
                            <div className={styles.addphoto}>
                                <div className={`dropdown ${styles.cropname}`}>
                                    <button
                                        className="btn btn-secondary dropdown-toggle"
                                        type="button"
                                        id="dropdownMenuButton1"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                        style={{
                                            backgroundColor: "#fff",
                                            color: "#49A760",
                                        }}
                                    >
                                        {selectedCrop}
                                    </button>
                                    <ul
                                        className="dropdown-menu"
                                        aria-labelledby="dropdownMenuButton1"
                                    >
                                        {cropError && <li className="dropdown-item text-danger">{cropError}</li>}
                                        {cropNames.length > 0 ? (
                                            cropNames.map((cropItem, index) => (
                                                <li key={index}>
                                                    <a
                                                        className="dropdown-item"
                                                        href="#"
                                                        onClick={() => {
                                                            handleCropSelect(cropItem.cropName); // Use cropItem.cropName
                                                        }}
                                                    >
                                                        {cropItem.cropName}
                                                    </a>
                                                </li>
                                            ))
                                        ) : (
                                            !cropError && <li className="dropdown-item">Loading...</li>
                                        )}
                                    </ul>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label">تاريخ الانتاج</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={productionDate}
                                        onChange={(e) => setProductionDate(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">الكمية</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        style={{ maxWidth: "50%" }}
                                        min="0"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">سعر المحصول</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    style={{ maxWidth: "50%" }}
                                    min="0"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>

                            {/* Cycle Dropdown */}
                            <div className={styles.cropperiod}>
                                <label
                                    className="form-label"
                                    style={{ marginTop: "5px", color: "#49A760" }}
                                >
                                    هل المحصول مرتبط بدورة زراعية؟
                                </label>
                                <select
                                    className="form-select"
                                    style={{
                                        maxWidth: "40%",
                                        backgroundColor: "#fff",
                                        color: "#49A760",
                                    }}
                                    onChange={handleCycleChange}
                                    value={selectedCycle} // Use selectedCycle directly
                                >
                                    <option value="no">لايوجد</option>
                                    {cycleError ? (
                                        <option disabled>{cycleError}</option>
                                    ) : cycleOptions.length > 0 ? (
                                        cycleOptions.map((cycle) => (
                                            <option key={cycle.cycleId} value={cycle.cycleId}>
                                                {cycle.cycleName}
                                            </option>
                                        ))
                                    ) : (
                                        !cycleError && <option disabled>Loading...</option>
                                    )}
                                </select>
                            </div>

                            {isCropAllowVisible && (
                                <div className={styles.cropallow}>
                                    <label
                                        className="form-label"
                                        style={{ marginLeft: "20px", color: "#49A760" }}
                                    >
                                        هل تريد السماح للتجار برؤية التحديثات على الدورات الزراعية؟
                                    </label>
                                    <div className="form-check">
                                        <input
                                            type="radio"
                                            id="allow-yes"
                                            name="allow-updates"
                                            className="form-check-input"
                                            value="yes"
                                            onChange={(e) => setAllowUpdates(e.target.value)}
                                        />
                                        <label htmlFor="allow-yes" className="form-check-label">
                                            نعم
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            type="radio"
                                            id="allow-no"
                                            name="allow-updates"
                                            className="form-check-input"
                                            value="no"
                                            onChange={(e) => setAllowUpdates(e.target.value)}
                                        />
                                        <label
                                            htmlFor="allow-no"
                                            className="form-check-label"
                                            style={{ marginRight: "20px" }}
                                        >
                                            لا
                                        </label>
                                    </div>
                                </div>
                            )}
                            <div className={styles.cropadd_btn}>
                                <button type="submit" className={styles.cropadd}>
                                    اضافه
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Image Section */}
                <div className="col-lg-6 col-md-6 col-12 d-flex justify-content-center">
                    <img
                        className="crop-image"
                        src={imageSrc || ""}
                        alt="اضف صوره المحصول"
                        style={{
                            maxWidth: "100%",
                            borderRadius: "8px",
                            maxHeight: "400px",
                            objectFit: "cover",
                        }}
                    />
                    <input
                        type="file"
                        style={{ display: "none" }}
                        id="fileInput"
                        onChange={handleFileChange}
                    />
                </div>
            </div>

            {/* Toast Container */}
            <ToastContainer />
        </div>
    );
}