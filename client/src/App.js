import React, {useState, useEffect} from "react";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Login from "./components/Login/Login";
import HomePage from "./components/Home/Home";
import CitizenReports from "./components/Reports/CitizenReports";
import Register from "./components/Register/Register";
import Forgot from "./components/ResetPass/Forgot"; 
import EditProfile from "./components/EditProfile/EditProfile";
import ResetPass from "./components/ResetPass/ResetPass";
import {MyContext} from "./MyContext";
import NewReport from "./components/Reports/NewReport";
import FixedReports from "./components/Reports/FixedReports";
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.js';
import NavbarComp from "./components/NavbarComp";
import EditReport from "./components/Reports/EditReport";
import WorkerRegister from "./components/Register/WorkerRegister";
import NotificationCenter from "./components/NotificationCenter/NotificationCenter"
import MyCalls from "./components/Reports/MyCalls";
import AddSensors from "./components/Sensors/AddSensors";
import SensorsTable from "./components/Sensors/SensorsTable";
import ContactUs from "./components/ContactUs/ContactUs";
import Map from "./components/InteractiveMap/Map";
import { GoogleMapsProvider } from './components/InteractiveMap/GoogleMapsProvider';




function App() {
    const [user, setUser] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            if (!user) {
                try {
                    const token = sessionStorage.getItem("token");
                    const response = await fetch('/auth/getUserData', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    const userData = await response.json();
                    setUser(userData);
                } catch (error) {
                    console.error('Failed to fetch user:', error);
                }
            }
        };

        fetchUser();
    }, [user]);

    return (
        <div>
            <Router>
                <MyContext.Provider value={{ user, setUser }}>
                    {sessionStorage.getItem("token") && user ? <NavbarComp /> : null}
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/Home" element={<HomePage />} />
                        <Route path="/Register" element={<Register />} />
                        <Route path='/editProfile' element={<EditProfile />} />
                        <Route path='/reports' element={<CitizenReports />} />
                        <Route path='/forgot' element={<Forgot />} />
                        <Route path='/new-report' element={<NewReport />} />
                        <Route path='/fixed' element={<FixedReports />} />
                        <Route path='/resetPass/:token' element={<ResetPass />} />
                        <Route path='/Report/:id' element={<EditReport />} />
                        <Route path="/WorkerRegister" element={<WorkerRegister />} />
                        <Route path='/Calls' element={<MyCalls />} />
                        <Route path='/NotificationCenter' element={<NotificationCenter />} />
                        <Route path='/addSensors' element={<AddSensors />} />
                        <Route path='/sensors' element={<SensorsTable />} />
                        <Route path='/contact-us' element={<ContactUs />} />
                        <Route path='/map' element={
                            <GoogleMapsProvider>
                                <Map />
                            </GoogleMapsProvider>
                        } />
                    </Routes>
                </MyContext.Provider>
            </Router>
        </div>
    );
}

export default App;

