import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../service/UserService';
import '../../styles/UpdatePassword.css';

function UpdatePassword() {
    const navigate = useNavigate();
    const [passwordData, setPasswordData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const validatePassword = (password) => {
        if (!password) {
            return 'Password cannot be empty';
        }
        if (password.length < 5) {
            return 'Password must be at least 5 characters long';
        }
        if (!/[A-Z]/.test(password)) {
            return 'Password must contain at least one uppercase letter';
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return 'Password must contain at least one special character';
        }
        return null;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.password !== passwordData.confirmPassword) {
            setError('Password and confirm password do not match!');
            return;
        }
        const passwordError = validatePassword(passwordData.password);
        if (passwordError) {
            setError(passwordError);
            return;
        }
        setShowConfirmModal(true);
    };

    const handleConfirmUpdate = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await UserService.updateUserPassword(passwordData, token);
           
            if (response.statusCode === 200) {
           
                if (response.token) {
                    localStorage.setItem('token', response.token);
                }
                setShowConfirmModal(false);
                navigate('/profile', { state: { showSuccessNotification: true } });
            } else {
                setShowConfirmModal(false);
                setError(response.message || 'Error updating password');
            }
        } catch (error) {
            setShowConfirmModal(false);
            setError(
                error.response?.data?.message ||
                'Error updating password: ' + error.message
            );
        }
    };

    const handleCancelUpdate = () => {
        setShowConfirmModal(false);
        setError('');
    };

    return (
        <div className="password-update-wrapper1">
            <div className="update-form-section1">
                <h2>Update Password</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label>New Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={passwordData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label>Confirm Password:</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-btn">Update Password</button>
                </form>
            </div>
            {showConfirmModal && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal">
                        <h3>Confirm Password Update</h3>
                        <p>Do you want to update your password?</p>
                        <div className="modal-buttons">
                            <button className="modal-btn confirm-btn" onClick={handleConfirmUpdate}>Yes</button>
                            <button className="modal-btn cancel-btn" onClick={handleCancelUpdate}>No</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UpdatePassword;