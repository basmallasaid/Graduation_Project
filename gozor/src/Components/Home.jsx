import styles from "../Styles/style.module.css"; 
import Footer from "./Footer";

export default function Home() {
  return (
    <>
    <header className=" vh-100">
    <div classNameName="slider position-relative">
        <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
                <div className="carousel-item active ">
                    <img src="/assets/home.jpg" className="d-block w-100  h-100 " alt="slideshow image" />
                    <div className=" text position-absolute top-50 start-20 ">
                    <button className={`btn me-2 ${styles.loginButton}`}>تسجيل الدخول</button>

                        <h1 className={styles.intro}  >استثمار زراعي يجمع بين فرص النمو للمستثمرين، وصول واسع للأسواق للتجار، ودعم متكامل للمزارعين لإنتاج محاصيل ذات جودة عالية. منصة جذور المدينة، تجمع بين التمويل، التسويق، والإنتاج لتحقيق التنمية الزراعية المستدامة.</h1>
                    </div>
                </div>
                <div className="carousel-item  ">
                    <img src="/assets/home2.jpg" className="d-block w-100  h-100" alt="slideshow image"/>
                    <div className=" text position-absolute top-50 start-50 translate-middle  text-center">
                        <h1 className="text-white" >Focused <br/> on Strategy.</h1>
                    </div>
                </div>
                <div className="carousel-item  ">
                    <img src="/assets/home3.jpg" className="d-block w-100   h-100" alt="slideshow image"/>
                    <div className="  text position-absolute top-50 start-50 translate-middle  text-center">
                        <h1 className="text-white " > Advanced in<br/>  digital works.</h1>
                    </div>
                </div>
                <div className="carousel-item  ">
                    <img src="/assets/home4.jpg" className="d-block w-100   h-100" alt="slideshow image"/>
                    <div className="  text position-absolute top-50 start-50 translate-middle  text-center">
                        <h1 className="text-white " > Advanced in<br/>  digital works.</h1>
                    </div>
                </div>
            </div>
            <button  className="carousel-control-prev d-md-inline-block d-none" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                <span className="carousel-control-prev-icon position-relative text-white d-flex justify-content-center align-items-center " aria-hidden="true"><i className="fas fa-chevron-right"></i></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button  className="carousel-control-next d-md-inline-block d-none" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                <span className="carousel-control-next-icon position-relative text-white d-flex justify-content-center align-items-center" aria-hidden="true"><i className="fas fa-chevron-left"></i></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
        <a href="#About" className={`${styles.scroll} text-decoration-none  d-sm-block d-none`} id="About">
            <span></span>
        </a>
    </div>
</header>
<Footer/>

</>
  );
}