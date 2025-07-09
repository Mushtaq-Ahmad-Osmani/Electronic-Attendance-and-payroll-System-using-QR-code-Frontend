import React, { useState } from 'react';
import UserService from '../service/UserService';
import '../../styles/AllPayrollPage.css';

function AllPayrollsPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [payrolls, setPayrolls] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searched, setSearched] = useState(false);

  
  const handleSearch = async () => {
    const token = localStorage.getItem('token');
    try {
      const data = await UserService.getAllPayrolls(year, month, token);
      setPayrolls(data);
      setSearched(true);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPayrolls = payrolls.filter(p =>
    p.teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
   <div className="all-payrolls-container">
      <h2>All Teacher Payrolls</h2>
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
          placeholder="Search by name or email"
          className="search-input"
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>
      <table className="payroll-table">
        <thead>
          <tr>
            <th className="payroll-th">Name</th>
            <th className="payroll-th">Email</th>
            <th className="payroll-th">Month</th>
            <th className="payroll-th">Credit</th>
            <th className="payroll-th">Credit Rate</th>
            <th className="payroll-th">Net Salary</th>
          </tr>
        </thead>
        <tbody>
          {!searched ? (
            <tr>
              <td colSpan="6" className="text-center text-gray-600">
                Please enter a year and month, then click Search to view payrolls.
              </td>
            </tr>
          ) : filteredPayrolls.length > 0 ? (
            filteredPayrolls.map((p, index) => (
              <tr key={index}>
                <td className="payroll-td">{p.teacher.name}</td>
                <td className="payroll-td">{p.teacher.email}</td>
                <td className="payroll-td">{p.month}/{p.year}</td>
                <td className="payroll-td">{p.totalCredits}</td>
                <td className="payroll-td">{p.creditRate}</td>
                <td className="payroll-td">{p.netSalary}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center text-red-600">
                No payrolls found for this year/month!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AllPayrollsPage;