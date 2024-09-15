import React, { useState, useEffect } from 'react';
import MapComponent from './MapComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form, Card } from 'react-bootstrap';

function Map() {
  const [markers, setMarkers] = useState([]);
  const [name, setName] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [sensorReports, setSensorReports] = useState([]); // State for sensor reports
  const [showAlertModal, setShowAlertModal] = useState(false); // State for showing alert modal
  const [newAlert, setNewAlert] = useState(null); // State for the new alert

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const response = await fetch('/sensor/viewsensors');
        const sensorData = await response.json();

        if (response.ok) {
          const sensorMarkers = sensorData.map(sensor => ({
            name: sensor.sensorId,
            lat: parseFloat(sensor.lat),
            lng: parseFloat(sensor.lng)
          }));
          setMarkers(sensorMarkers);
        } else {
          console.error('Failed to fetch sensors:', sensorData.data);
        }
      } catch (error) {
        console.error('Error fetching sensors:', error);
      }
    };

    fetchSensors();
  }, []);

  useEffect(() => {
    const fetchSensorReports = async () => {
      try {
        const response = await fetch('/sensor/sensor-reports');
        const reportData = await response.json();
        
        if (response.ok) {
          setSensorReports(reportData);
        } else {
          console.error('Failed to fetch sensor reports:', reportData);
        }
      } catch (error) {
        console.error('Error fetching sensor reports:', error);
      }
    };

    fetchSensorReports();
  }, []);

  const addSensor = async () => {
    if (name && lat && lng) {
      try {
        const response = await fetch('/sensor/newsensor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: name,
            lat: parseFloat(lat),
            lng: parseFloat(lng)
          })
        });

        const result = await response.json();

        if (response.ok) {
          // Add the new sensor to the markers state
          setMarkers([...markers, { name, lat: parseFloat(lat), lng: parseFloat(lng) }]);
          setName('');
          setLat('');
          setLng('');
          setShowModal(false); // Hide the modal after adding the sensor
        } else {
          console.error('Failed to add sensor:', result.data);
          alert('Failed to add sensor: ' + result.data);
        }
      } catch (error) {
        console.error('Error adding sensor:', error);
        alert('Error adding sensor: ' + error.message);
      }
    } else {
      alert('Please enter valid name, latitude, and longitude.');
    }
  };

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const simulateAlert = () => {
    const simulatedAlert = {
      id: sensorReports.length + 1, // Generate a unique ID
      vibration: Math.random() * 10, // Random vibration value
      tilt: Math.random() * 10, // Random tilt value
      unit_location: `Location ${sensorReports.length + 1}` // Example location
    };
    setNewAlert(simulatedAlert);

    setTimeout(() => {
      setShowAlertModal(true);
    }, 3000); 
  };

  const confirmAlert = () => {
    setSensorReports([...sensorReports, newAlert]); // Add the new alert to the reports
    setShowAlertModal(false); // Hide the alert modal
    setNewAlert(null); // Clear the new alert state
  };

  const closeAlertModal = () => setShowAlertModal(false);

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Left Component */}
        <div className="col-md-4 col-lg-3 bg-dark text-white">
          <div className="d-flex flex-column justify-content-between" style={{ height: '100%' }}>
            <div>
              <h2>Interactive Map</h2>
              <p>Latest alerts</p>
              {sensorReports.map(report => (
                <Card key={report.id} className="bg-secondary text-white mb-2">
                  <Card.Body className="d-flex justify-content-between align-items-center">
                    <Card.Text className="mb-0">
                      Alert: {report.unit_location}
                    </Card.Text>
                    <Button variant="light" className="ms-2">Confirm</Button>
                  </Card.Body>
                </Card>
              ))}
            </div>
            <div className="d-flex flex-column">
              <Button variant="secondary" className="mb-2" onClick={simulateAlert}>
                Simulate Alert
              </Button>
              <Button variant="primary" onClick={handleShow} className="mb-2">
                Add Sensor
              </Button>
            </div>
          </div>
        </div>

        {/* Map Component */}
        <div className="col-md-8 col-lg-9">
          <div className="d-flex justify-content-center" style={{ height: '100%' }}>
            <MapComponent markers={markers} />
          </div>
        </div>
      </div>

      {/* Bootstrap Modal for adding sensors */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add a New Sensor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formSensorName">
              <Form.Label>Sensor ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter sensor ID"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formLatitude" className="mt-3">
              <Form.Label>Latitude</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter latitude"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formLongitude" className="mt-3">
              <Form.Label>Longitude</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter longitude"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="success" onClick={addSensor}>
            Add Sensor
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Bootstrap Modal for alert simulation */}
      {newAlert && (
        <Modal show={showAlertModal} onHide={closeAlertModal}>
          <Modal.Header closeButton>
            <Modal.Title>New Alert</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Location:</strong> {newAlert.unit_location}</p>
            <p><strong>Vibration:</strong> {newAlert.vibration.toFixed(2)}</p>
            <p><strong>Tilt:</strong> {newAlert.tilt.toFixed(2)}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeAlertModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={confirmAlert}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default Map;
