import { useEffect, useState } from "react";
import axios from "axios";

import RoomAvailabilityCalendar
    from "../../components/Common/RoomAvailabilityCalendar";

import "../../styles/adminRoomAvailability.css";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

function AdminRoomAvailability() {

    const [guestHouses, setGuestHouses] = useState([]);

    const [rooms, setRooms] = useState([]);

    const [occupancy, setOccupancy] = useState({});

    const [filters, setFilters] = useState({

        guestHouse: "",

        month: new Date().getMonth() + 1,

        year: new Date().getFullYear()

    });

    useEffect(() => {

        loadMasters();

    }, []);

    useEffect(() => {

        loadAvailability();

    }, [filters]);

    const loadMasters = async () => {

        try {

            const response = await axios.get(

                `${API_URL}/api/master/guesthouse-types`

            );

            setGuestHouses(response.data);

        }

        catch (err) {

            console.log(err);

        }

    };

    const loadAvailability = async () => {

        try {

            const response = await axios.get(

                `${API_URL}/api/admin/room-availability`,

                {

                    params: filters

                }

            );

            setRooms(response.data.rooms);

            setOccupancy(response.data.occupancy);

        }

        catch (err) {

            console.log(err);

        }

    };

    const openRoomDetails = (room) => {

        console.log(room);

        // Later
        // Open Booking Details Modal

    };

    return (

        <div className="admin-room-page">

            <h2>

                Room Availability Calendar

            </h2>

            <div className="calendar-filters">

                <select

                    value={filters.guestHouse}

                    onChange={(e)=>

                        setFilters({

                            ...filters,

                            guestHouse:e.target.value

                        })

                    }

                >

                    <option value="">

                        All Guest Houses

                    </option>

                    {

                        guestHouses.map(gh=>(

                            <option

                                key={gh.GuestHouseID}

                                value={gh.GuestHouseID}

                            >

                                {gh.GuestHouseName}

                            </option>

                        ))

                    }

                </select>

                <select

                    value={filters.month}

                    onChange={(e)=>

                        setFilters({

                            ...filters,

                            month:e.target.value

                        })

                    }

                >

                    {

                        Array.from(

                            {length:12},

                            (_,i)=>(

                                <option

                                    key={i+1}

                                    value={i+1}

                                >

                                    {

                                        new Date(

                                            2025,

                                            i

                                        )

                                        .toLocaleString(

                                            "default",

                                            {

                                                month:"long"

                                            }

                                        )

                                    }

                                </option>

                            )

                        )

                    }

                </select>

                <select

                    value={filters.year}

                    onChange={(e)=>

                        setFilters({

                            ...filters,

                            year:e.target.value

                        })

                    }

                >

                    {

                        [2025,2026,2027,2028].map(year=>(

                            <option

                                key={year}

                                value={year}

                            >

                                {year}

                            </option>

                        ))

                    }

                </select>

            </div>

            <RoomAvailabilityCalendar

                rooms={rooms}

                occupancy={occupancy}

                title="Room Availability"

                numberOfDays={30}

                showSummary={true}

                onRoomClick={openRoomDetails}

            />

        </div>

    );

}

export default AdminRoomAvailability;