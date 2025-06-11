// Editcrop.jsx
import styles from "../../Styles/style.module.css";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from 'sweetalert2';
import api from "../../API/axiosInstance";

export default function Editcrop({ crop, oneditSuccess }) {
    // State for the image
    const [imageFile, setImageFile] = useState(null);
    const [imageSrc, setImageSrc] = useState(crop?.imageUrl || null);

    // Form fields state
    const [cropNames, setCropNames] = useState([]);
    const [selectedCrop, setSelectedCrop] = useState(crop?.name || "اختر المحصول");
    const [productionDate, setProductionDate] = useState(crop?.productionDate ? crop.productionDate.substring(0, 10) : "");
    const [quantity, setQuantity] = useState(crop?.yield?.toString() || "");
    const [price, setPrice] = useState(crop?.price?.toString() || "");
    const [selectedCycle, setSelectedCycle] = useState(crop?.cycleId?.toString() || "no");
    const [cycleOptions, setCycleOptions] = useState([]);
    const [allowUpdates, setAllowUpdates] = useState(crop?.isAlLowedToShowUpdatesToMerchant ? "yes" : "no");
    
    // UI and Error State
    const [isCropAllowVisible, setIsCropAllowVisible] = useState(!!crop?.cycleId);
    const [cropError, setCropError] = useState(null);
    const [cycleError, setCycleError] = useState(null);

    // Other constants
    const userData = JSON.parse(localStorage.getItem("user_data"));
    const farmerId = userData?.LoggedId;
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

    // Handles instant preview of a newly selected image
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

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
            setImageSrc(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleCycleChange = (e) => {
        const value = e.target.value;
        setSelectedCycle(value);
        setIsCropAllowVisible(value !== "no");
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (!selectedCrop || selectedCrop === "اختر المحصول" || !productionDate || !quantity || !price) {
            toast.error("يرجى ملء جميع الحقول!");
            return;
        }

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
            const formData = new FormData();

            formData.append("HarvestId", crop.harvestId);
            const cropId = cropNames.find((cropName) => cropName.cropName === selectedCrop)?.cropId || 0;
            formData.append("CropId", cropId);
            formData.append("Yield", parseFloat(quantity));
            formData.append("Price", parseFloat(price));
            const formattedDate = new Date(productionDate).toLocaleDateString('en-US', {
                month: '2-digit', day: '2-digit', year: 'numeric'
            });
            formData.append("ProductionDate", formattedDate);

            if (selectedCycle !== "no") {
                formData.append("CycleId", parseInt(selectedCycle, 10));
            }

            if (imageFile) {
                formData.append("Image", imageFile);
            }

            formData.append("IsAlLowedToShowUpdatesToMerchant", allowUpdates === "yes");

            try {
                const response = await api.put(`/Harvest`, formData);
                
                // =======================================================================
                // THE DEFINITIVE FIX: Construct a COMPLETE updated object to pass back.
                // =======================================================================
                const newName = cropNames.find((c) => c.cropId === response.data.cropId)?.cropName || "";

                // 1. Start with the original crop data to preserve fields like 'status'.
                // 2. Overwrite with form data for instant UI feedback.
                // 3. Overwrite with the server response, which is the "source of truth", especially for the new `imageUrl`.
                // 4. Ensure the `name` is correctly set.
                const completeUpdatedCrop = {
                    ...crop,                               // Base object with all original fields
                    yield: parseFloat(quantity),             // Update with form value
                    price: parseFloat(price),                // Update with form value
                    productionDate: productionDate,          // Update with form value
                    ...response.data,                        // Crucially, overwrite with server response
                    name: newName,                           // Set the correct name
                };
                
                toast.success("تم تحديث المحصول بنجاح!");
              
                if (oneditSuccess) {
                    // Pass the complete, correct object back to the parent.
                    oneditSuccess(completeUpdatedCrop); 
                }

            } catch (error) {
                console.error("Error updating crop:", error);
                toast.error("فشل في تحديث المحصول. يرجى المحاولة مرة أخرى.");
            }
        } else {
            toast.info("تم إلغاء التعديل.");
        }
    };

    // Effect to fetch crop names
    useEffect(() => {
        api.get("/Crop/CropsOfType?CropTypeId=0")
            .then(res => setCropNames(res.data))
            .catch(err => setCropError("Failed to load crops."));
    }, []);

    // Effect to fetch farmer's cycles
    useEffect(() => {
        if (!farmerId) return;
        api.get(`Cycle/GetAllOpenCyclesOfFarmer?farmerId=${farmerId}`)
            .then(res => {
                if (res.data && Array.isArray(res.data)) {
                    setCycleOptions(res.data.map(c => ({ cycleId: c.id, cycleName: c.nameCycle })));
                }
            })
            .catch(err => setCycleError("Failed to load cycles."));
    }, [farmerId]);

    // Effect to populate form when `crop` prop changes (e.g., when modal opens)
    useEffect(() => {
        if (crop) {
            setImageSrc(crop.imageUrl);
            setSelectedCrop(crop.name);
            setProductionDate(crop.productionDate ? crop.productionDate.substring(0, 10) : "");
            setQuantity(crop.yield?.toString() || "");
            setPrice(crop.price?.toString() || "");
            setSelectedCycle(crop.cycleId ? crop.cycleId.toString() : "no");
            setAllowUpdates(crop.isAlLowedToShowUpdatesToMerchant ? "yes" : "no");
            setIsCropAllowVisible(!!crop.cycleId);
            setImageFile(null); // Reset any previously staged file
        }
    }, [crop]);

    return (
        <div className="container" style={{ backgroundColor: "#F5F5F5" }}>
            <div className="row d-flex flex-column flex-md-row align-items-start align-items-md-center">
                {/* Form Section */}
                <div className="col-lg-6 col-md-6 col-12 mb-4">
                    <div className="border rounded p-4 shadow">
                        <form style={{ padding: "30px" }} onSubmit={handleFormSubmit}>
                            <div className="text-center" style={{ maxwidth: "40%" }}>
                                <div className={styles.bordercrop}>
                                    <p>اسحب الصور هنا لتحميلها</p>
                                    <button type="button" className={styles.bordercropbtn} onClick={() => document.getElementById("fileInput").click()}>
                                        استعراض الصور
                                    </button>
                                    <p className="text-muted mt-2">5MB الحجم الاقصى للصور | PNG, JPG</p>
                                </div>
                            </div>
                            
                            <div className={styles.addphoto}>
                                <div className={`dropdown ${styles.cropname}`}>
                                    <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ backgroundColor: "#fff", color: "#49A760" }}>
                                        {selectedCrop}
                                    </button>
                                    <ul className="dropdown-menu">
                                        {cropNames.map((cropItem) => (
                                            <li key={cropItem.cropId}>
                                                <a className="dropdown-item" href="#" onClick={() => setSelectedCrop(cropItem.cropName)}>
                                                    {cropItem.cropName}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label">تاريخ الانتاج</label>
                                    <input type="date" className="form-control" value={productionDate} onChange={(e) => setProductionDate(e.target.value)} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">الكمية</label>
                                    <input type="number" className="form-control" style={{ maxWidth: "50%" }} min="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">سعر المحصول</label>
                                <input type="number" className="form-control" style={{ maxWidth: "50%" }} min="0" value={price} onChange={(e) => setPrice(e.target.value)} />
                            </div>

                            <div className={styles.cropperiod}>
                                <label className="form-label" style={{ marginTop: "5px", color: "#49A760" }}>
                                    هل المحصول مرتبط بدورة زراعية؟
                                </label>
                                <select className="form-select" style={{ maxWidth: "40%", backgroundColor: "#fff", color: "#49A760" }} onChange={handleCycleChange} value={selectedCycle}>
                                    <option value="no">لايوجد</option>
                                    {cycleOptions.map((cycle) => (
                                        <option key={cycle.cycleId} value={cycle.cycleId}>{cycle.cycleName}</option>
                                    ))}
                                </select>
                            </div>
                            
                            {isCropAllowVisible && (
                                <div className={styles.cropallow}>
                                    <label className="form-label" style={{ marginLeft: "20px", color: "#49A760" }}>
                                        هل تريد السماح للتجار برؤية التحديثات على الدورات الزراعية؟
                                    </label>
                                    <div className="form-check">
                                        <input type="radio" id="allow-yes" name="allow-updates" className="form-check-input" value="yes" checked={allowUpdates === "yes"} onChange={(e) => setAllowUpdates(e.target.value)} />
                                        <label htmlFor="allow-yes" className="form-check-label">نعم</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="radio" id="allow-no" name="allow-updates" className="form-check-input" value="no" checked={allowUpdates === "no"} onChange={(e) => setAllowUpdates(e.target.value)} />
                                        <label htmlFor="allow-no" className="form-check-label" style={{ marginRight: "20px" }}>لا</label>
                                    </div>
                                </div>
                            )}

                            <div className={styles.cropadd_btn}>
                                <button type="submit" className={styles.cropadd}>تعديل</button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Image Preview Section */}
                <div className="col-lg-6 col-md-6 col-12 d-flex justify-content-center">
                    <img
                        className="crop-image"
                        src={
                            imageSrc && imageSrc.startsWith("data:image") // Case 1: Local base64 preview
                                ? imageSrc
                                : imageSrc // Case 2: URL from server
                                ? `https://cityroots.runasp.net/${imageSrc.startsWith('/') ? imageSrc.substring(1) : imageSrc}`
                                : "" // Case 3: No image
                        }
                        alt="اضف صوره المحصول"
                        style={{ maxWidth: "100%", borderRadius: "8px", maxHeight: "400px", objectFit: "cover" }}
                    />
                    <input
                        type="file"
                        style={{ display: "none" }}
                        id="fileInput"
                        accept={ALLOWED_FILE_TYPES.join(",")}
                        onChange={handleFileChange}
                    />
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}