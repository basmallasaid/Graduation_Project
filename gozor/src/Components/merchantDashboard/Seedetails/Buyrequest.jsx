// BuyRequest.js
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../../API/axiosInstance";

const BuyRequest = ({
  setIsClicked,
  setvisibleBuyRequestModal,
  harvestId,
  onSuccessRequest,
}) => {
  const [requestedAmount, setRequestedAmount] = useState("");
  const [requestedPrice, setRequestedPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    // Front-end validation for empty fields
    if (!requestedAmount) {
      toast.error("يرجى إدخال الكمية المطلوبة", {
        position: "top-right",
        rtl: true,
      });
      return;
    }
    if (!requestedPrice) {
      toast.error("يرجى إدخال السعر المطلوب", {
        position: "top-right",
        rtl: true,
      });
      return;
    }
    if (!harvestId) {
      toast.error("معرف الحصاد غير متوفر. لا يمكن إرسال الطلب.", {
        position: "top-right",
        rtl: true,
      });
      return;
    }

    const requestData = {
      harvestId: Number(harvestId),
      requestedAmount: Number(requestedAmount),
      requestedPrice: Number(requestedPrice),
    };

    try {
      setLoading(true);
      setError(null);
      const response = await api.post("PurchaseRequest", requestData);

      toast.success("تم إرسال طلب الشراء بنجاح!", {
        position: "top-right",
        rtl: true,
      });
      setIsClicked(true);
      if (onSuccessRequest) {
        onSuccessRequest();
      }
      setvisibleBuyRequestModal(false);
    } catch (err) {
      let errorMessage = "حدث خطأ أثناء إرسال طلب الشراء.";

      if (err.response) {
        // If the server responds with 400, it means the input was invalid (e.g., quantity too high)
        if (err.response.status === 400) {
          // --- MODIFICATION 1: Set the specific user-friendly message ---
          errorMessage = "أدخل الكمية أو المبلغ بشكل صحيح.";
        } else {
          // For other server errors (like 500), show a more general server error message
          errorMessage =
            err.response.data?.message || `حدث خطأ في الخادم: ${err.response.status}`;
        }
      } else if (err.message) {
        // For network errors etc.
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage, {
        // --- MODIFICATION 2: Fix the position syntax ---
        position: "top-center", // Use the string 'top-center' instead of toast.POSITION.TOP_CENTER
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
          طلب شراء محصول
        </h2>
        <div
          className="mb-4 text-right"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
            padding: "0 10px",
          }}
        >
          <label className="block mb-1" style={{ fontSize: "1.5rem", flexShrink: 0 }}>
            الكمية المطلوبة
          </label>
          <input
            type="number"
            min={0}
            value={requestedAmount}
            onChange={(e) => setRequestedAmount(e.target.value)}
            placeholder="مثال: 100"
            className="w-full p-2"
            style={{
              borderRadius: "10px",
              border: "none",
              boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
              textAlign: "right",
            }}
          />
        </div>
        <div
          className="mb-4 text-right"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
            padding: "0 10px",
          }}
        >
          <label className="block mb-1" style={{ fontSize: "1.5rem", flexShrink: 0 }}>
            السعر المقترح (الإجمالي)
          </label>
          <input
            type="number"
            min={0}
            value={requestedPrice}
            onChange={(e) => setRequestedPrice(e.target.value)}
            placeholder="مثال: 500"
            className="w-full p-2"
            style={{
              borderRadius: "10px",
              border: "none",
              boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
              textAlign: "right",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button
            className="w-full bg-black text-white rounded-lg"
            style={{
              borderRadius: "15px",
              padding: "10px 0",
              marginTop: "20px",
              width: "80%",
              fontSize: "1.2rem",
              backgroundColor: "#6C4C94",
            }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "جاري الإرسال..." : "إرسال طلب الشراء"}
          </button>
        </div>
        {error && (
          <p style={{ color: "red", textAlign: "center", marginTop: "10px" }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default BuyRequest;