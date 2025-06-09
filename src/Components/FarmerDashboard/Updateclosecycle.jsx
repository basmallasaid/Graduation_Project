import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import api from "../../API/axiosInstance";

export default function Updateclosecycle({ selectedCardData, onUpdateSuccess }) {
const userData = JSON.parse(localStorage.getItem("user_data"));

    const farmerId = userData?.LoggedId; 
  const [formData, setFormData] = useState({
    cycleId: selectedCardData?.cycleId || null,
    cycleName: "",
    parcelName: "",
    parcelId: null,
    selectedProductType: "",
    cropId: null,
    expectedYield: "",
    isOpenForInvestment: false,
    roiUnit: "",
    startDate: "",
    endDate: "",
  });

  const [parcelName, setParcelName] = useState("");
  const [parcelId, setParcelId] = useState(null);
  const [selectedProductType, setSelectedProductType] = useState("");
  const [selectedCropId, setSelectedCropId] = useState(null);
  
  const [lands, setLands] = useState([]);
  const [vegetables, setVegetables] = useState([]);
  const [fruits, setFruits] = useState([]);
  const [seeds, setSeeds] = useState([]);

  useEffect(() => {
    if (selectedCardData) {
      setFormData({
        cycleId: selectedCardData.cycleId,
        cycleName: selectedCardData.cycleName || "",
        parcelName: selectedCardData.parcelName || "",
        parcelId: selectedCardData.parcelId || null,
        selectedProductType: selectedCardData.selectedProductType || "",
        cropId: selectedCardData.cropId || null,
        expectedYield: selectedCardData.expectedYield?.toString() || "",
        startDate: selectedCardData.startDate
          ? new Date(selectedCardData.startDate).toISOString().split("T")[0]
          : "",
        endDate: selectedCardData.endDate
          ? new Date(selectedCardData.endDate).toISOString().split("T")[0]
          : "",
      });

      setParcelName(selectedCardData.parcelName || "");
      setParcelId(selectedCardData.parcelId || null);
      setSelectedProductType(selectedCardData.selectedProductType || "");
      setSelectedCropId(selectedCardData.cropId || null);
    }
  }, [selectedCardData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [landsRes, vegetablesRes, fruitsRes, seedsRes] = await Promise.all([
          api.get(`LandParcel/GetAllLandsOfFarmerId?farmerId=${farmerId}`),
          api.get("Crop/CropsOfType?CropTypeId=3"),
          api.get("Crop/CropsOfType?CropTypeId=2"),
          api.get("Crop/CropsOfType?CropTypeId=1"),
        ]);

        setLands(landsRes.data);
        setVegetables(vegetablesRes.data);
        setFruits(fruitsRes.data);
        setSeeds(seedsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.");
      }
    };

    fetchData();
  }, [farmerId]);

  useEffect(() => {
    if (selectedCardData?.parcelId && lands.length > 0) {
      const land = lands.find((land) => land.parcelId === selectedCardData.parcelId);
      setParcelName(land ? land.parcelName : "");
    }
  }, [selectedCardData, lands]);

  useEffect(() => {
    if (selectedCropId) {
      let foundCrop =
        fruits.find(fruit => fruit.id === selectedCropId || fruit.cropId === selectedCropId) ||
        vegetables.find(vegetable => vegetable.id === selectedCropId || vegetable.cropId === selectedCropId) ||
        seeds.find(seed => seed.id === selectedCropId || seed.cropId === selectedCropId);

      if (foundCrop && foundCrop.cropName !== selectedProductType) {
        setSelectedProductType(foundCrop.cropName || foundCrop.name);
      }
    }
  }, [selectedCropId, fruits, vegetables, seeds]);

  const handleSelectChange = (selectedCrop) => {
    setSelectedProductType(selectedCrop.cropName || selectedCrop.name);
    setSelectedCropId(selectedCrop.id || selectedCrop.cropId);
  };

  const handleLandChange = (e) => {
    const selectedLand = JSON.parse(e.target.value);
    setParcelName(selectedLand.parcelName);
    setParcelId(selectedLand.parcelId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`Cycle/EditCycle`, {
        ...formData,
        parcelName,
        parcelId,
        selectedProductType,
        cropId: selectedCropId,
        expectedYield: Number(formData.expectedYield),
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
                            value={parcelId ? JSON.stringify({ parcelId: parcelId, parcelName: parcelName }) : ""}
                            onChange={handleLandChange}
                            style={{ borderRadius: "10px", borderColor: "#1F4E3D" }}
                        >
                            <option value="">{parcelName || "الارض..."}</option>
                            {lands.map((land) => (
                                <option key={land.parcelId} value={JSON.stringify(land)}>
                                    {land.parcelName}
                                </option>
                            ))}

                        </select>
               </div>
         </div>
         <div className="row">
     {/* Product Type */}
     <div className="col-12 ">
         <label className="form-label">المحصول</label>
         <div className="d-flex flex-wrap align-items-center gap-2">
             <input
                 type="text"
                 className="form-control  mb-md-0" /* Added mb-md-0 for medium and larger screens */
                 style={{ width: "450px",borderRadius:"10px",
                   borderColor:"#1F4E3D" }}
                 value={selectedProductType}
                 readOnly

             />
             <select
                 className="form-select mb-2 mb-md-0"
                 style={{ width: "250px",borderRadius:"10px",
                   borderColor:"#1F4E3D" }}
                 onChange={(e) => handleSelectChange(JSON.parse(e.target.value))}
             >
                 <option value="">فواكه...</option>
                 {fruits.map((fruit) => (
                     <option key={fruit.id} value={JSON.stringify(fruit)}>
                                        {fruit.cropName || fruit.name}
                                        </option>
                 ))}

             </select>
             <select
                 className="form-select mb-2 mb-md-0"
                 style={{ width: "250px",borderRadius:"10px",
                   borderColor:"#1F4E3D" }}
                 onChange={(e) => handleSelectChange(JSON.parse(e.target.value))}
             >
                 <option value="">خضروات...</option>
                 {vegetables.map((vegetable) => (
                     <option key={vegetable.id} value={JSON.stringify(vegetable)}>
                                        {vegetable.cropName || vegetable.name}
                                        </option>
                 ))}
             </select>
             <select
                 className="form-select mb-2 mb-md-0"
                 style={{ width: "250px" ,borderRadius:"10px",
                   borderColor:"#1F4E3D"}}
                 onChange={(e) => handleSelectChange(JSON.parse(e.target.value))}
             >
                 <option value="">حبوب...</option>
                 {seeds.map((seed) => (
                     <option key={seed.id} value={JSON.stringify(seed)}>
                                        {seed.cropName || seed.name}
                                        </option>
                 ))}
             </select>
            </div>
          </div>
        </div>
        <div className="row">
          {/* Return on Investment */}
          <div className="col-12 col-md-6">
            <label className="form-label">متوقع انتاجيه المحصول بالكيلو</label>
            <div className="d-flex flex-wrap align-items-center gap-2">
              <input
                type="number"
                min={0}
                className="form-control  mb-md-0"
                 style={{ width: "400px",borderRadius:"10px",
                  borderColor:"#1F4E3D",}}
                value={formData.expectedYield}
                onChange={(e) => setFormData({ ...formData, expectedYield: e.target.value })}
                
              />
              {/* <select
                className="form-select  mb-md-0"
                 style={{ width: "100px" ,borderRadius:"10px",
                  borderColor:"#1F4E3D",}}
                value={formData.roiUnit}
                onChange={(e) => setFormData({ ...formData, roiUnit: e.target.value })}
              >
                <option value="">اختر</option>
                <option value="كيلو">كيلو</option>
                <option value="طن">طن</option>
              </select> */}
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