import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../API/axiosInstance";

export default function AddCloseCycle({ isOpenForInvestment, onCropAdded, onaddcloseSuccess }) {
    const [lands, setLands] = useState([]);
  const [vegetables, setVegetables] = useState([]);
  const [fruits, setFruits] = useState([]);
  const [seeds, setSeeds] = useState([]);

    const [cycleName, setCycleName] = useState("");
  const [parcelName, setparcelName] = useState("");
  const [parcelId, setParcelId] = useState(null);
  const [selectedProductType, setSelectedProductType] = useState("");
  const [selectedCropId, setSelectedCropId] = useState(null);
  const [expectedProduction, setexpectedProduction] = useState("");
  const [roiUnit, setRoiUnit] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const userData = JSON.parse(localStorage.getItem("user_data"));

    const farmerId = userData?.LoggedId;
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
        toast.error("حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.");
      }
    };

    fetchData();
  }, []);
  const handleSelectChange = (selectedCrop) => {
    setSelectedProductType(selectedCrop.cropName || selectedCrop.name); //Handles both objects
    setSelectedCropId(selectedCrop.id || selectedCrop.cropId);
};
const handleLandChange = (e) => {
    const selectedLand = JSON.parse(e.target.value);
    setparcelName(selectedLand.parcelName);
    setParcelId(selectedLand.parcelId);
};


  const validateForm = () => {
    if (!cycleName.trim()) {
      toast.error("يرجى إدخال اسم الدورة");
      return false;
    }

     if (!parcelName) {
      toast.error("يرجى اختيار الأرض");
      return false;
    }

    if (!selectedProductType) {
      toast.error("يرجى اختيار نوع المحصول");
      return false;
    }

    if (!expectedProduction) {
      toast.error("يرجى إدخال الإنتاج المتوقع");
      return false;
    }

    

    if (!startDate || !endDate) {
      toast.error("يرجى إدخال تاريخ البداية والنهاية");
      return false;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) {
      toast.error("يجب أن يكون تاريخ النهاية بعد تاريخ البداية");
      return false;
    }

    return true;
  };
  const resetForm = () => {
    setCycleName("");
    setparcelName("");
    setParcelId(null);
    setSelectedCropId(null);
    setSelectedProductType("");
    setexpectedProduction("");
    setStartDate("");
    setEndDate("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const data = {
      parcelId: Number(parcelId), // Convert to Number
      cropId: Number(selectedCropId), // Convert to Number
      cycleName,
      startDate: new Date(startDate).toISOString(), // Format the date
      endDate: new Date(endDate).toISOString(),     // Format the date
      expectedYield: Number(expectedProduction), // expectedProduction instead of expectedYield
      // isOpenForInvestment should NOT be included in the request body for closed cycles.
    };

    try {
      const response = await api.post("Cycle/AddCycle", data);
      toast.success("تم إضافة الدورة المغلقه بنجاح");
      setTimeout(() => {
        onaddcloseSuccess();
      }, 2000);
      if (onCropAdded) {
        // Assign cycleId from the id in the response.
        onCropAdded({ ...response.data, cycleId: response.data.cycleId });
      }
      resetForm();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "حدث خطأ أثناء إضافة الدورة";
      toast.error(errorMessage);
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
          <div className="col-md-6 mb-2">
            <label className="form-label">اسم الدورة</label>
            <input
              type="text"
              className="form-control"
              value={cycleName}
              onChange={(e) => setCycleName(e.target.value)}
              style={{borderRadius:"10px",
                borderColor:"#1F4E3D",
              }}
            />
          </div>
           {/* Land */}
           <div className="col-md-6 ">
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
        <div className="row ">
            {/* Product Type */}
           <div className="col-12 " >
           <label className="form-label">المحصول</label>
                        <div className="d-flex flex-wrap align-items-center gap-2">
                            <input
                                type="text"
                                className="form-control  mb-md-0"
                                style={{ width: "450px", borderRadius: "10px", borderColor: "#1F4E3D" }}
                                value={selectedProductType}
                                readOnly
                            />
                            <select
                                className="form-select mb-2 mb-md-0"
                                style={{ width: "250px", borderRadius: "10px", borderColor: "#1F4E3D" }}
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
                                style={{ width: "250px", borderRadius: "10px", borderColor: "#1F4E3D" }}
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
                                style={{ width: "250px", borderRadius: "10px", borderColor: "#1F4E3D" }}
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
        <div className="row ">
    {/* Return on Investment */}
    <div className="col-12 col-md-6"> {/* Modified column class */}
        <label className="form-label">متوقع انتاجيه المحصول بالكيلو</label>
        <div className="d-flex flex-wrap align-items-center gap-2"> {/* Added flex-wrap */}
            <input
                type="number"
                min={0}
                className="form-control mb-2 mb-md-0" /* Added mb-md-0 for medium and larger screens */
                style={{ width: "400px",borderRadius:"10px",borderColor:"#1F4E3D"}}
                 value={expectedProduction}
                onChange={(e) => setexpectedProduction(e.target.value)}
            />
            {/* <select
                className="form-select mb-2 mb-md-0"  
                style={{ width: "100px",borderRadius:"10px",borderColor:"#1F4E3D" }}
                value={roiUnit}
                onChange={(e) => setRoiUnit(e.target.value)}
            >
                <option value="">اختر</option>
                <option value="كيلو">كيلو</option>
                <option value="طن">طن</option>
            </select> */}
        </div>
    </div>
</div>
       
        <div className="row">
          {/* Start Date */}
          <div className="col-md-6 ">
            <label className="form-label">تاريخ البداية:</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
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
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
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