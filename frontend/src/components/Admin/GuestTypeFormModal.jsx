import { useEffect, useState } from "react";
import axios from "axios";

import ERPFormModal from "../Common/Form/ERPFormModal";
import ERPFormField from "../Common/Form/ERPFormField";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

function GuestTypeFormModal({

    open,

    onClose,

    onSaved,

    selectedGuestType

}) {

    const [form, setForm] = useState({

        GuestTypeName: ""

    });

    useEffect(() => {

        if (selectedGuestType) {

            setForm({

                GuestTypeName:

                    selectedGuestType.GuestTypeName || ""

            });

        }

        else {

            setForm({

                GuestTypeName: ""

            });

        }

    }, [selectedGuestType]);

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async () => {

        if (selectedGuestType) {

            await axios.put(

                `${API_URL}/api/admin/guest-types/${selectedGuestType.GuestTypeID}`,

                form

            );

        }

        else {

            await axios.post(

                `${API_URL}/api/admin/guest-types`,

                form

            );

        }

        onSaved();

        onClose();

    };

    return (

        <ERPFormModal

            open={open}

            title={

                selectedGuestType

                    ?

                    "Edit Guest Type"

                    :

                    "Add Guest Type"

            }

            onSave={handleSubmit}

            onClose={onClose}

        >

            <ERPFormField

                label="Guest Type Name"

                required

                name="GuestTypeName"

                value={form.GuestTypeName}

                onChange={handleChange}

            />

        </ERPFormModal>

    );

}

export default GuestTypeFormModal;