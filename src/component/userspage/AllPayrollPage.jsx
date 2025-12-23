import React, { useEffect, useState } from 'react';
import UserService from '../service/UserService';
import { useNavigate } from 'react-router-dom';
import '../../styles/AllPayrollPage.css';


const AllPayrollsPage = () => {
  
    const [payrolls, setPayrolls] = useState([]);
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [loading, setLoading] = useState(true); 
    const navigate = useNavigate();
    

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token || !UserService.isAdmin()) {
                    navigate("/login");
                    return;
                }

               
                const data = await UserService.getAllPayrolls(token, year, month);
                console.log("Payroll data received:", data); //for debug
                setPayrolls(data);
                setLoading(false);
            } catch (error) {
                console.error("Error loading payrolls:", error);
                setLoading(false);
            }
        };

        fetchAll();
    }, [navigate, year, month]);

    const handleRowClick = (teacherId) => {
        navigate(`/admin/view-payroll/${teacherId}/${year}/${month}`);
    };
    

    return (
        <div className="all-payrolls-container">
            <h2>All Teachers Payrolls</h2>
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
                <button
                    className="search-button"
                    onClick={() => {
                        setLoading(true);
                        console.log("Search clicked with params:", { year, month }); // For dubg
                        UserService.getAllPayrolls(localStorage.getItem('token'), year, month)
                            .then(data => {
                                console.log("Payroll data received:", data); // for debug                            setPayrolls(data);
                                setLoading(false);
                            })
                            .catch(error => {
                                console.error("Error loading payrolls:", error);
                                setLoading(false);
                            });
                    }}
                >
                    Search
                </button>
            </div>
            <div className="export-buttons">
                <button
                    className="btn-export"
                    onClick={async () => {
                        const token = localStorage.getItem('token');
                        await UserService.exportAllPayrollExcel(token, year, month);
                    }}
                    disabled={loading || payrolls.length === 0}
                >
                    Export Excel
                </button>
                <button
                    className="btn-export"
                    onClick={async () => {
                        const token = localStorage.getItem('token');
                        await UserService.exportAllPayrollCSV(token, year, month);
                    }}
                    disabled={loading || payrolls.length === 0}
                >
                    Export CSV
                </button>
            </div>
            <table className="payroll-table">
                <thead>
                    <tr>
                        <th className="payroll-th">ID</th>
                        <th className="payroll-th">Teacher Name</th>
                        <th className="payroll-th">Email</th>
                        <th className="payroll-th">Year</th>
                        <th className="payroll-th">Month</th>
                        <th className="payroll-th">Total Credits</th>
                        <th className="payroll-th">Credit Rate</th>
                        <th className="payroll-th">Gross Salary</th>
                        <th className="payroll-th">Tax</th>
                        <th className="payroll-th">Net Salary</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="10" className="text-center text-gray-600">
                                Loading payroll data...
                            </td>
                        </tr>
                    ) : payrolls.length > 0 ? (
                        payrolls.map((payroll, index) => (
                            <tr key={index} onClick={() => handleRowClick(payroll.teacher?.id || payroll.teacherId)}>
                                <td className="payroll-td">{payroll.id}</td>
                                <td className="payroll-td">{payroll.teacher?.name || 'N/A'}</td>
                                <td className="payroll-td">{payroll.teacher?.email || 'N/A'}</td>
                                <td className="payroll-td">{payroll.year}</td>
                                <td className="payroll-td">{payroll.month}</td>
                                <td className="payroll-td">{payroll.totalCredits}</td>
                                <td className="payroll-td">{payroll.creditRate}</td>
                                <td className="payroll-td">{payroll.grossSalary}</td>
                                <td className="payroll-td">{payroll.tax}</td>
                                <td className="payroll-td">{payroll.netSalary}</td>
                            </tr>
                        )) 
                    ) : (
                        <tr>
                            <td colSpan="10" className="text-center text-red-600">
                                No payroll records found for this year and month.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AllPayrollsPage;