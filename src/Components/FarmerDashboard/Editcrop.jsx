// Editcrop.jsx
import styles from "../../Styles/style.module.css";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'; // Import SweetAlert
import api from "../../API/axiosInstance";

export default function Editcrop({ crop, onCropUpdated, oneditSuccess }) {
    const [imageFile, setImageFile] = useState(null);
    const [imageSrc, setImageSrc] = useState(crop?.imageUrl || null);
    const [isCropAllowVisible, setIsCropAllowVisible] = useState(false);
    const [cropNames, setCropNames] = useState([]);
    const [selectedCrop, setSelectedCrop] = useState(crop?.name || "اختر المحصول");
    const [productionDate, setProductionDate] = useState(crop?.productionDate ? crop.productionDate.substring(0, 10) : "");
    const [quantity, setQuantity] = useState(crop?.yield?.toString() || "");
    const [price, setPrice] = useState(crop?.price?.toString() || "");
    const [selectedCycle, setSelectedCycle] = useState(crop?.cycleId?.toString() || "no");
    const [cycleOptions, setCycleOptions] = useState([]);
    const [allowUpdates, setAllowUpdates] = useState(crop?.isAlLowedToShowUpdatesToMerchant ? "yes" : "no");
    const [error, setError] = useState(null);
    const [cropError, setCropError] = useState(null);
    const [cycleError, setCycleError] = useState(null);
    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem("user_data"));
    const farmerId = userData?.LoggedId;

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_FILE_TYPES = ["image/jpeg", "image/jpeg", "image/png", "image/jpg"];

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (!file) {
            return; // No file selected
        }

        if (file.size > MAX_FILE_SIZE) {
            toast.error("حجم الصورة كبير جداً. يجب أن يكون أقل من 5 ميجابايت.");
            return;
        }

        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            toast.error("نوع الصورة غير مدعوم.  يجب أن يكون JPG أو PNG.");
            return;
        }

        setImageFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result); // reader.result is a base64 data URL like "data:image/jpeg;base64,..."
            };
            if (file) {
                reader.readAsDataURL(file);
            }
        };

    const handleCycleChange = (e) => {
        const value = e.target.value;
        console.log("Selected cycle value:", value);
        setSelectedCycle(value); // Set selectedCycle directly (string or "no")
        setIsCropAllowVisible(value !== "no");
    };

    const handleCropSelect = (cropName) => {
        setSelectedCrop(cropName);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
    
        if (
            !selectedCrop ||
            selectedCrop === "اختر المحصول" ||
            !productionDate ||
            !quantity ||
            !price
        ) {
            toast.error("يرجى ملء جميع الحقول!");
            return;
        }
    
        // Show SweetAlert confirmation *before* API call
        const result = await Swal.fire({
            title: "هل أنت متأكد من تعديل المحصول؟",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "نعم, قم بالتعديل!",
            confirmButtonColor: "#28a745",
            denyButtonText: "لا تقم بالتعديل",
            cancelButtonText: "الغاء"
        });
    
        if (result.isConfirmed) {
            // User confirmed, proceed with the API call
            const formData = new FormData();
    
            // Add harvestId (important, based on API endpoint requirements)
            formData.append("HarvestId", crop.harvestId);
    
            //Find CropId
            const cropId = cropNames.find((cropName) => cropName.cropName === selectedCrop)?.cropId || 0;
            formData.append("CropId", cropId);
    
            formData.append("Yield", parseFloat(quantity));
            formData.append("Price", parseFloat(price));
    
            // Format ProductionDate to 'MM-DDYYYY'
            const formattedDate = new Date(productionDate).toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric'
            });
            formData.append("ProductionDate", formattedDate);
    
            // Handle cycleId: Send 0 if no cycle is selected.
            // Conditionally append CycleId
            if (selectedCycle !== "no") {
                formData.append("CycleId", parseInt(selectedCycle, 10));
            }
    
            // Handle Image File
            if (imageFile) {
                formData.append("Image", imageFile);
            }
    
            // Handle IsAlLowedToShowUpdatesToMerchant
            formData.append("IsAlLowedToShowUpdatesToMerchant", allowUpdates === "yes");
    
            console.log("Form data being sent:", Object.fromEntries(formData)); // Log formData
    
            try {
                const response = await api.put(`/Harvest`, formData );
    
                // Get name from cropNames
                const newName = cropNames.find((c) => c.cropId === response.data.cropId)?.cropName || "";
                const updatedCropData = { ...response.data, name: newName };
    
                console.log("Update successful:", response.data);
                toast.success("تم تحديث المحصول بنجاح!");
    
                // Call the onCropUpdated and oneditSuccess callbacks *only* if the API call was successful
                if (onCropUpdated) {
                    onCropUpdated(updatedCropData);
                }
    
                if (oneditSuccess) {
                    oneditSuccess(updatedCropData); // Pass the updated data
                }
    
            } catch (error) {
                console.error("Error updating crop:", error);
                toast.error("فشل في تحديث المحصول. يرجى المحاولة مرة أخرى.");
    
            }
        } else {
            // User cancelled or denied the update
            toast.info("تم إلغاء التعديل.");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(
                    "/Crop/CropsOfType?CropTypeId=0",);
                console.log("Raw Crop API Data:", response.data);
                setCropNames(response.data);
                if (!response.data || response.data.length === 0) {
                    setCropError("No crops found.");
                } else {
                    setCropError(null);
                }
            } catch (err) {
                console.error(err);
                setCropError("Failed to load crops.");
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchCycleData = async () => {
            try {
                console.log("Fetching cycle data...");
                const response = await api.get(
                    `Cycle/GetAllOpenCyclesOfFarmer?farmerId=${farmerId}`);
                console.log("Raw Cycle API Data:", response.data);

                if (response.data && Array.isArray(response.data)) {
                    const formattedCycleOptions = response.data.map((cycle) => ({
                        cycleId: cycle.id,
                        cycleName: cycle.nameCycle,
                    }));
                    setCycleOptions(formattedCycleOptions);

                    if (formattedCycleOptions.length === 0) {
                        setCycleError("No cycles found.");
                    } else {
                        setCycleError(null);
                    }
                } else {
                    console.error("Invalid cycle data received:", response.data);
                    setCycleError("Invalid cycle data received.");
                }
            } catch (err) {
                console.error("Failed to fetch cycle options:", err);
                setCycleError("Failed to load cycle options.");
            }
        };

        fetchCycleData();
    }, [farmerId]);

    useEffect(() => {
        console.log("EditCrop - Crop Prop:", crop); // Check if this is receiving the correct crop
        if (crop) {
            setImageSrc(crop.imageUrl);
            setSelectedCrop(crop.name);
            setProductionDate(crop.productionDate ? crop.productionDate.substring(0, 10) : "");
            setQuantity(crop.yield.toString());
            setPrice(crop.price.toString());
            setSelectedCycle(crop.cycleId ? crop.cycleId.toString() : "no");
            setAllowUpdates(crop.isAlLowedToShowUpdatesToMerchant ? "yes" : "no");
            setIsCropAllowVisible(crop.cycleId !== null && crop.cycleId !== undefined);
        }
    }, [crop]);

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
                                                            console.log("Selected Crop:", cropItem.cropName); // Use cropItem.cropName
                                                            handleCropSelect(cropItem.cropName); // Use cropItem.cropName
                                                        }}
                                                    >
                                                        {cropItem.cropName} {/* Display cropItem.cropName */}
                                                    </a>
                                                </li>
                                            ))
                                        ) : (
                                            !cropError && <li className="dropdown-item">Loading...</li >
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
                                            checked={allowUpdates === "yes"}
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
                                            checked={allowUpdates === "no"}
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
                                    تعديل
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Image Section */}
                <div className="col-lg-6 col-md-6 col-12 d-flex justify-content-center">
                <img
    className="crop-image"
    src={
        imageSrc && imageSrc.startsWith("data:image")
            ? imageSrc
            : imageSrc
            ? `https://cityroots.runasp.net/${imageSrc.startsWith('/') ? imageSrc.substring(1) : imageSrc}`
            : ""
    }
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