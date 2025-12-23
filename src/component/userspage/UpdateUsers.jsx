
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserService from '../service/UserService';
import '../../styles/UpdateUser.css';

function UpdateUser() {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: '',
    credits: '',
    creditRate: '',
  });
  const [error, setError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    fetchUserDataById(userId);
  }, [userId]);

  const fetchUserDataById = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await UserService.getUserById(parseInt(userId), token);
      const { name, email, role, phone, gender, credits, creditRate } = response.teachers;
      setUserData({ name, email, role, phone, gender, credits: credits || '', creditRate: creditRate || '', password: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Error fetching user data: ' + error.message);
    }
  };

  const validatePassword = (password) => {
    if (!password) {
      return null; // Password is optional
    }
    if (password.length < 5) {
      return 'Password must be at least 5 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'Password must contain at least one special character';
    }
    return null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (userData.password && userData.password !== userData.confirmPassword) {
        setError('Password and confirmation do not match!');
        return;
      }
      if (userData.password) {
        const passwordError = validatePassword(userData.password);
        if (passwordError) {
          setError(passwordError);
          return;
        }
      }
      setShowConfirmModal(true);
    } catch (error) {
      console.error('Error validating form:', error);
      setError('An error occurred. Please try again.');
    }
  };

  const handleConfirmUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const updatedData = {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        phone: userData.phone,
        gender: userData.gender,
        credits: userData.credits ? parseInt(userData.credits) : null,
        creditRate: userData.creditRate ? parseFloat(userData.creditRate) : null,
      };

      if (userData.password) {
        updatedData.password = userData.password;
      }

      await UserService.updateUser(userId, updatedData, token);
      setShowConfirmModal(false);
      navigate('/admin/user-management', { state: { showSuccessNotification: true } });
    } catch (error) {
      console.error('Error updating user profile:', error);
      setError('Error updating user: ' + (error.response?.data?.message || error.message));
      setShowConfirmModal(false);
    }
  };

  const handleCancelUpdate = () => {
    setShowConfirmModal(false);
    setError('');
  };

  return (
    <div className="user-update-wrapper">
      <div className="update-form-section">
        <h2>Update User</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Name:</label>
            <input type="text" name="name" value={userData.name} onChange={handleInputChange} required />
          </div>
          <div className="form-field">
            <label>Email:</label>
            <input type="email" name="email" value={userData.email} onChange={handleInputChange} required />
          </div>
          <div className="form-field">
            <label>Role:</label>
            <select name="role" value={userData.role} onChange={handleInputChange} required>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          <div className="form-field">
            <label>Phone:</label>
            <input type="text" name="phone" value={userData.phone} onChange={handleInputChange} />
          </div>
          <div className="form-field">
            <label>New Password:</label>
            <input type="password" name="password" value={userData.password} onChange={handleInputChange} />
          </div>
          <div className="form-field">
            <label>Confirm Password:</label>
            <input type="password" name="confirmPassword" value={userData.confirmPassword} onChange={handleInputChange} />
          </div>
          <div className="form-field">
            <label>Credits:</label>
            <input type="number" name="credits" value={userData.credits} onChange={handleInputChange} />
          </div>
          <div className="form-field">
            <label>Credit Rate:</label>
            <input type="number" step="0.01" name="creditRate" value={userData.creditRate} onChange={handleInputChange} />
          </div>
          <div className="form-radio-group">
            <label>Gender:</label>
            <label className="radio-option">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={userData.gender === 'male'}
                onChange={handleInputChange}
              />
              Male
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={userData.gender === 'female'}
                onChange={handleInputChange}
              />
              Female
            </label>
          </div>
          <button type="submit" className="submit-btn">Update</button>
        </form>
      </div>
      {showConfirmModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <h3>Confirm Update</h3>
            <p>Do you want to update this user?</p>
            <div className="modal-buttons">
              <button className="modal-btn confirm-btn" onClick={handleConfirmUpdate}>Yes</button>
              <button className="modal-btn cancel-btn" onClick={handleCancelUpdate}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdateUser;
