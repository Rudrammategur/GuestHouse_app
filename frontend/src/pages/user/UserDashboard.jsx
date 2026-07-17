import { useNavigate } from "react-router-dom";
import {
  FaHotel,
  FaCar,
  FaClipboardList,
  FaSignOutAlt
} from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";

import "../../styles/userDashboard.css";

function UserDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const [stats, setStats] = useState({
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        const res = await axios.get(
          `http://localhost:5000/api/dashboard-stats/${user.EmployeeId}`
        );

        setStats(res.data);

      } catch (err) {
        console.log(err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard-container">

      {/* Header */}
      <div className="dashboard-header">
        <h1>
          {/*Welcome, {user?.EmployeeName}*/}
        </h1>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>

      <div className="dashboard-stats">

        <div className="stat-card">
          <h2>{stats.pendingCount}</h2>
          <p>Pending Requests</p>
        </div>

        <div className="stat-card">
          <h2>{stats.approvedCount}</h2>
          <p>Approved Requests</p>
        </div>

        <div className="stat-card">
          <h2>{stats.rejectedCount}</h2>
          <p>Rejected Requests</p>
        </div>

      </div>

      {/* Cards */}
      <div className="dashboard-cards">

        {/* Guest House */}
        <div
          className="dashboard-card"
          onClick={() => navigate("/guesthouse")}
        >
          <FaHotel className="card-icon" />

          <h3>Guest House Booking</h3>

          <p>
            Submit guest house accommodation
            requests for institute visitors.
          </p>
        </div>

        {/* Transport */}
        <div
          className="dashboard-card"
          onClick={() => navigate("/transport")}
        >
          <FaCar className="card-icon" />

          <h3>Transport Booking</h3>

          <p>
            Create transport requests for
            official travel and guests.
          </p>
        </div>

        {/* My Requests */}
        <div
          className="dashboard-card"
          onClick={() => navigate("/my-requests")}
        >
          <FaClipboardList className="card-icon" />

          <h3>My Requests</h3>

          <p>
            Track all Guest House and
            Transport requests.
          </p>
        </div>

      </div>

    </div>
  );
}

export default UserDashboard;