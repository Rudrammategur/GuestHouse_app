import { useEffect, useState } from "react";
import axios from "axios";
import GenericDashboardPage from "../../components/Common/GenericDashboardPage";
import GuestTypeFormModal from "../../components/Admin/GuestTypeFormModal";
import ERPConfirmDialog from "../../components/Common/ERPConfirmDialog";
import "../../styles/adminDashboard.css";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

function GuestTypeMaster() {

    const [guestTypes, setGuestTypes] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedGuestType, setSelectedGuestType] = useState(null);

    const [showModal, setShowModal] = useState(false);

    const [searchText, setSearchText] = useState("");

    const [selectedStatus, setSelectedStatus] = useState("");

    const [confirmOpen, setConfirmOpen] = useState(false);

    useEffect(() => {

        loadGuestTypes();

    }, []);

    const loadGuestTypes = async () => {

        const response = await axios.get(

            `${API_URL}/api/admin/guest-types`

        );

        setGuestTypes(response.data);

        setLoading(false);

    };

    const columns = [

        {

            header: "Guest Type",

            accessor: "GuestTypeName",

            searchable: true

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

                            setSelectedGuestType(row);

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

                            setSelectedGuestType(row);

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

                    setSelectedGuestType(null);

                    setShowModal(true);

                }}

            >

                + Add Guest Type

            </button>

            <input

                type="text"

                placeholder="Search Guest Type..."

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

    const filteredGuestTypes = guestTypes.filter(item => {

        const matchesSearch =

            !searchText ||

            item.GuestTypeName

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

                title="Guest Type Master"

                columns={columns}

                tableData={filteredGuestTypes}

                loading={loading}

                toolbar={toolbar}

            />

            <GuestTypeFormModal

                open={showModal}

                selectedGuestType={selectedGuestType}

                onClose={() => {

                    setShowModal(false);

                    setSelectedGuestType(null);

                }}

                onSaved={loadGuestTypes}

            />

            <ERPConfirmDialog

                open={confirmOpen}

                title={

                    selectedGuestType?.IsActive

                        ?

                        "Deactivate Guest Type"

                        :

                        "Activate Guest Type"

                }

                message={

                    selectedGuestType?.IsActive

                        ?

                        `Are you sure you want to deactivate "${selectedGuestType?.GuestTypeName}"?`

                        :

                        `Are you sure you want to activate "${selectedGuestType?.GuestTypeName}"?`

                }

                confirmText={

                    selectedGuestType?.IsActive

                        ?

                        "Deactivate"

                        :

                        "Activate"

                }

                confirmButtonClass={

                    selectedGuestType?.IsActive

                        ?

                        "danger-btn"

                        :

                        "success-btn"

                }

                onCancel={() => {

                    setConfirmOpen(false);

                    setSelectedGuestType(null);

                }}

                onConfirm={async () => {

                    await axios.patch(

                        `${API_URL}/api/admin/guest-types/${selectedGuestType.GuestTypeID}/status`

                    );

                    setConfirmOpen(false);

                    loadGuestTypes();

                }}

            />

        </>

    );

}

export default GuestTypeMaster;