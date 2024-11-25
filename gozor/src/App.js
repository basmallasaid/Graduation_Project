import './App.css';
import StanderErrorBoundary from './Components/Error/StanderErorrBoundary';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import Notfound from './Components/Notfound';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Footer from './Components/Footer';
// import Contact from './Components/Contact'
// import Header from './Components/Header';
function App() {
  return (
      <StanderErrorBoundary>
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<Footer/>} />
          <Route path="*" element={<Notfound />} />
          </Routes>
        </BrowserRouter>
      </StanderErrorBoundary>
  );
}

export default App;
