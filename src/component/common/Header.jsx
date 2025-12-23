import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaSignOutAlt } from 'react-icons/fa';
import UserService from '../service/UserService';
import logo from '../../styles/Assets/kateb_logo.png';
import '../../styles/Header.css';

function Header() {
  const location = useLocation();
  const [userName, setUserName] = useState(null);
  const [userProfilePic, setUserProfilePic] = useState(null);

  useEffect(() => {
    if (UserService.isAuthenticated()) {
      const token = localStorage.getItem('token');
      //sending request to get api for profile 
      UserService.getYourProfile(token)
        .then((userData) => {
          if (userData.teachers) {
            setUserName(userData.teachers.name);
            return UserService.getProfilePicture(userData.teachers.id, token);
          }
          return null;
        })
      //sending request to get api for profile picture
        .then((profilePicUrl) => {
          if (profilePicUrl) {
            console.log('Profile picture URL:', profilePicUrl); // Debug the URL
            setUserProfilePic(profilePicUrl);
          }
        })
        .catch((err) => console.error('Error fetching profile data:', err));
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
          <Link to="/profile">
            <img src={userProfilePic} alt="Profile" className="profile-img" onError={(e) => console.log('Profile image failed to load:', e.target.src)} />
          </Link>
        ) : (
          <Link to="/profile">
            <div className="default-avatar">
              {userName ? userName.charAt(0).toUpperCase() : 'U'}
            </div>
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;