import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function MyGuestHouseBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user || !user.EmployeeId) {
          setError("User not logged in");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `http://localhost:5000/api/my-bookings/${user.EmployeeId}`
        );

        setBookings(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // 📅 Format Date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString(); // you can customize format
  };

  // 🎨 Status color
  const getStatusStyle = (status) => {
    switch (status) {
      case "Approved":
        return { color: "green", fontWeight: "bold" };
      case "Rejected":
        return { color: "red", fontWeight: "bold" };
      default:
        return { color: "orange", fontWeight: "bold" };
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading bookings...</p>;
  if (error) return <p style={{ color: "red", padding: "20px" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>My Guest House Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "#fff",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
          >
            <thead style={{ background: "#89288F", color: "#fff" }}>
              <tr>
                <th style={thStyle}>Guest House</th>
                <th style={thStyle}>Guest Name</th>
                <th style={thStyle}>Booking Type</th>
                <th style={thStyle}>Arrival</th>
                <th style={thStyle}>Departure</th>
                <th style={thStyle}>Status</th>
                <th>View</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} style={{ textAlign: "center" }}>
                  <td style={tdStyle}>{b.guesthouse_name}</td>
                  <td style={tdStyle}>{b.guest_name}</td>
                  <td style={tdStyle}>{b.booking_type}</td>
                  <td style={tdStyle}>{formatDate(b.arrival)}</td>
                  <td style={tdStyle}>{formatDate(b.departure)}</td>
                  <td style={{ ...tdStyle, ...getStatusStyle(b.status) }}>
                    {b.status}
                  </td>
                  <td>
                    <button
                      onClick={() =>
                        navigate(
    `/guesthouse/application/${b.GHBookingID}`
)
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
      )}
    </div>
  );
}

// 🎨 Styles
const thStyle = {
  padding: "12px",
  border: "1px solid #ddd",
  fontSize: "14px"
};

const tdStyle = {
  padding: "10px",
  border: "1px solid #ddd",
  fontSize: "14px"
};

export default MyGuestHouseBookings;