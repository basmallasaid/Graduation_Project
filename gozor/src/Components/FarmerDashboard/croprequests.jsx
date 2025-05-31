import styles from "../../Styles/style.module.css";
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from "../../API/axiosInstance";

// Key for localStorage
const HANDLED_REQUEST_IDS_KEY = 'cropHandledRequestIds';

// Helper function to get handled IDs from localStorage
const getHandledIdsFromStorage = () => {
  const storedIds = localStorage.getItem(HANDLED_REQUEST_IDS_KEY);
  try {
    return storedIds ? JSON.parse(storedIds) : [];
  } catch (e) {
    console.error("Error parsing handled IDs from localStorage:", e);
    return []; // Return empty array on error
  }
};

// Helper function to add a handled ID to localStorage
const addHandledIdToStorage = (requestId) => {
  if (typeof requestId === 'undefined' || requestId === null) return;
  const currentIds = getHandledIdsFromStorage();
  if (!currentIds.includes(requestId)) {
    localStorage.setItem(HANDLED_REQUEST_IDS_KEY, JSON.stringify([...currentIds, requestId]));
  }
};

export default function Croprequests({ purchaseRequests, onRequestHandled }) {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [displayableRequests, setDisplayableRequests] = useState([]);

  useEffect(() => {
    const allIncomingRequests = Array.isArray(purchaseRequests) ? purchaseRequests : [];
    const handledIds = getHandledIdsFromStorage();

    const filteredRequests = allIncomingRequests.filter(
      (req) => !handledIds.includes(req.purchaseRequestId)
    );
    setDisplayableRequests(filteredRequests);

  }, [purchaseRequests]);

  const handleRequestSelect = (request) => {
    setSelectedRequest(request);
  };

  const processRequest = async (actionType) => {
    if (!selectedRequest) return;

    const { purchaseRequestId } = selectedRequest;
    const apiEndpoint = actionType === 'approve'
      ? `PurchaseRequest/Approved/${purchaseRequestId}`
      : `PurchaseRequest/Declined/${purchaseRequestId}`;
    const successTitle = actionType === 'approve'
      ? 'تم قبول الطلب بنجاح'
      : 'تم رفض الطلب بنجاح';
    const errorTitle = actionType === 'approve'
      ? 'فشل في قبول الطلب'
      : 'فشل في رفض الطلب';

    try {
      await api.get(apiEndpoint);

      Swal.fire({
        icon: 'success',
        title: successTitle,
        confirmButtonText: 'حسناً'
      });

      // Add to localStorage so it's not shown on next refresh from this client
      addHandledIdToStorage(purchaseRequestId);

      // Remove the handled request from the local displayable list for immediate UI update
      setDisplayableRequests(prevRequests =>
        prevRequests.filter((req) => req.purchaseRequestId !== purchaseRequestId)
      );

      if (typeof onRequestHandled === 'function') {
        onRequestHandled(purchaseRequestId);
      } else {
        console.warn(`Croprequests: onRequestHandled prop is not a function or was not provided. Parent component won't be notified for ${actionType}.`);
      }
      setSelectedRequest(null);
    } catch (error) {
      console.error(`${actionType === 'approve' ? 'Approval' : 'Decline'} failed:`, error);
      Swal.fire({
        icon: 'error',
        title: errorTitle,
        text: error.response?.data?.message || error.message || 'حدث خطأ ما.',
        confirmButtonText: 'حسناً'
      });
    }
  };

  const handleApprove = () => processRequest('approve');
  const handleDecline = () => processRequest('decline');

  return (
    <div style={{ backgroundColor: "#fff" }}>
      <div className={styles.request}>
        <h1 style={{ color: "black" }}>عرض الطلبات</h1>
        <p className={styles.reqnum}>{displayableRequests.length}</p>

        <div className="btn-group" style={{ marginTop: "7px", marginRight: "80px" }}>
          <button
            type="button"
            className="btn dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{ backgroundColor: "#28a745", color: "white" }}
            disabled={displayableRequests.length === 0}
          >
            {displayableRequests.length > 0 ? 'عرض الطلبات' : 'لا توجد طلبات'}
          </button>
          <ul className="dropdown-menu" style={{ cursor: "pointer" }}>
            {displayableRequests.map((request) => (
              <li key={request.purchaseRequestId}>
                <a className="dropdown-item" onClick={() => handleRequestSelect(request)}>
                  {request.merchantName}
                </a>
              </li>
            ))}
            {displayableRequests.length === 0 && (
              <li><span className="dropdown-item-text">لا توجد طلبات جديدة لعرضها</span></li>
            )}
          </ul>
        </div>
      </div>

      {selectedRequest && (
        <>
          <div style={{ display: "flex" }}>
            <label className={styles.labelreq}>اسم التاجر:</label>
            <p className={styles.preq}>{selectedRequest.merchantName}</p>
          </div>
          <div style={{ display: "flex" }}>
            <label className={styles.labelreq}>السعر المطلوب:</label>
            <p className={styles.preq}>{selectedRequest.requestedPrice}</p>
          </div>
          <div style={{ display: "flex" }}>
            <label className={styles.labelreq}>الكمية المطلوبة:</label>
            <p className={styles.preq}>{selectedRequest.requestedAmount} <span>كيلو</span></p>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
            <button className={styles.reqbtn} onClick={handleApprove}>تأكيد</button>
            <button className={styles.reqbtn} onClick={handleDecline}>رفض</button>
          </div>
        </>
      )}
      
    </div>
  );
}