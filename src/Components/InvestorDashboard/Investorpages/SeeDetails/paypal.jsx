import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../../../API/axiosInstance"; // Your pre-configured Axios instance

export default function Paypal({ cycleId }) {
  const [amount, setAmount] = useState("");
  const [sellerEmail, setSellerEmail] = useState(""); // Renamed from 'email' to 'sellerEmail' for clarity
  const [loading, setLoading] = useState(false);

  const userData = JSON.parse(localStorage.getItem("user_data"));
  // console.log("User Data (from localStorage):", userData); // For debugging
  const investorUserId = userData?.userId; // This is the string GUID for the user

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!investorUserId) {
      toast.warn("لم يتم التعرف على المستخدم. يرجى تسجيل الدخول مرة أخرى.", { position: "top-right" });
      setLoading(false); // Ensure loading is false if we return early
      return;
    }

    if (!amount || !sellerEmail) {
      toast.warn("يرجى ملء جميع الحقول", { position: "top-right" });
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
        toast.warn("يرجى إدخال مبلغ دفع صالح.", { position: "top-right" });
        return;
    }

    const numericCycleId = parseInt(cycleId, 10);
    if (isNaN(numericCycleId)) {
        toast.error("معرف الدورة غير صالح.", { position: "top-right" });
        return;
    }

    setLoading(true);

    const paymentData = {
      userId: investorUserId,
      amount: numericAmount,
      sellerEmail: sellerEmail, // The farmer's PayPal email
      cycleId: numericCycleId,
    };

    try {
    
      const response = await api.post("/PayPal/create-payment", paymentData);

      
      toast.success("تم إرسال طلب الدفع بنجاح.", {
        position: "top-right",
        autoClose: 2000,
      });

      setAmount("");
      setSellerEmail("");
      // Potentially close the modal or navigate away after successful payment submission
      // if (onPaymentSuccess) onPaymentSuccess();

    } catch (error) {
      console.error("Payment error:", error.response || error.message);
      const errorMessage = error.response?.data?.message || error.response?.data || "حدث خطأ أثناء الدفع، حاول مرة أخرى";
      toast.error(errorMessage, {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4" style={{ marginBottom: "70px", width: "fit-content" }}>
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
                min="0.01" // Minimum amount for payment
                step="0.01" // Allow decimals
                className="form-control"
                style={{ backgroundColor: "rgb(231, 231, 231)", width: "65%", borderRadius: "10px", border: "none", padding: "10px" }}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g., 50.00"
              />
            </div>
            <div className="mb-3 d-flex align-items-center">
              <label className="form-label" style={{ width: "35%", textAlign: "right", marginRight: "10px" }}>
                ايميل PayPal للمزارع
              </label>
              <input
                type="email"
                className="form-control"
                style={{ backgroundColor: "rgb(231, 231, 231)", width: "65%", borderRadius: "10px", border: "none", padding: "10px" }}
                value={sellerEmail}
                onChange={(e) => setSellerEmail(e.target.value)}
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