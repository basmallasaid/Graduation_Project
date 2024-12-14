import styles from "../../Styles/style.module.css"; 

export default function Croprequests() {

    return(
        <>
        <div  style={{backgroundColor:"#fff"}}>
        <div className={styles.request}>
          <h1 style={{color:"black"}}>عرض الطلبات</h1>
          <p className={styles.reqnum}>3</p>
          <div>
<div class="btn-group" style={{marginTop:"7px",marginRight:"80px"}}>
  <button type="button" class="btn  dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" style={{backgroundColor:"#28a745",color:"white"}}>
    عرض الطلبات
  </button>
  <ul class="dropdown-menu">
    <li><a class="dropdown-item" href="#">Action</a></li>
   
   
  </ul>
</div>
          </div>
        </div>
<div style={{display:"flex"}}>
    <label htmlFor="name" className={styles.labelreq}>اسم التاجر:</label>
    <p className={styles.preq}>جنا احمد السيد</p>
</div>
<div style={{display:"flex"}}>
    <label htmlFor="name" className={styles.labelreq}> السعر المطلوب:</label>
    <p className={styles.preq}>1000</p>
</div>
<div style={{display:"flex"}}>
    <label htmlFor="name" className={styles.labelreq}> الكميه المطلوبه:</label>
    <p className={styles.preq}>    30 <span>كيلو</span></p>
</div>
<div style={{display:"flex", justifyContent:"center",gap:"20px"}}>
    <button className={styles.reqbtn}>تأكيد</button>
    <button className={styles.reqbtn}>رفض</button>
</div>
</div>
        </>
    );
}


