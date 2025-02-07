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
// import ViewCrops from './Components/FarmerDashboard/ViewCrops';
import Addcrop from './Components/FarmerDashboard/addcrop';
// <<<<<<< HEAD
import WeatherF from './Components/FarmerDashboard/WeatherF';
// =======
import Cropcard from './Components/FarmerDashboard/cropcard';
// import Croprequests from './Components/FarmerDashboard/Croprequests';
import AImodel from './Components/FarmerDashboard/AImodel';
import Cropmenuview from './Components/FarmerDashboard/Cropsmeniview'
import Updatenewcycle from './Components/FarmerDashboard/Updateoncycle';
import Addcycletasks from './Components/FarmerDashboard/Addcycletasks';
import Addopencycle from './Components/FarmerDashboard/Addopencycle';
import Addclosecycle from './Components/FarmerDashboard/Addclosecycle';
import Tabletasks from './Components/FarmerDashboard/Tabletasks';
import Updateopencycle from './Components/FarmerDashboard/Updateopencycle'
import Updateclosecycle from './Components/FarmerDashboard/Updateclosecycle'
import Viewnew from './Components/FarmerDashboard/Viewnew';
import Editupdatenewcycle from './Components/FarmerDashboard/Editupdateoncycle';
import Shopping from './Components/FarmerDashboard/Shopping';
import ViewCrops from './Components/FarmerDashboard/ViewCrops';
import PaymentF from './Components/FarmerDashboard/financial reporting/PaymentF';
import HomeFarmer from './Components/FarmerDashboard/Main/HomeFarmer';
import Agricultural from './Components/FarmerDashboard/AgriculturalManagement/Agricultural';
import SeeDetails from './Components/InvestorDashboard/Investorpages/SeeDetails/SeeDetails';
import Invnewupdates from './Components/InvestorDashboard/Investorpages/SeeDetails/Invnewupdates'
import InvestorHome from './Components/InvestorDashboard/InvestorHome/InvestorHome';
import InverstorPayment from './Components/InvestorDashboard/InvestorPayment/InverstorPayment';

// >>>>>>> 854142225220f439e2c00c42ebb6c9345aae2d54
function App() {
  return (
      <StanderErrorBoundary>
        <BrowserRouter>
          { <Routes>
          {/* <Route path="/" element={<> <Navbar/><Home/></>} />
=======
           <Routes>
          <Route path="/" element={<> <Navbar/><Home/></>} />
>>>>>>> 766779033927f4e114e22a134732c64f25fc8a99
          {/* <Route path="/viewcrops" element={<ViewCrops/>} /> */}

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
          <Route path="/viewcrops" element={<ViewCrops/>} />
          <Route path="/Cropmenuview" element={<Cropmenuview/>} />
          <Route path="/Updateoncycle" element={<Updatenewcycle/>} />
          <Route path="/Addcycletasks" element={<Addcycletasks/>} />
          <Route path="/Addopencycle" element={<Addopencycle/>} />
          <Route path="/Addclosecycle" element={<Addclosecycle/>} />
          <Route path="/Tabletasks" element={<Tabletasks/>} />
          <Route path="/Updateopencycle" element={<Updateopencycle/>} />
          <Route path="/Updateclosecycle" element={<Updateclosecycle/>} />
          <Route path="/Viewnew" element={<Viewnew/>} />
          <Route path="/Editupdatenewcycle" element={<Editupdatenewcycle/>} />
          <Route path='WeatherF' element={<WeatherF/>}/> 
          <Route path="AI"  element={<AImodel/>}/>
          <Route path="Shopping" element={<Shopping/>}/>
          <Route path='ViewCrops' element={<ViewCrops/>}/>
         <Route path='HomeFarmer' element={<HomeFarmer/>}/>
          <Route path='PaymentF' element={<PaymentF/>}/>
          <Route path='SeeDetails' element={<SeeDetails/>}/>
          <Route path='Invnewupdates' element={<Invnewupdates/>}/>
          <Route path='Agricultural' element={<Agricultural/>}/>
          <Route path='InvestorHome' element={<InvestorHome/>}/>
          <Route path='InverstorPayment' element={<InverstorPayment/>}/>
         
           </Routes>}
 


      
{/* 
          
          

           </Routes>   */}
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
