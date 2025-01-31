import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

export default function Updateclosecycle({ selectedCardData, onUpdateSuccess }) {
  const [formData, setFormData] = useState({
    cycleId: null,
    cycleName: "",
    parcelName: "",
    parcelId: null,
    selectedProductType: "",
    cropId: null,
    expectedProduction: "",
    isOpenForInvestment: false,
    roiUnit: "",
    startDate: "",
    endDate: ""
  });
  const [lands, setLands] = useState([]);
  const [vegetables, setVegetables] = useState([]);
  const [fruits, setFruits] = useState([]);
  const [seeds, setSeeds] = useState([]);

  useEffect(() => {
    if (selectedCardData) {
      setFormData({
        cycleId: selectedCardData.id,
        cycleName: selectedCardData.cycleName || "",
        parcelName: selectedCardData.parcelName || "",
        parcelId: selectedCardData.parcelId || null,
        selectedProductType: selectedCardData.selectedProductType || "",
        cropId: selectedCardData.cropId || null,
        expectedProduction: selectedCardData.expectedProduction?.toString() || "",
        roiUnit: selectedCardData.roiUnit || "",
        startDate: selectedCardData.startDate ? new Date(selectedCardData.startDate).toISOString().split('T')[0] : "",
        endDate: selectedCardData.endDate ? new Date(selectedCardData.endDate).toISOString().split('T')[0] : ""
      });
    }
  }, [selectedCardData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [landsRes, vegetablesRes, fruitsRes, seedsRes] = await Promise.all([
          axios.get("http://localhost:8000/lands"),
          axios.get("http://localhost:8000/vegetables"),
          axios.get("http://localhost:8000/fruits"),
          axios.get("http://localhost:8000/seeds"),
        ]);

        setLands(landsRes.data);
        setVegetables(vegetablesRes.data);
        setFruits(fruitsRes.data);
        setSeeds(seedsRes.data);
      } catch (error) {
        toast.error("حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.");
      }
    };
    fetchData();
  }, []);

  const handleSelectChange = (selectedCrop) => {
    setFormData(prev => ({
      ...prev,
      selectedProductType: selectedCrop.name,
      cropId: selectedCrop.id
    }));
  };

  const handleLandChange = (e) => {
    const selectedLand = JSON.parse(e.target.value);
    setFormData(prev => ({
      ...prev,
      parcelName: selectedLand.name,
      parcelId: selectedLand.id
    }));
  };

  const validateForm = () => {
    const validations = [
      { condition: !formData.cycleId, message: "تعذر تحديد الدورة الحالية" },
      { condition: !formData.cycleName.trim(), message: "يرجى إدخال اسم الدورة" },
      { condition: !formData.parcelName, message: "يرجى اختيار الأرض" },
      { condition: !formData.selectedProductType, message: "يرجى اختيار نوع المحصول" },
      { condition: !formData.cropId, message: "يرجى اختيار المحصول" },
      { condition: !formData.expectedProduction, message: "يرجى إدخال الإنتاج المتوقع" },
      { condition: !formData.roiUnit, message: "يرجى اختيار وحدة العائد" },
      { condition: !formData.startDate || !formData.endDate, message: "يرجى إدخال تاريخ البداية والنهاية" },
      {
        condition: new Date(formData.endDate) <= new Date(formData.startDate),
        message: "يجب أن يكون تاريخ النهاية بعد تاريخ البداية"
      }
    ];

    const error = validations.find(v => v.condition);
    if (error) {
      Swal.fire({
        title: "خطأ",
        text: error.message,
        icon: "error",
        confirmButtonColor: "#28a745"
      });
      return false;
    }
    return true;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      console.log(formData);
      const response = await axios.put(`http://localhost:8000/viewyield/${formData.cycleId}`, {
        cycleName: formData.cycleName,
        parcelName: formData.parcelName,
        parcelId: formData.parcelId,
        selectedProductType: formData.selectedProductType,
        cropId: formData.cropId,
        expectedProduction: Number(formData.expectedProduction),
        roiUnit: formData.roiUnit,
        startDate: formData.startDate,
        endDate: formData.endDate,
        isOpenForInvestment: false
      });

      Swal.fire("تم الحفظ!", "تم تحديث الدورة بنجاح.", "success");
      onUpdateSuccess(response.data);
    } catch (error) {
      console.error("Update failed:", error);
      Swal.fire("خطأ", "حدث خطأ أثناء تحديث الدورة.", "error");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <form
        onSubmit={handleSubmit}
        className="w-100 p-4 border rounded"
        style={{ fontSize: "22px" }}
      >
        <div className="row ">
          {/* Cycle Name */}
          <div className="col-md-6 ">
            <label className="form-label">اسم الدورة</label>
            <input
              type="text"
              className="form-control"
              value={formData.cycleName}
              onChange={(e) => setFormData({ ...formData, cycleName: e.target.value })}
              style={{borderRadius:"10px",
                borderColor:"#1F4E3D",
              }}
            />
          </div>
          {/* Land */}
          <div className="col-md-6 mb-2">
            <label className="form-label">الأرض المرتبطة بالدورة</label>
            <select
              className="form-select"
              value={formData.parcelId ? JSON.stringify({ id: formData.parcelId, name: formData.parcelName }) : ""}
              onChange={handleLandChange}
              style={{borderRadius:"10px",
                borderColor:"#1F4E3D",
              }}
            >
              <option value="">الارض...</option>
              {lands.map((land) => (
                <option key={land.id} value={JSON.stringify(land)}>
                  {land.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="row ">
          {/* Product Type */}
          <div className="col-12 ">
            <label className="form-label">المحصول:</label>
            <div className="d-flex flex-wrap align-items-center gap-2">
              <input
                type="text"
                className="form-control mb-2 mb-md-0"
                style={{ width: "440px",borderRadius:"10px",
                  borderColor:"#1F4E3D", }}
                value={formData.selectedProductType}
                readOnly
              />
              <select
                className="form-select  mb-md-0"
                style={{ width: "230px" ,borderRadius:"10px",
                  borderColor:"#1F4E3D",}}
                onChange={(e) => handleSelectChange(JSON.parse(e.target.value))}
              >
                <option value="">فواكه...</option>
                {fruits.map((fruit) => (
                  <option key={fruit.id} value={JSON.stringify(fruit)}>
                    {fruit.name}
                  </option>
                ))}
              </select>
              <select
                className="form-select  mb-md-0"
                style={{ width: "230px",borderRadius:"10px",
                  borderColor:"#1F4E3D", }}
                onChange={(e) => handleSelectChange(JSON.parse(e.target.value))}
              >
                <option value="">خضروات...</option>
                {vegetables.map((vegetable) => (
                  <option key={vegetable.id} value={JSON.stringify(vegetable)}>
                    {vegetable.name}
                  </option>
                ))}
              </select>
              <select
                className="form-select  mb-md-0"
                style={{ width: "230px" ,borderRadius:"10px",
                  borderColor:"#1F4E3D",}}
                onChange={(e) => handleSelectChange(JSON.parse(e.target.value))}
              >
                <option value="">حبوب...</option>
                {seeds.map((seed) => (
                  <option key={seed.id} value={JSON.stringify(seed)}>
                    {seed.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="row">
          {/* Return on Investment */}
          <div className="col-12 col-md-6">
            <label className="form-label">متوقع انتاجيه المحصول</label>
            <div className="d-flex flex-wrap align-items-center gap-2">
              <input
                type="number"
                min={0}
                className="form-control  mb-md-0"
                 style={{ width: "400px",borderRadius:"10px",
                  borderColor:"#1F4E3D",}}
                value={formData.expectedProduction}
                onChange={(e) => setFormData({ ...formData, expectedProduction: e.target.value })}
                
              />
              <select
                className="form-select  mb-md-0"
                 style={{ width: "100px" ,borderRadius:"10px",
                  borderColor:"#1F4E3D",}}
                value={formData.roiUnit}
                onChange={(e) => setFormData({ ...formData, roiUnit: e.target.value })}
              >
                <option value="">اختر</option>
                <option value="كيلو">كيلو</option>
                <option value="طن">طن</option>
              </select>
            </div>
          </div>
        </div>

        <div className="row ">
          {/* Start Date */}
          <div className="col-md-6 mb-2">
            <label className="form-label">تاريخ البداية:</label>
            <input
              type="date"
              className="form-control"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              style={{borderRadius:"10px",
                borderColor:"#1F4E3D",
              }}
            />
          </div>
          {/* End Date */}
          <div className="col-md-6 mb-2">
            <label className="form-label">تاريخ النهاية:</label>
            <input
              type="date"
              className="form-control"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              style={{borderRadius:"10px",
                borderColor:"#1F4E3D",
              }}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="d-flex justify-content-end">
          <button
            type="submit"
            className="btn"
            style={{
              padding: "10px 45px",
              backgroundColor: "#1F4E3D",
              color: "white",
            }}
          >
            حفظ
          </button>
        </div>
      </form>
    </div>
  );
}