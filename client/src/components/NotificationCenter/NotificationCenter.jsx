import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../../MyContext';

const NotificationCenter = () => {
  const { user, setUser } = useContext(MyContext);
  const [data, setData] = useState([]);
  const navigate = useNavigate();


  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 20;
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = data.slice(indexOfFirstReport, indexOfLastReport);
  const totalPages = Math.ceil(data.length / reportsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  const retrieveNewData = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('No token found, please log in');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('/sensor/fetch', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
      } else {
        console.error('Failed to fetch home data:', response.status);
        alert('Failed to fetch home data');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to fetch home data');
    }
  };

  const fetchData = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('No token found, please log in');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('/sensor/getData', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        console.error('Failed to fetch data:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReport = async (item) => {
    const desc = "Report ID:" + item.id + " reported via Sensor: " + item.device_name + " temp: " + item.temperature + ", vibration: " + item.vibration_sd + " tilt: " + item.tilt;
    const loca = "lat: " + item.location_lat + " lng: " + item.location_lng;

    const token = sessionStorage.getItem("token");

    try {

      const reportResponse = await fetch('/report/dispatcher/new', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          "id": user.id,
          "data": desc,
          "location": loca,
          "image": "https://st.depositphotos.com/1186248/2751/i/950/depositphotos_27516585-stock-photo-alert.jpg",
          "sensorId": item.id
        })
      });
      console.log(item.id)
      const reportData = await reportResponse.json();
      alert('Report created');
      navigate('/reports');
    } catch (e) {
      console.error('Error:', e);
      alert("Something went wrong, try again later.");
    }
  };

  return (
    <div className="container">
      <button className='btn btn-primary my-3' onClick={retrieveNewData}>Retrieve Data</button>
      <div className="accordion accordion-flush" id="accordionFlushExample">
        {currentReports.map((item, index) => (
          <div className="accordion-item" key={item.id}>
            <h2 className="accordion-header" id={`flush-heading${index}`}>
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#flush-collapse${index}`} aria-expanded="false" aria-controls={`flush-collapse${index}`}>
                Report ID: {item.id} <code className='ms-5'>Lat: {item.location_lat} | Lng: {item.location_lng} | Sample Time UTC: {item.sample_time_utc}</code> 
              </button>
            </h2>
            <div id={`flush-collapse${index}`} className="accordion-collapse collapse" aria-labelledby={`flush-heading${index}`} data-bs-parent="#accordionFlushExample">
              <div className="accordion-body">
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>Temperature:</strong> {item.temperature}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Vibration SD:</strong> {item.vibration_sd}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Tilt:</strong> {item.tilt}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Sample Time UTC:</strong> {item.sample_time_utc}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>GW Read Time UTC:</strong> {item.gw_read_time_utc}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Device Name:</strong> {item.device_name}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Location Latitude:</strong> {item.location_lat}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Location Longitude:</strong> {item.location_lng}</p>
                  </div>
                  <div className="col-md-12">
                    <button className="btn btn-secondary" onClick={() => handleReport(item)}>Report</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => paginate(currentPage - 1)}>Previous</button>
          </li>
          {[...Array(totalPages)].map((_, index) => (
            <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => paginate(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => paginate(currentPage + 1)}>Next</button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default NotificationCenter;
