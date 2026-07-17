import { useEffect, useState } from "react";
import axios from "axios";

import ERPFormModal from "../Common/Form/ERPFormModal";
import ERPFormField from "../Common/Form/ERPFormField";
import ERPSelectField from "../Common/Form/ERPSelectField";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

function RoomChargesFormModal({

    open,

    onClose,

    onSaved,

    selectedCharge,

    guestHouses,

    roomTypes

}) {

    const [form, setForm] = useState({

        GuestHouseID: "",

        RoomTypeID: "",

        IsSingleOccupancy: "true",

        DayRate: "",

        FifteenDayRate: "",

        ThirtyDayRate: ""

    });

    const occupancyOptions = [

        {

            label: "Single Occupancy",

            value: "true"

        },

        {

            label: "Double Occupancy",

            value: "false"

        }

    ];

    useEffect(() => {

        if (selectedCharge) {

            setForm({

                GuestHouseID:

                    selectedCharge.GuestHouseID || "",

                RoomTypeID:

                    selectedCharge.RoomTypeID || "",

                IsSingleOccupancy:

                    String(selectedCharge.IsSingleOccupancy),

                DayRate:

                    selectedCharge.DayRate || "",

                FifteenDayRate:

                    selectedCharge.FifteenDayRate || "",

                ThirtyDayRate:

                    selectedCharge.ThirtyDayRate || ""

            });

        }

        else {

            setForm({

                GuestHouseID: "",

                RoomTypeID: "",

                IsSingleOccupancy: "true",

                DayRate: "",

                FifteenDayRate: "",

                ThirtyDayRate: ""

            });

        }

    }, [selectedCharge]);

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async () => {

        if (!form.GuestHouseID) {

            alert("Please select Guest House.");

            return;

        }

        if (!form.RoomTypeID) {

            alert("Please select Room Type.");

            return;

        }

        if (!form.DayRate) {

            alert("Please enter Day Rate.");

            return;

        }

        const payload = {

            GuestHouseID: form.GuestHouseID,

            RoomTypeID: form.RoomTypeID,

            IsSingleOccupancy:

                form.IsSingleOccupancy === "true",

            DayRate: Number(form.DayRate),

            FifteenDayRate:

                Number(form.FifteenDayRate || 0),

            ThirtyDayRate:

                Number(form.ThirtyDayRate || 0)

        };

        try {

            if (selectedCharge) {

                await axios.put(

                    `${API_URL}/api/admin/room-charges/${selectedCharge.GHRCID}`,

                    payload

                );

            }

            else {

                await axios.post(

                    `${API_URL}/api/admin/room-charges`,

                    payload

                );

            }

            onSaved();

            onClose();

        }

        catch (err) {

            alert(

                err.response?.data?.message ||

                "Unable to save room charges."

            );

        }

    };

    return (

        <ERPFormModal

            open={open}

            title={

                selectedCharge

                    ?

                    "Edit Room Charges"

                    :

                    "Add Room Charges"

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

                label="Room Type"

                required

                name="RoomTypeID"

                value={form.RoomTypeID}

                onChange={handleChange}

                options={

                    roomTypes.map(item => ({

                        value: item.RoomTypeID,

                        label: item.RoomTypeName

                    }))

                }

            />

            <ERPSelectField

                label="Occupancy"

                required

                name="IsSingleOccupancy"

                value={form.IsSingleOccupancy}

                onChange={handleChange}

                options={occupancyOptions}

            />

            <ERPFormField

                label="Day Rate"

                required

                type="number"

                name="DayRate"

                value={form.DayRate}

                onChange={handleChange}

            />

            <ERPFormField

                label="15 Day Rate"

                type="number"

                name="FifteenDayRate"

                value={form.FifteenDayRate}

                onChange={handleChange}

            />

            <ERPFormField

                label="30 Day Rate"

                type="number"

                name="ThirtyDayRate"

                value={form.ThirtyDayRate}

                onChange={handleChange}

            />

        </ERPFormModal>

    );

}

export default RoomChargesFormModal;