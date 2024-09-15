import React, { useState } from 'react';
import { useParams , useNavigate} from 'react-router-dom';

const ResetPass = () => {
    const nav = useNavigate();
    const { token } = useParams();


    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
        } else if (password !== confirmPassword) {
            setError('Passwords do not match.');
        } else {

            fetch(`/auth/resetSub/${token}`, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password: password, token: token }),
            })
            .then(data => {
                alert('Password reset successfully.');
                nav("/");
            })
            .catch((error) => {
                setError('Error resetting password.');
                console.error('Error:', error);
            });
        }
    };

    const containerStyle = {
        maxWidth: '400px',
        margin: 'auto'
      };
    const errorStyle = {
    color: 'red',
    fontSize: '0.875em',
    marginTop: '0.25em',
    };

    return (
        <div className="px-4 py-5 my-5 text-center">
            <div class="display-5 mb-5 fw-bold text-body-emphasis">
                Reset Password
            </div>
            <div style={containerStyle}>
                <div class="form-floating my-3">
                    <input 
                        type="password" 
                        id="password" 
                        class="form-control" 
                        value={password} 
                        placeholder="password" 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                    <label for="floatingInput">Password</label>
                
                    <div class="form-floating my-3">
                        <input 
                            type="password" 
                            id="confirmPassword"
                            class="form-control" 
                            placeholder="password"
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            required 
                        />
                        <label for="floatingInput">Confirm Password</label>
                        {error && <div style={errorStyle}>{error}</div>}
                    </div>
                </div>
                
                <button class="btn btn-primary w-100 mb-3" type="submit" onClick={handleSubmit}>Reset Password</button>
            </div>
        </div>
    );
};

export default ResetPass;
