function BookingHeader({ booking }) {

    return (

        <div className="workspace-header">

            <div>

                <h2>

                    {booking?.GHRBookingNo}

                </h2>

                <span>

                    {booking?.GuestName}

                </span>

            </div>

            <div>

                <span className="status-pill">

                    {booking?.BookingStatus}

                </span>

            </div>

        </div>

    );

}

export default BookingHeader;