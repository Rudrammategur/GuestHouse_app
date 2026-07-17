import "./workflow.css";

function WorkflowTable({

    applications = [],

    onViewTimeline

}) {

    const getStatusClass = (status) => {

        switch (status) {

            case "Submitted":

                return "status-submitted";

            case "Verified":

                return "status-verified";

            case "Approved":

                return "status-approved";

            case "Allocated":

                return "status-allocated";

            case "CheckedIn":

                return "status-checkedin";

            case "CheckedOut":

                return "status-checkedout";

            case "Rejected":

                return "status-rejected";

            case "Cancelled":

                return "status-cancelled";

            default:

                return "";

        }

    };

    const calculatePendingDays = (createdDate) => {

        if (!createdDate) return "-";

        const created = new Date(createdDate);

        const today = new Date();

        const diff = today - created;

        return Math.floor(diff / (1000 * 60 * 60 * 24));

    };

    if (applications.length === 0) {

        return (

            <div className="workflow-empty">

                No workflow records found.

            </div>

        );

    }

    return (

        <div className="workflow-table-container">

            <table className="workflow-table">

                <thead>

                    <tr>

                        <th>Booking No</th>

                        <th>Guest Name</th>

                        <th>Current Status</th>

                        <th>Pending With</th>

                        <th>Created Date</th>

                        <th>Days Pending</th>

                        <th>Timeline</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        applications.map(application => (

                            <tr key={application.GHBookingID}>

                                <td>

                                    {application.GHRBookingNo}

                                </td>

                                <td>

                                    {application.GuestName}

                                </td>

                                <td>

                                    <span

                                        className={`workflow-status ${getStatusClass(

                                            application.BookingStatus

                                        )}`}

                                    >

                                        {application.BookingStatus}

                                    </span>

                                </td>

                                <td>

                                    {application.PendingWith || "-"}

                                </td>

                                <td>

                                    {

                                        application.CreatedDate

                                            ?

                                            new Date(

                                                application.CreatedDate

                                            ).toLocaleDateString()

                                            :

                                            "-"

                                    }

                                </td>

                                <td>

                                    {

                                        calculatePendingDays(

                                            application.CreatedDate

                                        )

                                    }

                                </td>

                                <td>

                                    <button

                                        className="timeline-btn"

                                        onClick={() =>

                                            onViewTimeline(

                                                application.GHBookingID

                                            )

                                        }

                                    >

                                        View Timeline

                                    </button>

                                </td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

}

export default WorkflowTable;