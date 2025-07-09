import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../service/UserService";
import FooterComponent from "../common/Footer";
import { FaUserAlt, FaLock } from "react-icons/fa";
import "../../styles/LoginPage.css";
import logo from "../../styles/Assets/kateb_logo.png"; 

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
// Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setError(''); // Clear any existing errors

        try {
            const userData = await UserService.login(email, password);
            console.log(userData);

            if (userData && userData.token) {
            // Store token and role in localStorage if login is successful
                localStorage.setItem('token', userData.token);
                localStorage.setItem('role', userData.role);
                navigate('/home');
            } else {
                setError(userData?.message || "Invalid credentials");
            }

        } catch (error) {
            console.error("Login error:", error);
            // Set error message from response or a default message
            setError(error.response?.data?.message || "An error occurred. Please try again.");
            setTimeout(() => setError(''), 5000);
        }
    };

    return (
        
        <div className="auth-box">
            <div className="auth-wrapper">
                <div className="logo-section">
                    <img src={logo} alt="Kateb University Logo" className="auth-logo" />
                </div>

                <h2>Login</h2>
                {error && <p className="error-notice">{error}</p>}
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <FaUserAlt className="input-icon" />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <FaLock className="input-icon" />
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
            <FooterComponent />
        </div>
    );
}

export default LoginPage;