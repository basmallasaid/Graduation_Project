import React, { useState } from "react";
import styles from "../../Styles/style.module.css"; 
export default function ViewCrops() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <>
      <div className="crops" style={{ backgroundColor: "#fff", padding: "50px" }}>
        {/* Flex container for Plus Icon, Title, and Search */}
        <div
          className="d-flex align-items-center justify-content-between"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Plus Icon */}
          <button
            className={styles.plus}
            style={{
          
            }}
          >
            <i className="fa-solid fa-plus" style={{ fontSize: "40px" }}></i>
          </button>
          <div className={styles.hide} >اضافه محصول</div>

          {/* Center Content (h3 and Search Bar) */}
          <div
            className="d-flex align-items-center justify-content-center flex-grow-1"
            style={{
              textAlign: "center",
            }}
          >
            {!showSearch ? (
              <h3 className={styles.croptitle} >
                جميع المحاصيل التي اضافها المزارع
              </h3>
            ) : (
              <form
                className={`d-flex align-items-center ${styles.cropinput}`}
                role="search"
                
              >
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="ابحث..."
                  aria-label="Search"
                  style={{
                    marginRight: "10px",
                    border: "2px solid #000",
                  }}
                />
              </form>
            )}
            <button
              className="btn btn-outline-success"
              onClick={() => setShowSearch(!showSearch)}
              style={{
                background: "none",
                border: "none",
                padding: "0",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                style={{
                  width: "30px",
                  height: "24px",
                  fill: "black",
                  marginRight: "30px",
                }}
              >
                <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6 .1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="container my-5">
      <div className="row justify-content-center">
          <div className="col-lg-2 col-md-4 col-6 mb-4" >
            <div className="card text-center" style={{ width: "100%",padding:'20px' }}>
              <div className="card-body">
                <h5 className="card-title">بطيخ </h5>
                <p className={`card-text ${styles.cropdesc}`} >15جنيه /الكيلو</p>
                <p className="card-text">الكميه: <span  className={styles.propspan}>30</span></p>
                <a href="#" className={`btn ${styles.cropempty}`} >نفذت الكميه</a>
              </div>
            </div>
          </div>
          <div className="col-lg-2 col-md-4 col-6 mb-4" >
            <div className="card text-center" style={{ width: "100%",padding:'20px' }}>
              <div className="card-body">
                <h5 className="card-title">اناناس</h5>
                <p className={`card-text ${styles.cropdesc}`} >15جنيه /الكيلو</p>
                <p className="card-text">الكميه: <span  className={styles.propspan}>30</span></p>
                <a href="#" className={`btn ${styles.croppending}`}>تحت الطلب</a>
              </div>
            </div>
          </div>
          <div className="col-lg-2 col-md-4 col-6 mb-4" >
            <div className="card text-center" style={{ width: "100%",padding:'20px' }}>
              <div className="card-body">
                <h5 className="card-title">برتقال</h5>
                <p className={`card-text ${styles.cropdesc}`} >15جنيه /الكيلو</p>
                <p className="card-text">الكميه: <span className={styles.propspan}>30</span></p>
                <a href="#" className={`btn ${styles.cropava}`}>متاح</a>
              </div>
            </div>
          </div>
      </div>
    </div>
      </div>
    </>
  );
}
