import React, { useState } from 'react';
import UserService from '../service/UserService';  // مسیر دقیق نسبت به محل فایل را چک کن
import '../../styles/CreateNotificaton.css';

function CreateNotificationPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('message', message);
    if (image) {
      formData.append('image', image);
    }

    try {
      await UserService.createNotification(formData, token);
      setSuccessMessage('Notification successfully created.');
      setTitle('');
      setMessage('');
      setImage(null);
      setErrorMessage('');
    } catch (err) {
      setErrorMessage('Error creating notification');
    }
  };

  return (
    <div className="create-notification-container">
      <h2>Create Notification</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit} className="notification-form">
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="form-textarea"
          ></textarea>
        </div>
        <div className="form-group">
          <label>Image (Optional):</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="form-file"
          />
        </div>
        <button type="submit" className="submit-button">Send Notification</button>
      </form>
    </div>
  );
}

export default CreateNotificationPage;