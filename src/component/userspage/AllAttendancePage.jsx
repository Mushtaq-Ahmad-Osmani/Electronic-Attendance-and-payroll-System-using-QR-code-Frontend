import React, { useEffect, useState } from 'react';
import UserService from '../service/UserService';
import { useNavigate } from 'react-router-dom';
import '../../styles/AllAttendancePage.css';
const AllAttendancesPage = () => {
    const [attendances, setAttendances] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // State for search term
    const [searched, setSearched] = useState(false);   // State to track if search has been performed
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token || !UserService.isAdmin()) {
                    navigate("/login");
                    return;
                }

                const data = await UserService.getAllAttendances(token);
                setAttendances(data);
                setSearched(true);
            } catch (error) {
                console.error("Error loading attendances", error);
            }
        };

        fetchAll();
    }, [navigate]);


    
    // Filter attendances based on search term
    const filteredAttendances = attendances.filter(att =>
        att.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        att.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="all-attendances-container">
            <h2>All Teachers Attendances</h2>
            <div className="search-container">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or email..."
                    className="search-input"
                />
                <button className="search-button" onClick={() => {}}>Search</button>
            </div>
            <table className="attendance-table">
                <thead>
                    <tr>
                        <th className="attendance-th">Name</th>
                        <th className="attendance-th">Email</th>
                        <th className="attendance-th">Date</th>
                        <th className="attendance-th">Check-in</th>
                        <th className="attendance-th">Check-out</th>
                        <th className="attendance-th">Expected Credits</th>
                        <th className="attendance-th">Actual Credits</th>
                        <th className="attendance-th">Absent</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredAttendances.length > 0 ? (
                        filteredAttendances.map((att, index) => (
                            <tr key={index}>
                                <td className="attendance-td">{att.userName}</td>
                                <td className="attendance-td">{att.email}</td>
                                <td className="attendance-td">{att.attendanceDate}</td>
                                <td className="attendance-td">{att.checkInTime || "-"}</td>
                                <td className="attendance-td">{att.checkOutTime || "-"}</td>
                                <td className="attendance-td">{att.expectedCredits}</td>
                                <td className="attendance-td">{att.actualCredits}</td>
                                <td className="attendance-td">{att.absent ? "Yes" : "No"}</td>
                            </tr>
                        ))
                    ) : (
                        searched && (
                            <tr>
                                <td colSpan="8" className="text-center text-red-600">
                                    ❌ No results found matching your search!
                                </td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AllAttendancesPage;