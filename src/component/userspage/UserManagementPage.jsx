  import React, { useState, useEffect } from 'react';
  import { Link } from 'react-router-dom';
  import UserService from '../service/UserService';
  import '../../styles/UserManagementPage.css';

  function UserManagementPage() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null); 

    useEffect(() => {
      fetchUsers();
    }, []);

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await UserService.getAllUsers(token);
        setUsers(response.teachersList || []); 
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const handleDeleteClick = (userId) => {
      setUserToDelete(userId); 
      setShowDeleteModal(true); 
    };

    const handleConfirmDelete = async () => {
      try {
        if (userToDelete) {
          const token = localStorage.getItem('token');
          await UserService.deleteUser(userToDelete, token);
          setShowDeleteModal(false);
          setUserToDelete(null); 
          fetchUsers(); 
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('An error occurred. Please try again.');
        setShowDeleteModal(false);
      }
    };

    const handleCancelDelete = () => {
      setShowDeleteModal(false);
      setUserToDelete(null);
    };

   // Filter users based on search term
    const filteredUsers = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toString().includes(searchTerm) ||
      (user.role || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="user-management-container">
        <div className="header-section">
          <h1 className="page-title">Users Management</h1>
          <Link to="/register" className="add-user-btn">Add New User</Link>
        </div>
        <div className="search-section">
          <input
            type="text"
            placeholder="Search by Name, Email, ID,"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Credit</th>
                <th>Credit Rate</th>
                <th>Phone Number</th>
                <th>Profile Picture</th>
                <th>Gender</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="10" className="no-users-message">
                    {searchTerm ? 'No users found matching your search.' : 'No users found.'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.credits || 'N/A'}</td>
                    <td>{user.creditRate || 'N/A'}</td>
                    <td>{user.phone || 'N/A'}</td>
                    <td>
                      {user.profilePicture && (
                        <img src={user.profilePicture} alt="Profile" className="profile-image" />
                      )}
                    </td>
                    <td>{user.gender || 'N/A'}</td>
                    <td>{user.role || 'N/A'}</td>
                    <td className="action-buttons">
                      <button className="delete-btn" onClick={() => handleDeleteClick(user.id)}>Delete</button>
                      <Link to={`/update-user/${user.id}`} className="update-btn">Update</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        
        {showDeleteModal && (
          <div className="custom-modal-overlay">
            <div className="custom-modal">
              <h3>Confirm Deletion</h3>
              <p>Are you sure you want to delete this user?</p>
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

  export default UserManagementPage;