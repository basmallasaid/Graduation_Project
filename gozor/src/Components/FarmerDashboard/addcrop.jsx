import styles from "../../Styles/style.module.css";
import { useState } from "react";

export default function Addcrop() {
  const [imageSrc, setImageSrc] = useState(null);
  const [isCropAllowVisible, setIsCropAllowVisible] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImageSrc(reader.result); // Store the image data
    };

    if (file) {
      reader.readAsDataURL(file); // Read the file
    }
  };

  const handleSelectChange = (e) => {
    const value = e.target.value;
    setIsCropAllowVisible(value !== "no"); // Show the div if the value is not "لايوجد"
  };

  return (
    <div className="container py-5" style={{ backgroundColor: "#F5F5F5" ,maxWidth:"70%" }}>
      <div
        className="row d-flex flex-column flex-md-row align-items-start align-items-md-center"
      >
        {/* Form Section */}
        <div className="col-lg-6 col-md-6 col-12 mb-4">
          <div className="border rounded p-4 shadow">
            <form style={{ padding: "30px" }}>
              <div className={styles.addphoto}>
                <div className={styles.cropname}>
                  <label className="form-label">اسم المحصول</label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ width: "100%" }}
                  />
                </div>
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
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">تاريخ الانتاج</label>
                  <input type="date" className="form-control" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">الكمية</label>
                  <input
                    type="number"
                    className="form-control"
                    style={{ maxWidth: "30%" }}
                    min="0"
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
                    maxWidth: "30%",
                    backgroundColor: "#fff",
                    color: "#49A760",
                  }}
                  onChange={handleSelectChange}
                >
                  <option>اختر الدورة</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="no">لايوجد</option>
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
            </form>
          </div>
        </div>

        {/* Image Section */}
        <div className="col-lg-6 col-md-6 col-12 d-flex justify-content-center">
          <img
            className="crop-image"
            src={imageSrc || ""}
            alt="add product image"
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
    </div>
  );
}
