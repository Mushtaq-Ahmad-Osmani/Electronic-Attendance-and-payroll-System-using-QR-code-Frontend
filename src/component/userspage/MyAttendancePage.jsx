import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../service/UserService';
import '../../styles/MyAttendancePage.css';

function MyAttendancePage() {
    const [attendances, setAttendances] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const fetchMyAttendances = async () => {
        try {
            if (!token || !UserService.isAuthenticated()) {
                navigate('/login');
                return;
            }
            const { data, error } = await UserService.getMyAttendances(token, year, month);
            setAttendances(data);
            setErrorMessage(error);
            setLoading(false);
        } catch (error) {
            setErrorMessage('Error loading attendance. Please try again.');
            setAttendances([]);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyAttendances();
    }, [navigate, year, month]);

    const handleExportExcel = async () => {
        try {
            await UserService.exportMyAttendanceExcel(token, year, month);
            setErrorMessage(null);
        } catch (error) {
            setErrorMessage(error.message || 'Error exporting to Excel');
        }
    };

    const handleExportCSV = async () => {
        try {
            await UserService.exportMyAttendanceCSV(token, year, month);
            setErrorMessage(null);
        } catch (error) {
            setErrorMessage(error.message || 'Error exporting to CSV');
        }
    };

    return (
        <div className="my-attendance-container">
            <h2>My Attendance</h2>
            <div className="search-container">
                <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    placeholder="Year"
                    className="year-input"
                />
                <input
                    type="number"
                    value={month}
                    onChange={(e) => setMonth(Number(e.target.value))}
                    placeholder="Month"
                    className="month-input"
                />
                <button className="search-button" onClick={fetchMyAttendances}>
                    Search
                </button>
            </div>
            <div className="export-buttons">
                <button
                    className="btn-export"
                    onClick={handleExportExcel}
                    disabled={loading || attendances.length === 0}
                >
                    Export to Excel
                </button>
                <button
                    className="btn-export"
                    onClick={handleExportCSV}
                    disabled={loading || attendances.length === 0}
                >
                    Export to CSV
                </button>
            </div>
            <table className="attendance-table">
                <thead>
                    <tr>
                        <th className="attendance-th">Name</th>
                        <th className="attendance-th">Email</th>
                        <th className="attendance-th">Date</th>
                        <th className="attendance-th">Check-in</th>
                        <th className="attendance-th">Check-out</th>
                        <th className="attendance-th">Expected Cr.</th>
                        <th className="attendance-th">Actual Cr.</th>
                        <th className="attendance-th">Absent</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="8" className="text-center text-gray-600">
                                Loading attendance data...
                            </td>
                        </tr>
                    ) : errorMessage ? (
                        <tr>
                            <td colSpan="8" className="text-center text-red-600">
                                {errorMessage}
                            </td>
                        </tr>
                    ) : attendances.length > 0 ? (
                        attendances.map((att, index) => (
                            <tr key={index}>
                                <td className="attendance-td">{att.userName}</td>
                                <td className="attendance-td">{att.email}</td>
                                <td className="attendance-td">{att.attendanceDate || ""}</td>
                                <td className="attendance-td">{att.checkInTime || "-"}</td>
                                <td className="attendance-td">{att.checkOutTime || "-"}</td>
                                <td className="attendance-td">{att.expectedCredits}</td>
                                <td className="attendance-td">{att.actualCredits}</td>
                                <td className="attendance-td">{att.absent ? "Yes" : "No"}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center text-red-600">
                                No attendance records found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default MyAttendancePage;