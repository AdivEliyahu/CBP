import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../MyContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faBell, faFile, faFlag, faListCheck, faCity, faEye, faPlus, faCircleExclamation, faPenToSquare, faArrowRightFromBracket, faMap } from '@fortawesome/free-solid-svg-icons';
import { faBattleNet } from '@fortawesome/free-brands-svg-icons';

function NavbarComp() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(MyContext);

  const clearToken = async () => {
    const token = sessionStorage.getItem("token");
    sessionStorage.removeItem("token");
    try {
      const response = await fetch('/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setUser(null);
        alert("Disconnected");
        navigate('/login');
      } else {
        console.error('Something went wrong, please try again', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const navReport = () => {
    navigate('/reports');
  };

  const navHome = () => {
    navigate('/home');
  };

  const newReport = () => {
    navigate('/new-report');
  };

  const fixedReport = () => {
    navigate('/fixed');
  };

  const editProfile = () => {
    navigate('/editprofile');
  };

  const navCalls = () => {
    navigate('/calls');
  };

  const newCall = () => {
    navigate('/new-report');
  };

  const navNotificationCenter = () => {
    navigate('/NotificationCenter');
  };

  const navInteractiveMap = () => {
    navigate('/map');
  };

  const navAddSensors = () => {
    navigate('/addSensors');
  };

  const navAllSensors = () => {
    navigate('/sensors');
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a type='button' className="navbar-brand" onClick={navHome}>CBP</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <button className="nav-link" aria-current="page" onClick={navHome}><FontAwesomeIcon className='me-2' icon={faHouse} /> Home</button>
              </li>
              {user.role === "dispatcher" && (
                <li className='nav-item'>
                  <button className="nav-link" aria-current="page" onClick={navNotificationCenter}><FontAwesomeIcon className='me-2' icon={faBell} /> Notification Center</button>
                </li>
              )}
              <li className="nav-item dropdown">
                <button className="nav-link dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  {user.role === 'technician' ? (
                    <>
                      <FontAwesomeIcon className='me-2' icon={faFile} /> Calls
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon className='me-2' icon={faFlag} /> Reports
                    </>
                  )}
                </button>
                <ul className="dropdown-menu">
                  {user.role === 'technician' ? (
                    <>
                      <li><button className="dropdown-item" onClick={navCalls}><FontAwesomeIcon className='me-2' icon={faListCheck} /> My Calls</button></li>
                      <li><button className="dropdown-item" onClick={newCall}><FontAwesomeIcon className='me-2' icon={faPlus} /> New Call</button></li>
                    </>
                  ) : (
                    <>
                      <li><button className="dropdown-item" onClick={navReport}><FontAwesomeIcon className='me-2' icon={faCircleExclamation} /> My Reports</button></li>
                      <li><button className="dropdown-item" onClick={newReport}><FontAwesomeIcon className='me-2' icon={faPlus} /> New Report</button></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><button className="dropdown-item" onClick={fixedReport}><FontAwesomeIcon className='me-2' icon={faCity} /> City Reports</button></li>
                    </>
                  )}
                </ul>
              </li>
              {user.role === "technician" && (
                <li className='nav-item dropdown'>
                  <button className="nav-link dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <FontAwesomeIcon className='me-2' icon={faBattleNet} /> Sensors
                  </button>
                  <ul className="dropdown-menu">
                    <li><button className="dropdown-item" onClick={navAllSensors}><FontAwesomeIcon className='me-2' icon={faEye} /> All Sensors</button></li>
                    <li><button className="dropdown-item" onClick={navAddSensors}><FontAwesomeIcon className='me-2' icon={faPlus} /> Add Sensor</button></li>
                  </ul>
                </li>
              )}
              {(user.role === "technician" || user.role === "dispatcher") && (
                <li className='nav-item'>
                  <button className="nav-link" aria-current="page" onClick={navInteractiveMap}><FontAwesomeIcon className='me-2' icon={faMap} /> Interactive Map</button>
                </li>
              )}
            </ul>
            <div className="d-flex">
              <button className="btn btn-primary me-2" onClick={editProfile}><FontAwesomeIcon className='me-2' icon={faPenToSquare} /> Edit Profile</button>
              <button className="btn btn-danger" onClick={clearToken}><FontAwesomeIcon className='me-2' icon={faArrowRightFromBracket} /> Disconnect</button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default NavbarComp;
