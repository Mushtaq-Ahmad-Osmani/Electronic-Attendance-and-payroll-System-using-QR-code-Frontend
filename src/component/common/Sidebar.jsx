import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import UserService from "../service/UserService";
import { FaHome, FaUser, FaUsers, FaSignOutAlt, FaPlusCircle, FaBars, FaMoneyBill, FaFileInvoiceDollar, FaClipboardCheck, FaListAlt } from 'react-icons/fa'; 
import { RiCalendarScheduleFill } from "react-icons/ri"
import { MdQrCodeScanner } from "react-icons/md";
import '../../styles/Sidebar.css';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true); 
    const location = useLocation();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);  
    };

    if (location.pathname === "/login" || location.pathname === "/") {
        return null;
    }

    return (
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header">
                <button className="toggle-btn" onClick={toggleSidebar}>
                    <FaBars className="toggle-icon" />
                </button>
            </div>

            <div className="sidebar-links">
                {UserService.isAuthenticated() && (
                    <div className="sidebar-link">
                        <Link to="/home" className={location.pathname === '/home' ? 'active' : ''}>
                            <FaHome className="icon" /> {isOpen && 'Home'}
                        </Link>
                    </div>
                )}
                {UserService.isAuthenticated() && (
                    <div className="sidebar-link">
                        <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>
                            <FaUser className="icon" /> {isOpen && 'Profile'}
                        </Link>
                    </div>
                )}
                {UserService.isAuthenticated() && (
                    <div className="sidebar-link">
                        <Link to="/my-attendance" className={location.pathname === '/my-attendance' ? 'active' : ''}>
                            <FaClipboardCheck className="icon" /> {isOpen && 'My Attendance'}
                        </Link>
                    </div>
                )}
                {UserService.isAuthenticated() && (
                    <div className="sidebar-link">
                        <Link to="/my-payroll" className={location.pathname === '/my-payroll' ? 'active' : ''}>
                            <FaMoneyBill className="icon" /> {isOpen && 'My Payroll'}
                        </Link>
                    </div>
                )}
                {UserService.isAdmin() && (
                    <div className="sidebar-link">
                        <Link to="/scanner" className={location.pathname === '/scanner' ? 'active' : ''}>
                            <MdQrCodeScanner className="icon" /> {isOpen && 'QR Scanner'}
                        </Link>
                    </div>
                )}
                {UserService.isAdmin() && (
                    <div className="sidebar-link">
                        <Link to="/admin/user-management" className={location.pathname === '/admin/user-management' ? 'active' : ''}>
                            <FaUsers className="icon" /> {isOpen && 'User Management'}
                        </Link>
                    </div>
                )}
                {UserService.isAdmin() && (
                    <div className="sidebar-link">
                        <Link to="/admin/all-attendances" className={location.pathname === '/admin/all-attendances' ? 'active' : ''}>
                            <FaListAlt className="icon" /> {isOpen && 'All Attendances'}
                        </Link>
                    </div>
                )}
                {UserService.isAdmin() && (
                    <div className="sidebar-link">
                        <Link to="/admin/all-payrolls" className={location.pathname === '/admin/all-payrolls' ? 'active' : ''}>
                            <FaFileInvoiceDollar className="icon" /> {isOpen && 'All Payrolls'}
                        </Link>
                    </div>
                )}
                {UserService.isAdmin() && (
                    <div className="sidebar-link">
                        <Link to="/admin/create-notification" className={location.pathname === '/admin/create-notification' ? 'active' : ''}>
                            <FaPlusCircle className="icon" /> {isOpen && 'Create Notification'}
                        </Link>
                    </div>
                )}
                {UserService.isAdmin() && (
                    <div className="sidebar-link">
                        <Link to="/schedules" className={location.pathname === '/schedules' ? 'active' : ''}>
                            <RiCalendarScheduleFill  className="icon" /> {isOpen && 'Teacher Schedules'} 
                        </Link>
                    </div>
                )}
                {UserService.isAuthenticated() && (
                    <div className="sidebar-link">
                        <Link to="/" onClick={UserService.logout} className={location.pathname === '/' ? 'active' : ''}>
                            <FaSignOutAlt className="icon" /> {isOpen && 'Logout'}
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;