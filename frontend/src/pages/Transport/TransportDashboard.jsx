import { useNavigate } from "react-router-dom";
import "../../styles/moduleDashboard.css";

function TransportDashboard() {

  const navigate = useNavigate();

  return (

    <div className="module-dashboard">

      <h2>Transport Module</h2>

      <div className="dashboard-grid">

        <div
          className="dashboard-card"
          onClick={() => navigate("/transport")}
        >
          <h3>Apply Request</h3>

          <p>Create a new transport request.</p>
        </div>

        <div
          className="dashboard-card"
          onClick={() =>
            navigate("/my-transport-bookings")
          }
        >
          <h3>My Requests</h3>

          <p>Track all submitted applications.</p>
        </div>

      </div>

    </div>

  );
}

export default TransportDashboard;