import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ApplicationView from "../../components/Dashboard/ApplicationView/ApplicationView";
import RoomAllocationPanel from "./RoomAllocationPanel";
import "../../styles/ghIncharge.css";
import RoomAvailabilityCalendar from "../../components/Common/RoomAvailabilityCalendar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function GHAllocationPage() {
  const { bookingId, id } = useParams();
  const selectedBookingId = bookingId || id;
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedGuestHouse, setSelectedGuestHouse] = useState("");
  const [guestHouses, setGuestHouses] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [accommodationAmount, setAccommodationAmount] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  const [roomAvailability, setRoomAvailability] = useState([]);
  const [occupancy, setOccupancy] = useState({});



  const loadAllocation = useCallback(async () => {
    setLoading(true);
    try {

      const [applicationResponse, roomResponse, occupancyResponse] = await Promise.all([

        axios.get(
          `${API_URL}/api/guesthouse-incharge/applications/${selectedBookingId}`
        ),

        axios.get(
          `${API_URL}/api/guesthouse-incharge/room-availability`
        ),

        axios.get(
          `${API_URL}/api/guesthouse-incharge/occupancy-summary`
        )

      ]);

      setApplication(applicationResponse.data);

      setRoomAvailability(roomResponse.data);

      setOccupancy(occupancyResponse.data);

      if (applicationResponse.data.BookingStatus === "Approved") {
        const roomsResponse = await axios.get(
          `${API_URL}/api/guesthouse-incharge/applications/${selectedBookingId}/available-rooms`
        );

        setRooms(roomsResponse.data);
      }

      const guestHouseResponse = await axios.get(
        `${API_URL}/api/master/guesthouse-types`
      );

      setGuestHouses(guestHouseResponse.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load allocation details");
    } finally {
      setLoading(false);
    }

  }, [selectedBookingId]);

  useEffect(() => { loadAllocation(); }, [loadAllocation]);

  useEffect(() => {

    if (!application) return;

    const arrival = new Date(application.ArrivalDateTime);

    const departure = new Date(application.DepartureDateTime);

    const stayDays = Math.max(
      1,
      Math.ceil(
        (departure - arrival) /
        (1000 * 60 * 60 * 24)
      )
    );

    const total = selectedRooms.reduce(

      (sum, room) =>

        sum +

        (Number(room.dayRate || 0) * stayDays),

      0

    );

    setAccommodationAmount(total);

  }, [selectedRooms, application]);

  const allocateRooms = async () => {

    setSaving(true);

    try {

      await axios.post(

        `${API_URL}/api/guesthouse-incharge/applications/${selectedBookingId}/allocations`,

        {

          rooms: selectedRooms,

          accommodationAmount,

          remarks

        }

      );

      toast.success("Rooms allocated successfully");

      navigate("/gh-incharge");

    }

    catch (err) {

      toast.error(

        err.response?.data?.message ||

        "Allocation failed"

      );

    }

    finally {

      setSaving(false);

    }

  };


  if (loading) return <div className="allocation-loading">Loading application…</div>;
  if (!application) return <div className="allocation-loading">Application not found.</div>;

  return (
    <main className="allocation-page">
      <header className="allocation-page-header">
        <button type="button" className="back-btn" onClick={() => navigate("/gh-incharge")}>← Back to Dashboard</button>
        <div>
          <h1>Booking GH{String(application.BookingID).padStart(5, "0")}</h1>
          <p>{application.GuestName} · {application.GuestHouseName || "Guest House"}</p>
        </div>
      </header>
      <div className="allocation-layout">
        <section className="application-pane">
          <ApplicationView application={application} />
        </section>
        <div className="allocation-actions">

          <button
            type="button"
            className="view-calendar-btn"
            onClick={() => setShowCalendar(true)}
          >
            View Room Availability
          </button>

        </div>
        <RoomAllocationPanel
          application={application}
          rooms={rooms}
          selectedRooms={selectedRooms}
          onSelectionChange={setSelectedRooms}
          onAllocate={allocateRooms}
          saving={saving}

          selectedGuestHouse={selectedGuestHouse}
          setSelectedGuestHouse={setSelectedGuestHouse}

          accommodationAmount={accommodationAmount}

          remarks={remarks}
          setRemarks={setRemarks}
        />
      </div>

      {
        showCalendar && (

          <div
            className="calendar-modal-overlay"
            onClick={() => setShowCalendar(false)}
          >

            <div
              className="calendar-modal"
              onClick={(e) => e.stopPropagation()}
            >

              <div className="calendar-modal-header">

                <h2>Room Availability</h2>

                <button
                  onClick={() => setShowCalendar(false)}
                >
                  ✕
                </button>

              </div>

              <RoomAvailabilityCalendar

                rooms={rooms}

                occupancy={occupancy}

                title="Guest House Room Availability"

                numberOfDays={15}

              />

            </div>

          </div>

        )
      }
    </main>
  );
}

export default GHAllocationPage;
