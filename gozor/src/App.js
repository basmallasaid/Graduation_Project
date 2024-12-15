import './App.css';
import StanderErrorBoundary from './Components/Error/StanderErorrBoundary';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import "@fortawesome/fontawesome-free/css/all.min.css";
import Notfound from './Components/Notfound';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Contact from './Components/Contact';
import Home from './Components/Home';
import Services from './Components/Services';
import About from './Components/About';
import Instructions from './Components/Instructions';
import Register from './Authentication/Register';
import Opinon from './Components/Opinon';
import NavbarF from './Components/FarmerDashboard/NavbarF';
import FooterF from './Components/FarmerDashboard/FooterF';
import ViewCrops from './Components/FarmerDashboard/ViewCrops';
import Addcrop from './Components/FarmerDashboard/addcrop';
// <<<<<<< HEAD
import WeatherF from './Components/FarmerDashboard/WeatherF';
// =======
import Cropcard from './Components/FarmerDashboard/cropcard';
import Croprequests from './Components/FarmerDashboard/croprequests';
import AImodel from './Components/FarmerDashboard/AImodel';

// >>>>>>> 854142225220f439e2c00c42ebb6c9345aae2d54
function App() {
  return (
      <StanderErrorBoundary>
        <BrowserRouter>
           <Routes>
          <Route path="/" element={<> <Navbar/><Home/></>} />
          <Route path="/Home" element={<> <Navbar/><Home /></>} />
          <Route path="Services" element={<><Services/></>}/>
          <Route path="Contact" element={<><Contact/></>}/>
          <Route path="About" element={<><About/></>}/>
          <Route path="Instructions" element={<><Instructions/></>}/>
          <Route path="*" element={<Notfound />} />
          <Route path="/register" element={<Home />} />
          <Route path='Opinon' element={<Opinon/>}/>
          <Route path='WeatherF' element={<WeatherF/>}/>
          <Route path="AI"  element={<AImodel/>}/>

           </Routes>  
          {/* <Navbar/>
          <ViewCrops/>
          <FooterF/> */}
      {/* <Addcrop/> */}
      {/* <Cropcard/> */}

       {/* </Routes>  */}
          {/* <Navbar/>
           <ViewCrops/>
           <FooterF/> */}
       {/* <Addcrop/> */}
       {/* <Cropcard/> */}
{/* >>>>>>> 854142225220f439e2c00c42ebb6c9345aae2d54 */}
{/* <Croprequests/> */}
     
        </BrowserRouter>
      </StanderErrorBoundary>
  );
}

export default App;
