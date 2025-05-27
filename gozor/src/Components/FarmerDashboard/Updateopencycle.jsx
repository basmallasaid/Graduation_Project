import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import api from "../../API/axiosInstance";

export default function Updateopencycle({ selectedCardData, onUpdateSuccess }) {
  const [lands, setLands] = useState([]);
  const [vegetables, setVegetables] = useState([]);
  const [fruits, setFruits] = useState([]);
  const [seeds, setSeeds] = useState([]);

  // Form state variables
  const [cycleName, setCycleName] = useState("");
  const [parcelName, setparcelName] = useState("");
  const [parcelId, setParcelId] = useState(null);
  const [selectedProductType, setSelectedProductType] = useState("");
  const [selectedCropId, setSelectedCropId] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [expectedYield, setExpectedYield] = useState("");
  const [isOpenForInvestmentState, setIsOpenForInvestment] = useState(true);
  const [data, setData] = useState([]);
   const userData = JSON.parse(localStorage.getItem("user_data"));

    const farmerId = userData?.LoggedId; 
  const [updateOpenInvestmentCycleDTO, setUpdateOpenInvestmentCycleDTO] = useState({
    expectedFinancialGoal: "",
    minimumInvestment: "",
    maximumInvestment: "",
    maxInvestorsAllowed: "",
    availableProfitTypes: " ",
  });

  // Initialize form data when selectedCardData changes
  useEffect(() => {
    if (selectedCardData) {
      console.log("Initializing form with data:", selectedCardData);
      setCycleName(selectedCardData.cycleName || "");
   setparcelName(selectedCardData.parcelName || "");
      setParcelId(selectedCardData.parcelId || null);      setSelectedProductType(selectedCardData.cropName || ""); //Use cropName for the input field
      setSelectedCropId(selectedCardData.cropId || null); // Ensure cropId is always a number

      //  // Update parcelName based on parcelId from selectedCardData
      //  if (selectedCardData.parcelId && lands.length > 0) {
      //   const land = lands.find(land => land.parcelId === selectedCardData.parcelId);
      //   setparcelName(land ? land.parcelName : ""); 
      // } else {
      //   setparcelName("");
      // }
      

      setStartDate(
        selectedCardData.startDate
          ? new Date(selectedCardData.startDate).toISOString().split("T")[0]
          : ""
      );
      setEndDate(
        selectedCardData.endDate
          ? new Date(selectedCardData.endDate).toISOString().split("T")[0]
          : ""
      );
      setExpectedYield(selectedCardData.expectedYield?.toString() || "");

       // Handle updateOpenInvestmentCycleDTO. If it's null, initialize with empty values.
       setUpdateOpenInvestmentCycleDTO(
        selectedCardData.openInvestmentCycleDTO
          ? {
              expectedFinancialGoal: selectedCardData.openInvestmentCycleDTO.expectedFinancialGoal?.toString() || "",
              minimumInvestment: selectedCardData.openInvestmentCycleDTO.minimumInvestment?.toString() || "",
              maximumInvestment: selectedCardData.openInvestmentCycleDTO.maximumInvestment?.toString() || "",
              maxInvestorsAllowed: selectedCardData.openInvestmentCycleDTO.maxInvestorsAllowed?.toString() || "",
              availableProfitTypes: selectedCardData.openInvestmentCycleDTO.availableProfitTypes || "",
              openInvestmentCycleId: selectedCardData.openInvestmentCycleDTO.openInvestmentCycleId || 0, // Preserve the ID
            }
          : {
              expectedFinancialGoal: "",
              minimumInvestment: "",
              maximumInvestment: "",
              maxInvestorsAllowed: "",
              availableProfitTypes: "",
              openInvestmentCycleId: 0, // Initialize the ID
            }
      );
      setIsOpenForInvestment(selectedCardData.isOpenForInvestment === undefined ? true : selectedCardData.isOpenForInvestment);
    }
  }, [selectedCardData, lands]); // Depend on lands to update parcelName correctly
   useEffect(() => {
      if (selectedCardData?.parcelId && lands.length > 0) {
        const land = lands.find((land) => land.parcelId === selectedCardData.parcelId);
        setparcelName(land ? land.parcelName : "");
      }
    }, [selectedCardData, lands]);

  // useEffect(() => {
  //   if (selectedCropId) {
  //     let foundCrop =
  //       fruits.find(fruit => fruit.id === selectedCropId || fruit.cropId === selectedCropId) ||
  //       vegetables.find(vegetable => vegetable.id === selectedCropId || vegetable.cropId === selectedCropId) ||
  //       seeds.find(seed => seed.id === selectedCropId || seed.cropId === selectedCropId);

  //     if (foundCrop && foundCrop.cropName !== selectedProductType) {
  //       setSelectedProductType(foundCrop.cropName || foundCrop.name);
  //     }
  //   }
  // }, [selectedCropId, fruits, vegetables, seeds]);

useEffect(() => {
  const fetchData = async () => {
    try {
  const [landsResponse, vegetablesRes, fruitsRes, seedsRes] = await Promise.all([
          api.get(`LandParcel/GetAllLandsOfFarmerId?farmerId=${farmerId}`),
          api.get("Crop/CropsOfType?CropTypeId=3"),
          api.get("Crop/CropsOfType?CropTypeId=2"),
          api.get("Crop/CropsOfType?CropTypeId=1"),
        ]);

setLands(landsResponse.data);
setVegetables(vegetablesRes.data);
setFruits(fruitsRes.data);
setSeeds(seedsRes.data);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  if (farmerId) {
    fetchData();
  }
}, [farmerId]);

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
      toast.error("يرجى اختيار المحصول");
      return false;
    }

      // Validate minimumInvestment and maximumInvestment only if isOpenForInvestment is true
      if (isOpenForInvestmentState) {
        if (!updateOpenInvestmentCycleDTO.minimumInvestment || !updateOpenInvestmentCycleDTO.maximumInvestment) {
          toast.error("يرجى إدخال الحد الأدنى والأقصى للاستثمار");
          return false;
        }

        if (
          Number(updateOpenInvestmentCycleDTO.minimumInvestment) >
          Number(updateOpenInvestmentCycleDTO.maximumInvestment)
        ) {
          toast.error("الحد الأدنى للاستثمار لا يمكن أن يكون أكبر من الحد الأقصى");
          return false;
        }

        if (!updateOpenInvestmentCycleDTO.availableProfitTypes) {
          toast.error("يرجى اختيار نوع العائد");
          return false;
        }
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


useEffect(() => {
  console.log("Fruits Loaded:", fruits);
  console.log("Vegetables Loaded:", vegetables);
  console.log("Seeds Loaded:", seeds);
}, [fruits, vegetables, seeds]);

  const handleSelectChange = (selectedCrop) => {
    setSelectedProductType(selectedCrop.cropName || selectedCrop.name); //Handles both objects
    setSelectedCropId(selectedCrop.id || selectedCrop.cropId);
  };

  const handleLandChange = (e) => {
    const selectedLand = JSON.parse(e.target.value);
    setParcelId(selectedLand.parcelId); // Set parcelId first
    setparcelName(selectedLand.parcelName); // Ensure parcelName updates
  };

  // Ensure parcelName updates immediately when parcelId changes
  useEffect(() => {
    if (parcelId) {
      const land = lands.find(land => land.parcelId === parcelId);
      if (land) {
        setparcelName(land.parcelName);
      }
    }
  }, [parcelId, lands]);


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm() || !selectedCardData?.cycleId) {
      if (!selectedCardData?.cycleId) {
        Swal.fire("خطأ", "تعذر تحديد الدورة الحالية.", "error");
      }
      return;
    }
  
    const data = {
      cycleId: selectedCardData.cycleId,
      cycleName,
      parcelId,
      cropId: selectedCropId,
      startDate,
      endDate,
      expectedYield: Number(expectedYield),
      isOpenForInvestment: selectedCardData.isOpenForInvestment,
      updateOpenInvestmentCycleDTO: {
            openInvestmentCycleId: updateOpenInvestmentCycleDTO.openInvestmentCycleId, // Use the current value
            expectedFinancialGoal: Number(updateOpenInvestmentCycleDTO.expectedFinancialGoal),
            minimumInvestment: Number(updateOpenInvestmentCycleDTO.minimumInvestment),
            maximumInvestment: Number(updateOpenInvestmentCycleDTO.maximumInvestment),
            maxInvestorsAllowed: Number(updateOpenInvestmentCycleDTO.maxInvestorsAllowed),
            availableProfitTypes: updateOpenInvestmentCycleDTO.availableProfitTypes
      }
    };
  
    console.log("Data being sent:", data);
  
    try {
      const response = await api.put(
       ` Cycle/EditCycle`,
        data
      );
  
      Swal.fire("تم الحفظ!", "تم تحديث الدورة بنجاح.", "success");
  
      if (onUpdateSuccess) {
        onUpdateSuccess(response.data);
      }
    } catch (error) {
      console.error(error);
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
        style={{ fontSize: "23px" }}
      >
        <div className="row ">
          {/* Cycle Name */}
          <div className="col-md-6">
            <label className="form-label">اسم الدورة</label>
            <input
              type="text"
              className="form-control"
              value={cycleName}
              onChange={(e) => setCycleName(e.target.value)}
              style={{
                borderRadius: "10px",
                borderColor: "#1F4E3D"
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
                style={{
                  width: "450px", borderRadius: "10px",
                  borderColor: "#1F4E3D"
                }}
                value={selectedProductType}
                readOnly

              />
              <select
                className="form-select mb-2 mb-md-0"
                style={{
                  width: "250px", borderRadius: "10px",
                  borderColor: "#1F4E3D"
                }}
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
                style={{
                  width: "250px", borderRadius: "10px",
                  borderColor: "#1F4E3D"
                }}
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
                style={{
                  width: "250px", borderRadius: "10px",
                  borderColor: "#1F4E3D"
                }}
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
            <div className="col-md-6">
                <label className="form-label">حدد عائد الدورة</label>
                <select
                    className="form-select"
                    value={updateOpenInvestmentCycleDTO.availableProfitTypes || ""}
                    onChange={(e) =>
                        setUpdateOpenInvestmentCycleDTO({
                            ...updateOpenInvestmentCycleDTO,
                            availableProfitTypes: e.target.value,
                        })
                    }
                    style={{
                        borderRadius: "10px",
                        borderColor: "#1F4E3D"
                    }}
                    disabled={!isOpenForInvestmentState}  // Disable when not open for investment
                >
                    <option value="">اختر...</option>
                    <option value="كاش">مالي</option>
                    <option value="محصول">محصول</option>
                    <option value="كاش او محصول">الاثنين معا</option>
                </select>
            </div>
        </div>
        <div className="row ">
          {/* Minimum Investment */}
          <div className="col-md-6">
            <label className="form-label">الحد الأدنى للاستثمار</label>
            <input
              type="number"
              className="form-control"
              value={updateOpenInvestmentCycleDTO.minimumInvestment}
              onChange={(e) => setUpdateOpenInvestmentCycleDTO({ ...updateOpenInvestmentCycleDTO, minimumInvestment: e.target.value })}
              min={0}
              style={{
                borderRadius: "10px",
                borderColor: "#1F4E3D",
              }}
                disabled={!isOpenForInvestmentState} // Disable when not open for investment
            />
          </div>

          {/* Maximum Investment */}
          <div className="col-md-6 ">
            <label className="form-label">الحد الأقصى للاستثمار</label>
            <input
              type="number"
              className="form-control"
              value={updateOpenInvestmentCycleDTO.maximumInvestment}
              onChange={(e) => setUpdateOpenInvestmentCycleDTO({ ...updateOpenInvestmentCycleDTO, maximumInvestment: e.target.value })}
              min={0}
              style={{
                borderRadius: "10px",
                borderColor: "#1F4E3D",
              }}
                disabled={!isOpenForInvestmentState} // Disable when not open for investment
            />
          </div>
        </div>
        {/* expectedFinancialGoal */}
        <div className="row">
          <div className="col-md-6">
            <label className="form-label">الهدف الاستثماري</label>
            <input
              type="number"
              className="form-control"
              value={updateOpenInvestmentCycleDTO.expectedFinancialGoal}
              onChange={(e) => setUpdateOpenInvestmentCycleDTO({ ...updateOpenInvestmentCycleDTO, expectedFinancialGoal: e.target.value })}
              style={{
                borderRadius: "10px",
                borderColor: "#1F4E3D",
              }}
                disabled={!isOpenForInvestmentState} // Disable when not open for investment
            />

          </div>

          {/* Allowed Investors */}
          <div className="col-md-6">
            <label className="form-label">عدد المستثمرين المسموحين</label>
            <input
              type="number"
              className="form-control"
              value={updateOpenInvestmentCycleDTO.maxInvestorsAllowed}
              onChange={(e) => setUpdateOpenInvestmentCycleDTO({ ...updateOpenInvestmentCycleDTO, maxInvestorsAllowed: e.target.value })}
              min={0}
              style={{
                borderRadius: "10px",
                borderColor: "#1F4E3D"
              }}
                disabled={!isOpenForInvestmentState} // Disable when not open for investment
            />
          </div>

        </div>

        <div className="row ">
          {/* Start Date */}
          <div className="col-md-6 ">
            <label className="form-label">تاريخ البداية</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{
                borderRadius: "10px",
                borderColor: "#1F4E3D"
              }}
            />
          </div>
          {/* End Date */}
          <div className="col-md-6 mb-2">
            <label className="form-label">تاريخ النهاية</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{
                borderRadius: "10px",
                borderColor: "#1F4E3D"
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