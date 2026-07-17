import React, { useEffect, useState } from "react";
import axios from "axios";

function MyTransportBookings() {

  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    const res = await axios.get(
      `http://localhost:5000/api/my-transport-bookings/${user.EmployeeId}`
    );

    setRequests(res.data);
  };

  const getStatusStyle = (status) => {

    if (status === "Approved") {
      return { color: "green" };
    }

    if (status === "Rejected") {
      return { color: "red" };
    }

    return { color: "orange" };
  };

  return (
    <div className="table-page">

      <h2>My Transport Requests</h2>

      <table className="erp-table">

        <thead>
          <tr>
            <th>ID</th>
            <th>Vehicle</th>
            <th>From</th>
            <th>To</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>

          {requests.map((item) => (
            <tr key={item.id}>

              <td>{item.id}</td>

              <td>{item.vehicleType}</td>

              <td>{item.departurePlace}</td>

              <td>{item.arrivalPlace}</td>

              <td style={getStatusStyle(item.status)}>
                {item.status}
              </td>

              <td>
                <button
                  onClick={() =>
                    navigate(`/tracking/${item.id}`)
                  }
                >
                  View
                </button>
              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}

export default MyTransportBookings;