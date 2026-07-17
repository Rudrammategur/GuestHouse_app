module.exports = (data) => {

    return {

        subject: "Guest House Booking Application Submitted",

        html: `
            <p>Dear ${data.EmployeeName},</p>

            <p>Your Guest House Booking Application has been submitted successfully.</p>

            <ul>
                <li>Booking Number: ${data.BookingNo}</li>
                <li>Guest Name: ${data.GuestName}</li>
                <li>Arrival Date: ${data.ArrivalDate}</li>
                <li>Departure Date: ${data.DepartureDate}</li>
            </ul>

            <p>Current Status: Submitted</p>

            <p>Regards,<br/>
            Guest House Management System<br/>
            IIT Dharwad</p>
        `
    };

};