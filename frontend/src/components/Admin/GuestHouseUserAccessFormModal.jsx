import { useEffect, useState } from "react";
import axios from "axios";

import ERPFormModal from "../Common/Form/ERPFormModal";
import ERPSelectField from "../Common/Form/ERPSelectField";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

function GuestHouseUserAccessFormModal({

    open,

    onClose,

    onSaved,

    selectedUserAccess,

    guestHouses,

    employees,

    roles

}) {

    const [form, setForm] = useState({

        GuestHouseID: "",

        EmployeeID: "",

        RoleID: "",

        IsDefault: false

    });

    useEffect(() => {

        if (selectedUserAccess) {

            setForm({

                GuestHouseID:
                    selectedUserAccess.GuestHouseID || "",

                EmployeeID:
                    selectedUserAccess.EmployeeID || "",

                RoleID:
                    selectedUserAccess.RoleID || "",

                IsDefault:
                    selectedUserAccess.IsDefault || false

            });

        }

        else {

            setForm({

                GuestHouseID: "",

                EmployeeID: "",

                RoleID: "",

                IsDefault: false

            });

        }

    }, [selectedUserAccess]);

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setForm({

            ...form,

            [name]:

                type === "checkbox"

                    ? checked

                    : value

        });

    };

    const handleSubmit = async () => {

        if (!form.GuestHouseID) {

            alert("Please select Guest House.");

            return;

        }

        if (!form.EmployeeID) {

            alert("Please select Employee.");

            return;

        }

        if (!form.RoleID) {

            alert("Please select Role.");

            return;

        }

        try {

            if (selectedUserAccess) {

                await axios.put(

                    `${API_URL}/api/admin/user-access/${selectedUserAccess.UserAccessID}`,

                    form

                );

            }

            else {

                await axios.post(

                    `${API_URL}/api/admin/user-access`,

                    form

                );

            }

            onSaved();

            onClose();

        }

        catch (err) {

            alert(

                err.response?.data?.message ||

                "Unable to save User Access."

            );

        }

    };

    return (

        <ERPFormModal

            open={open}

            title={

                selectedUserAccess

                    ?

                    "Edit User Access"

                    :

                    "Add User Access"

            }

            onSave={handleSubmit}

            onClose={onClose}

        >

            <ERPSelectField

                label="Guest House"

                required

                name="GuestHouseID"

                value={form.GuestHouseID}

                onChange={handleChange}

                options={

                    guestHouses.map(item => ({

                        value: item.GuestHouseID,

                        label: item.GuestHouseName

                    }))

                }

            />

            <ERPSelectField

                label="Employee"

                required

                name="EmployeeID"

                value={form.EmployeeID}

                onChange={handleChange}

                options={

                    employees.map(item => ({

                        value: item.EmployeeID,

                        label:
                            `${item.EmployeeID} - ${item.EmployeeName}`

                    }))

                }

            />

            <ERPSelectField

                label="Role"

                required

                name="RoleID"

                value={form.RoleID}

                onChange={handleChange}

                options={

                    roles.map(item => ({

                        value: item.RoleID,

                        label: item.RoleName

                    }))

                }

            />

            <div className="form-checkbox">

                <label>

                    <input

                        type="checkbox"

                        name="IsDefault"

                        checked={form.IsDefault}

                        onChange={handleChange}

                    />

                    Default User

                </label>

            </div>

        </ERPFormModal>

    );

}

export default GuestHouseUserAccessFormModal;