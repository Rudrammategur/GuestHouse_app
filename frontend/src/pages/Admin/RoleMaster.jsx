import { useEffect, useState } from "react";
import axios from "axios";

import GenericDashboardPage from "../../components/Common/GenericDashboardPage";
import ERPConfirmDialog from "../../components/Common/ERPConfirmDialog";
import RoleFormModal from "../../components/Admin/RoleFormModal";

import "../../styles/adminDashboard.css";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

function RoleMaster() {

    const [roles, setRoles] = useState([]);

    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);

    const [selectedRole, setSelectedRole] = useState(null);

    const [confirmOpen, setConfirmOpen] = useState(false);

    const [searchText, setSearchText] = useState("");

    const [selectedStatus, setSelectedStatus] = useState("");

    useEffect(() => {

        loadRoles();

    }, []);

    const loadRoles = async () => {

        const response =
            await axios.get(
                `${API_URL}/api/admin/roles`
            );

        setRoles(response.data);

        setLoading(false);

    };

    const columns = [

        {

            header: "Role",

            accessor: "RoleName",

            searchable: true

        },

        {

            header: "Description",

            accessor: "Description"

        },

        {

            header: "Status",

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

                            setSelectedRole(row);

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

                            setSelectedRole(row);

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

                    setSelectedRole(null);

                    setShowModal(true);

                }}

            >

                + Add Role

            </button>

            <input

                type="text"

                placeholder="Search Role..."

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

    const filteredRoles = roles.filter(role => {

        const matchesSearch =

            !searchText ||

            role.RoleName

                ?.toLowerCase()

                .includes(searchText.toLowerCase()) ||

            role.Description

                ?.toLowerCase()

                .includes(searchText.toLowerCase());

        const matchesStatus =

            selectedStatus === "" ||

            String(role.IsActive) === selectedStatus;

        return (

            matchesSearch &&

            matchesStatus

        );

    });

    return (

        <>

            <GenericDashboardPage

                title="Role Master"

                columns={columns}

                tableData={filteredRoles}

                loading={loading}

                toolbar={toolbar}

            />

            <RoleFormModal

                open={showModal}

                selectedRole={selectedRole}

                onClose={() => {

                    setShowModal(false);

                    setSelectedRole(null);

                }}

                onSaved={loadRoles}

            />

            <ERPConfirmDialog

                open={confirmOpen}

                title="Confirmation"

                message={`Are you sure you want to ${selectedRole?.IsActive ? "Deactivate" : "Activate"} this role?`}

                confirmText={selectedRole?.IsActive ? "Deactivate" : "Activate"}

                confirmButtonClass={selectedRole?.IsActive ? "danger-btn" : "success-btn"}

                onCancel={() => {

                    setConfirmOpen(false);

                    setSelectedRole(null);

                }}

                onConfirm={async () => {

                    await axios.patch(

                        `${API_URL}/api/admin/roles/${selectedRole.RoleID}/status`

                    );

                    setConfirmOpen(false);

                    loadRoles();

                }}

            />

        </>

    );

}

export default RoleMaster;