const sql = require("mssql");
const { poolPromise } = require("../config/db");

exports.generateBookingNumbers = async (transaction) => {

    const request = new sql.Request(transaction);

    const result = await request.query(`
        SELECT TOP 1
            GHBookingID,
            GHRBookingNo
        FROM GuestHouseRoomBookings
        ORDER BY CreatedDate DESC
    `);

    let bookingID;
    let bookingNo;

    if (result.recordset.length === 0) {

        bookingID = "GHB000001";

        bookingNo =
            `GHR${new Date().getFullYear()}00001`;

    }
    else {

        const lastBookingID =
            result.recordset[0].GHBookingID;

        const lastNumber =
            parseInt(
                lastBookingID.replace("GHB", "")
            );

        const nextNumber =
            lastNumber + 1;

        bookingID =
            `GHB${String(nextNumber).padStart(6, "0")}`;

        bookingNo =
            `GHR${new Date().getFullYear()}${String(nextNumber).padStart(5, "0")}`;

    }

    return {

        bookingID,

        bookingNo

    };

};