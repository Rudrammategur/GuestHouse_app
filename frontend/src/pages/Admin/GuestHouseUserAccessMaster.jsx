import { useEffect, useState } from "react";
import axios from "axios";

import GenericDashboardPage from "../../components/Common/GenericDashboardPage";
import GuestHouseUserAccessFormModal from "../../components/Admin/GuestHouseUserAccessFormModal";
import ERPConfirmDialog from "../../components/Common/ERPConfirmDialog";

import "../../styles/adminDashboard.css";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

function GuestHouseUserAccessMaster() {

    const [userAccess, setUserAccess] = useState([]);

    const [guestHouses, setGuestHouses] = useState([]);

    const [roles, setRoles] = useState([]);

    const [employees, setEmployees] = useState([]);

    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);

    const [selectedUserAccess, setSelectedUserAccess] = useState(null);

    const [confirmOpen, setConfirmOpen] = useState(false);

    const [searchText, setSearchText] = useState("");

    const [selectedGuestHouse, setSelectedGuestHouse] = useState("");

    const [selectedRole, setSelectedRole] = useState("");

    const [selectedStatus, setSelectedStatus] = useState("");

    useEffect(() => {

        loadData();

    }, []);

    const loadData = async () => {

        const [

            accessResponse,

            guestHouseResponse,

            roleResponse,

            employeeResponse

        ] = await Promise.all([

            axios.get(`${API_URL}/api/admin/user-access`),

            axios.get(`${API_URL}/api/admin/guesthouses`),

            axios.get(`${API_URL}/api/admin/roles`),

            axios.get(`${API_URL}/api/admin/employees`)

        ]);

        setUserAccess(accessResponse.data);

        setGuestHouses(guestHouseResponse.data);

        setRoles(roleResponse.data);

        setEmployees(employeeResponse.data);

        setLoading(false);

    };

    const columns = [

        {
            header: "Guest House",
            accessor: "GuestHouseName"
        },

        {
            header: "Employee",
            render: row =>
                `${row.EmployeeID} - ${row.EmployeeName}`
        },

        {
            header: "Role",
            accessor: "RoleName"
        },

        {
            header: "Default",
            render: row =>
                row.IsDefault ? "Yes" : "No"
        },

        {
            header: "Status",
            render: row =>
                row.IsActive ? "Active" : "Inactive"
        },

        {
            header: "Action",

            render: row => (

                <div className="action-buttons">

                    <button

                        className="edit-btn"

                        onClick={() => {

                            setSelectedUserAccess(row);

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

                            setSelectedUserAccess(row);

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

                    setSelectedUserAccess(null);

                    setShowModal(true);

                }}

            >

                + Add User Access

            </button>

            <input

                type="text"

                placeholder="Search Employee..."

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

                <option value="">All Guest Houses</option>

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

                value={selectedRole}

                onChange={(e) =>
                    setSelectedRole(e.target.value)
                }

            >

                <option value="">All Roles</option>

                {

                    roles.map(item => (

                        <option

                            key={item.RoleID}

                            value={item.RoleID}

                        >

                            {item.RoleName}

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

                <option value="">All Status</option>

                <option value="true">Active</option>

                <option value="false">Inactive</option>

            </select>

        </div>

    );

    const filteredData = userAccess.filter(item => {

        const matchesSearch =
            !searchText ||

            item.EmployeeName
                ?.toLowerCase()
                .includes(searchText.toLowerCase()) ||

            item.EmployeeID
                ?.toLowerCase()
                .includes(searchText.toLowerCase());

        const matchesGuestHouse =
            !selectedGuestHouse ||

            item.GuestHouseID === selectedGuestHouse;

        const matchesRole =
            !selectedRole ||

            item.RoleID === selectedRole;

        const matchesStatus =
            selectedStatus === "" ||

            String(item.IsActive) === selectedStatus;

        return (

            matchesSearch &&

            matchesGuestHouse &&

            matchesRole &&

            matchesStatus

        );

    });

    return (

        <>

            <GenericDashboardPage

                title="Guest House User Access"

                columns={columns}

                tableData={filteredData}

                loading={loading}

                toolbar={toolbar}

            />

            <GuestHouseUserAccessFormModal

                open={showModal}

                selectedUserAccess={selectedUserAccess}

                guestHouses={guestHouses}

                employees={employees}

                roles={roles}

                onClose={() => {

                    setShowModal(false);

                    setSelectedUserAccess(null);

                }}

                onSaved={loadData}

            />

            <ERPConfirmDialog

                open={confirmOpen}

                title="Confirmation"

                message={`Are you sure you want to ${selectedUserAccess?.IsActive ? "Deactivate" : "Activate"} this User Access?`}

                confirmText={selectedUserAccess?.IsActive ? "Deactivate" : "Activate"}

                confirmButtonClass={selectedUserAccess?.IsActive ? "danger-btn" : "success-btn"}

                onCancel={() => {

                    setConfirmOpen(false);

                    setSelectedUserAccess(null);

                }}

                onConfirm={async () => {

                    await axios.patch(

                        `${API_URL}/api/admin/user-access/${selectedUserAccess.UserAccessID}/status`

                    );

                    setConfirmOpen(false);

                    loadData();

                }}

            />

        </>

    );

}

export default GuestHouseUserAccessMaster;