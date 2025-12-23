
import React, { useEffect, useState } from 'react';
import UserService from '../service/UserService';
import '../../styles/TeacherSchedulePage.css';

function TeacherSchedulePage() {
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [formData, setFormData] = useState({
    teacherId: '',
    dayOfWeek: '',
    startTime: '',
    endTime: '',
    expectedCredits: '',
  });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!UserService.isAuthenticated()) {
      setError('Please log in to access this page.');
      return;
    }
    if (!UserService.adminOnly()) {
      setError('Only admins can access this page.');
      return;
    }
    fetchSchedules(token);
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 7000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const fetchSchedules = async (token) => {
    try {
      const data = await UserService.getAllSchedules(token);
      console.log('Fetched schedules:', data);
      setSchedules(data);
    } catch (err) {
      console.error('Error fetching schedules:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.error || err.message || 'Failed to fetch schedules.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      if (selectedSchedule) {
        await UserService.updateSchedule(selectedSchedule.id, formData, token);
        setMessage('Schedule updated successfully.');
      } else {
        await UserService.createSchedule(formData, token);
        setMessage('Schedule created successfully.');
      }
      fetchSchedules(token);
      setFormData({ teacherId: '', dayOfWeek: '', startTime: '', endTime: '', expectedCredits: '' });
      setSelectedSchedule(null);
    } catch (err) {
      console.error('Error saving schedule:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.error || err.message || 'Failed to save schedule.');
    }
  };

  const handleEdit = (schedule) => {
    setSelectedSchedule(schedule);
    setFormData({
      teacherId: schedule.teacher.id,
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      expectedCredits: schedule.expectedCredits,
    });
  };

  const confirmDelete = (scheduleId) => {
    setScheduleToDelete(scheduleId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await UserService.deleteSchedule(scheduleToDelete, token);
      console.log('Delete schedule response:', response);
      fetchSchedules(token);
      setMessage('Schedule deleted successfully.');
    } catch (err) {
      console.error('Error deleting schedule:', err.response ? err.response.data : err.message);
      let errorMessage = err.response?.data?.error || err.message || 'Failed to delete schedule.';
      if (errorMessage.includes('foreign key constraint fails')) {
        errorMessage = 'Cannot delete this schedule because it is associated with attendance records. Please clear or reassign related attendance records first.';
      }
      setError(errorMessage);
    }
    setShowDeleteModal(false);
    setScheduleToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setScheduleToDelete(null);
  };

  return (
    <div className="teacher-schedule-container">
      <h2>Teacher Schedules</h2>
      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}
      {!UserService.isAuthenticated() || !UserService.adminOnly() ? (
        <div>{error}</div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="schedule-form">
            <div className="form-group">
              <label>Teacher ID:</label>
              <input
                type="number"
                name="teacherId"
                value={formData.teacherId}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Day of Week:</label>
              <select name="dayOfWeek" value={formData.dayOfWeek} onChange={handleInputChange} required>
                <option value="">Select Day</option>
                {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Start Time:</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>End Time:</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Expected Credits:</label>
              <input
                type="number"
                name="expectedCredits"
                value={formData.expectedCredits}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit">{selectedSchedule ? 'Update Schedule' : 'Add Schedule'}</button>
          </form>

          <table className="schedule-table">
            <thead>
              <tr>
                <th>Teacher ID</th>
                <th>Day</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Credits</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {schedules.length > 0 ? (
                schedules.map((schedule) => (
                  <tr key={schedule.id}>
                    <td>{schedule.teacher.id}</td>
                    <td>{schedule.dayOfWeek}</td>
                    <td>{schedule.startTime}</td>
                    <td>{schedule.endTime}</td>
                    <td>{schedule.expectedCredits}</td>
                    <td>
                      <button onClick={() => handleEdit(schedule)}>Edit</button>
                      <button onClick={() => confirmDelete(schedule.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">No schedules found.</td>
                </tr>
              )}
            </tbody>
          </table>

          {showDeleteModal && (
            <div className="custom-modal-overlay">
              <div className="custom-modal">
                <h3>Confirm Deletion</h3>
                <p>Are you sure you want to delete this schedule?</p>
                <div className="modal-buttons">
                  <button className="modal-btn confirm-btn" onClick={handleConfirmDelete}>Yes</button>
                  <button className="modal-btn cancel-btn" onClick={handleCancelDelete}>No</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default TeacherSchedulePage;
