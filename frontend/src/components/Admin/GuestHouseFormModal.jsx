import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/formModal.css";

import ERPFormModal from "../Common/Form/ERPFormModal";
import ERPFormField from "../Common/Form/ERPFormField";
import ERPTextArea from "../Common/Form/ERPTextArea";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

function GuestHouseFormModal({

    open,

    onClose,

    onSaved,

    selectedGuestHouse

}) {

    const [form, setForm] = useState({

        GuestHouseName: "",

        Location: "",

        Address: "",

        ContactPerson: "",

        ContactNo: "",

        ContactEmailID: ""

    });

    useEffect(() => {

        if (selectedGuestHouse) {

            setForm({

                GuestHouseName: selectedGuestHouse.GuestHouseName || "",

                Location: selectedGuestHouse.Location || "",

                Address: selectedGuestHouse.Address || "",

                ContactPerson: selectedGuestHouse.ContactPerson || "",

                ContactNo: selectedGuestHouse.ContactNo || "",

                ContactEmailID: selectedGuestHouse.ContactEmailID || ""

            });

        }

        else {

            setForm({

                GuestHouseName: "",

                Location: "",

                Address: "",

                ContactPerson: "",

                ContactNo: "",

                ContactEmailID: ""

            });

        }

    }, [selectedGuestHouse]);

    if (!open) return null;

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async () => {

        try {

            if (selectedGuestHouse) {

                await axios.put(

                    `${API_URL}/api/admin/guesthouses/${selectedGuestHouse.GuestHouseID}`,

                    form

                );

            }

            else {

                await axios.post(

                    `${API_URL}/api/admin/guesthouses`,

                    form

                );

            }

            onSaved();

            onClose();

        }

        catch (err) {

            alert(

                err.response?.data?.message ||

                "Unable to save Guest House."

            );

        }

    };


    return (

        <ERPFormModal

            open={open}

            title={
                selectedGuestHouse

                    ?

                    "Edit Guest House"

                    :

                    "Add Guest House"
            }

            onSave={handleSubmit}

            onClose={onClose}

        >

            <ERPFormField

                label="Guest House Name"

                required

                name="GuestHouseName"

                value={form.GuestHouseName}

                onChange={handleChange}

            />

            <ERPFormField

                label="Location"

                name="Location"

                value={form.Location}

                onChange={handleChange}

            />

            <ERPTextArea

                label="Address"

                name="Address"

                value={form.Address}

                onChange={handleChange}

            />

            <ERPFormField

                label="Contact Person"

                name="ContactPerson"

                value={form.ContactPerson}

                onChange={handleChange}

            />

            <ERPFormField

                label="Contact Number"

                name="ContactNo"

                value={form.ContactNo}

                onChange={handleChange}

            />

            <ERPFormField

                label="Contact Email"

                type="email"

                name="ContactEmailID"

                value={form.ContactEmailID}

                onChange={handleChange}

            />

        </ERPFormModal>

    );

}

export default GuestHouseFormModal;