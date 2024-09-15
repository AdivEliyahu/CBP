import { Link, useNavigate } from 'react-router-dom'
import React, {useState, useContext} from 'react'
import { MyContext } from '../../MyContext'


function validateEmail(email) {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
}

function validatePhoneNumber(phoneNumber) {
    return /^0(5[0-9])\d{7}$/.test(phoneNumber);
}

function validateID(id) {
    return /^\d{9}$/.test(id);
}

function Register() {
    const nav = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [id, setID] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [password, setPassword] = useState({
        value: "",
        isTouched: false,
    });
    const [confirmPassword, setConfirmPassword] = useState({
        value: "",
        isTouched: false,
    });

    const [isIdValid, setIsIdValid] = useState(true);
    const [isFirstNameValid, setIsFirstNameValid] = useState(true);
    const [isLastNameValid, setIsLastNameValid] = useState(true);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(true);
    const [isAddressValid, setIsAddressValid] = useState(true);
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);

    const getIsFormValid = () => {
        return (
            validateID(id) &&
            firstName &&
            lastName &&
            validateEmail(email) &&
            validatePhoneNumber(phoneNumber) &&
            address &&
            password.value.length >= 8 &&
            password.value === confirmPassword.value
        );
    };

    const clearForm = () => {
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhoneNumber("");
        setAddress("");
        setID("");
        setPassword({
            value: "",
            isTouched: false,
        });
        setConfirmPassword({
            value: "",
            isTouched: false,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phoneNumber: phoneNumber,
                    address: address,
                    password: password.value,
                    id: id
                })
            });

            const data = await response.json();
            if (response.status === 409) {
                alert(data.message);
            } else if (!response.ok) {
                throw new Error("Bad Network");
            } else {
                alert(data.message);
                clearForm();
                nav("/");
            }
        } catch (error) {
            console.error('Error:', error);
        }
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

    const PasswordErrorMessage = () => {
        return (
            <p style={errorStyle}>Password should have at least 8 characters</p>
        );
    };

    
const ConfirmPasswordErrorMessage = () => {
    return (
        <p style={errorStyle}>Passwords do not match</p>
    );
};

    return (
        <div class="px-4 py-5 my-5 text-center">
            <div className="display-5 mb-5 fw-bold text-body-emphasis">
                Sign Up
            </div>
            <form onSubmit={handleSubmit} style={containerStyle}>
                <div className="form-floating my-3">
                    <input
                        value={id}
                        onChange={(e) => {
                            setID(e.target.value);
                            setIsIdValid(validateID(e.target.value));
                        }}
                        placeholder="ID"
                        className="form-control"
                    />
                    <label htmlFor="floatingInput">ID <sup>{!isIdValid && "*"}</sup></label>
                    {!isIdValid && <div style={errorStyle}>Invalid ID</div>}
                </div>

                <div className="form-floating my-3">
                    <input
                        value={firstName}
                        onChange={(e) => {
                            setFirstName(e.target.value);
                            setIsFirstNameValid(!!e.target.value);
                        }}
                        placeholder="First name"
                        className="form-control"
                    />
                    <label htmlFor="floatingInput">First name <sup>{!isFirstNameValid && "*"}</sup></label>
                    {!isFirstNameValid && <div style={errorStyle}>First name is required</div>}
                </div>

                <div className="form-floating my-3">
                    <input
                        value={lastName}
                        onChange={(e) => {
                            setLastName(e.target.value);
                            setIsLastNameValid(!!e.target.value);
                        }}
                        placeholder="Last name"
                        className="form-control"
                    />
                    <label htmlFor="floatingInput">Last name <sup>{!isLastNameValid && "*"}</sup></label>
                    {!isLastNameValid && <div style={errorStyle}>Last name is required</div>}
                </div>

                <div className="form-floating my-3">
                    <input
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setIsEmailValid(validateEmail(e.target.value));
                        }}
                        placeholder="Email address"
                        className="form-control"
                    />
                    <label htmlFor="floatingInput">Email address <sup>{!isEmailValid && "*"}</sup></label>
                    {!isEmailValid && <div style={errorStyle}>Invalid email</div>}
                </div>

                <div className="form-floating my-3">
                    <input
                        value={phoneNumber}
                        onChange={(e) => {
                            setPhoneNumber(e.target.value);
                            setIsPhoneNumberValid(validatePhoneNumber(e.target.value));
                        }}
                        placeholder="Phone number"
                        className="form-control"
                    />
                    <label htmlFor="floatingInput">Phone number <sup>{!isPhoneNumberValid && "*"}</sup></label>
                    {!isPhoneNumberValid && <div style={errorStyle}>Invalid phone number</div>}
                </div>

                <div className="form-floating my-3">
                    <input
                        value={address}
                        onChange={(e) => {
                            setAddress(e.target.value);
                            setIsAddressValid(!!e.target.value);
                        }}
                        placeholder="Address"
                        className="form-control"
                    />
                    <label htmlFor="floatingInput">Address <sup>{!isAddressValid && "*"}</sup></label>
                    {!isAddressValid && <div style={errorStyle}>Address is required</div>}
                </div>

                <div className="form-floating my-3">
                    <input
                        value={password.value}
                        type="password"
                        onChange={(e) => {
                            const newPasswordValue = e.target.value;
                            setPassword({ ...password, value: newPasswordValue });
                            setIsPasswordValid(newPasswordValue.length >= 8);
                            setIsConfirmPasswordValid(newPasswordValue === confirmPassword.value);
                        }}
                        onBlur={() => {
                            setPassword({ ...password, isTouched: true });
                        }}
                        placeholder="Password"
                        className="form-control"
                    />
                    <label htmlFor="floatingInput">Password <sup>{password.isTouched && !isPasswordValid && "*"}</sup></label>
                    {password.isTouched && password.value.length < 8 && <PasswordErrorMessage />}
                </div>

                <div className="form-floating my-3">
                    <input
                        value={confirmPassword.value}
                        type="password"
                        onChange={(e) => {
                            const newConfirmPasswordValue = e.target.value;
                            setConfirmPassword({ ...confirmPassword, value: newConfirmPasswordValue });
                            setIsConfirmPasswordValid(newConfirmPasswordValue === password.value);
                        }}
                        onBlur={() => {
                            setConfirmPassword({ ...confirmPassword, isTouched: true });
                        }}
                        placeholder="Confirm Password"
                        className="form-control"
                    />
                    <label htmlFor="floatingInput">Confirm Password <sup>{confirmPassword.isTouched && !isConfirmPasswordValid && "*"}</sup></label>
                    {confirmPassword.isTouched && confirmPassword.value !== password.value && <ConfirmPasswordErrorMessage />}
                </div>

                <button type="submit" className="btn btn-primary w-100 mb-3" style={containerStyle} disabled={!getIsFormValid()}>
                    Create account
                </button>
            </form>

            <div>
                <p>
                    <Link to={'/login'}>Already have an account? Log in here</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
