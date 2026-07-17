import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/formModal.css";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

function RoomFormModal({

    open,

    onClose,

    onSaved,

    selectedRoom

}) {

    const [form, setForm] = useState({

        roomNumber: "",

        guestHouseId: "",

        roomTypeId: "",

        isActive: true

    });

    const [guestHouses, setGuestHouses] = useState([]);

    const [roomTypes, setRoomTypes] = useState([]);

    useEffect(() => {

        if (!open) return;

        loadMasters();

        if (selectedRoom) {

            setForm({

                roomNumber: selectedRoom.RoomNumber,

                guestHouseId: selectedRoom.GuestHouseID,

                roomTypeId: selectedRoom.RoomTypeID,

                isActive: selectedRoom.IsActive

            });

        }

        else {

            setForm({

                roomNumber: "",

                guestHouseId: "",

                roomTypeId: "",

                isActive: true

            });

        }

    }, [open, selectedRoom]);

    const loadMasters = async () => {

        const [gh, rt] = await Promise.all([

            axios.get(`${API_URL}/api/admin/guesthouses`),

            axios.get(`${API_URL}/api/admin/room-types`)

        ]);

        setGuestHouses(gh.data);

        setRoomTypes(rt.data);

    };

    const saveRoom = async () => {

        if (selectedRoom) {

            await axios.put(

                `${API_URL}/api/admin/rooms/${selectedRoom.GuestHouseRoomID}`,

                form

            );

        }

        else {

            await axios.post(

                `${API_URL}/api/admin/rooms`,

                form

            );

        }

        onSaved();

        onClose();

    };

    if (!open) return null;

    return (

        <div className="modal-overlay">

            <div className="modal-box">

                <h2>

                    { selectedRoom ? "Edit Room" : "Add Room" }

                </h2>

                <input

                    placeholder="Room Number"

                    value={form.roomNumber}

                    onChange={(e) =>

                        setForm({

                            ...form,

                            roomNumber: e.target.value

                        })

                    }

                />

                <select

                    value={form.guestHouseId}

                    onChange={(e) =>

                        setForm({

                            ...form,

                            guestHouseId: e.target.value

                        })

                    }

                >

                    <option value="">

                        Select Guest House

                    </option>

                    {

                        guestHouses.map(g =>

                            <option

                                key={g.GuestHouseID}

                                value={g.GuestHouseID}

                            >

                                {g.GuestHouseName}

                            </option>

                        )

                    }

                </select>

                <select

                    value={form.roomTypeId}

                    onChange={(e) =>

                        setForm({

                            ...form,

                            roomTypeId: e.target.value

                        })

                    }

                >

                    <option value="">

                        Select Room Type

                    </option>

                    {

                        roomTypes.map(r =>

                            <option

                                key={r.RoomTypeID}

                                value={r.RoomTypeID}

                            >

                                {r.RoomTypeName}

                            </option>

                        )

                    }

                </select>

                <div className="modal-actions">

                    <button onClick={onClose}>

                        Cancel

                    </button>

                    <button onClick={saveRoom}>

                        Save Room

                    </button>

                </div>

            </div>

        </div>

    );

}

export default RoomFormModal;