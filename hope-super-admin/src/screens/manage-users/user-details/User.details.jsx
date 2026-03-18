import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./User.details.css"; // Make sure the path matches your project structure

/**
 * UserDetails Component
 * * Displays comprehensive user profile information using Bootstrap 5 and Custom CSS.
 */
const UserDetails = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("habits"); // Default tab for the extra data

  useEffect(() => {
    const timer = setTimeout(() => {
      const data = location.state?.user || null;
      setUser(data);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [location.state]);

  if (loading) {
    return (
      <div id="user-detail">
        <div className="loader-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div id="user-detail">
        <div className="not-found">No user data found</div>
      </div>
    );
  }

  return (
    <div id="user-detail">
      <div className="scroll-container">
        <h1 className="user-title">User Profile Details</h1>

        {/* --- Profile Header & Info --- */}
        <div className="content-container">
          {/* User Image */}
          <div className="user-image-container text-center">
            <img
              src={user.profilePicture || "https://via.placeholder.com/300"}
              alt={user.userName}
              className="user-image mb-3"
            />
            <h3 className="fw-bold mb-1">{user.userName}</h3>
            <p className="text-muted small mb-3">{user.bio}</p>

            <div className="d-flex justify-content-center gap-2">
              <span
                className="role-badge"
                style={{ backgroundColor: "var(--primary, #0d6efd)" }}
              >
                {user.role}
              </span>
              <span
                className={`status-badge ${user.isActive ? "bg-success" : "bg-danger"}`}
              >
                {user.isActive ? "ACTIVE" : "INACTIVE"}
              </span>
            </div>
          </div>

          {/* User Details Table */}
          <div className="details-container">
            <div className="details-table">
              <div className="detail-row">
                <div className="detail-label">Email</div>
                <div className="detail-value user-email">{user.email}</div>
                <div className="detail-label">Phone</div>
                <div className="detail-value">{user.fullPhone}</div>
              </div>

              <div className="detail-row">
                <div className="detail-label">Age</div>
                <div className="detail-value">{user.age}</div>
                <div className="detail-label">Gender</div>
                <div className="detail-value">{user.gender}</div>
              </div>

              <div className="detail-row">
                <div className="detail-label">Verified</div>
                <div className="detail-value">
                  <span
                    className={`badge ${user.isEmailVerified ? "bg-success" : "bg-warning text-dark"}`}
                  >
                    {user.isEmailVerified ? "Yes" : "No"}
                  </span>
                </div>
                <div className="detail-label">Stealth Mode</div>
                <div className="detail-value">
                  <span
                    className={`badge ${user.isStealthModeEnabled ? "bg-dark" : "bg-secondary"}`}
                  >
                    {user.isStealthModeEnabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>

              <div className="detail-row">
                <div className="detail-label">Created At</div>
                <div className="detail-value">
                  {new Date(user.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="detail-row">
                <div className="detail-label">Last Login</div>
                <div className="detail-value">
                  {new Date(user.lastLogin).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Tab Navigation --- */}
        <ul className="nav nav-pills mb-4 justify-content-center">
          <li className="nav-item mx-2">
            <button
              className={`nav-link fw-bold px-4 ${activeTab === "habits" ? "active shadow-sm" : "text-muted"}`}
              onClick={() => setActiveTab("habits")}
            >
              <i className="fas fa-check-circle me-2"></i>Habits (
              {user.habits?.length || 0})
            </button>
          </li>
          <li className="nav-item mx-2">
            <button
              className={`nav-link fw-bold px-4 ${activeTab === "moods" ? "active shadow-sm" : "text-muted"}`}
              onClick={() => setActiveTab("moods")}
            >
              <i className="fas fa-smile me-2"></i>Mood Logs (
              {user.moodLogs?.length || 0})
            </button>
          </li>
        </ul>

        {/* --- Habits Section --- */}
        {activeTab === "habits" && (
          <div className="user-events-container">
            <h2 className="user-events-title">Active Habits</h2>
            {user.habits?.length > 0 ? (
              <div className="events-table">
                <div className="events-header">
                  <div className="header-cell">Title & Category</div>
                  <div className="header-cell">Schedule</div>
                  <div className="header-cell">Streaks</div>
                  <div className="header-cell">Status</div>
                </div>
                {user.habits.map((habit) => (
                  <div className="events-row" key={habit._id}>
                    <div className="events-cell flex-column align-items-center">
                      <span className="fw-bold">{habit.title}</span>
                      <span className="badge bg-secondary mt-1">
                        {habit.category}
                      </span>
                    </div>
                    <div className="events-cell flex-column align-items-center">
                      <small className="text-muted d-block text-center">
                        {habit.description}
                      </small>
                      <div className="mt-2">
                        {habit.frequency?.map((day) => (
                          <span
                            key={day}
                            className="badge bg-light text-dark border me-1 mb-1"
                          >
                            {day.substring(0, 3)}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="events-cell flex-column">
                      <div>
                        <strong>Current:</strong> {habit.currentStreak} days
                      </div>
                      <div>
                        <strong>Best:</strong> {habit.longestStreak} days
                      </div>
                    </div>
                    <div className="events-cell">
                      <span
                        className={`badge ${habit.isActive ? "bg-success" : "bg-danger"}`}
                      >
                        {habit.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data text-center py-4">
                No habits found for this user.
              </div>
            )}
          </div>
        )}

        {/* --- Mood Logs Section --- */}
        {activeTab === "moods" && (
          <div className="user-events-container">
            <h2 className="user-events-title">Mood History</h2>
            {user.moodLogs?.length > 0 ? (
              <div className="events-table">
                <div className="events-header">
                  <div className="header-cell">Date & Mood</div>
                  <div className="header-cell">Metrics</div>
                  <div className="header-cell">Notes & Tags</div>
                </div>
                {user.moodLogs.map((mood) => (
                  <div className="events-row" key={mood._id}>
                    <div className="events-cell flex-column align-items-center">
                      <span
                        className={`badge mb-2 fs-6 ${getMoodColor(mood.moodType)}`}
                      >
                        {mood.moodType}
                      </span>
                      <small className="text-muted">
                        {new Date(mood.moodDate).toLocaleDateString()}
                      </small>
                    </div>
                    <div className="events-cell flex-column text-start align-items-start ps-4">
                      <small>
                        <strong>Intensity:</strong> {mood.moodIntensity}/10
                      </small>
                      <small>
                        <strong>Energy:</strong> {mood.energyLevel}/10
                      </small>
                      <small>
                        <strong>Sleep:</strong> {mood.sleepHours} hrs
                      </small>
                      <small>
                        <strong>Weather:</strong> {mood.weatherCondition}
                      </small>
                    </div>
                    <div className="events-cell flex-column align-items-start text-start">
                      <p className="mb-2 small">"{mood.moodNote}"</p>
                      <div>
                        {mood.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="badge bg-info text-dark me-1 mb-1"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data text-center py-4">
                No mood logs found for this user.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Helper function to map mood types to Bootstrap 5 background colors
 */
const getMoodColor = (moodType) => {
  const colors = {
    STRESSED: "bg-danger",
    HAPPY: "bg-success",
    SAD: "bg-primary",
    ANXIOUS: "bg-warning text-dark",
    CALM: "bg-info text-dark",
  };
  return colors[moodType] || "bg-secondary";
};

export default UserDetails;
