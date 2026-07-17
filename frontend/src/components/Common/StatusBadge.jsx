import "./statusBadge.css";

function StatusBadge({

    status = "",

    size = "md"

}) {

    const getClassName = () => {

        switch (status.toLowerCase()) {

            case "submitted":

                return "submitted";

            case "verified":

                return "verified";

            case "approved":

                return "approved";

            case "rejected":

                return "rejected";

            case "allocated":

                return "allocated";

            case "checked in":

                return "checked-in";

            case "checked out":

                return "checked-out";

            case "cancelled":

                return "cancelled";

            case "pending":

                return "pending";

            default:

                return "default";

        }

    };

    return (

        <span

            className={`

                status-badge

                status-${getClassName()}

                status-${size}

            `}

        >

            {status}

        </span>

    );

}

export default StatusBadge;