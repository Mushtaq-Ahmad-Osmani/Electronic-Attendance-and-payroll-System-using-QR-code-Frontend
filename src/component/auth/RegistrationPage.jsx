import React, { useState } from 'react';
import UserService from '../service/UserService';
import { useNavigate } from 'react-router-dom';
import '../../styles/RegistrationPage.css';
import NotificationDialog from '../common/NotificationDialog';

function RegistrationPage() {
    const navigate = useNavigate();
    const [notification, setNotification] = useState({
        isOpen: false,
        message: '',
        isSuccess: false
    });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'User',
        phone: '',
        gender: '',
        credits: 0,
        creditRate: 0,
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setFormData({
            ...formData,
            [name]: newValue,
        });
        if (name === 'role') {
            console.log(`role changed to: ${newValue}`);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form data submitted:', formData);

        const password = formData.password;

        if (password.length < 5) {
            setNotification({
                isOpen: true,
                message: 'Password must be at least 5 characters long.',
                isSuccess: false
            });
            return;
        }

        const hasUppercase = /[A-Z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (!hasUppercase || !hasSpecialChar) {
            setNotification({
                isOpen: true,
                message: 'Password must contain at least one uppercase letter and one special character.',
                isSuccess: false
            });
            return;
        }

        try {
            const token = localStorage.getItem('token') || '';
            const response = await UserService.register(formData, token);

            if (response.statusCode === 200) {
                setNotification({
                    isOpen: true,
                    message: response.message || 'User registered successfully. Please check your email for verification.',
                    isSuccess: true
                });
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    role: 'User',
                    phone: '',
                    gender: '',
                    credits: 0,
                    creditRate: 0,
                });
                setTimeout(() => {
                    navigate('/admin/user-management');
                }, 2000);
            } else {
                setNotification({
                    isOpen: true,
                    message: response.error || 'Registration failed.',
                    isSuccess: false
                });
            }
        } catch (error) {
            console.error('Error registering user:', error);
            setNotification({
                isOpen: true,
                message: error.message || 'An error occurred while registering user.',
                isSuccess: false
            });
        }
    };

    const closeNotification = () => {
        setNotification({ isOpen: false, message: '', isSuccess: false });
    };

    const handleRetry = () => {
        closeNotification();
        handleSubmit({ preventDefault: () => {} });
    };

    return (
        <div className="reg-wrapper">
            <h2>Registration</h2>
            <form onSubmit={handleSubmit} className="reg-form">
                <div className="form-field">
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter your Name" required/>
                </div>
                <div className="form-field">
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Enter your Email" required />
                </div>
                <div className="form-field">
                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Enter your Password" required />
                </div>
                <div className="form-field">
                    <label>Role:</label>
                    <select name="role" value={formData.role} onChange={handleInputChange} required>
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                </div>
                <div className="form-field">
                    <label>Phone:</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Enter your Phone number" required />
                </div>
                <div className="form-field">
                    <label>Credits:</label>
                    <input type="number" name="credits" value={formData.credits} onChange={handleInputChange} placeholder="Enter credits" />
                </div>
                <div className="form-field">
                    <label>Credit Rate:</label>
                    <input type="number" name="creditRate" value={formData.creditRate} onChange={handleInputChange} placeholder="Enter credit rate" />
                </div>
                <div className="form-radio-group">
                    <label>Gender:</label>
                    <label className="radio-option">
                        <input
                            type="radio"
                            name="gender"
                            value="male"
                            checked={formData.gender === "male"}
                            onChange={handleInputChange}
                            required
                        />
                        Male
                    </label>
                    <label className="radio-option">
                        <input
                            type="radio"
                            name="gender"
                            value="female"
                            checked={formData.gender === "female"}
                            onChange={handleInputChange}
                            required
                        />
                        Female
                    </label>
                </div>
                <button type="submit" className="reg-btn">Register</button>
                <button 
                    type="button" 
                    className="cancel-btn" 
                    onClick={() => navigate('/admin/user-management')}
                >
                    Cancel
                </button>
            </form>
            <NotificationDialog
                isOpen={notification.isOpen}
                message={notification.message}
                isSuccess={notification.isSuccess}
                onClose={closeNotification}
                onRetry={notification.isSuccess ? null : handleRetry}
            />
        </div>
    );
}

export default RegistrationPage;