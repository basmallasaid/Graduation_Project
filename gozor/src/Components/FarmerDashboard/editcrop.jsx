import styles from "../../Styles/style.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function Editcrop({ crop, onCropUpdated ,oneditSuccess}) {
  const [imageSrc, setImageSrc] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState("اختر المحصول");
  const [productionDate, setProductionDate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [isCycleRelated, setIsCycleRelated] = useState(null);
  const [allowUpdates, setAllowUpdates] = useState(null);
  const [cropNames, setCropNames] = useState([]);
  const [error, setError] = useState(null);


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImageSrc(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleCropSelect = (name) => {
    setSelectedCrop(name);
  };

  const handleSelectChange = (e) => {
    setIsCycleRelated(e.target.value);
  };

  useEffect(() => {
    if (crop) {
      setImageSrc(crop.imageUrl);
      setSelectedCrop(crop.name);
      setProductionDate(crop.productionDate);
      setQuantity(crop.yield.toString());
      setPrice(crop.price.toString());
      setIsCycleRelated(crop.isCycleRelated ? crop.isCycleRelated.toString() : "0");
      setAllowUpdates(crop.allowUpdates ? "yes" : "no");
    }
  }, [crop]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (
      !selectedCrop ||
      selectedCrop === "اختر المحصول" ||
      !productionDate ||
      !quantity ||
      !price ||
      !imageSrc
    ) {
      toast.error("يرجى ملء جميع الحقول!");
      return;
    }

    const updatedCropData = {
      id: crop.id,
      imageUrl: imageSrc,
      name: selectedCrop,
      yield: parseInt(quantity, 10),
      price: parseFloat(price),
      productionDate,
      status: quantity > 0 
      ? parseInt(isCycleRelated, 10) > 0 
        ? "تحت الطلب" 
        : "متاح" 
      : "نفذت الكمية",
      isCycleRelated: parseInt(isCycleRelated, 10),
      allowUpdates: allowUpdates === "true",
    };

    try {
      const response = await axios.put(
        `http://localhost:8100/cropview/${crop.id}`,
        updatedCropData
      );
     
      if (onCropUpdated) {
        onCropUpdated(updatedCropData);
      }
    
    } catch (err) {
      console.error("Error updating data:", err);
      toast.error("فشل في تعديل البيانات. يرجى المحاولة مرة أخرى.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8100/cropname");
        setCropNames(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load crops");
      }
    };

    fetchData();
  }, []);

  const isCropAllowVisible = isCycleRelated !== null && parseInt(isCycleRelated, 10) > 0;

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
                    {selectedCrop} {/* Display the selected crop name */}
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    {error && <li className="dropdown-item text-danger">{error}</li>}
                    {cropNames.length > 0 ? (
                      cropNames.map((crop, index) => (
                        <li key={index}>
                          <a
                            className="dropdown-item"
                            href="#"
                            onClick={() => handleCropSelect(crop.name)} // Set the selected crop name on click
                          >
                            {crop.name}
                          </a>
                        </li>
                      ))
                    ) : (
                      !error && <li className="dropdown-item">Loading...</li>
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
                  onChange={handleSelectChange}
                  value={isCycleRelated} // Bind to state
                  
                >
                  <option value="no">لايوجد</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
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
                      checked={allowUpdates === "yes"} // This will set the checked state based on the value of allowUpdates

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
                      checked={allowUpdates === "no"} // This will set the checked state based on the value of allowUpdates

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
