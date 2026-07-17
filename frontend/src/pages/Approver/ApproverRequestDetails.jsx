import { useState } from "react";
import { useParams } from "react-router-dom";
import "../../styles/approver.css";

function ApproverRequestDetails() {

  const { id } = useParams();

  const [remarks, setRemarks] = useState("");

  return (

    <div className="details-container">

      <h2>Approver Review</h2>

      <div className="details-card">

        <h3>Request Number : {id}</h3>

        <hr />

        <h4>Applicant Information</h4>

        <p><b>Name :</b> Rudra</p>
        <p><b>Department :</b> CSE</p>
        <p><b>Designation :</b> Assistant Professor</p>

        <hr />

        <h4>Guest Details</h4>

        <p><b>Guest Name :</b> Dr. ABC</p>
        <p><b>Purpose :</b> Conference Visit</p>

        <hr />

        <h4>Booking Details</h4>

        <p><b>Arrival :</b> 12-Jun-2026 10:00 AM</p>
        <p><b>Departure :</b> 14-Jun-2026 05:00 PM</p>
        <p><b>Room Type :</b> Double</p>

        <hr />

        <h4>Workflow Progress</h4>

        <div className="timeline">

          <div className="completed">
            ✓ Submitted
          </div>

          <div className="completed">
            ✓ Verified
          </div>

          <div className="pending">
            ⏳ Approver Review
          </div>

          <div>
            Incharge Allocation
          </div>

        </div>

        <textarea
          rows="4"
          placeholder="Remarks"
          value={remarks}
          onChange={(e) =>
            setRemarks(e.target.value)
          }
        />

        <div className="btn-group">

          <button className="approve-btn">
            Approve
          </button>

          <button className="reject-btn">
            Reject
          </button>

        </div>

      </div>

    </div>

  );
}

export default ApproverRequestDetails;