import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';

function Forgot() {
    const [inputEmail, setInputEmail] = useState('');
    const nav = useNavigate()
    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('/auth/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: inputEmail }),
        })
        .then(response => response.json())
        .then(data => {
            alert(data["message"]);
            if(data["status"]){
                nav("/");
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            
        });
    };

    const containerStyle = {
        maxWidth: '400px',
        margin: 'auto'
      };

    return (
        <div class="px-4 py-5 my-5 text-center">
            <div class="display-5 mb-5 fw-bold text-body-emphasis">
                Forgot Password
            </div>
            <div style={containerStyle}>
                <div class="form-floating my-3" style={containerStyle}>
                    <input 
                    value={inputEmail} 
                    type="email" 
                    class="form-control" 
                    placeholder="name@example.com" 
                    onChange={(ev) => setInputEmail(ev.target.value)}
                    />
                    <label for="floatingInput">Email address</label>
                </div>
                <button class="btn btn-primary w-100" type="submit" onClick={handleSubmit}>Reset Password</button>
            </div>
        </div>
    );
}

export default Forgot;
