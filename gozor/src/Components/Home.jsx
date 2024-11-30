import styles from "../Styles/style.module.css";
import Footer from "./Footer";
import Register from "../Authentication/Register";
import Modal from "react-modal";
import { useState } from "react";

export default function Home() {
  const [visible, setVisible] = useState(false);

  const customStyles = {
    content: {
      maxWidth: "500px", // Set desired width
      margin: "auto", // Centers the modal horizontally
      padding: "10px", // Add padding for better spacing
      borderRadius: "10px", // Optional: round corners
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional: dim background
    },
  };

  return (
    <>
      <header className={styles.slide}>
        <div className="slider position-relative">
          <div
            id="carouselExampleControls"
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              {/* Slide 1 */}
              <div className="carousel-item active">
                <div className="position-relative">
                  <button
                    className={`btn position-absolute start-0 ${styles.frameButton}`}
                    onClick={() => setVisible(true)}
                  >
                    انشاء حساب
                  </button>
                  <Modal
                    isOpen={visible}
                    onRequestClose={() => setVisible(false)}
                    style={customStyles}
                  >
                    <button
                      onClick={() => setVisible(false)}
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        fontSize: "24px",
                        color: "#333",
                        cursor: "pointer",
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                      }}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                    <Register />
                  </Modal>
                  <img
                    src="/assets/frame1.png"
                    className="img-fluid d-block w-100"
                    alt="slideshow image"
                  />
                </div>
              </div>

              {/* Slide 2 */}
              <div className="carousel-item">
                <div className="position-relative">
                  <button
                    className={`btn position-absolute start-0 ${styles.frame_1Button}`}
                    onClick={() => setVisible(true)}
                  >
                    انشاء حساب
                  </button>
                  <Modal
                    isOpen={visible}
                    onRequestClose={() => setVisible(false)}
                    style={customStyles}
                  >
                    <button
                      onClick={() => setVisible(false)}
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        fontSize: "24px",
                        color: "#333",
                        cursor: "pointer",
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                      }}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                    <Register />
                  </Modal>
                  <img
                    src="/assets/frame 2.png"
                    className="img-fluid d-block w-100"
                    alt="slideshow image"
                  />
                </div>
              </div>

              {/* Slide 3 */}
              <div className="carousel-item">
                <div className="position-relative">
                  <button
                    className={`btn position-absolute start-0 ${styles.frame_2Button}`}
                    onClick={() => setVisible(true)}
                  >
                    انشاء حساب
                  </button>
                  <Modal
                    isOpen={visible}
                    onRequestClose={() => setVisible(false)}
                    style={customStyles}
                  >
                    <button
                      onClick={() => setVisible(false)}
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        fontSize: "24px",
                        color: "#333",
                        cursor: "pointer",
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                      }}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                    <Register />
                  </Modal>
                  <img
                    src="/assets/frame 3.png"
                    className="img-fluid d-block w-100"
                    alt="slideshow image"
                  />
                </div>
              </div>
              <div className="carousel-item">
                <div className="position-relative">
                  <button
                    className={`btn position-absolute start-0 ${styles.frame_2Button}`}
                    onClick={() => setVisible(true)}
                  >
                    انشاء حساب
                  </button>
                  <Modal
                    isOpen={visible}
                    onRequestClose={() => setVisible(false)}
                    style={customStyles}
                  >
                    <button
                      onClick={() => setVisible(false)}
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        fontSize: "24px",
                        color: "#333",
                        cursor: "pointer",
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                      }}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                    <Register />
                  </Modal>
                  <img
                    src="/assets/frame 4.png"
                    className="img-fluid d-block w-100"
                    alt="slideshow image"
                  />
                </div>
              </div>
            </div>

            {/* Carousel Controls */}
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleControls"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleControls"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>

          <a
            href="#About"
            className={`${styles.scroll} text-decoration-none d-sm-block d-none`}
            id="About"
          >
            <span></span>
          </a>
        </div>
      </header>

      {/* Other Sections */}
      <section>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "70px",
          }}
        >
          <div>
            <img
              src="/assets/circlestext.png"
              alt="Circles Text"
              style={{ maxWidth: "100%" }}
            />
          </div>
          <div>
            <img
              src="/assets/circles.png"
              alt="Circles"
              style={{ maxWidth: "100%" }}
            />
          </div>
        </div>
      </section>
      <section>
    <div className={styles.gridtext}>
        <h2 className={styles.textgrid}>نبذه عن ما نقدمه</h2>
    </div>
    <div className="container text-center">
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4" style={{ marginTop: "-70px" }}>
            <div className="col">
                <img src="/assets/grid1.png" className="img-fluid" alt="Grid Image 1" />
            </div>
            <div className="col">
                <img src="/assets/grid2.png" className="img-fluid" alt="Grid Image 2" />
            </div>
            <div className="col">
                <img src="/assets/grid3.png" className="img-fluid" alt="Grid Image 3" />
            </div>
            <div className="col">
                <img src="/assets/grid4.png" className="img-fluid" alt="Grid Image 4" />
            </div>
        </div>
    </div>
</section>
<section>
    <h2 className={styles.greentext}>ميزات منصتنا</h2>
    <div className="container text-center">
      <div className="row">
        <div className="col-12 col-md-6 col-lg-4">
          <img src="/assets/feature1.png" alt="Feature 1" className="img-fluid" />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <img src="/assets/feature2.png" alt="Feature 2" className="img-fluid" />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <img src="/assets/feature3.png" alt="Feature 3" className="img-fluid" />
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-4">
          <img src="/assets/feature4.png" alt="Feature 1" className="img-fluid" />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <img src="/assets/feature5.png" alt="Feature 2" className="img-fluid" />
        </div>
      </div>
    </div>
</section>
<section>
<div className="position-relative d-flex justify-content-center align-items-center" style={{marginTop:"100px"}}>
    <img src="/assets/video.png" alt="Feature 1" className="img-fluid" style={{ marginBottom:" 100px"}}/>
    <img src="/assets/green.png" alt="Feature 1" className="img-fluid position-absolute" style={{ top: '-90px' }} />
</div>

</section>

      <Footer />
    </>
  );
}
