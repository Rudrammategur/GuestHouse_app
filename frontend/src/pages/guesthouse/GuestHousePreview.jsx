import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../../styles/guestHousePreview.css";


function GuestHousePreview() {

    const navigate = useNavigate();
    const location = useLocation();
    const localData =
        JSON.parse(localStorage.getItem("guestHouseDraft")) || {};

    const data = location.state || localData;

    console.log("Preview Data:", data);

    const openDocument = () => {

        if (!data?.uploadedFileUrl) return;

        if (data.uploadedFileUrl.startsWith("data:application/pdf")) {

            const response = fetch(data.uploadedFileUrl);

            response
                .then((res) => res.blob())
                .then((blob) => {

                    const blobUrl =
                        URL.createObjectURL(blob);

                    window.open(
                        blobUrl,
                        "_blank"
                    );

                });

        } else {

            window.open(
                data.uploadedFileUrl,
                "_blank"
            );

        }
    };

    const totalRoomsReq = data.roomRequirements.reduce(
        (total, room) => total + Number(room.noOfRooms),
        0
    );

    console.log("Uploaded File:", data.uploadedFile);

    const formData = new FormData();

    formData.append(
        "GuestTypeID",
        data.guestType
    );

    formData.append(
        "GuestName",
        data.guestName
    );

    formData.append(
        "GuestDesignation",
        data.designation
    );

    formData.append(
        "GuestAddress",
        data.guestAddress
    );

    formData.append(
        "PurposeOfVisit",
        data.purpose
    );

    formData.append(
        "GuestHouseID",
        data.GuestHouseID
    );

    formData.append(
        "OccupantsNo",
        Number(data.occupancy)
    );

    formData.append(
        "TotalRoomsReq",
        totalRoomsReq
    );

    formData.append(
        "GuestContactNo",
        data.contact
    );

    formData.append(
        "GuestEmailID",
        data.email
    );

    formData.append(
        "GuestNationality",
        data.nationality
    );

    formData.append(
        "ArrivalDateTime",
        data.arrivalDate
    );

    formData.append(
        "DepartureDateTime",
        data.departureDate
    );

    formData.append(
        "SpecialRequirements",
        data.special
    );

    formData.append(
        "ExpenditureHead",
        data.expenditureHeadType
    );

    formData.append(
        "ProjectNo",
        data.projectDetails
    );

    formData.append(

        "RoomRequirements",

        JSON.stringify(

            data.roomRequirements.map(room => ({

                RoomTypeID:
                    room.roomTypeId,

                NoOfRooms:
                    room.noOfRooms

            }))

        )

    );

    if (data.uploadedFile) {

        formData.append(

            "SupportingDoc",

            data.uploadedFile

        );

    }

    // const fileUrl = data.uploadedFile
    //     ? URL.createObjectURL(data.uploadedFile)
    //     : null;

    const isImage =
        data?.uploadedFileUrl &&
        (
            data.uploadedFileUrl.includes(".jpg") ||
            data.uploadedFileUrl.includes(".jpeg") ||
            data.uploadedFileUrl.includes(".png")
        );

    const handleSubmit = async () => {

        try {

            console.log("Uploaded file size", data.uploadedFile?.size);

            for (const pair of formData.entries()) {

                console.log(pair[0], pair[1]);

            }

            await axios.post(

                "http://localhost:5000/api/guesthouse",

                formData,

            );

            toast.success("Application submitted successfully.");

            localStorage.removeItem("guestHouseDraft");

            navigate("/guesthouse/dashboard", {
                replace: true
            });

        }
        catch (err) {

            console.log("ERROR:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Submission failed");

        }

    };

    if (!data) {
        return (
            <div>
                <h2>No Draft Found</h2>
                <button onClick={() => navigate("/guesthouse")}>
                    Back to Form
                </button>
            </div>
        );
    }

    return (
        <div className="preview-container">

            <div className="preview-header">
                <h1>Guest House Booking Preview</h1>
                <p>Please review the details before submitting.</p>
            </div>

            {/* Guest Information */}
            <div className="preview-card">

                <h2>👤 Guest Information</h2>

                <div className="preview-grid">

                    <div className="preview-item">
                        <label>Guest Type</label>
                        <span>{data.guestTypeName}</span>
                    </div>

                    <div className="preview-item">
                        <label>Guest Name</label>
                        <span>{data.guestName}</span>
                    </div>

                    <div className="preview-item">
                        <label>Designation</label>
                        <span>{data.designation}</span>
                    </div>

                    <div className="preview-item">
                        <label>Guest Address</label>
                        <span>{data.GuestAddress}</span>
                    </div>

                    <div className="preview-item">
                        <label>Contact Number</label>
                        <span>{data.mobile}</span>
                    </div>

                    <div className="preview-item">
                        <label>Email</label>
                        <span>{data.email}</span>
                    </div>

                    <div className="preview-item">
                        <label>Nationality</label>
                        <span>{data.nationality}</span>
                    </div>

                </div>

            </div>


            {/* Visit Information */}
            <div className="preview-card">

                <h2>📅 Visit Information</h2>

                <div className="preview-grid">

                    <div className="preview-item">
                        <label>Purpose of Visit</label>
                        <span>{data.purpose}</span>
                    </div>

                    <div className="preview-item">
                        <label>Arrival Date</label>
                        <span>
                            {new Date(data.arrivalDate).toLocaleString()}
                        </span>
                    </div>

                    <div className="preview-item">
                        <label>Departure Date</label>
                        <span>
                            {new Date(data.departureDate).toLocaleString()}
                        </span>
                    </div>

                </div>

            </div>


            {/* Accommodation Details */}
            <div className="preview-card">

                <h2>🏠 Accommodation Details</h2>

                <div className="preview-grid">

                    <div className="preview-item">
                        <label>Expenditure Head</label>
                        <span>{data.expenditureHeadType}</span>
                    </div>

                    {(data.roomRequirements || []).map((room, index) => (
                        <div className="preview-item" key={`${room.roomTypeId}-${index}`}>
                            <label>{room.roomTypeName || "Room Type"}</label>
                            <span>{room.noOfRooms} room(s)</span>
                        </div>
                    ))}

                    <div className="preview-item">
                        <label>Rooms Required</label>
                        <span>{data.totalRooms || data.rooms}</span>
                    </div>

                    <div className="preview-item">
                        <label>Occupancy</label>
                        <span>{data.occupancy}</span>
                    </div>

                </div>

            </div>

            {/* Additional Information */}
            <div className="preview-card">

                <h2>📝 Additional Information</h2>

                <div className="preview-item full-width">

                    <label>Special Requirements</label>

                    <span>{data.special || "-"}</span>

                </div>

            </div>


            {data?.uploadedFileUrl && (
                <div className="preview-card document-card">

                    <h4>📎 Supporting Document</h4>

                    <div className="document-preview">

                        {isImage ? (
                            <img
                                src={data.uploadedFileUrl}
                                className="preview-image"
                                alt="document"
                            />
                        ) : (
                            <div className="file-box">
                                📄 PDF Uploaded
                            </div>
                        )}

                    </div>

                    <div className="document-actions">

                        <button
                            type="button"
                            className="view-btn"
                            onClick={openDocument}
                        >
                            View Document
                        </button>

                        <a
                            href={data.uploadedFileUrl}
                            download="GuestHouseDocument"
                            className="download-btn"
                        >
                            Download
                        </a>

                    </div>

                </div>
            )}


            <div className="button-container">

                <button
                    className="edit-btn"
                    onClick={() => navigate("/guesthouse/apply")}
                >
                    Edit
                </button>

                <button
                    className="submit-btn"
                    onClick={handleSubmit}
                >
                    Submit Request
                </button>

            </div>

        </div>
    );
}

export default GuestHousePreview;
