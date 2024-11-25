import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Notfound = () => {
  const navigate = useNavigate();

  const handleNav = () => {
    navigate("/Home");
  };

  
  useEffect(() => {
    Swal.fire({
      icon: 'error',
      title: 'Page Not Found',
      text: 'The page you are looking for does not exist!',
      confirmButtonText: 'Back to Home',
      confirmButtonColor: '#3085d6',
      background: '#f8d7da',
    }).then(() => {
      handleNav();
    });
  }, [navigate]);

  return (
    <div>
      
    </div>
  );
};

export default Notfound;