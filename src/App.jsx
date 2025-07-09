import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation,} from "react-router-dom";
import LoginPage from "./component/auth/LoginPage";
import RegistrationPage from "./component/auth/RegistrationPage";
import FooterComponent from "./component/common/Footer";
import ProfilePage from "./component/userspage/ProfilePage";
import UpdateUser from "./component/userspage/UpdateUsers";
import UserService from "./component/service/UserService";
import UserManagementPage from "./component/userspage/UserManagementPage";
import Sidebar from "./component/common/Sidebar";
import Header from "./component/common/Header";
import QrScanner from "./component/auth/QrScanner";
import MyPayrollPage from "./component/userspage/MyPayrollPage";
import AllPayrollsPage from "./component/userspage/AllPayrollPage";
import AllAttendancesPage from "./component/userspage/AllAttendancePage";
import MyAttendancePage from "./component/userspage/MyAttendancePage";
import NotificationsPage from "./component/userspage/NotificationsPage";
import CreateNotificationPage from "./component/userspage/CreateNotificationPage";
import TeacherSchedulePage from './component/userspage/TeacherSchedulePage';

import './App.css';
import HomePage from "./component/userspage/HomePage";

function App() {
  
  return (
    <BrowserRouter>
      <MainLayout />  
    </BrowserRouter>
    
      
  );
}

function MainLayout() {
    const location = useLocation();
// Determine if sidebar and header should be shown (exclude login and root pages)
    const showSidebarAndHeader = location.pathname !== "/login" && location.pathname !== "/";

    return (
        <div className="App">
            {showSidebarAndHeader && <Sidebar />}
            {showSidebarAndHeader && <Header />}
            
            <div className={`content ${showSidebarAndHeader ? 'with-sidebar' : ''}`}>
            <Routes>
            <Route exact path="/" element={<LoginPage />} />
            <Route exact path="/login" element={<LoginPage />} />
            <Route exact path="/profile" element={<ProfilePage />} />
            
            <Route path="/my-payroll" element={<MyPayrollPage />} />
            <Route path="/my-attendance" element={<MyAttendancePage />} />
           <Route path="/notifications" element={<NotificationsPage />} />
           <Route path="/schedules" element={<TeacherSchedulePage />} />
           <Route exact path="/Home" element={<HomePage />} />

            {UserService.adminOnly() && (
                <>
                    <Route path="/admin/all-payrolls" element={<AllPayrollsPage />} />
                    <Route path="/admin/all-attendances" element={<AllAttendancesPage />} />
                    <Route exact path="/scanner" element={<QrScanner />} />
                    <Route path="/register" element={<RegistrationPage />} />
                    <Route path="/admin/user-management" element={<UserManagementPage />} />
                    <Route path="/update-user/:userId" element={<UpdateUser />} />
                    <Route path="/admin/create-notification" element={<CreateNotificationPage />} />
                     
                 

                </>
            )}
            {/* Catch-all route for invalid paths */}
            <Route path="*" element={<Navigate to="/login/" />} />
        </Routes>
            </div>

            {location.pathname === "/login" && <FooterComponent />}
        </div>
    );
}

export default App;