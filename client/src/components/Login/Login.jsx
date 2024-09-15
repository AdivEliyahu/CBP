import { Link, useNavigate } from 'react-router-dom'
import React, { useState, useContext } from 'react'
import { MyContext } from '../../MyContext'

const Login = (props) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const nav = useNavigate();
    const { user, setUser } = useContext(MyContext);

    const onButtonClick = async () => {
        setEmailError('');
        setPasswordError('');

        if ('' === email) {
            setEmailError('Please enter your email');
            return;
        }

        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            setEmailError('Please enter a valid email');
            return;
        }

        if ('' === password) {
            setPasswordError('Please enter a password');
            return;
        }

        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const result = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    setPasswordError(result.error);
                } else if (response.status === 400) {
                    setEmailError(result.error);
                } else {
                    throw new Error("Network response was not ok");
                }
                setPassword("");
            } else {
                sessionStorage.setItem("token", result.userToken);
                setUser(result.user)
                nav("/home");
            }
        } catch (error) {
            console.error('Error:', error);
            setEmailError('Something went wrong, please try again later');
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            onButtonClick();
        }
    };

    const signUp = () => {
        nav('/register');
    }

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
        <div>
        <div className="px-4 py-5 my-5 text-center">
            <div className="display-5 mb-5 fw-bold text-body-emphasis">
                Login
            </div>
            <div className="form-floating my-3" style={containerStyle}>
                <input
                    value={email}
                    type="email"
                    className="form-control"
                    placeholder="name@example.com"
                    onChange={(ev) => setEmail(ev.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <label htmlFor="floatingInput">Email address</label>
                {emailError && <div style={errorStyle}>{emailError}</div>}
            </div>
            <div className="form-floating my-3" style={containerStyle}>
                <input
                    value={password}
                    type="password"
                    className="form-control"
                    placeholder="Enter your password here"
                    onChange={(ev) => setPassword(ev.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <label htmlFor="floatingInput">Password</label>
                {passwordError && <div style={errorStyle}>{passwordError}</div>}
            </div>
            <input className="btn btn-primary w-100 mb-3" style={containerStyle} type="button" onClick={onButtonClick}
                value={'Log in'} />
            <div>
                <p>
                    <Link to={'/forgot'}>forgot password?</Link>
                    <br />
                    <Link to={'/register'}>Not registered? sign up now!</Link>
                    <br />
                    <Link to={'/workerRegister'}>worker registration</Link>
                </p>
            </div>
        </div>
        <div>
            
            
        </div>
    </div>
)

    
}


export default Login;
