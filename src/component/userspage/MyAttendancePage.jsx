import React, { useEffect, useState } from 'react';
import UserService from '../service/UserService';
import { useNavigate } from 'react-router-dom';
import '../../styles/MyAttendancePage.css';

const MyAttendancePage = () => {
    const [attendances, setAttendances] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAttendances = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate("/login");
                    return;
                }

                const data = await UserService.getMyAttendances(token);
                setAttendances(data);
            } catch (error) {
                console.error("Failed to fetch attendances:", error);
            }
        };

        fetchAttendances();
    }, [navigate]);

    return (
        
             <div className="my-attendance-container">
            <h2>My Attendances</h2>
            
            <table className="attendance-table">
                <thead>
                    <tr>
                        <th className="attendance-th">Date</th>
                        <th className="attendance-th">Check-in</th>
                        <th className="attendance-th">Check-out</th>
                        <th className="attendance-th">Expected Credits</th>
                        <th className="attendance-th">Actual Credits</th>
                        <th className="attendance-th">Absent</th>
                    </tr>
                </thead>
                <tbody>
                    {attendances.map((att, index) => (
                        <tr>
                            <td className="attendance-td">{att.attendanceDate}</td>
                            <td className="attendance-td">{att.checkInTime || "-"}</td>
                            <td className="attendance-td">{att.checkOutTime || "-"}</td>
                            <td className="attendance-td">{att.expectedCredits}</td>
                            <td className="attendance-td">{att.actualCredits}</td>
                            <td className="attendance-td">{att.absent ? "Yes" : "No"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MyAttendancePage;