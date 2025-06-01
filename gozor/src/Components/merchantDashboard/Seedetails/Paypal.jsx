import React, { useState } from "react"; // Added React import
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../../API/axiosInstance"; // Ensure this path is correct relative to Paypal.js

// The component now expects 'harvestId' as a prop
export default function Paypal({ harvestId }) {
  const [amount, setAmount] = useState("");
  const [sellerEmail, setSellerEmail] = useState(""); // For farmer's PayPal email
  const [loading, setLoading] = useState(false);

  // Retrieve logged-in merchant's data from localStorage
  const userData = JSON.parse(localStorage.getItem("user_data"));
  // 'merchantUserId' is the ID of the merchant making the payment
  const merchantUserId = userData?.userId; // Make sure 'loggedId' is the correct key

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!merchantUserId) {
      toast.warn("معرف المستخدم (التاجر) غير موجود. يرجى تسجيل الدخول مرة أخرى.", { position: "top-right" });
      return;
    }

    if (!harvestId) {
        toast.warn("معرف الحصاد مفقود. لا يمكن إتمام العملية.", { position: "top-right" });
        return;
    }

    if (!amount || !sellerEmail) {
      toast.warn("يرجى ملء مبلغ الدفع وايميل PayPal للبائع (المزارع).", { position: "top-right" });
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
        toast.warn("يرجى إدخال مبلغ صحيح أكبر من الصفر للدفع.", { position: "top-right" });
        return;
    }

    // Validate email format (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sellerEmail)) {
        toast.warn("يرجى إدخال عنوان بريد إلكتروني صحيح للبائع.", { position: "top-right" });
        return;
    }

    setLoading(true);

    try {
      const payload = {
        userId: merchantUserId,         // Merchant's User ID
        amount: parsedAmount,           // Amount to pay
        sellerEmail: sellerEmail,       // Farmer's (Seller's) PayPal email
        harvestId: parseInt(harvestId, 10) // Harvest ID, ensure it's an integer
      };

      // Use the 'api' (axios) instance to make the POST request
      const response = await api.post("/PayPal/create-paymentforMerchant", payload);
      
      toast.success(response.data?.message || "تم إرسال طلب الدفع بنجاح. قد يستغرق الأمر بعض الوقت للمعالجة.", {
        position: "top-right",
        autoClose: 3000,
      });
      
      setAmount("");
      setSellerEmail(""); // Clear sellerEmail field
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "حدث خطأ أثناء عملية الدفع، حاول مرة أخرى.";
      toast.error(errorMessage, {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4" style={{ marginBottom: "70px", width: "fit-content" }}>
      {/* It's generally better to have one ToastContainer at the app's root level (e.g., App.js) */}
      <ToastContainer /> 
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ color: "#6C4C94", marginBottom: "0" }}>الدفع من خلال PayPal</h2>
      </div>
      <form
        className="p-4 d-flex justify-content-center"
        style={{ fontSize: "1.3rem", width: "100%" }}
        onSubmit={handlePayment}
      >
        <div className="row mb-3 w-100">
          <div className="col-12 col-md-12">
            <div className="mb-3 d-flex align-items-center">
              <label className="form-label" style={{ width: "35%", textAlign: "right", marginRight: "10px" }}>
                مبلغ الدفع
              </label>
              <input
                type="number"
                min="0.01" // Minimum payment amount greater than 0
                step="any"  // Allows decimal values
                className="form-control"
                style={{ backgroundColor: "rgb(231, 231, 231)", width: "65%", borderRadius: "10px", border: "none", padding: "10px" }}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="مثال: 50.00"
              />
            </div>
            <div className="mb-3 d-flex align-items-center">
              {/* Label "ايميل PayPal للمزارع" is appropriate as the farmer is the seller */}
              <label className="form-label" style={{ width: "35%", textAlign: "right", marginRight: "10px" }}>
                ايميل PayPal للمزارع
              </label>
              <input
                type="email"
                className="form-control"
                style={{ backgroundColor: "rgb(231, 231, 231)", width: "65%", borderRadius: "10px", border: "none", padding: "10px" }}
                value={sellerEmail} // Bind to sellerEmail state
                onChange={(e) => setSellerEmail(e.target.value)} // Update sellerEmail state
                placeholder="farmer@example.com"
              />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
            <button
              type="submit"
              style={{
                backgroundColor: "black",
                padding: "5px 35px",
                color: "white",
                borderRadius: "10px",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
              disabled={loading}
            >
              {loading ? "جارٍ الدفع..." : "اتمام الدفع"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}