import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserService from '../service/UserService';
import '../../styles/UpdateUser.css';



function UpdateUser() {
  const navigate = useNavigate();
  const { userId } = useParams();  // Get user ID from URL parameters

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: '',
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    fetchUserDataById(userId);
  }, [userId]);

  const fetchUserDataById = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await UserService.getUserById(userId, token);
      const { name, email, role, phone, gender } = response.teachers;
      setUserData({ name, email, role, phone, gender, password: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
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
        alert('Password and confirmation do not match!');
        return;
      }

      setShowConfirmModal(true);

    
    
   } catch (error) {
      console.error('Error validating form:', error);
      alert('An error occurred. Please try again.');
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
      };

      if (userData.password) {
        updatedData.password = userData.password;
      }

      await UserService.updateUser(userId, updatedData, token);
      setShowConfirmModal(false); // Close modal after success
      navigate('/admin/user-management');
    } catch (error) {
      console.error('Error updating user profile:', error);
      alert('An error occurred. Please try again.');
      setShowConfirmModal(false); // Close modal on error
    }
  };

  const handleCancelUpdate = () => {
    setShowConfirmModal(false); 
  };
  return (
     <div className="user-update-wrapper">
      <div className="update-form-section">
        <h2>Update User</h2>
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
            <input type="text" name="role" value={userData.role} onChange={handleInputChange} required />
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