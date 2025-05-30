import styles from "../../Styles/style.module.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../../API/axiosInstance";
import { toast } from "react-toastify";
import Swal from 'sweetalert2';

export default function Croprequests() {
  const [cyclesData, setCyclesData] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const userData = JSON.parse(localStorage.getItem("user_data"));
  const farmerId = userData?.LoggedId;

  useEffect(() => {
    const fetchCyclesData = async () => {
      try {
        const response = await api.get(`Cycle/GetAllCycleasOfFarmerId?farmerId=${farmerId}`);
        setCyclesData(Array.isArray(response.data) ? response.data : [response.data]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchCyclesData();
  }, []);

  const handleRequestSelect = (cycle, request) => {
    setSelectedRequest({ ...request, cycleName: cycle.cycleName });
  };
const handleApprove = async () => {
  if (!selectedRequest) return;
  try {
    await api.get(`InvestmentRequest/Approved/${selectedRequest.investmentRequestId}`);

    Swal.fire({
      icon: 'success',
      title: 'تم قبول الطلب بنجاح',
      confirmButtonText: 'حسناً'
    });

    setCyclesData(prevCyclesData =>
      prevCyclesData.map(cycle => {
        if (cycle.cycleName !== selectedRequest.cycleName) return cycle;

        return {
          ...cycle,
          requestsForInvestments: Array.isArray(cycle.requestsForInvestments)
            ? cycle.requestsForInvestments.filter(
                req => req.investmentRequestId !== selectedRequest.investmentRequestId
              )
            : []
        };
      })
    );

    setTimeout(() => setSelectedRequest(null), 1500);
  } catch (error) {
    console.error("Approval failed:", error);
    Swal.fire({
      icon: 'error',
      title: 'فشل في قبول الطلب',
      confirmButtonText: 'حسناً'
    });
  }
};


const handleDecline = async () => {
  if (!selectedRequest) return;
  try {
    await api.get(`InvestmentRequest/Declined/${selectedRequest.investmentRequestId}`);

    Swal.fire({
      icon: 'success',
      title: 'تم رفض الطلب بنجاح',
      confirmButtonText: 'حسناً'
    });

    setCyclesData(prevCyclesData =>
      prevCyclesData.map(cycle => {
        if (cycle.cycleName !== selectedRequest.cycleName) return cycle;

        return {
          ...cycle,
          requestsForInvestments: Array.isArray(cycle.requestsForInvestments)
            ? cycle.requestsForInvestments.filter(
                req => req.investmentRequestId !== selectedRequest.investmentRequestId
              )
            : []
        };
      })
    );

    setTimeout(() => setSelectedRequest(null), 1500);
  } catch (error) {
    console.error("Decline failed:", error);
    Swal.fire({
      icon: 'error',
      title: 'فشل في رفض الطلب',
      confirmButtonText: 'حسناً'
    });
  }
};



  if (!cyclesData || cyclesData.length === 0) {
    return <div>لا توجد طلبات حالياً</div>;
  }

  return (
    <>
      <div style={{ backgroundColor: "#fff" }}>
        <div className={styles.request}>
          <h1 style={{ color: "black" }}>عرض الطلبات</h1>
          <div className="btn-group" style={{ marginTop: "7px" }}>
            <button
              type="button"
              className="btn dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{
                backgroundColor: "#28a745",
                color: "black",
                fontSize: "18px",
                margin: "auto",
              }}
            >
              عرض الطلبات (
              {cyclesData.reduce(
                (total, cycle) =>
                  total + (cycle.requestsForInvestments?.length || 0),
                0
              )}
              )
            </button>
            <ul className="dropdown-menu" style={{ cursor: "pointer", color: "black" }}>
              {cyclesData.map((cycle) =>
                cycle.requestsForInvestments?.map((request, index) => (
                  <li key={`${cycle.cycleId}-${index}`}>
                    <a
                      className="dropdown-item"
                      onClick={() => handleRequestSelect(cycle, request)}
                      style={{ color: "black" }}
                    >
                      {request.fullName}
                    </a>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>

      {selectedRequest && (
        <div style={{ backgroundColor: "#fff", marginTop: "5px", width: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", flexWrap: "wrap" }}>
            <div style={{ display: "flex" }}>
              <label className={styles.labelreq}>اسم المستثمر:</label>
              <p className={styles.preq}>{selectedRequest.fullName}</p>
            </div>
            <div style={{ display: "flex" }}>
              <label className={styles.labelreq}>مبلغ الاستثمار:</label>
              <p className={styles.preq}>{selectedRequest.investmentAmount}</p>
            </div>
            <div style={{ display: "flex" }}>
              <label className={styles.labelreq}>نوع الأرباح:</label>
              <p className={styles.preq}>{selectedRequest.typeOfProfit}</p>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
            <button className={styles.reqbtn} onClick={handleApprove}>تأكيد</button>
            <button className={styles.reqbtn} onClick={handleDecline}>رفض</button>
          </div>
        </div>
      )}
    </>
  );
}
