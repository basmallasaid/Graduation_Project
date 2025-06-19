import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../../../API/axiosInstance";

const InvestmentRequest = ({ setIsClicked, cycleId }) => {
  const [amount, setAmount] = useState("");
  const [benefitType, setBenefitType] = useState("مالي");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!amount) {
      toast.error("يرجى إدخال مبلغ الاستثمار", {
        position: "top-right",
        rtl: true,
      });
      return;
    }

 const requestData = {
  cycleId: Number(cycleId), // ensure it's a number
  requestedProfitType: benefitType,
  requestedAmount: parseFloat(amount), // ensure it's a float
};


    try {
      setLoading(true);
      setError(null);
      const response = await api.post("InvestmentRequest", requestData);
      toast.success("تم إرسال الطلب بنجاح!", {
        position: "top-right",
        rtl: true,
      });
      setIsClicked(true);
    } catch (err) {
     toast.error(" تاكد من الحد الادني والاقصي للطلب ونوع العائد", {
  position: "top-center",
  rtl: true,
});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center ">
      <div className="p-6 rounded-2xl w-96 relative">
        <h2
          className="mb-4 text-right"
          style={{ fontSize: "2rem", color: "#6C4C94", padding: "0 20px" }}
        >
          طلب الاستثمار
        </h2>
        <div
          className="mb-4 text-right"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "40px",
          }}
        >
          <label className="block mb-1" style={{ fontSize: "2rem" }}>
            مبلغ الاستثمار
          </label>
          <input
            type="number"
            min={0}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2"
            style={{
              borderRadius: "10px",
              border: "none",
              boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            }}
          />
        </div>
        <div
          className="mb-4 text-right"
          style={{ display: "flex", justifyContent: "center", gap: "10px" }}
        >
          <label className="block" style={{ fontSize: "2rem" }}>
            نوع العائد
          </label>
          <div
            className="flex gap-2"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <button
              className={`rounded-lg ${
                benefitType === "كاش" ? "bg-black text-white" : ""
              }`}
              onClick={() => setBenefitType("كاش")}
              style={{
                padding: "5px 50px",
                color: "#6C4C94",
                background: benefitType === "كاش" ? "#000" : "#fff",
                borderRadius: "10px",
                fontSize: "1.5rem",
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
              }}
            >
              كاش
            </button>
            <button
              className={`rounded-lg ${
                benefitType === "محصول" ? "bg-black text-white" : ""
              }`}
              onClick={() => setBenefitType("محصول")}
              style={{
                padding: "5px 50px",
                color: "#6C4C94",
                background: benefitType === "محصول" ? "#000" : "#fff",
                borderRadius: "10px",
                fontSize: "1.5rem",
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
              }}
            >
              محصول
            </button>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginRight: "50px",
          }}
        >
          <button
            className="w-full bg-black text-white rounded-lg"
            style={{
              borderRadius: "15px",
              padding: "10px 100px",
              marginTop: "20px",
              width: "350px",
              fontSize: "1.2rem",
            }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "جاري الإرسال..." : "إرسال الطلب"}
          </button>
        </div>
        {error && (
          <p style={{ color: "red", textAlign: "center", marginTop: "10px" }}>
            {error}
          </p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default InvestmentRequest;
