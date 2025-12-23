import React, { useEffect, useState } from 'react';
import UserService from '../service/UserService';
import '../../styles/MyPayrollPage.css';

function MyPayrollPage() {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const token = localStorage.getItem('token');

  useEffect(() => {
    UserService.getMyPayroll(token, year, month)
      .then(data => {
        setPayrolls(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching payroll:', error);
        setLoading(false);
      });
  }, [year, month]);

  const handleExportExcel = async () => {
    try {
      await UserService.exportMyPayrollExcel(token, year, month);
    } catch (err) {
      alert("Error downloading Excel: " + (err.message || "Failed to export"));
    }
  };

  const handleExportCSV = async () => {
    try {
      await UserService.exportMyPayrollCSV(token, year, month);
    } catch (err) {
      alert("Error downloading CSV: " + (err.message || "Failed to export"));
    }
  };

  return (
    <div className="my-payroll-container">
      <h2>My Payroll</h2>

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
            UserService.getMyPayroll(token, year, month)
              .then(data => {
                setPayrolls(data);
                setLoading(false);
              })
              .catch(error => {
                console.error('Error fetching payroll:', error);
                setLoading(false);
              });
          }}
        >
          Search
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Month</th>
            <th>Year</th>
            <th>Credits</th>
            <th>Credit Rate</th>
            <th>Gross</th>
            <th>Tax</th>
            <th>Net</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="9" className="text-center text-gray-600">Loading payroll data...</td>
            </tr>
          ) : payrolls.length > 0 ? (
            payrolls.map((p, index) => (
              <tr key={index}>
                <td>{p.teacher?.name}</td>
                <td>{p.teacher?.email}</td>
                <td>{p.month}</td>
                <td>{p.year}</td>
                <td>{p.totalCredits}</td>
                <td>{p.creditRate}</td>
                <td>{p.grossSalary}</td>
                <td>{p.tax}</td>
                <td>{p.netSalary}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center text-red-600">No payroll records found for this year and month.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MyPayrollPage;