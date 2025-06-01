// BuyRequest.js
import React, { useState } from "react";
// import axios from "axios"; // Using api instance
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../../API/axiosInstance"; // Assuming this path is correct

const BuyRequest = ({
  setIsClicked,
  setvisibleBuyRequestModal, // To close the modal on success/error
  harvestId, // Passed from the parent component (Seedetailsmerch)
  onSuccessRequest, // Callback to refresh parent data
}) => {
  const [requestedAmount, setRequestedAmount] = useState(""); // Corresponds to "requestedAmount" in API
  const [requestedPrice, setRequestedPrice] = useState(""); // Corresponds to "requestedPrice" in API
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
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
      harvestId: Number(harvestId), // Ensure it's a number
      requestedAmount: Number(requestedAmount),
      requestedPrice: Number(requestedPrice),
    };

    try {
      setLoading(true);
      setError(null);
      // Endpoint from your curl example
      const response = await api.post("PurchaseRequest", requestData);

      toast.success("تم إرسال طلب الشراء بنجاح!", {
        position: "top-right",
        rtl: true,
      });
      setIsClicked(true); // Update parent state to indicate a request is pending
      if (onSuccessRequest) {
        onSuccessRequest(); // Call the callback to refresh parent data
      }
      setvisibleBuyRequestModal(false); // Close the modal on success
    } catch (err) {
      let errorMessage = "حدث خطأ أثناء إرسال طلب الشراء.";
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      toast.error(errorMessage, {
        position: toast.POSITION.TOP_CENTER, // Or TOP_RIGHT
        rtl: true,
      });
      // Optionally, don't close modal on error so user can see the error
      // setvisibleBuyRequestModal(false);
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
            justifyContent: "space-between", // Adjusted for better label alignment
            alignItems: "center",
            gap: "10px", // Reduced gap
            padding: "0 10px", // Added some padding
          }}
        >
          <label className="block mb-1" style={{ fontSize: "1.5rem", flexShrink: 0 }}> {/* Adjusted font size */}
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
              textAlign: "right", // Align text to right
            }}
          />
        </div>
        <div
          className="mb-4 text-right"
          style={{
            display: "flex",
            justifyContent: "space-between", // Adjusted for better label alignment
            alignItems: "center",
            gap: "10px", // Reduced gap
            padding: "0 10px", // Added some padding
          }}
        >
          <label className="block mb-1" style={{ fontSize: "1.5rem", flexShrink: 0 }}> {/* Adjusted font size */}
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
              textAlign: "right", // Align text to right
            }}
          />
        </div>
        {/* "Benefit Type" section is removed as it's not in the PurchaseRequest API */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // marginRight: "50px", // Removed, let centering handle it
          }}
        >
          <button
            className="w-full bg-black text-white rounded-lg"
            style={{
              borderRadius: "15px",
              padding: "10px 0", // Adjusted padding for full width button
              marginTop: "20px",
              width: "80%", // Adjusted width
              fontSize: "1.2rem",
              backgroundColor: "#6C4C94", // Matching title color
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
      {/* ToastContainer should ideally be at the root of your app,
          but if it's specific to this modal, it can stay.
          However, messages might appear behind the modal if not configured correctly.
          For global toasts, one ToastContainer in App.js is preferred.
      */}
      {/* <ToastContainer /> */}
    </div>
  );
};

export default BuyRequest;