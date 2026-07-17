const sql = require("mssql");
const { poolPromise } = require("../config/db");

exports.getBookingDetails = async (req, res) => {

    try {

        const bookingId = req.params.bookingId;

        const pool = await poolPromise;

        //-----------------------------------------
        // Booking
        //-----------------------------------------

        const booking =
            await pool.request()

                .input(
                    "BookingID",
                    sql.VarChar,
                    bookingId
                )

                .query(`

SELECT *

FROM GuestHouseRoomBookings

WHERE GHBookingID=@BookingID

`);

        if (
            booking.recordset.length === 0
        ) {

            return res.status(404).json({

                success: false,

                message: "Booking not found"

            });

        }

        //-----------------------------------------
        // Room Requirements
        //-----------------------------------------

        const roomRequirements =
            await pool.request()

                .input(
                    "BookingID",
                    sql.VarChar,
                    bookingId
                )

                .query(`

SELECT

d.*,

r.RoomTypeName

FROM GuestHouseBookingRoomDetails d

INNER JOIN RoomTypeMaster r

ON d.RoomTypeID=r.RoomTypeID

WHERE

d.GHBookingID=@BookingID

`);

        //-----------------------------------------
        // Allocated Rooms
        //-----------------------------------------

        const allocatedRooms =
            await pool.request()

                .input(
                    "BookingID",
                    sql.VarChar,
                    bookingId
                )

                .query(`

SELECT

a.*,

g.GHRoomNo,

rt.RoomTypeName

FROM GuestHouseRoomAllocation a

INNER JOIN GuestHouseRooms g

ON a.GuestHouseRoomID=g.GHRMID

INNER JOIN RoomTypeMaster rt

ON g.RoomTypeID=rt.RoomTypeID

WHERE

a.GHBookingID=@BookingID

`);

        //-----------------------------------------
        // Workflow History
        //-----------------------------------------

        const workflow =
            await pool.request()

                .input(
                    "BookingID",
                    sql.VarChar,
                    bookingId
                )

                .query(`

SELECT

CurrentStatus,

ActionBy,

Remarks,

ActionDate

FROM GuestHouseBookingWorkflowHistory

WHERE

GHBookingID=@BookingID

ORDER BY

ActionDate

`);

        //-----------------------------------------
        // Other Occupants
        //-----------------------------------------

        const occupants =
            await pool.request()

                .input(
                    "BookingID",
                    sql.VarChar,
                    bookingId
                )

                .query(`

SELECT *

FROM GuestHouseOccupants

WHERE

GHBookingID=@BookingID

`);

        //-----------------------------------------

        res.json({

            success: true,

            booking:
                booking.recordset[0],

            roomRequirements:
                roomRequirements.recordset,

            allocatedRooms:
                allocatedRooms.recordset,

            workflowHistory:
                workflow.recordset,

            occupants:
                occupants.recordset

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};