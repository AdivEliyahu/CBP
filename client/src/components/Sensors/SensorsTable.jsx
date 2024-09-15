import React, { useState, useEffect } from 'react';

function SensorsTable() {
    const [loading, setLoading] = useState(true);
    const [sensors, setSensors] = useState([]);

    const getSensors = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/sensor/viewsensors`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'GET'
            });
            const json = await response.json();
            if (response.status === 200) {
                setSensors(json);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getSensors();
    }, []);

    return (
        <div className="container mt-4">
            <div className="row">
                {loading ? (
                    <p>Loading...</p>
                ) : sensors.length === 0 ? (
                    <p>No sensors found.</p>
                ) : (
                    sensors.map(sensor => (
                        <div key={sensor.sensorId} className="col-12 mb-4">
                            <div className="card shadow-sm border-0">
                                <div className="card-body">
                                    <h5 className="card-title text-primary">Sensor ID: {sensor.sensorId}</h5>
                                    <div className="card-text">
                                        <p>
                                            <strong>Lat:</strong> {sensor.lat}
                                        </p>
                                        <p>
                                            <strong>Lng:</strong> {sensor.lng}
                                        </p>
                                    </div>
                                    <p className="card-text">
                                        <strong>Installation Date:</strong> {new Date(sensor.installation_date).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default SensorsTable;
