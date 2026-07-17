import { useNavigate } from "react-router-dom";
import "../styles/myRequests.css";

function MyRequests() {

  const navigate = useNavigate();

  return (
    <div className="requests-page">

      <h2>My Requests</h2>

      <div className="cards-grid">

        <div
          className="request-card"
          onClick={() => navigate("/my-guesthouse-bookings")}
        >
          <div className="card-icon">🏠</div>

          <h3>Guest House Requests</h3>

          <p>View all guest house applications</p>
        </div>

        <div
          className="request-card"
          onClick={() =>
            navigate("/my-transport-bookings")
          }
        >
          <div className="card-icon">🚗</div>

          <h3>Transport Requests</h3>

          <p>View all transport applications</p>
        </div>

      </div>

    </div>
  );
}

export default MyRequests;