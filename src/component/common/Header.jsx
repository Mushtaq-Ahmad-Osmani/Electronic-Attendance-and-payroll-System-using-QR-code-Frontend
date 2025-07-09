import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaSignOutAlt } from 'react-icons/fa';
import UserService from "../service/UserService";
import logo from "../../styles/Assets/kateb_logo.png";
import '../../styles/Header.css';

function Header() {
    const location = useLocation();
    const [userName, setUserName] = useState(null);
    const [userProfilePic, setUserProfilePic] = useState(null);

    // Fetch user profile data on mount if authenticated
    useEffect(() => {
        if (UserService.isAuthenticated()) {
            UserService.getYourProfile(localStorage.getItem('token'))
                .then((userData) => {
                    setUserName(userData.name);
                    setUserProfilePic(userData.profilePic); 
                })
                .catch((err) => console.log(err));
        }
    }, []);

    return (
        <header className="header">
            <div className="logo">
                <Link to="https://kateb.edu.af/" className="logo-link">
                    <img src={logo} alt="Logo" className="logo-img" />
                    <h1 className="logo-text">Kateb University</h1>
                </Link>
            </div>

            <nav className="nav">
                <ul className="nav-list">
                    <li className="nav-item">
                        <Link to="/home" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                            <FaHome className="nav-icon" />
                            Home
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}>
                            <FaUser className="nav-icon" />
                            Profile
                        </Link>
                    </li>
                    {UserService.isAuthenticated() && (
                        <li className="nav-item">
                            <Link to="/notifications" className={`nav-link ${location.pathname === '/notifications' ? 'active' : ''}`}>
                                🔔 Notification
                            </Link>
                        </li>
                    )}
                    {UserService.isAuthenticated() && (
                        <li className="nav-item">
                            <Link to="/" onClick={UserService.logout} className="nav-link">
                                <FaSignOutAlt className="nav-icon" />
                                Logout
                            </Link>
                        </li>
                    )}
                </ul>
            </nav>

            <div className="user-profile">
                {userProfilePic ? (
                    <img src={userProfilePic} alt="Profile" className="profile-img" />
                ) : (
                    <div className="default-avatar">
                        {userName ? userName.charAt(0).toUpperCase() : 'U'} {/* Display first letter of name or 'U' */}
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;