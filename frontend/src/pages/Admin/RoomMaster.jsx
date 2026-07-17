import { useEffect, useState } from "react";
import axios from "axios";
import GenericDashboardPage from "../../components/Common/GenericDashboardPage";
import RoomFormModal from "../../components/Admin/RoomFormModal";
import ERPConfirmDialog from "../../components/Common/ERPConfirmDialog";
import "../../styles/adminDashboard.css";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

function RoomMaster() {

    const [rooms, setRooms] = useState([]);

    const [loading, setLoading] = useState(true);

    const [selectedRoom, setSelectedRoom] = useState(null);

    const [confirmOpen, setConfirmOpen] = useState(false);

    const [showModal, setShowModal] = useState(false);

    const [searchText, setSearchText] = useState("");

    const [selectedGuestHouse, setSelectedGuestHouse] = useState("");

    const [selectedRoomType, setSelectedRoomType] = useState("");

    const [selectedStatus, setSelectedStatus] = useState("");

    const [guestHouses, setGuestHouses] = useState([]);

    const [roomTypes, setRoomTypes] = useState([]);

    useEffect(() => {

        loadRooms();

    }, []);

    const loadRooms = async () => {

        const [roomsResponse, guestHouseResponse, roomTypeResponse] =
            await Promise.all([

                axios.get(`${API_URL}/api/admin/rooms`),

                axios.get(`${API_URL}/api/admin/guesthouses`),

                axios.get(`${API_URL}/api/admin/room-types`)

            ]);

        console.log("Rooms:", roomsResponse.data);

        setRooms(roomsResponse.data);

        setGuestHouses(guestHouseResponse.data);

        setRoomTypes(roomTypeResponse.data);

        setLoading(false);

    };

    const handleConfirm = async () => {

        try {

            await axios.patch(
                `${API_URL}/api/admin/rooms/${selectedRoom.GuestHouseRoomID}/status`
            );

            setConfirmOpen(false);

            setSelectedRoom(null);

            loadRooms();

        }

        catch (err) {

            console.log(err);

        }

    };

    const columns = [

        {

            header: "Room No",

            accessor: "GHRoomNo",
            searchable: true

        },

        {

            header: "Guest House",

            accessor: "GuestHouseName",
            filter: "select"

        },

        {

            header: "Room Type",

            accessor: "RoomTypeName",
            filter: "select"


        },

        {
            header: "Status",
            accessor: "IsActive",
            filter: "select",
            render: row => (
                row.IsActive ? "Active" : "Inactive"
            )
        },

        {

            header: "Action",

            render: (row) => (

                <div className="action-buttons">

                    <button
                        className="edit-btn"
                        onClick={() => {

                            setSelectedRoom(row);

                            setShowModal(true);

                        }}
                    >
                        Edit
                    </button>

                    <button

                        className={
                            row.IsActive
                                ? "deactivate-btn"
                                : "activate-btn"
                        }

                        onClick={() => {

                            setSelectedRoom(row);

                            setConfirmOpen(true);

                        }}

                    >

                        {
                            row.IsActive
                                ? "Deactivate"
                                : "Activate"
                        }

                    </button>

                </div>

            )

        }

    ];

    const toolbar = (

        <div className="master-toolbar">

            <button
                className="add-btn"
                onClick={() => {
                    setSelectedRoom(null);
                    setShowModal(true);
                }}
            >
                + Add Room
            </button>

            <input
                type="text"
                placeholder="Search Room..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
            />

            <select
                value={selectedGuestHouse}
                onChange={(e) => setSelectedGuestHouse(e.target.value)}
            >

                <option value="">All Guest Houses</option>

                {

                    guestHouses.map(g => (

                        <option
                            key={g.GuestHouseID}
                            value={g.GuestHouseID}
                        >
                            {g.GuestHouseName}
                        </option>

                    ))

                }

            </select>

            <select
                value={selectedRoomType}
                onChange={(e) => setSelectedRoomType(e.target.value)}
            >

                <option value="">All Room Types</option>

                {

                    roomTypes.map(r => (

                        <option
                            key={r.RoomTypeID}
                            value={r.RoomTypeID}
                        >
                            {r.RoomTypeName}
                        </option>

                    ))

                }

            </select>

            <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
            >

                <option value="">All Status</option>

                <option value="true">Active</option>

                <option value="false">Inactive</option>

            </select>

        </div>

    );

    const filteredRooms = rooms.filter((room) => {

        const matchesSearch =
            !searchText ||
            room.RoomNumber?.toLowerCase().includes(
                searchText.toLowerCase()
            );

        const matchesGuestHouse =
            !selectedGuestHouse ||
            room.GuestHouseID === selectedGuestHouse;

        const matchesRoomType =
            !selectedRoomType ||
            room.RoomTypeID === selectedRoomType;

        const matchesStatus =
            selectedStatus === "" ||
            String(room.IsActive) === selectedStatus;

        return (
            matchesSearch &&
            matchesGuestHouse &&
            matchesRoomType &&
            matchesStatus
        );

    });

    return (
        <>

            <GenericDashboardPage

                title="Room Master"

                columns={columns}

                tableData={filteredRooms}

                loading={loading}

                toolbar={toolbar}

            />
            <RoomFormModal

                open={showModal}

                selectedRoom={selectedRoom}

                onClose={() => {

                    setShowModal(false);

                    setSelectedRoom(null);

                }}

                onSaved={loadRooms}

            />

            <ERPConfirmDialog

                open={confirmOpen}

                title={
                    selectedRoom?.IsActive
                        ? "Deactivate Room"
                        : "Activate Room"
                }

                message={
                    selectedRoom?.IsActive
                        ? `Are you sure you want to deactivate Room ${selectedRoom?.GHRoomNo}?`
                        : `Are you sure you want to activate Room ${selectedRoom?.GHRoomNo}?`
                }

                confirmText={
                    selectedRoom?.IsActive
                        ? "Deactivate"
                        : "Activate"
                }

                confirmButtonClass={
                    selectedRoom?.IsActive
                        ? "danger-btn"
                        : "success-btn"
                }

                onCancel={() => {

                    setConfirmOpen(false);

                    setSelectedRoom(null);

                }}

                onConfirm={handleConfirm}

            />
        </>



    );

}

export default RoomMaster;