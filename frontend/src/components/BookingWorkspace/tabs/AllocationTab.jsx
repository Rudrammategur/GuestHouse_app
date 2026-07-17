import { useEffect, useState } from "react";
import axios from "axios";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

function AllocationTab({ booking }) {

    const [rooms, setRooms] = useState([]);

    useEffect(() => {

        if (booking?.GHBookingID) {

            loadAllocation();

        }

    }, [booking]);

    const loadAllocation = async () => {

        const response = await axios.get(

            `${API_URL}/api/admin/allocation/${booking.GHBookingID}`

        );

        setRooms(response.data);

    };

    const totalAmount = rooms.reduce(

        (sum, room) =>

            sum + Number(room.DayRate),

        0

    );

    return (

        <div>

            <h3>Allocated Rooms</h3>

            <table className="erp-table">

                <thead>

                    <tr>

                        <th>Room</th>

                        <th>Type</th>

                        <th>Occupancy</th>

                        <th>Rate</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        rooms.map(room => (

                            <tr key={room.GHRAllocationID}>

                                <td>{room.RoomNumber}</td>

                                <td>{room.RoomTypeName}</td>

                                <td>

                                    {

                                        room.IsSingleOccupancy

                                        ? "Single"

                                        : "Double"

                                    }

                                </td>

                                <td>

                                    ₹ {room.DayRate}

                                </td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

            <div className="allocation-summary">

                <h4>

                    Accommodation Charge

                </h4>

                <h2>

                    ₹ {totalAmount}

                </h2>

            </div>

        </div>

    );

}

export default AllocationTab;