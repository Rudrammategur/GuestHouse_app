import { useNavigate } from "react-router-dom";
import "../Dashboard/dashboard.css";

function DashboardTable({
    applications,
    viewRoute,
    onPrint
}) {

    const navigate = useNavigate();

    return (
        <table className="erp-table">

            <thead>
                <tr>
                    <th>Booking No.</th>
                    <th>Guest Name</th>
                    <th>Guest Type</th>
                    <th>Rooms Req.</th>
                    <th>Employee Name</th>
                    <th>Arrival</th>
                    <th>Departure</th>
                    <th>Submission Date</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>

            <tbody>
                {applications.map((item) => (
                    <tr key={item.GHBookingID}>

                        <td>{item.GHRBookingNo}</td>
                        <td>{item.GuestName}</td>
                        <td>{item.GuestTypeName}</td>
                        <td>{item.TotalRoomsReq}</td>
                        <td>{item.BookedBy}</td>
                        <td>{new Date(item.ArrivalDateTime).toLocaleString()}</td>
                        <td>{new Date(item.DepartureDateTime).toLocaleString()}</td>
                        <td>{new Date(item.BookingDateTime).toLocaleString()}</td>
                        <td>{item.BookingStatus}</td>
                        <td>

                            <button
                                className="view-btn"
                                onClick={() =>
                                    navigate(`${viewRoute}/${item.GHBookingID}`)
                                }
                            >
                                View
                            </button>
                            

                        <button
                            className="print-btn"
                            onClick={() => navigate(`/guesthouse/print/${item.GHBookingID}`)}
                        >
                            Print
                        </button>

                    </td>

                    </tr>
                ))}
        </tbody>

        </table >
    );
}

export default DashboardTable;