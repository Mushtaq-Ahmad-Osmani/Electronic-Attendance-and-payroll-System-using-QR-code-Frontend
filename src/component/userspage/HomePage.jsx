import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../service/UserService';
import '../../styles/HomePage.css';
import logo from '../../styles/Assets/kateb_logo.png';

const HomePage = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await UserService.getYourProfile(token);
          const role = response.teachers?.role || null; 
          setUserRole(role);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };
    fetchUserRole();
  }, []);


  const renderContent = () => {
    if (!userRole) {
      return <p>Loading...</p>; 
    }

    return (
      <>
        <div className="banner">
          <img src={logo} alt="Kateb University Logo" className="home-logo" />
          <h1 className="banner-title">Welcome to Kateb Attendance System</h1>
          <p className="banner-subtitle">Track attendance and manage payroll effortlessly</p>
        </div>
        <div className="description">
          <p>
            {userRole === 'ADMIN'
              ? 'Manage users, track all attendance records, and generate payroll reports in one intuitive platform.'
              : 'Log your attendance and view payroll with easy.'}
          </p>
        </div>
        <div className="quick-links">
          <button className="link-button" onClick={() => navigate('/my-attendance')}>
            My Attendance
          </button>
          <button className="link-button" onClick={() => navigate('/my-payroll')}>
            My Payroll
          </button>
          {userRole === 'ADMIN' && (
            <>
              <button className="link-button" onClick={() => navigate('/admin/user-management')}>
                User Management
              </button>
              <button className="link-button" onClick={() => navigate('/scanner')}>
                QR Scanner
              </button>
              <button className="link-button" onClick={() => navigate('/admin/create-notification')}>
                Create Notification
              </button>
            </>
          )}
        </div>
      </>
    );
  };

  return <div className="home-container">{renderContent()}</div>;
};

export default HomePage;