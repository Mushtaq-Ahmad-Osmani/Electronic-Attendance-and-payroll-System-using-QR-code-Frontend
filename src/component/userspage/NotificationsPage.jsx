import React, { useEffect, useState } from 'react';
import UserService from '../service/UserService';
import '../../styles/NotificatonPage.css';

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!UserService.isAuthenticated()) {
        alert('Please log in to view notifications.');
        return;
      }
      const response = await UserService.getAllNotifications(token);
      setNotifications(response);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleDeleteClick = (id) => {
    setNotificationToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await UserService.deleteNotification(notificationToDelete, token);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationToDelete));
      setShowDeleteModal(false);
      setNotificationToDelete(null);
    } catch (e) {
      alert('Delete failed');
      setShowDeleteModal(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setNotificationToDelete(null);
  };

  if (!UserService.isAuthenticated()) {
    return (
      <div className="notifications-container">
        <h1>Notifications</h1>
        <p>Please log in to view your notifications.</p>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <h1>Notifications</h1>
      {notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        <ul className="notification-list">
          {notifications.map((note) => (
            <li key={note.id} className="notification-item">
              <div className="notification-header">
                <h3>{note.title}</h3>
                {UserService.isAdmin() && (
                  <button className="btn-delete" onClick={() => handleDeleteClick(note.id)}>
                    Delete
                  </button>
                )}
              </div>
              <p>{note.message}</p>
              <p className="date">{new Date(note.createdAt).toLocaleString()}</p>
              {note.imagePath && (
                <img
                  src={`${UserService.BASE_URL}${note.imagePath}`}
                  alt="Notification"
                  className="notification-image"
                  onError={(e) => console.log('Image failed to load:', e.target.src)}
                />
              )}
            </li>
          ))}
        </ul>
      )}
      {showDeleteModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this notification?</p>
            <div className="modal-buttons">
              <button className="modal-btn confirm-btn" onClick={handleConfirmDelete}>Yes</button>
              <button className="modal-btn cancel-btn" onClick={handleCancelDelete}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationsPage;