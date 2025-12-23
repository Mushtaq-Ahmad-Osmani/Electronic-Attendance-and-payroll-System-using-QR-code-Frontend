import React, { useEffect, useState } from 'react';
import UserService from '../service/UserService';
import { useNavigate } from 'react-router-dom';
import '../../styles/AllAttendancePage.css';

const AllAttendancesPage = () => {
    const [attendances, setAttendances] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchAllAttendances = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token || !UserService.isAdmin()) {
                navigate("/login");
                return;
            }

            const { data, error } = await UserService.getAllAttendances(token, year, month);
            setAttendances(data);
            setErrorMessage(error);
            setLoading(false);
        } catch (error) {
            setErrorMessage('Error loading attendances. Please try again.');
            setAttendances([]);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllAttendances();
    }, [navigate, year, month]);

    const handleRowClick = (userId) => {
        navigate(`/admin/view-attendance/${userId}/${year}/${month}`);
    };

    const filteredAttendances = attendances.filter(att =>
        att.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        att.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="all-attendances-container">
            <h2>All Teachers Attendances</h2>
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
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or email..."
                    className="search-input"
                />
                <button
                    className="search-button"
                    onClick={fetchAllAttendances}
                >
                    Search
                </button>
            </div>
            <div className="export-buttons">
                <button
                    className="btn-export"
                    onClick={async () => {
                        try {
                            const token = localStorage.getItem('token');
                            await UserService.exportAllAttendanceExcel(token, year, month);
                        } catch (error) {
                            setErrorMessage(error.message || 'Error exporting to Excel');
                        }
                    }}
                    disabled={loading || filteredAttendances.length === 0}
                >
                    Export Excel
                </button>
                <button
                    className="btn-export"
                    onClick={async () => {
                        try {
                            const token = localStorage.getItem('token');
                            await UserService.exportAllAttendanceCSV(token, year, month);
                        } catch (error) {
                            setErrorMessage(error.message || 'Error exporting to CSV');
                        }
                    }}
                    disabled={loading || filteredAttendances.length === 0}
                >
                    Export CSV
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
                    ) : filteredAttendances.length > 0 ? (
                        filteredAttendances.map((att, index) => (
                            <tr key={index} onClick={() => handleRowClick(att.user.id)}>
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
};

export default AllAttendancesPage;