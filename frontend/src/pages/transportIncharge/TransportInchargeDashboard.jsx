import { useNavigate } from "react-router-dom";
import "../../styles/transportIncharge.css";

function TransportInchargeDashboard() {

  const navigate = useNavigate();

  const requests = [
    {
      id: "TR0001",
      applicant: "User1",
      vehicleType: "Car",
      from: "Bhubaneswar Airport",
      to: "IIT Campus",
      date: "12-Jun-2026"
    },
    {
      id: "TR0002",
      applicant: "User2",
      vehicleType: "Bus",
      from: "Railway Station",
      to: "Guest House",
      date: "13-Jun-2026"
    }
  ];

  return (

    <div className="transport-container">

      <h2>Transport Incharge Dashboard</h2>

      <table className="erp-table">

        <thead>

          <tr>
            <th>Request No</th>
            <th>Applicant</th>
            <th>Vehicle Type</th>
            <th>From</th>
            <th>To</th>
            <th>Date</th>
            <th>Action</th>
          </tr>

        </thead>

        <tbody>

          {requests.map((item) => (

            <tr key={item.id}>

              <td>{item.id}</td>
              <td>{item.applicant}</td>
              <td>{item.vehicleType}</td>
              <td>{item.from}</td>
              <td>{item.to}</td>
              <td>{item.date}</td>

              <td>

                <button
                  className="allocate-btn"
                  onClick={() =>
                    navigate(`/transport-allocation/${item.id}`)
                  }
                >
                  Allocate
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );
}

export default TransportInchargeDashboard;