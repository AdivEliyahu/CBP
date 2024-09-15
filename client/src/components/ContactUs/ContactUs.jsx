import React, {useContext, useState} from 'react';
import {useNavigate} from "react-router-dom";

function ContactUs() {
    const [subject, setSubject] = useState('');
    const [data, setData] = useState('');
    const navigate = useNavigate();
    const handleDataChange = (e) => {
        setData(e.target.value);
    };
    const handleSubjectChange = (e) => {
        setSubject(e.target.value);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/auth/contact-us', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    title: subject,
                    description: data
                })
            });
            const json = await response.json();
            if (response.status === 200) {
                alert("Submission completed successfully");
            }
            navigate('/home');
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        
        
    };
    
    const containerStyle = {
        maxWidth: '400px',
        margin: 'auto'
    };
  return (
    <div class="px-4 py-5 my-5 text-center">
        <div className="display-5 mb-5 fw-bold text-body-emphasis">
            Contact Us
        </div>

        <form onSubmit={handleSubmit} style={containerStyle}>
                <select 
                    className="form-select" 
                    aria-label="Default select example"
                    value={subject} 
                    onChange={handleSubjectChange}
                    required
                >
                    <option value="" disabled>Select your subject</option>
                    <option value="Help">Help</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Bug">Bug Report</option>
                </select>
            <div className="form-floating my-3"> 
                <textarea 
                style={{ height: '100px' }}
                type="text" 
                value={data} 
                onChange={handleDataChange} 
                required
                className="form-control"
                placeholder="Description"
                rows="4"
                />
                <label htmlFor="floatingInput">Description</label>
            </div>
     
            <button type="submit" className="btn btn-primary w-100 mb-3">
                Send
            </button>
        </form>
    </div>
  )
}

export default ContactUs