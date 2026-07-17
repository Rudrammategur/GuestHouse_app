import { useParams } from "react-router-dom";

function RequestTracking() {

  const { id } = useParams();

  return (

    <div className="tracking-container">

      <h2>Request Tracking</h2>

      <div className="timeline">

        <div className="timeline-item completed">
          ✓ Submitted
        </div>

        <div className="timeline-item completed">
          ✓ Verified
        </div>

        <div className="timeline-item pending">
          ⏳ Approver Review
        </div>

        <div className="timeline-item waiting">
          Waiting for Allocation
        </div>

      </div>

    </div>

  );
}

export default RequestTracking;