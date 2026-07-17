import { useEffect, useState } from "react";
import axios from "axios";
import GenericDashboardPage from "../../components/Common/GenericDashboardPage";
import GuestHouseFormModal from "../../components/Admin/GuestHouseFormModal";
import "../../styles/adminDashboard.css";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

function GuestHouseMaster() {

    const [guestHouses, setGuestHouses] = useState([]);

    const [loading, setLoading] = useState(true);

    const [selectedGuestHouse, setSelectedGuestHouse] = useState(null);

    const [showModal, setShowModal] = useState(false);

    const [searchText, setSearchText] = useState("");

    const [selectedStatus, setSelectedStatus] = useState("");

    useEffect(() => {

        loadGuestHouses();

    }, []);

    const loadGuestHouses = async () => {

        const response = await axios.get(

            `${API_URL}/api/admin/guesthouses`

        );

        setGuestHouses(response.data);

        setLoading(false);

    };

    const columns = [

        {

            header: "Guest House",

            accessor: "GuestHouseName",

            searchable: true

        },

        {

            header: "Address",

            accessor: "Address",

            searchable: true

        },

        {

            header: "Description",

            accessor: "Description"

        },

        {

            header: "Status",

            accessor: "IsActive",

            filter: "select",

            render: row =>

                row.IsActive

                    ? "Active"

                    : "Inactive"

        },

        {

            header: "Action",

            render: row => (

                <div className="action-buttons">

                    <button

                        className="edit-btn"

                        onClick={() => {

                            setSelectedGuestHouse(row);

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

                        onClick={async () => {

                            await axios.patch(

                                `${API_URL}/api/admin/guesthouses/${row.GuestHouseID}/status`

                            );

                            loadGuestHouses();

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

                    setSelectedGuestHouse(null);

                    setShowModal(true);

                }}

            >

                + Add Guest House

            </button>

            <input

                type="text"

                placeholder="Search Guest House..."

                value={searchText}

                onChange={(e) =>

                    setSearchText(e.target.value)

                }

            />

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

    const filteredGuestHouses = guestHouses.filter(item => {

        const matchesSearch =

            !searchText ||

            item.GuestHouseName

                ?.toLowerCase()

                .includes(

                    searchText.toLowerCase()

                );

        const matchesStatus =

            selectedStatus === "" ||

            String(item.IsActive) === selectedStatus;

        return (

            matchesSearch &&

            matchesStatus

        );

    });

    return (

        <>

            <GenericDashboardPage

                title="Guest House Master"

                columns={columns}

                tableData={filteredGuestHouses}

                loading={loading}

                toolbar={toolbar}

            />

            <GuestHouseFormModal

                open={showModal}

                selectedGuestHouse={selectedGuestHouse}

                onClose={() => {

                    setShowModal(false);

                    setSelectedGuestHouse(null);

                }}

                onSaved={loadGuestHouses}

            />

        </>

    );

}

export default GuestHouseMaster;