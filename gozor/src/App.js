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
          <Route path="*" element={<Notfound />} />
          </Routes>
        </BrowserRouter>
      </StanderErrorBoundary>
  );
}

export default App;
