import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import DashboardCards from "../../components/Dashboard/DashboardCards";
import "../../components/Dashboard/dashboard.css";
import "../../styles/ghIncharge.css";
import RoomAvailabilityCalendar from "../../components/Common/RoomAvailabilityCalendar";
import Button from "../../components/Common/Button/Button";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const formatDate = (value) => value
  ? new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
  : "-";

function GHInchargeDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [activeFilter, setActiveFilter] = useState("All");
  const [applications, setApplications] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [occupancy, setOccupancy] = useState({});
  const [roomAvailability, setRoomAvailability] = useState([]);


  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const actionRequired = activeTab === "action";
      const [
        applicationsResponse,
        countsResponse,
        occupancyResponse,
        roomAvailabilityResponse
      ] = await Promise.all([

        axios.get(`${API_URL}/api/guesthouse-incharge/applications`, {
          params: { actionRequired }
        }),

        axios.get(`${API_URL}/api/guesthouse-incharge/dashboard-counts`),

        axios.get(`${API_URL}/api/guesthouse-incharge/occupancy-summary`),

        axios.get(`${API_URL}/api/guesthouse-incharge/room-availability`)

      ]);
      setApplications(applicationsResponse.data);
      setCounts(countsResponse.data);
      setOccupancy(occupancyResponse.data);
      setRoomAvailability(roomAvailabilityResponse.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load applications");
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  const filteredApplications = applications.filter(app => {

    if (activeFilter === "PendingForRoomAllocation")
        return app.BookingStatus === "Approved";

    if (activeFilter === "PendingForCheckIn")
        return app.BookingStatus === "Allocated";

    if (activeFilter === "PendingForCheckOut")
        return app.BookingStatus === "Checked In";

    if (activeFilter === "CheckedOut")
        return app.BookingStatus === "Checked Out";

    return true;

});

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  const cards = [

    {
        label: "All Applications",
        count: counts.TotalApplications ?? applications.length,
        className: "total-card",
        active: activeFilter === "All",
        onClick: () => setActiveFilter("All")
    },

    {
        label: "Pending For Room Allocation",
        count: counts.PendingForRoomAllocation ?? 0,
        className: "approved-card",
        active: activeFilter === "PendingForRoomAllocation",
        onClick: () => setActiveFilter("PendingForRoomAllocation")
    },

    {
        label: "Rooms Allocated",
        count: counts.PendingForCheckIn ?? 0,
        className: "allocated-card",
        active: activeFilter === "PendingForCheckIn",
        onClick: () => setActiveFilter("PendingForCheckIn")
    },

    {
        label: "Checked In",
        count: counts.PendingForCheckOut ?? 0,
        className: "checkedin-card",
        active: activeFilter === "PendingForCheckOut",
        onClick: () => setActiveFilter("PendingForCheckOut")
    },

    {
        label: "Checked Out",
        count: counts.AllProcessedApplications ?? 0,
        className: "completed-card",
        active: activeFilter === "CheckedOut",
        onClick: () => setActiveFilter("CheckedOut")
    }

];

  const getActionButton = (application) => {

    if (application.BookingStatus === "Approved") {

      return (
        <button
          type="button"
          className="allocate-btn"
          onClick={() =>
            navigate(
              `/guesthouse/allocation/${application.GHBookingID}`
            )
          }
        >
          Allocate Room
        </button>
      );

    }

    if (application.BookingStatus === "Allocated") {

      return (
        <button
          type="button"
          className="checkin-btn"
          onClick={() =>
            navigate(`/gh-incharge/checkin/${application.GHBookingID}`)
          }
        >
          Check In
        </button>
      );

    }

    if (application.BookingStatus === "Checked In") {

      return (
        <button
          type="button"
          className="checkout-btn"
          onClick={() =>
            navigate(
              `/gh-incharge/checkout/${application.GHBookingID}`
            )
          }
        >
          Check Out
        </button>
      );

    }

    if (application.BookingStatus === "CheckedOut") {

      return (
        <button
          type="button"
          className="receipt-btn"
          onClick={() =>
            navigate(
              `/guesthouse/receipt/${application.GHBookingID}`
            )
          }
        >
          Receipt
        </button>


      );

    }

    return (
      <Button type="button"
          className="view-btn"

        onClick={() =>

          navigate(

            `/ghincharge/application/${application.GHBookingID}`

          )

        }

      >

        View

      </Button>
    );

  };

  return (
    <main className="dashboard-container incharge-dashboard">
      <h2 className="dashboard-title">Guest House Incharge Dashboard</h2>
      <DashboardCards cards={cards} />


      <section className="table-section">
        <div
          className="dashboard-tabs"
          role="tablist"
        >

          <button
            type="button"
            className={
              activeTab === "all"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("all")
            }
          >
            All
          </button>

          <button
            type="button"
            className={
              activeTab === "allocation"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("allocation")
            }
          >
            Allocation Queue
          </button>

          <button
            type="button"
            className={
              activeTab === "checkin"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("checkin")
            }
          >
            Check-In Queue
          </button>

          <button
            type="button"
            className={
              activeTab === "checkout"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("checkout")
            }
          >
            Check-Out Queue
          </button>

          <button
            type="button"
            className={activeTab === "availability" ? "active" : ""}
            onClick={() => setActiveTab("availability")}
          >
            Room Availability
          </button>

        </div>
        <div className="table-scroll">

          {
            activeTab === "availability"

              ?

              <RoomAvailabilityCalendar

                rooms={roomAvailability}

                occupancy={occupancy}

              />

              :
              <table className="erp-table">
                <thead>
                  <tr>
                    <th>Booking Number</th>
                    <th>Guest Name</th>
                    <th>Guest House</th>
                    <th>Arrival Date</th>
                    <th>Departure Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {!loading && filteredApplications.map((application) => (
                    <tr key={application.GHBookingID}>
                      <td>GH{String(application.GHBookingID).padStart(5, "0")}</td>
                      <td>{application.GuestName || "-"}</td>
                      <td>{application.GuestHouseName || "-"}</td>
                      <td>{formatDate(application.ArrivalDateTime)}</td>
                      <td>{formatDate(application.DepartureDateTime)}</td>
                      <td>
                        <span className={`status-pill status-${application.BookingStatus?.toLowerCase()}`}>
                          {application.BookingStatus}
                        </span>
                      </td>
                      <td>
                        {getActionButton(application)}
                      </td>
                    </tr>
                  ))}
                  {!loading && applications.length === 0 && (
                    <tr><td className="empty-state" colSpan="7">No applications found.</td></tr>
                  )}
                  {loading && (
                    <tr><td className="empty-state" colSpan="7">Loading applications…</td></tr>
                  )}
                </tbody>
              </table>
          }
        </div>
      </section>
    </main>
  );
}

export default GHInchargeDashboard;
