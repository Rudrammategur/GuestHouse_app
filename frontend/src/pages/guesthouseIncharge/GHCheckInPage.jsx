import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ApplicationView from "../../components/Dashboard/ApplicationView/ApplicationView";
import "../../styles/ghCheckIn.css";
import PageHeader from "../../components/Common/PageHeader";
import Button from "../../components/Common/Button/Button";
import ApplicationSummary from "../../components/Dashboard/ApplicationView/ApplicationSummary";
import InfoCard from "../../components/Common/InfoCard/InfoCard";
import { toast } from "react-toastify";
import ERPSelectField from "../../components/Common/Form/ERPSelectField";
import ERPFormField from "../../components/Common/Form/ERPFormField";
import ERPTextArea from "../../components/Common/Form/ERPTextArea";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";


function GHCheckInPage() {

    const navigate = useNavigate();

    const { bookingId } = useParams();

    const addOccupant = () => {

        setOccupants(prev => [

            ...prev,

            {
                name: "",
                gender: "",
                age: "",
                relationship: "",
                proofType: "",
                proofNumber: "",
                proofFile: null
            }

        ]);

    };

    const handleOccupantChange = (index, field, value) => {

        const updated = [...occupants];

        updated[index][field] = value;

        setOccupants(updated);

    };

    const removeOccupant = (index) => {

        setOccupants(

            occupants.filter((_, i) => i !== index)

        );

    };

    const [application, setApplication] = useState({

        Allocations: [],

        RoomRequirements: []

    });

    useEffect(() => {

        loadApplication();

    }, []);

    const loadApplication = async () => {

        const res = await axios.get(

            `${API_URL}/api/guesthouse-incharge/checkin/${bookingId}`

        );

        setApplication(res.data);

    };

    const [primaryGuest, setPrimaryGuest] = useState({
        proofType: "",
        proofNumber: "",
        document: null
    });

    const [occupants, setOccupants] = useState([
        {
            name: "",
            relationship: "",
            age: "",
            proofType: "",
            proofNumber: "",
            document: null
        }
    ]);

    const [remarks, setRemarks] = useState("");

    const [selectedOccupant, setSelectedOccupant] = useState(null);

    const [showDocumentModal, setShowDocumentModal] = useState(false);


    const [idProofType, setIdProofType] =
        useState("");

    const [idProofNo, setIdProofNo] =
        useState("");

    const handleCheckIn = async () => {

        try {

            const formData = new FormData();

            formData.append(
                "proofType",
                primaryGuest.proofType
            );

            formData.append(
                "proofNumber",
                primaryGuest.proofNumber
            );

            formData.append(
                "remarks",
                remarks
            );

            formData.append(
                "document",
                primaryGuest.document
            );

            formData.append(
                "occupants",
                JSON.stringify(occupants)
            );

            await axios.post(

                `${API_URL}/api/guesthouse-incharge/checkin/${bookingId}`,

                formData,

                {

                    headers: {

                        "Content-Type": "multipart/form-data"

                    }

                }

            );

            toast.success("Guest checked in successfully.");

            navigate("/gh-incharge");

        }

        catch (err) {

            console.log(err);

            toast.error(

                err.response?.data?.message ||

                "Check-In failed."

            );

        }

    };

    const updateOccupant = (
        index,
        field,
        value
    ) => {

        const updatedOccupants =
            [...occupants];

        updatedOccupants[index][field] =
            value;

        setOccupants(updatedOccupants);

    };

    const proofTypes = [

        {
            label: "Aadhaar Card",
            value: "Aadhaar"
        },

        {
            label: "PAN Card",
            value: "PAN"
        },

        {
            label: "Passport",
            value: "Passport"
        },

        {
            label: "Driving Licence",
            value: "Driving Licence"
        },

        {
            label: "Voter ID",
            value: "Voter ID"
        },

        {
            label: "Any Government ID",
            value: "Any Government ID"
        }

    ];


    return (
        <div className="checkin-container">

            <PageHeader
                title="Guest Check-In"
                subtitle={`Booking No : ${application.GHRBookingNo}`}
                actions={
                    <Button
                        variant="outline"
                        onClick={() => navigate(-1)}
                    >
                        ← Back
                    </Button>
                }
            />

            {/* Summary Cards */}
            <ApplicationSummary application={application} />

            {/* Workspace */}

            <div className="workflow-layout">

                {/* LEFT PANEL */}

                <div className="workflow-left">

                    <ApplicationView
                        application={application}
                        hideHeader
                        hideSummary
                    />
                </div>

                {/* RIGHT PANEL */}

                <div className="workflow-right">

                    <InfoCard title="Guest Check-In">

                        {/* Primary Guest */}

                        <div className="section-block">

                            <h4>Primary Guest Verification</h4>

                            <ERPSelectField
                                label="Proof Type"
                                value={primaryGuest.proofType}
                                onChange={(e) =>
                                    setPrimaryGuest({
                                        ...primaryGuest,
                                        proofType: e.target.value
                                    })
                                }
                                options={proofTypes}
                            />

                            <ERPFormField
                                label="Proof Number"
                                value={primaryGuest.proofNumber}
                                onChange={(e) =>
                                    setPrimaryGuest({
                                        ...primaryGuest,
                                        proofNumber: e.target.value
                                    })
                                }
                            />

                            <div className="full-width">

                                <label>Upload Proof</label>

                                <input

                                    type="file"

                                    onChange={(e) =>

                                        handleOccupantChange(

                                            index,

                                            "proofFile",

                                            e.target.files[0]

                                        )

                                    }

                                />

                            </div>

                        </div>

                        <hr />

                        {/* Occupants */}

                        <div className="section-block">

                            <div className="section-header">

                                <h4>Additional Occupants</h4>

                                <Button onClick={addOccupant}>

                                    + Add Occupant

                                </Button>

                            </div>

                            {

                                occupants.map((occupant, index) => (

                                    <div
                                        className="occupant-card"
                                        key={index}
                                    >

                                        <h5>

                                            Occupant {index + 1}

                                        </h5>

                                        <div className="occupant-grid">

                                            <ERPFormField

                                                label="Name"

                                                value={occupant.name}

                                                onChange={(e) =>

                                                    handleOccupantChange(

                                                        index,

                                                        "name",

                                                        e.target.value

                                                    )

                                                }

                                            />

                                            <ERPSelectField

                                                label="Gender"

                                                value={occupant.gender}

                                                onChange={(e) =>

                                                    handleOccupantChange(

                                                        index,

                                                        "gender",

                                                        e.target.value

                                                    )

                                                }

                                            />

                                            <ERPFormField

                                                label="Age"

                                                value={occupant.age}

                                                onChange={(e) =>

                                                    handleOccupantChange(

                                                        index,

                                                        "age",

                                                        e.target.value

                                                    )

                                                }

                                            />

                                            <ERPFormField

                                                label="Relationship"

                                                value={occupant.relationship}

                                                onChange={(e) =>

                                                    handleOccupantChange(

                                                        index,

                                                        "relationship",

                                                        e.target.value

                                                    )

                                                }

                                            />

                                            <ERPSelectField
                                                label="Proof Type"
                                                value={occupant.proofType}
                                                options={proofTypes}
                                                onChange={(e) =>
                                                    handleOccupantChange(index, "proofType", e.target.value)
                                                }
                                            />

                                            <ERPFormField

                                                label="Proof Number"

                                                value={occupant.proofNumber}

                                                onChange={(e) =>

                                                    handleOccupantChange(

                                                        index,

                                                        "proofNumber",

                                                        e.target.value

                                                    )

                                                }

                                            />

                                            <div className="full-width">

                                                <label>Upload Proof</label>

                                                <input

                                                    type="file"

                                                    onChange={(e) =>

                                                        handleOccupantChange(

                                                            index,

                                                            "proofFile",

                                                            e.target.files[0]

                                                        )

                                                    }

                                                />

                                            </div>

                                        </div>

                                        <Button

                                            variant="danger"

                                            onClick={() => removeOccupant(index)}

                                        >

                                            Remove Occupant

                                        </Button>

                                    </div>

                                ))

                            }

                        </div>

                        <hr />

                        <ERPTextArea

                            label="Remarks"

                            rows={4}

                            value={remarks}

                            onChange={(e) =>
                                setRemarks(e.target.value)
                            }

                        />

                        {/* Footer */}

                        <div className="action-footer">

                            <Button
                                variant="outline"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </Button>

                            <Button
                                onClick={handleCheckIn}
                            >
                                Confirm Check-In
                            </Button>

                        </div>

                    </InfoCard>

                </div>

            </div>

        </div>
    );
}

export default GHCheckInPage;