import { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/transportForm.css";

function TransportForm() {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [formData, setFormData] = useState({
    vehicleType: "",
    bookingType: "",
    capacity: "",
    department: "",
    expenditureHead: "",
    guestName: "",
    guestEmail: "",
    address: "",
    contact: "",
    departurePlace: "",
    arrivalPlace: "",
    localContactPerson: "", 
    reason: "",
    remarks: "",
  });

  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [file, setFile] = useState(null);
  const [totalHours, setTotalHours] = useState(0);
  const [arrival, setArrival] = useState(null);
  const [departure, setDeparture] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateDuration = (arrival, departure) => {
    if (!arrival || !departure) return;

    const diffMs = departure - arrival;

    const totalHours = Math.floor(
      diffMs / (1000 * 60 * 60)
    );

    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;

    setTotalHours(`${days} Day(s) ${hours} Hour(s)`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    const data = new FormData();

    data.append("userId", user.EmployeeId);

    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    data.append("dateFrom", dateFrom);
    data.append("dateTo", dateTo);

    if (file) {
      data.append("document", file);
    }

    try {
      await axios.post(
        "http://localhost:5000/api/transport",
        data
      );

      alert("Transport request submitted successfully");
    } catch (err) {
      console.log(err);
      alert("Submission failed");
    }
  };

  return (
    <div className="transport-container">

      <div className="page-header">
        <div>
          <h2>Create Transport Request</h2>
          <p>
            Submit transport requests for official institute travel.
          </p>
        </div>

        <div className="request-tag">
          New Request
        </div>
      </div>

      <form onSubmit={handleSubmit}>

        {/* Request Information */}
        <div className="section-card">
          <h3>Request Information</h3>

          <div className="transport-grid">

            <div className="form-group">
              <label>Type of Vehicle *</label>
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select Vehicle
                </option>
                <option value="Car">Car</option>
                <option value="SUV">SUV</option>
                <option value="Bus">Bus</option>
              </select>
            </div>

            <div className="form-group">
              <label>Type of Booking *</label>
              <select
                name="bookingType"
                value={formData.bookingType}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option>Hour Based</option>
                <option>Fixed Location Based</option>
              </select>
            </div>

            <div className="form-group">
              <label>Department *</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                <option>CSE</option>
                <option>ECE</option>
                <option>ME</option>
              </select>
            </div>

            <div className="form-group">
              <label>Expenditure Head *</label>
              <select
                name="expenditureHead"
                value={formData.expenditureHead}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option>Institute Fund</option>
                <option>Project Fund</option>
                <option>Self</option>
              </select>
            </div>

          </div>
        </div>

        {/* Guest Details */}
        <div className="section-card">
          <h3>Guest / Traveller Details</h3>

          <div className="transport-grid">

            <div className="form-group">
              <label>Guest Name *</label>
              <input
                name="guestName"
                value={formData.guestName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Guest Email *</label>
              <input
                type="email"
                name="guestEmail"
                value={formData.guestEmail}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Contact Number *</label>
              <input
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Local Contact Person *</label>
              <input
                name="localContactPerson"
                value={formData.localContactPerson}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Address</label>
              <textarea
                rows="3"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

          </div>
        </div>

        {/* Journey Details */}
        <div className="section-card">
          <h3>Journey Details</h3>

          <div className="transport-grid">

            <div className="form-group">
              <label>Departure Location *</label>
              <input
                name="departurePlace"
                value={formData.departurePlace}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Arrival Location *</label>
              <input
                name="arrivalPlace"
                value={formData.arrivalPlace}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Date From *</label>

              <DatePicker
                selected={arrival}
                onChange={(date) => {
                  setArrival(date);

                  if (departure) {
                    calculateDuration(date, departure);
                  }
                }}
                showTimeSelect
                dateFormat="dd/MM/yyyy h:mm aa"
                className="date-picker"
              />
            </div>

            <div className="form-group">
              <label>Date To *</label>

              <DatePicker
                selected={departure}
                onChange={(date) => {
                  setDeparture(date);

                  if (arrival) {
                    calculateDuration(arrival, date);
                  }
                }}
                minDate={arrival}
                showTimeSelect
                dateFormat="dd/MM/yyyy h:mm aa"
                className="date-picker"
              />
            </div>

          </div>

          <div className="duration-card">
            <small>Total Booking Duration</small>
            <h3>{totalHours || "0 Hours"}</h3>
          </div>

        </div>

        {/* Purpose */}
        <div className="section-card">
          <h3>Purpose & Attachments</h3>

          <div className="transport-grid">

            <div className="form-group full-width">
              <label>Reason For Request *</label>
              <textarea
                rows="4"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Reference Document</label>

              <input
                type="file"
                onChange={(e) =>
                  setFile(e.target.files[0])
                }
              />
            </div>

            <div className="form-group full-width">
              <label>Additional Information</label>

              <textarea
                rows="4"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
              />
            </div>

          </div>
        </div>

        {/* Workflow */}
        <div className="workflow-card">

          <h4>Approval Workflow</h4>

          <div className="workflow">

            <span>Applicant</span>

            ➜

            <span>Verifier</span>

            ➜

            <span>Approver</span>

          </div>

        </div>


        <div className="button-row">
          <button
            type="submit"
            className="submit-btn"
          >
            Submit Request
          </button>

          <button
            type="reset"
            className="reset-btn"
          >
            Reset
          </button>
        </div>

      </form>

    </div>
  );
}

export default TransportForm;