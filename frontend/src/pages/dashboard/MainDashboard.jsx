import { FaHotel, FaCar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../styles/mainDashboard.css";

function MainDashboard() {

  const navigate = useNavigate();

  return (

    <div className="main-dashboard">

      <h1>Guest House & Transport Management System</h1>

      <div className="module-cards">

        <div
          className="module-card"
          onClick={() => navigate("/guesthouse-dashboard")}
        >
          <FaHotel className="module-icon" />

          <h2>Guest House</h2>

          <p>
            Accommodation booking and request tracking
          </p>

        </div>

        <div
          className="module-card"
          onClick={() => navigate("/transport-dashboard")}
        >
          <FaCar className="module-icon" />

          <h2>Transport</h2>

          <p>
            Vehicle booking and request tracking
          </p>

        </div>

      </div>

    </div>

  );
}

export default MainDashboard;