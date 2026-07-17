import { useNavigate } from "react-router-dom";
import Button from "../Common/Button/Button";

function BookingActions({ booking,

    onView,

    onCancel,

    onPrint,

    onEdit }) {

    const navigate = useNavigate();

    switch (booking.BookingStatus) {

        case "Draft":

            return (
                <Button onClick={onEdit}>
                    Edit
                </Button>
            );

        case "Submitted":

            return (
                <div className="action-buttons">

                    <Button onClick={onView}>
                        View
                    </Button>

                    <Button
                        variant="danger"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>

                </div>
            );

        case "Approved":

            return (
                <div className="action-buttons">

                    <Button onClick={onView}>
                        View
                    </Button>

                    <Button
                        variant="outline"
                        onClick={onPrint}
                    >
                        Print
                    </Button>

                </div>
            );

        default:

            return (
                <Button
                    onClick={() =>
                        navigate(`/guesthouse/application/${booking.GHBookingID}`)
                    }
                >
                    View
                </Button>
            );
    }
}

export default BookingActions;