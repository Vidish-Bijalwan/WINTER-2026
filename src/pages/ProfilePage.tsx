import React, { useState } from 'react';
import './ProfilePage.css';

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    organization: 'TopoForge Inc.',
    role: 'Data Analyst',
    bio: 'Experienced data analyst specializing in topological data analysis.',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data if needed
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>User Profile</h1>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="btn btn-primary">
            Edit Profile
          </button>
        ) : (
          <div className="profile-actions">
            <button onClick={handleCancel} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleSave} className="btn btn-primary">
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="profile-content">
        <div className="profile-section card">
          <h2>Personal Information</h2>
          <div className="profile-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              {isEditing ? (
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input"
                />
              ) : (
                <div className="profile-value">{formData.name}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              {isEditing ? (
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input"
                />
              ) : (
                <div className="profile-value">{formData.email}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="organization">Organization</label>
              {isEditing ? (
                <input
                  id="organization"
                  name="organization"
                  type="text"
                  value={formData.organization}
                  onChange={handleInputChange}
                  className="input"
                />
              ) : (
                <div className="profile-value">{formData.organization}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="role">Role</label>
              {isEditing ? (
                <input
                  id="role"
                  name="role"
                  type="text"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="input"
                />
              ) : (
                <div className="profile-value">{formData.role}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              {isEditing ? (
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="input"
                  rows={4}
                />
              ) : (
                <div className="profile-value">{formData.bio}</div>
              )}
            </div>
          </div>
        </div>

        <div className="profile-section card">
          <h2>Change Password</h2>
          <div className="profile-form">
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                id="currentPassword"
                type="password"
                className="input"
                placeholder="Enter current password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                id="newPassword"
                type="password"
                className="input"
                placeholder="Enter new password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                id="confirmPassword"
                type="password"
                className="input"
                placeholder="Confirm new password"
              />
            </div>
            <button className="btn btn-primary">Update Password</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
