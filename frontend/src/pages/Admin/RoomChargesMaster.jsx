import { useEffect, useState } from "react";
import axios from "axios";
import GenericDashboardPage from "../../components/Common/GenericDashboardPage";
import RoomChargesFormModal from "../../components/Admin/RoomChargesFormModal";
import ERPConfirmDialog from "../../components/Common/ERPConfirmDialog";
import "../../styles/adminDashboard.css";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

function RoomChargesMaster() {

    const [charges, setCharges] = useState([]);

    const [guestHouses, setGuestHouses] = useState([]);

    const [roomTypes, setRoomTypes] = useState([]);

    const [loading, setLoading] = useState(true);

    const [selectedCharge, setSelectedCharge] = useState(null);

    const [showModal, setShowModal] = useState(false);

    const [confirmOpen, setConfirmOpen] = useState(false);

    const [searchText, setSearchText] = useState("");

    const [selectedGuestHouse, setSelectedGuestHouse] = useState("");

    const [selectedRoomType, setSelectedRoomType] = useState("");

    const [selectedStatus, setSelectedStatus] = useState("");

    useEffect(() => {

        loadData();

    }, []);

    const loadData = async () => {

        const [

            chargesResponse,

            guestHouseResponse,

            roomTypeResponse

        ] = await Promise.all([

            axios.get(`${API_URL}/api/admin/room-charges`),

            axios.get(`${API_URL}/api/admin/guesthouses`),

            axios.get(`${API_URL}/api/admin/room-types`)

        ]);

        setCharges(chargesResponse.data);

        setGuestHouses(guestHouseResponse.data);

        setRoomTypes(roomTypeResponse.data);

        setLoading(false);

    };

    const columns = [

        {

            header: "Guest House",

            accessor: "GuestHouseName"

        },

        {

            header: "Room Type",

            accessor: "RoomTypeName"

        },

        {

            header: "Occupancy",

            render: row =>

                row.IsSingleOccupancy

                    ?

                    "Single"

                    :

                    "Double"

        },

        {

            header: "Day Rate",

            accessor: "DayRate"

        },

        {

            header: "15 Day Rate",

            accessor: "FifteenDayRate"

        },

        {

            header: "30 Day Rate",

            accessor: "ThirtyDayRate"

        },

        {

            header: "Status",

            render: row =>

                row.IsActive

                    ?

                    "Active"

                    :

                    "Inactive"

        },

        {

            header: "Action",

            render: row => (

                <div className="action-buttons">

                    <button

                        className="edit-btn"

                        onClick={() => {

                            setSelectedCharge(row);

                            setShowModal(true);

                        }}

                    >

                        Edit

                    </button>

                    <button

                        className={

                            row.IsActive

                                ?

                                "deactivate-btn"

                                :

                                "activate-btn"

                        }

                        onClick={() => {

                            setSelectedCharge(row);

                            setConfirmOpen(true);

                        }}

                    >

                        {

                            row.IsActive

                                ?

                                "Deactivate"

                                :

                                "Activate"

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

                    setSelectedCharge(null);

                    setShowModal(true);

                }}

            >

                + Add Charges

            </button>

            <input

                type="text"

                placeholder="Search..."

                value={searchText}

                onChange={(e) =>

                    setSearchText(e.target.value)

                }

            />

            <select

                value={selectedGuestHouse}

                onChange={(e) =>

                    setSelectedGuestHouse(e.target.value)

                }

            >

                <option value="">

                    All Guest Houses

                </option>

                {

                    guestHouses.map(item => (

                        <option

                            key={item.GuestHouseID}

                            value={item.GuestHouseID}

                        >

                            {item.GuestHouseName}

                        </option>

                    ))

                }

            </select>

            <select

                value={selectedRoomType}

                onChange={(e) =>

                    setSelectedRoomType(e.target.value)

                }

            >

                <option value="">

                    All Room Types

                </option>

                {

                    roomTypes.map(item => (

                        <option

                            key={item.RoomTypeID}

                            value={item.RoomTypeID}

                        >

                            {item.RoomTypeName}

                        </option>

                    ))

                }

            </select>

            <select

                value={selectedStatus}

                onChange={(e) =>

                    setSelectedStatus(e.target.value)

                }

            >

                <option value="">

                    All Status

                </option>

                <option value="true">

                    Active

                </option>

                <option value="false">

                    Inactive

                </option>

            </select>

        </div>

    );

    const filteredCharges = charges.filter(item => {

        const matchesSearch =

            !searchText ||

            item.GuestHouseName.toLowerCase().includes(searchText.toLowerCase()) ||

            item.RoomTypeName.toLowerCase().includes(searchText.toLowerCase());

        const matchesGuestHouse =

            !selectedGuestHouse ||

            item.GuestHouseID === selectedGuestHouse;

        const matchesRoomType =

            !selectedRoomType ||

            item.RoomTypeID === selectedRoomType;

        const matchesStatus =

            selectedStatus === "" ||

            String(item.IsActive) === selectedStatus;

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

                title="Room Charges Master"

                columns={columns}

                tableData={filteredCharges}

                loading={loading}

                toolbar={toolbar}

            />

            <RoomChargesFormModal

                open={showModal}

                selectedCharge={selectedCharge}

                guestHouses={guestHouses}

                roomTypes={roomTypes}

                onClose={() => {

                    setShowModal(false);

                    setSelectedCharge(null);

                }}

                onSaved={loadData}

            />

            <ERPConfirmDialog

                open={confirmOpen}

                title="Confirmation"

                message={`Are you sure you want to ${selectedCharge?.IsActive ? "deactivate" : "activate"} this Room Charge?`}

                confirmText={selectedCharge?.IsActive ? "Deactivate" : "Activate"}

                confirmButtonClass={selectedCharge?.IsActive ? "danger-btn" : "success-btn"}

                onCancel={() => {

                    setConfirmOpen(false);

                    setSelectedCharge(null);

                }}

                onConfirm={async () => {

                    await axios.patch(

                        `${API_URL}/api/admin/room-charges/${selectedCharge.GHRCID}/status`

                    );

                    setConfirmOpen(false);

                    loadData();

                }}

            />

        </>

    );

}

export default RoomChargesMaster;