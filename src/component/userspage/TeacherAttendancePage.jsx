import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserService from "../service/UserService";
import '../../styles/MyAttendancePage.css';

function TeacherAttendancePage() {
  const { teacherId, year, month } = useParams();
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    UserService.getAttendancesByTeacherId(teacherId, token, year, month)
      .then((data) => {
        const filteredData = data.filter(a => {
          if (!a.attendanceDate) return false;
          const date = new Date(a.attendanceDate);
          return date.getFullYear() === parseInt(year) && (date.getMonth() + 1) === parseInt(month);
        });
        setAttendances(filteredData);
      })
      .catch(error => {
        console.error("Error fetching attendances:", error);
      })
      .finally(() => setLoading(false));
  }, [teacherId, year, month]);

  const handleExportExcel = async () => {
    try {
      const token = localStorage.getItem("token");
      await UserService.exportTeacherAttendanceExcel(teacherId, token, year, month);
    } catch (err) {
      alert("Error downloading Excel: " + err.message);
    }
  };

  const handleExportCSV = async () => {
    try {
      const token = localStorage.getItem("token");
      await UserService.exportTeacherAttendanceCSV(teacherId, token, year, month);
    } catch (err) {
      alert("Error downloading CSV: " + err.message);
    }
  };

  return (
    <div className="my-payroll-container">
      <h2>Teacher Attendance Records</h2>

      {loading ? (
        <p>Loading...</p>
      ) : attendances.length === 0 ? (
        <p style={{ color: 'red' }}>No attendance records found for this teacher in this month.</p>
      ) : (
        <>
          <div className="export-buttons">
            <button
              className="btn-export"
              onClick={handleExportExcel}
            >
              Export to Excel
            </button>
            <button
              className="btn-export"
              onClick={handleExportCSV}
            >
              Export to CSV
            </button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Date</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Expected Cr</th>
                <th>Actual Credits</th>
                <th>Absent</th>

              </tr>
            </thead>
            <tbody>
              {attendances.map((a, i) => (
                <tr key={i}>
                  <td>{a.userName}</td>
                  <td>{a.email}</td>
                  <td>{a.attendanceDate}</td>
                  <td>{a.checkInTime || '-'}</td>
                  <td>{a.checkOutTime || '-'}</td>
                  <td>{a.expectedCredits}</td>
                  <td>{a.actualCredits}</td>
                  <td>{a.absent ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default TeacherAttendancePage;