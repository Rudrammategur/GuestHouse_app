import "../../styles/roomCalendar.css";

function RoomAvailabilityCalendar({

    rooms = [],

    occupancy = {},

    numberOfDays = 15,

    showSummary = true,

    title = "Room Availability"

}) {

    const dates = [];

    const today = new Date();

    const totalDays = numberOfDays || 15;

    for (let i = 0; i < totalDays; i++) {

        const date = new Date(today);

        date.setDate(today.getDate() + i);

        dates.push(date);

    }

    return (

        <div className="calendar-summary">

            <div className="summary-card">
                <h3>{occupancy.TotalRooms}</h3>
                <p>Total Rooms</p>
            </div>

            <div className="summary-card">
                <h3>{occupancy.AvailableRooms}</h3>
                <p>Available</p>
            </div>

            <div className="summary-card">
                <h3>{occupancy.OccupiedRooms}</h3>
                <p>Occupied</p>
            </div>

            <div className="calendar-container">

                <h2>{title}</h2>

                <table className="calendar-table">

                    <thead>

                        <tr>

                            <th>
                                Room
                            </th>

                            {
                                dates.map(day => (
                                    <th key={day.toISOString()}>

                                        {day.getDate()}

                                        <br />

                                        <small>

                                            {day.toLocaleDateString(

                                                "en-IN",

                                                { month: "short" }

                                            )

                                            }

                                        </small>

                                    </th>
                                ))
                            }

                        </tr>

                    </thead>

                    <tbody>

                        {
                            rooms.map(room => (

                                <tr key={room.RoomNo}>

                                    <td>
                                        {room.RoomNo}
                                    </td>

                                    {
                                        dates.map(day => {

                                            const occupied = room.Bookings.some(booking => {

                                                const arrival = new Date(booking.ArrivalDateTime);

                                                const departure = new Date(booking.DepartureDateTime);

                                                return (

                                                    day >= arrival &&

                                                    day <= departure

                                                );

                                            });

                                            return (

                                                <td

                                                    key={day.toISOString()}

                                                    className={

                                                        occupied

                                                            ? "occupied"

                                                            : "available"

                                                    }

                                                    title={

                                                        occupied

                                                            ? room.Bookings[0]?.GuestName

                                                            : "Available"

                                                    }

                                                >
                                                    {occupied ? "●" : ""}
                                                </td>

                                            );

                                        })
                                    }

                                </tr>

                            ))
                        }

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default RoomAvailabilityCalendar;