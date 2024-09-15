import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

function validateEmail(email) {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
}

function validatePhoneNumber(phoneNumber) {
    return /^0(5[0-9])\d{7}$/.test(phoneNumber);
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

const PasswordErrorMessage = () => (
    <p style={errorStyle}>Password should have at least 8 characters</p>
);

const ConfirmPasswordErrorMessage = () => (
    <p style={errorStyle}>Passwords do not match</p>
);

function EditProfile() {
    const nav = useNavigate();
    const [userData, setUserData] = useState(null);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [role, setRole] = useState("");
    const [newPassword, setNewPassword] = useState({
        value: "",
        isTouched: false,
    });
    const [confirmPassword, setConfirmPassword] = useState({
        value: "",
        isTouched: false,
    });

    const [isFirstNameValid, setIsFirstNameValid] = useState(true);
    const [isLastNameValid, setIsLastNameValid] = useState(true);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(true);
    const [isAddressValid, setIsAddressValid] = useState(true);
    const [isNewPasswordValid, setIsNewPasswordValid] = useState(true);
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = sessionStorage.getItem("token");
                const response = await fetch('/auth/getUserData', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const data = await response.json();
                setUserData(data);
                setFirstName(data.firstName);
                setLastName(data.lastName);
                setEmail(data.email);
                setPhoneNumber(data.phoneNumber);
                setAddress(data.address); //for workers it'll be undifind
                setRole(data.role);

            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, []);

    const getIsFormValid = () => {
        return (
            firstName &&
            lastName &&
            validateEmail(email) &&
            validatePhoneNumber(phoneNumber) &&
            (address || role !== "citizen") &&
            (newPassword.value.length === 0 || newPassword.value.length >= 8) &&
            (newPassword.value === confirmPassword.value)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem('token')
        try {
            const response = await fetch('/auth/editProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phoneNumber: phoneNumber,
                    address: address,
                    newPassword: newPassword.value,
                    role : role
                })
            });

            if (!response.ok) {
                let errorMessage = 'Profile update failed';
                if (response.status === 400) {
                    const errorData = await response.json();
                    errorMessage = errorData.message;
                }
                alert(errorMessage);
            } else {
                const data = await response.json();
                sessionStorage.removeItem("token");
                sessionStorage.setItem("token", data.token);
                alert('Profile updated successfully');
                nav("/Home");
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Network error. Please try again.');
        }
    };

    return (
      <div className="px-4 py-5 my-5 text-center">
        <div className="display-5 mb-5 fw-bold text-body-emphasis">
          Edit Profile
        </div>
        <form onSubmit={handleSubmit} style={containerStyle}>
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
            <label htmlFor="floatingInput">
              First name <sup>{!isFirstNameValid && "*"}</sup>
            </label>
            {!isFirstNameValid && (
              <div style={errorStyle}>First name is required</div>
            )}
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
            <label htmlFor="floatingInput">
              Last name <sup>{!isLastNameValid && "*"}</sup>
            </label>
            {!isLastNameValid && (
              <div style={errorStyle}>Last name is required</div>
            )}
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
            <label htmlFor="floatingInput">
              Email address <sup>{!isEmailValid && "*"}</sup>
            </label>
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
            <label htmlFor="floatingInput">
              Phone number <sup>{!isPhoneNumberValid && "*"}</sup>
            </label>
            {!isPhoneNumberValid && (
              <div style={errorStyle}>Invalid phone number</div>
            )}
          </div>
          {role === "citizen" && (
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
              <label htmlFor="floatingInput">
                Address <sup>{!isAddressValid && "*"}</sup>
              </label>
              {!isAddressValid && (
                <div style={errorStyle}>Address is required</div>
              )}
            </div>
          )}

          <div className="form-floating my-3">
            <input
              value={newPassword.value}
              type="password"
              onChange={(e) => {
                const newPasswordValue = e.target.value;
                setNewPassword({ ...newPassword, value: newPasswordValue });
                setIsNewPasswordValid(
                  newPasswordValue.length === 0 || newPasswordValue.length >= 8
                );
                setIsConfirmPasswordValid(
                  newPasswordValue === confirmPassword.value
                );
              }}
              onBlur={() => {
                setNewPassword({ ...newPassword, isTouched: true });
              }}
              placeholder="New Password"
              className="form-control"
            />
            <label htmlFor="floatingInput">
              New Password{" "}
              <sup>{newPassword.isTouched && !isNewPasswordValid && "*"}</sup>
            </label>
            {newPassword.isTouched &&
              newPassword.value.length < 8 &&
              newPassword.value.length > 0 && <PasswordErrorMessage />}
          </div>

          <div className="form-floating my-3">
            <input
              value={confirmPassword.value}
              type="password"
              onChange={(e) => {
                const newConfirmPasswordValue = e.target.value;
                setConfirmPassword({
                  ...confirmPassword,
                  value: newConfirmPasswordValue,
                });
                setIsConfirmPasswordValid(
                  newConfirmPasswordValue === newPassword.value
                );
              }}
              onBlur={() => {
                setConfirmPassword({ ...confirmPassword, isTouched: true });
              }}
              placeholder="Confirm Password"
              className="form-control"
            />
            <label htmlFor="floatingInput">
              Confirm Password{" "}
              <sup>
                {confirmPassword.isTouched && !isConfirmPasswordValid && "*"}
              </sup>
            </label>
            {confirmPassword.isTouched &&
              confirmPassword.value !== newPassword.value && (
                <ConfirmPasswordErrorMessage />
              )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 mb-3"
            style={containerStyle}
            disabled={!getIsFormValid()}
          >
            Update Profile
          </button>
        </form>
      </div>
    );
}

export default EditProfile;
