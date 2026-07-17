import { useNavigate } from "react-router-dom";


function GHCheckInDashboard() {

  const navigate = useNavigate();

  const arrivals = [
    {
      BookingID: 101,
      GuestName: "Dr Sharma",
      RoomNo: "GH101",
      ArrivalDate: "2026-06-24",
      Status: "Allocated"
    }
  ];

  return (
    <div className="dashboard-page">

      <h2>Today's Arrivals</h2>

      <table>

        <thead>
          <tr>
            <th>Booking No</th>
            <th>Guest Name</th>
            <th>Room</th>
            <th>Arrival Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {arrivals.map(item => (

            <tr key={item.BookingID}>

              <td>{item.BookingID}</td>
              <td>{item.GuestName}</td>
              <td>{item.RoomNo}</td>
              <td>{item.ArrivalDate}</td>

              <td>

                <button
                  onClick={() =>
                    navigate(
                      `/gh-incharge/checkin/${item.BookingID}`
                    )
                  }
                >
                  Check In
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default GHCheckInDashboard;