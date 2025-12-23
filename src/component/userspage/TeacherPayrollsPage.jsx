import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserService from "../service/UserService";
import "../../styles/MyPayrollPage.css"; // reuse same table styles

function TeacherPayrollsPage() {
  const { teacherId, year, month } = useParams();
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    UserService.getPayrollByTeacherId(teacherId, year, month, token)
      .then((data) => setPayrolls(data))
      .catch((err) => console.error("Error fetching payroll:", err))
      .finally(() => setLoading(false));
  }, [teacherId, year, month]);

  return (
    <div className="my-payroll-container">
      <h2>Teacher Payroll</h2>

      {loading ? (
        <p>Loading...</p>
      ) : payrolls.length === 0 ? (
        <p>No payroll found for this month.</p>
      ) : (
        <>
          <div className="export-buttons">
            <button
              className="btn-export"
              onClick={async () => {
                try {
                  const token = localStorage.getItem("token");
                  await UserService.exportPayrollExcelByTeacherId(teacherId, year, month, token);
                } catch (err) {
                  alert("Error downloading Excel: " + (err.message || "Failed to export"));
                }
              }}
            >
              Export to Excel
            </button>

            <button
              className="btn-export"
              onClick={async () => {
                try {
                  const token = localStorage.getItem("token");
                  await UserService.exportPayrollCsvByTeacherId(teacherId, year, month, token);
                } catch (err) {
                  alert("Error downloading CSV: " + (err.message || "Failed to export"));
                }
              }}
            >
              Export to CSV
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
              {payrolls.map((p, i) => (
                <tr key={i}>
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
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default TeacherPayrollsPage;