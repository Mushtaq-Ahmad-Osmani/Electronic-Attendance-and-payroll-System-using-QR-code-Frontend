import React, { useEffect, useState } from 'react';
import UserService from '../service/UserService';
import '../../styles/NotificatonPage.css';

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

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

  if (!UserService.isAuthenticated()) {
    return (
      <div className="notifications-container">
        <h1 className="notifications-title">Notifications</h1>
        <p>Please log in to view your notifications.</p>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <h1 className="notifications-title">Notifications</h1>
      {notifications.length === 0 ? (
        <p className="no-notifications">No notifications available.</p>
      ) : (
        <ul className="notification-list">
          {notifications.map((note) => (
            <li key={note.id} className="notification-item">
              <h3>{note.title}</h3>
              <p>{note.message}</p>
              <p className="date">{new Date(note.createdAt).toLocaleString()}</p>
              {note.imageUrl && (
                <img src={note.imageUrl} alt="Notification" className="notification-image" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NotificationsPage;