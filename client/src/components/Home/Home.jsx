import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../../MyContext';


const Home = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const { user, setUser } = useContext(MyContext);

  const navContactUs = () => { 
    navigate('/contact-us');
  };

  useEffect(() => {
    const fetchHome = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        console.error('No token found, please log in');
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('/auth/home', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          setUserName(result.userName);
        } else {
          console.error('Failed to fetch home data:', response.status);
          navigate('/login');
        }
      } catch (error) {
        console.error('Error:', error);
        navigate('/login');
      }
    };

    fetchHome();
  }, [navigate]);

  return (
     
<div class="px-4 py-5 my-5 text-center">
    <img class="d-block mx-auto mb-4" src="https://i.ibb.co/dkXbX2K/asd-removebg-preview.png" alt="logo" />

    <div class="col-lg-6 mx-auto">
      <p class="lead mb-4">At our company, we focus on saving life, and this is how we do it, Sophisticated program designed to tackle the pressing issue of aging buildings in historic neighborhoods. We’ve developed a sophisticated system that goes beyond traditional methods of sporadic inspections and manual reporting. Our solution leverages real-time sensor data combined with a centralized reporting platform to enhance accuracy and efficiency. This allows municipalities to monitor the structural integrity of buildings more effectively and respond quickly to potential hazards. Our system is designed to be user-friendly and integrates smoothly with existing city infrastructure, ensuring that it supports both safety and operational efficiency. Ultimately, we aim to protect lives and property while optimizing resource allocation through our advanced technology and dedicated support.</p>
      <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">

      </div>
      <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 border-top">
        <p className="col-md-4 mb-0 text-body-secondary">© 2024 Company, Inc</p>
        <a href="/" className="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
        </a>
        <ul className="nav col-md-4 justify-content-end">
          <li className="nav-item"><button onClick={navContactUs} className="nav-link px-2 text-body-secondary">Contact us</button></li>
        </ul>
      </footer>
    </div>
    </div>
  )
}

export default Home;
