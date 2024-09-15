import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';

function AddSensors() {
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [sensorID, setSensorID] = useState('');
    const nav = useNavigate();

    const handleSensorChange = (e) => {
        setSensorID(e.target.value);
    };
    const handleLatChange = (e) => {
        setLat(e.target.value);
    };
    const handleLngChange = (e) => {
        setLng(e.target.value);
    };

    const containerStyle = {
        maxWidth: '400px',
        margin: 'auto'
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate if lat and lng are numbers
        const latNumber = parseFloat(lat);
        const lngNumber = parseFloat(lng);

        if (isNaN(latNumber) || isNaN(lngNumber)) {
            alert("Latitude and Longitude must be valid numbers");
            return;
        }

        // Validate if lat and lng are within valid ranges
        if (latNumber < -90 || latNumber > 90 || lngNumber < -180 || lngNumber > 180) {
            alert("Latitude must be between -90 and 90, and Longitude must be between -180 and 180");
            return;
        }

        try {
            const sensorResponse = await fetch('/sensor/newsensor', {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    "id": sensorID,
                    "lat": latNumber,
                    "lng": lngNumber
                })
            });
            const reportData = await sensorResponse.json();

            nav("/sensors");
        } catch (e) {
            console.error('Error:', e);
            alert("Couldn't create new sensor");
        }
    };
    
    return (
        <div className="px-4 py-5 my-5 text-center">
            <div className="display-5 mb-5 fw-bold text-body-emphasis">
                Add New Sensor
            </div>
            <form onSubmit={handleSubmit} style={containerStyle}>

                <div className="form-floating my-3">
                    <input 
                    type="text" 
                    value={sensorID} 
                    onChange={handleSensorChange} 
                    required
                    className="form-control"
                    placeholder="SensorID"
                    />
                    <label htmlFor="floatingInput">Sensor ID</label>
                </div>

                <div className="form-floating my-3">
                    <input 
                    type="text" 
                    value={lat} 
                    onChange={handleLatChange} 
                    required
                    className="form-control"
                    placeholder="Latitude"
                    />
                    <label htmlFor="floatingInput">Lat</label>
                </div>

                <div className="form-floating my-3">
                    <input 
                    type="text" 
                    value={lng} 
                    onChange={handleLngChange} 
                    required
                    className="form-control"
                    placeholder="Longitude"
                    />
                    <label htmlFor="floatingInput">Lng</label>
                </div>

                <button type="submit" className="btn btn-primary w-100 mb-3">
                    Confirm
                </button>
            </form>
        </div>
    );
}

export default AddSensors;
