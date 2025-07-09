import React, { useEffect, useState } from 'react';
import UserService from '../service/UserService';
import '../../styles/MyPayrollPage.css';

function MyPayrollPage() {
  const [payrolls, setPayrolls] = useState([]);

  // Fetch user's payroll on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    UserService.getMyPayroll(token, year, month)
      .then(data => setPayrolls(data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="my-payroll-container">
      <h2>Your Monthly Payroll</h2>
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Year</th>
            <th>Credit</th>
            <th>Credit Rate</th>
            <th>Gross Salary</th>
            <th>Tax</th>
            <th>Net Salary</th>
          </tr>
        </thead>
        <tbody>
          {payrolls.length > 0 ? (
            payrolls.map((p, index) => (
              <tr key={index}>
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
              <td colSpan="7" className="text-center text-gray-600">
                No payroll records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MyPayrollPage;