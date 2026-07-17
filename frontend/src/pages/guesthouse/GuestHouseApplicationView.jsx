import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../../styles/guestHouseApplicationView.css";


import WorkflowLogs from "../../components/Workflow/WorkflowLogs";
import ERPPage from "../../components/Common/ERPPage";
import PageHeader from "../../components/Common/PageHeader";
import DashboardCards from "../../components/Dashboard/DashboardCards";
import StatusBadge from "../../components/Common/StatusBadge";
import InfoCard from "../../components/Common/InfoCard";

import { ACTIONS, getAvailableActions } from "../../utils/applicationActions";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

const formatDate = (value) => {

    if (!value)
        return "-";

    return new Date(value).toLocaleString(
        "en-IN",
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    );

};

function InfoRow({

    label,

    value

}) {

    return (

        <div className="info-row">

            <label>

                {label}

            </label>

            <span>

                {value || "-"}

            </span>

        </div>

    );

}

function GuestHouseApplicationView() {

    const navigate = useNavigate();

    const { bookingId } = useParams();

    const [loading, setLoading] =
        useState(true);

    const [details, setDetails] =
        useState(null);

    const [currentUser, setCurrentUser] =
        useState(null);

    useEffect(() => {

        if (bookingId) {

            loadData();

        }

    }, [bookingId]);

    const loadData = async () => {

        try {

            const [

                applicationResponse,

                currentUserResponse

            ] = await Promise.all([

                axios.get(

                    `${API_URL}/api/guesthouse/application/${bookingId}`

                ),

                axios.get(

                    `${API_URL}/api/user/current-user`

                )

            ]);

            setDetails(

                applicationResponse.data

            );

            setCurrentUser(

                currentUserResponse.data.user ||

                currentUserResponse.data

            );

        }

        catch (err) {

            console.log(err);

            toast.error(

                err.response?.data?.message ||

                "Unable to load application."

            );

        }

        finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (

            <div className="application-loading">

                Loading application...

            </div>

        );

    }

    if (!details) {

        return (

            <div className="application-loading">

                Application not found.

            </div>

        );

    }

    const handleVerify = async () => {

        const remarks = prompt(
            "Verification Remarks"
        );

        if (remarks === null)
            return;

        try {

            await axios.post(

                `${API_URL}/api/verifier/verify/${application.GHBookingID}`,

                {

                    remarks

                }

            );

            toast.success(
                "Application verified."
            );

            loadData();

        }

        catch (err) {

            toast.error(

                err.response?.data?.message ||

                "Verification failed."

            );

        }

    };

    const application = details.application;

    const actions = getAvailableActions(

        application,

        currentUser?.Roles || []

    );

    const summaryCards = [

        {
            label: "Status",
            count: application.BookingStatus,
            color: "primary"
        },

        {
            label: "Guest House",
            count: application.GuestHouseName,
            color: "info"
        },

        {
            label: "Guests",
            count: application.OccupantsNo,
            color: "warning"
        },

        {
            label: "Rooms",
            count: application.TotalRoomsReq,
            color: "success"
        }

    ];

    return (

        <ERPPage>

            <PageHeader

                title="Guest House Application"

                subtitle={`Booking No : ${details.header.bookingNo ||
                    application.GHRBookingNo
                    }`}

                actions={

                    <StatusBadge
                        status={application.BookingStatus}
                    />

                }

            />

            <DashboardCards cards={summaryCards} />
            {/* Guest Information */}

            <div className="application-grid-layout">

                <InfoCard title="Guest Information">

                    <h3>

                        Guest Information

                    </h3>

                    <div className="application-grid">

                        <InfoRow
                            label="Guest Type"
                            value={application.GuestTypeName}
                        />

                        <InfoRow
                            label="Guest Name"
                            value={application.GuestName}
                        />

                        <InfoRow
                            label="Designation"
                            value={application.GuestDesignation}
                        />

                        <InfoRow
                            label="Nationality"
                            value={application.GuestNationality}
                        />

                        <InfoRow
                            label="Mobile"
                            value={application.GuestContactNo}
                        />

                        <InfoRow
                            label="Email"
                            value={application.GuestEmailID}
                        />

                        <div className="info-row full-width">

                            <label>

                                Address

                            </label>

                            <span>

                                {application.GuestAddress || "-"}

                            </span>

                        </div>

                    </div>

                </InfoCard>



                {/* Visit Information */}

                <InfoCard title="Guest Information">

                    <h3>

                        Visit Information

                    </h3>

                    <div className="application-grid">

                        <InfoRow

                            label="Purpose"

                            value={application.PurposeOfVisit}

                        />

                        <InfoRow

                            label="Arrival"

                            value={formatDate(

                                application.ArrivalDateTime

                            )}

                        />

                        <InfoRow

                            label="Departure"

                            value={formatDate(

                                application.DepartureDateTime

                            )}

                        />

                        <InfoRow

                            label="Status"

                            value={application.BookingStatus}

                        />

                    </div>

                </InfoCard>



                {/* Accommodation */}

                <InfoCard title="Guest Information">

                    <h3>

                        Accommodation Details

                    </h3>

                    <div className="application-grid">

                        <InfoRow

                            label="Guest House"

                            value={application.GuestHouseName}

                        />

                        <InfoRow

                            label="Occupants"

                            value={application.OccupantsNo}

                        />

                    </div>

                    <table className="erp-table room-table">

                        <thead>

                            <tr>

                                <th>

                                    Room Type

                                </th>

                                <th>

                                    Rooms Required

                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                details.roomRequirements.map(

                                    room => (

                                        <tr

                                            key={room.RoomTypeName}

                                        >

                                            <td>

                                                {

                                                    room.RoomTypeName

                                                }

                                            </td>

                                            <td>

                                                {

                                                    room.NoOfRooms

                                                }

                                            </td>

                                        </tr>

                                    )

                                )

                            }

                        </tbody>

                    </table>

                </InfoCard>



                {/* Financial */}

                <InfoCard title="Guest Information">

                    <h3>

                        Financial Details

                    </h3>

                    <div className="application-grid">

                        <InfoRow

                            label="Expenditure Head"

                            value={application.ExpenditureHead}

                        />

                        <InfoRow

                            label="Project Number"

                            value={application.ProjectNo}

                        />

                    </div>

                </InfoCard>



                {/* Special Requirements */}

                <InfoCard className="full-width" title="Guest Information">

                    <h3>

                        Special Requirements

                    </h3>

                    <p className="remarks-box">

                        {

                            application.SpecialRequirements ||

                            "No special requirements."

                        }

                    </p>

                </InfoCard>



                {/* Supporting Document */}

                <InfoCard title="Guest Information">

                    <h3>

                        Supporting Document

                    </h3>

                    {

                        application.SupportingDocPath

                            ?

                            (

                                <div className="document-actions">

                                    <a

                                        href={`${API_URL}/${application.SupportingDocPath}`}

                                        target="_blank"

                                        rel="noreferrer"

                                        className="view-btn"

                                    >

                                        View Document

                                    </a>

                                </div>

                            )

                            :

                            (

                                <p>

                                    No document uploaded.

                                </p>

                            )

                    }
                </InfoCard>

                {/* Workflow History */}

                <InfoCard title="Guest Information">

                    <h3>

                        Workflow Logs

                    </h3>

                    {
                        details.WorkflowLogs?.length > 0
                            ? (
                                <WorkflowLogs
                                    moduleName="GuestHouseBooking"
                                    referenceId={application.GHBookingID}
                                />
                            )
                            : (
                                <p>No workflow logs available.</p>
                            )
                    }

                </InfoCard>


                {/* Allocation Details */}

                {
                    details.allocation && (

                        <InfoCard title="Guest Information">

                            <h3>

                                Allocation Details

                            </h3>

                            <div className="application-grid">

                                <InfoRow
                                    label="Room Number"
                                    value={details.allocation.RoomNo}
                                />

                                <InfoRow
                                    label="Room Type"
                                    value={details.allocation.RoomTypeName}
                                />

                                <InfoRow
                                    label="Allocated By"
                                    value={details.allocation.AllocatedBy}
                                />

                                <InfoRow
                                    label="Allocated On"
                                    value={formatDate(
                                        details.allocation.AllocatedDate
                                    )}
                                />

                            </div>

                        </InfoCard>

                    )
                }


                {/* Check In */}

                {
                    details.checkIn && (

                        <InfoCard title="Guest Information">

                            <h3>

                                Check In Details

                            </h3>

                            <div className="application-grid">

                                <InfoRow
                                    label="Checked In By"
                                    value={details.checkIn.CheckedInBy}
                                />

                                <InfoRow
                                    label="Checked In Time"
                                    value={formatDate(
                                        details.checkIn.CheckInDateTime
                                    )}
                                />

                            </div>

                        </InfoCard>

                    )
                }


                {/* Check Out */}

                {
                    details.checkOut && (

                        <InfoCard title="Guest Information">

                            <h3>

                                Check Out Details

                            </h3>

                            <div className="application-grid">

                                <InfoRow
                                    label="Checked Out By"
                                    value={details.checkOut.CheckedOutBy}
                                />

                                <InfoRow
                                    label="Checked Out Time"
                                    value={formatDate(
                                        details.checkOut.CheckOutDateTime
                                    )}
                                />

                            </div>

                        </InfoCard>



                    )
                }

            </div>


            {/* Footer Buttons */}

            <div className="application-footer">

                <button

                    className="secondary-btn"

                    onClick={() => navigate(-1)}

                >

                    Back

                </button>

                {

                    actions.includes(ACTIONS.EDIT) && (

                        <button

                            className="edit-btn"

                            onClick={() =>

                                navigate(`/guesthouse/application/${bookingId}/edit`)

                            }

                        >

                            Edit

                        </button>

                    )

                }

                {

                    actions.includes(ACTIONS.DELETE) && (

                        <button

                            className="danger-btn"

                            onClick={() => navigate(`/guesthouse/application/${bookingId}/cancel`)}

                        >

                            Delete

                        </button>

                    )

                }

                {

                    actions.includes(ACTIONS.CANCEL) && (

                        <button

                            className="danger-btn"
                            onClick={() => navigate(`/guesthouse/application/${bookingId}/cancel`)}

                        >

                            Cancel

                        </button>

                    )

                }

                {

                    actions.includes(ACTIONS.VERIFY) && (

                        <button

                            className="approve-btn"
                            onClick={handleVerify}

                        >

                            Verify

                        </button>

                    )

                }

                {

                    actions.includes(ACTIONS.APPROVE) && (

                        <button

                            className="approve-btn"

                        >

                            Approve

                        </button>

                    )

                }

                {

                    actions.includes(ACTIONS.REJECT) && (

                        <button

                            className="reject-btn"

                        >

                            Reject

                        </button>

                    )

                }

                {

                    actions.includes(ACTIONS.ALLOCATE) && (

                        <button

                            className="allocate-btn"

                            onClick={() =>

                                navigate(`/guesthouse/allocation/${bookingId}`)

                            }

                        >

                            Allocate Room

                        </button>

                    )

                }

                {

                    actions.includes(ACTIONS.CHECKIN) && (

                        <button

                            className="checkin-btn"

                            onClick={() =>

                                navigate(`/guesthouse/checkin/${bookingId}`)

                            }

                        >

                            Check In

                        </button>

                    )

                }

                {

                    actions.includes(ACTIONS.CHECKOUT) && (

                        <button

                            className="checkout-btn"

                            onClick={() =>

                                navigate(`/guesthouse/checkout/${bookingId}`)

                            }

                        >

                            Check Out

                        </button>

                    )

                }

                {

                    actions.includes(ACTIONS.PRINT) && (

                        <button

                            className="print-btn"

                        >

                            Print

                        </button>

                    )

                }

                {

                    actions.includes(ACTIONS.RECEIPT) && (

                        <button

                            className="receipt-btn"

                        >

                            Receipt

                        </button>

                    )

                }

            </div>

        </ERPPage>

    );

}

export default GuestHouseApplicationView;