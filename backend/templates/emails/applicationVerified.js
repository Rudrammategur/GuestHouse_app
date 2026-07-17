module.exports = (data) => {

    return {

        subject: "Guest House Booking Application Verified",

        html: `
            <p>Dear ${data.EmployeeName},</p>

            <p>Your Guest House Booking Application has been verified successfully.</p>

            <p>Booking Number: ${data.BookingNo}</p>

            <p>Current Status: Verified</p>

            <p>Your application has been forwarded for approval.</p>

            <p>Regards,<br/>
            Guest House Management System</p>
        `
    };

};