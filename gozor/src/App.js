import './App.css';
import StanderErrorBoundary from './Components/Error/StanderErorrBoundary';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import "@fortawesome/fontawesome-free/css/all.min.css";
import Notfound from './Components/Notfound';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Footer from './Components/Footer';
import Navbar from './Components/Navbar';
import Contact from './Components/Contact';
import Home from './Components/Home';
function App() {
  return (
      <StanderErrorBoundary>
        <BrowserRouter>
          <Routes>
          {/* <Route path="/Home" element={<Footer/>} /> */}
          <Route path="/" element={<><Navbar/>
          <Home/>
           <Footer/></>} />
          {/* <Route path="*" element={<Notfound />} /> */}
          </Routes>
        </BrowserRouter>
      </StanderErrorBoundary>
  );
}

export default App;
