import styles from "../../Styles/style.module.css"; 
import React, { useState } from 'react';
export default function Croprequests({ purchaseRequests }) {
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleRequestSelect = (request) => {
    setSelectedRequest(request); // Update state with the selected request
  };

    return(
        <>
        <div  style={{backgroundColor:"#fff"}}>
        <div className={styles.request}>
          <h1 style={{color:"black"}}>عرض الطلبات</h1>
          <p className={styles.reqnum} >{purchaseRequests.length}</p>
          <div>
<div class="btn-group" style={{marginTop:"7px",marginRight:"80px"}}>
  <button type="button" class="btn  dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" style={{backgroundColor:"#28a745",color:"white"}}>
    عرض الطلبات
  </button>
  <ul class="dropdown-menu" style={{cursor:"pointer"}}>
  {purchaseRequests.map((request) => (
                <li key={request.purchaseRequestId}>
                  <a className="dropdown-item" onClick={() => handleRequestSelect(request)}>
                    {request.merchantName}
                  </a>
                </li>
              ))}
   
   
  </ul>
</div>
          </div>
        </div>
        {selectedRequest && (
          <>
<div style={{display:"flex"}}>
    <label htmlFor="name" className={styles.labelreq}>اسم التاجر:</label>
    <p className={styles.preq}>{selectedRequest.merchantName}</p>
</div>
<div style={{display:"flex"}}>
    <label htmlFor="name" className={styles.labelreq}> السعر المطلوب:</label>
    <p className={styles.preq}>{selectedRequest.requestedPrice}</p>
</div>
<div style={{display:"flex"}}>
    <label htmlFor="name" className={styles.labelreq}> الكميه المطلوبه:</label>
    <p className={styles.preq}>    {selectedRequest.requestedAmount} <span>كيلو</span></p>
</div>
<div style={{display:"flex", justifyContent:"center",gap:"20px"}}>
    <button className={styles.reqbtn}>تأكيد</button>
    <button className={styles.reqbtn}>رفض</button>
</div>
</>
)}
</div>

        </>
    );
}


