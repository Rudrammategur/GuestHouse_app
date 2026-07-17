import { useState } from "react";
import { useParams } from "react-router-dom";
import "../../styles/transportIncharge.css";

function TransportAllocationPage() {

  const { id } = useParams();

  const [vehicle, setVehicle] = useState("");
  const [driver, setDriver] = useState("");
  const [remarks, setRemarks] = useState("");

  return (

    <div className="allocation-container">

      <h2>Transport Allocation</h2>

      <div className="allocation-card">

        <h3>Request Number : {id}</h3>

        <div className="form-group">

          <label>Vehicle</label>

          <select
            value={vehicle}
            onChange={(e) =>
              setVehicle(e.target.value)
            }
          >
            <option value="">Select Vehicle</option>
            <option>OD-02-AB-1234</option>
            <option>OD-02-CD-4567</option>
            <option>OD-02-EF-7890</option>
          </select>

        </div>

        <div className="form-group">

          <label>Driver</label>

          <select
            value={driver}
            onChange={(e) =>
              setDriver(e.target.value)
            }
          >
            <option value="">Select Driver</option>
            <option>Ramesh</option>
            <option>Suresh</option>
            <option>Mahesh</option>
          </select>

        </div>

        <div className="form-group">

          <label>Remarks</label>

          <textarea
            rows="4"
            value={remarks}
            onChange={(e) =>
              setRemarks(e.target.value)
            }
          />

        </div>

        <div className="btn-row">

          <button className="allocate-btn">
            Save Allocation
          </button>

          <button className="complete-btn">
            Mark Trip Completed
          </button>

        </div>

      </div>

    </div>

  );
}

export default TransportAllocationPage;