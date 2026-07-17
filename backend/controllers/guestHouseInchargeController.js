const sql = require("mssql");
const { poolPromise } = require("../config/db");
const {
    getWorkflowHistory,
    changeWorkflowStatus
} = require("../services/WorkflowService");

const { generateAllocationId } = require("../utils/idGenerator");

exports.getApplications = async (req, res) => {

    try {

        const pool = await poolPromise;

        const actionRequired = String(req.query.actionRequired).toLowerCase() === "true";

        const status =
            actionRequired
                ? "Approved"
                : null;

        const request =
            pool.request();

        let query = `

SELECT

    b.GHBookingID,
    b.GHRBookingNo,
    b.GuestName,
    b.GuestDesignation,
    b.PurposeOfVisit,
    b.ArrivalDateTime,
    b.DepartureDateTime,
    b.BookingDateTime,
    b.BookingStatus,
    g.GuestHouseName,
    gt.GuestTypeName

FROM GuestHouseRoomBookings b

INNER JOIN GuestHouseMaster g
    ON b.GuestHouseID = g.GuestHouseID

INNER JOIN GuestTypeMaster gt
    ON b.GuestTypeID = gt.GuestTypeID

WHERE
    b.IsActive = 1
    AND b.BookingStatus IN
    (
        'Approved',
        'Allocated',
        'Checked In',
        'Checked Out'
    )


`;

        if (status) {

            query +=
                ` AND b.BookingStatus=@Status`;

            request.input(
                "Status",
                sql.VarChar,
                status
            );

        }

        query +=
            " ORDER BY BookingDateTime DESC";

        const result =
            await request.query(query);

        res.json(
            result.recordset
        );

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getDashboardCounts = async (req, res) => {

    try {

        const pool =
            await poolPromise;

        const result =
            await pool.request().query(`

SELECT

SUM(CASE WHEN BookingStatus='Approved' OR BookingStatus='Allocated' OR BookingStatus='Checked In' THEN 1 ELSE 0 END) TotalApplications,

SUM(CASE WHEN BookingStatus='Approved' THEN 1 ELSE 0 END) PendingForRoomAllocation,

SUM(CASE WHEN BookingStatus='Allocated' THEN 1 ELSE 0 END) PendingForCheckIn,

SUM(CASE WHEN BookingStatus='Checked In' THEN 1 ELSE 0 END) PendingForCheckOut

FROM GuestHouseRoomBookings

WHERE IsActive=1

`);

        res.json(
            result.recordset[0]
        );

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getApplication = async (req, res) => {

    try {

        const bookingId = req.params.bookingId;

        const pool = await poolPromise;

        //-------------------------------------------------------
        // Booking Details
        //-------------------------------------------------------

        const booking = await pool.request()

            .input(
                "BookingID",
                sql.VarChar,
                bookingId
            )

            .query(`

SELECT

b.*,

g.GuestHouseName,

gt.GuestTypeName

FROM GuestHouseRoomBookings b

INNER JOIN GuestHouseMaster g

ON b.GuestHouseID = g.GuestHouseID

INNER JOIN GuestTypeMaster gt

ON b.GuestTypeID = gt.GuestTypeID

WHERE

b.GHBookingID = @BookingID

`);

        if (booking.recordset.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Application not found"

            });

        }

        //-------------------------------------------------------
        // Room Requirements
        //-------------------------------------------------------

        const rooms = await pool.request()

            .input(
                "BookingID",
                sql.VarChar,
                bookingId
            )

            .query(`

SELECT

d.RoomTypeID,

r.RoomTypeName,

d.NoOfRooms

FROM GuestHouseBookingRoomDetails d

INNER JOIN RoomTypeMaster r

ON d.RoomTypeID = r.RoomTypeID

WHERE

d.GHBookingID = @BookingID

`);

        //-------------------------------------------------------

        const application = booking.recordset[0];

        application.RoomRequirements = rooms.recordset;

        const allocations = await pool.request()

            .input(
                "BookingID",
                sql.VarChar,
                bookingId
            )

            .query(`

SELECT

A.GHRAllocationID,

A.AllocatedRoom,

R.GHRoomNo AS RoomNumber,

RT.RoomTypeName,

A.IsSingleOccupancy,

A.DayRate,

A.AllocationStatus

FROM GuestHouseRoomAllocation A

INNER JOIN GuestHouseRoomMaster R
ON R.GHRMID=A.AllocatedRoom

INNER JOIN RoomTypeMaster RT
ON RT.RoomTypeID=R.RoomTypeID

WHERE

A.GHBookingID=@BookingID

`);


        application.Allocations = allocations.recordset;

        application.TotalRooms =
            rooms.recordset.reduce(

                (sum, room) =>

                    sum + Number(room.NoOfRooms),

                0

            );

        res.json(application);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getAvailableRooms = async (req, res) => {

    try {

        const pool = await poolPromise;

        const bookingId = req.params.bookingId;

        // Get booking details
        const bookingResult = await pool.request()

            .input(
                "BookingID",
                sql.VarChar,
                bookingId
            )

            .query(`

SELECT
    GuestHouseID,
    ArrivalDateTime,
    DepartureDateTime
FROM GuestHouseRoomBookings
WHERE GHBookingID=@BookingID

`);

        if (bookingResult.recordset.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Booking not found."

            });

        }

        const booking =
            bookingResult.recordset[0];

        // Get requested room types
        const roomRequirementResult = await pool.request()

            .input(
                "BookingID",
                sql.VarChar,
                bookingId
            )

            .query(`

SELECT
    RoomTypeID,
    NoOfRooms
FROM GuestHouseBookingRoomDetails
WHERE GHBookingID=@BookingID

`);

        // Fetch all available rooms
        const availableRooms = [];

        for (const requirement of roomRequirementResult.recordset) {

            const roomResult = await pool.request()

                .input(
                    "GuestHouseID",
                    sql.VarChar,
                    booking.GuestHouseID
                )

                .input(
                    "RoomTypeID",
                    sql.VarChar,
                    requirement.RoomTypeID
                )

                .input(
                    "ArrivalDateTime",
                    sql.DateTime,
                    booking.ArrivalDateTime
                )

                .input(
                    "DepartureDateTime",
                    sql.DateTime,
                    booking.DepartureDateTime
                )

                .query(`

SELECT

    R.GHRMID AS GuestHouseRoomID,

    R.GHRoomNo AS RoomNumber,

    R.RoomTypeID,

    RT.RoomTypeName,

    C1.DayRate AS SingleRate,

    C2.DayRate AS DoubleRate

FROM GuestHouseRoomMaster R

INNER JOIN RoomTypeMaster RT
ON RT.RoomTypeID = R.RoomTypeID

LEFT JOIN GuestHouseRoomCharges C1
ON C1.GuestHouseID = R.GuestHouseID
AND C1.RoomTypeID = R.RoomTypeID
AND C1.IsSingleOccupancy = 1

LEFT JOIN GuestHouseRoomCharges C2
ON C2.GuestHouseID = R.GuestHouseID
AND C2.RoomTypeID = R.RoomTypeID
AND C2.IsSingleOccupancy = 0

WHERE

    R.GuestHouseID = @GuestHouseID

    AND R.RoomTypeID = @RoomTypeID

    AND R.IsActive = 1

    AND NOT EXISTS
    (
        SELECT 1
        FROM GuestHouseRoomAllocation A
        WHERE
            A.AllocatedRoom = R.GHRMID
            AND A.CheckOutDateTime IS NULL
    )
`);

            availableRooms.push(

                ...roomResult.recordset

            );

        }

        res.json(availableRooms);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getReceiptDetails = async (req, res) => {

    try {

        const bookingId = req.params.bookingId;

        const pool = await poolPromise;

        const result = await pool.request()

            .input(
                "BookingID",
                sql.VarChar,
                bookingId
            )

            .query(`

SELECT

b.GHBookingID,

b.GHRBookingNo,

b.GuestName,

b.GuestDesignation,

b.BookedBy,

b.ArrivalDateTime,

b.DepartureDateTime,

b.AccommodationAmount,

b.MealCharges,

b.AdditionalCharges,

b.DiscountAmount,

b.TotalPayableAmount,

b.PaymentMode,

b.TransactionReference,

g.GuestHouseName,

STRING_AGG(r.GHRoomNo, ', ') AS RoomNumbers,

MIN(a.CheckInDateTime) AS CheckInDateTime,

MAX(a.CheckOutDateTime) AS CheckOutDateTime,

SUM(ISNULL(a.CheckInOccupantsNo,0)) AS Occupants

FROM GuestHouseRoomBookings b

LEFT JOIN GuestHouseMaster g

ON b.GuestHouseID = g.GuestHouseID

LEFT JOIN GuestHouseRoomAllocation a

ON b.GHBookingID = a.GHBookingID

LEFT JOIN GuestHouseRoomMaster r

ON a.AllocatedRoom = r.GHRMID

WHERE b.GHBookingID='@GHBookingID'

GROUP BY

b.GHBookingID,

b.GHRBookingNo,

b.GuestName,

b.GuestDesignation,

b.BookedBy,

b.ArrivalDateTime,

b.DepartureDateTime,

b.AccommodationAmount,

b.MealCharges,

b.AdditionalCharges,

b.DiscountAmount,

b.TotalPayableAmount,

b.PaymentMode,

b.TransactionReference,

g.GuestHouseName

`);

        if (result.recordset.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Receipt not found."

            });

        }

        res.json(result.recordset[0]);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

// exports.generateReceipt = async (req, res) => {

//     try {

//         const { bookingId } = req.params;

//         const {
//             accommodationAmount,
//             mealCharges,
//             additionalCharges,
//             discount,
//             paymentMode,
//             transactionReference
//         } = req.body;

//         const totalAmount =
//             Number(accommodationAmount)
//             +
//             Number(mealCharges)
//             +
//             Number(additionalCharges)
//             -
//             Number(discount);

//         // await generateId(
//         //     transaction,
//         //     {
//         //         table: "GuestHouseReceipt",
//         //         column: "ReceiptID",
//         //         prefix: "GHR"
//         //     }
//         // );

//         res.status(200).json({

//             success: true,

//             message:
//                 "Receipt generated successfully",

//             receipt: {

//                 BookingID: bookingId,

//                 ReceiptNumber: receiptNumber,

//                 AccommodationAmount:
//                     accommodationAmount,

//                 MealCharges:
//                     mealCharges,

//                 AdditionalCharges:
//                     additionalCharges,

//                 Discount:
//                     discount,

//                 TotalAmount:
//                     totalAmount,

//                 PaymentMode:
//                     paymentMode,

//                 TransactionReference:
//                     transactionReference

//             }

//         });

//     }
//     catch (error) {

//         console.log(error);

//         res.status(500).json({

//             success: false,

//             message:
//                 "Failed to generate receipt"

//         });

//     }

// };

exports.getCheckInApplication = async (req, res) => {

    try {

        const bookingId = req.params.bookingId;

        const pool = await poolPromise;

        // -------------------------------
        // Booking Details
        // -------------------------------

        const bookingResult = await pool.request()

            .input(
                "BookingID",
                sql.VarChar,
                bookingId
            )

            .query(`

SELECT

B.*,

GH.GuestHouseName,

GT.GuestTypeName

FROM GuestHouseRoomBookings B

INNER JOIN GuestHouseMaster GH
ON GH.GuestHouseID = B.GuestHouseID

INNER JOIN GuestTypeMaster GT
ON GT.GuestTypeID = B.GuestTypeID

WHERE B.GHBookingID = @BookingID

`);

        if (bookingResult.recordset.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Booking not found."

            });

        }

        const booking =
            bookingResult.recordset[0];

        // -------------------------------
        // Allocated Rooms
        // -------------------------------

        const allocationResult = await pool.request()

            .input(
                "BookingID",
                sql.VarChar,
                bookingId
            )

            .query(`

SELECT

A.GHRAllocationID,

A.AllocatedRoom,

R.GHRoomNo AS RoomNumber,

RT.RoomTypeName,

A.IsSingleOccupancy,

A.DayRate,

A.AllocationStatus

FROM GuestHouseRoomAllocation A

INNER JOIN GuestHouseRoomMaster R
ON R.GHRMID = A.AllocatedRoom

INNER JOIN RoomTypeMaster RT
ON RT.RoomTypeID = R.RoomTypeID

WHERE

A.GHBookingID = @BookingID

`);

        booking.Allocations =
            allocationResult.recordset;

        res.json(booking);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.checkoutGuest = async (req, res) => {

    const transaction = new sql.Transaction(await poolPromise);

    try {

        await transaction.begin();

        const bookingId = req.params.bookingId;

        const currentUser = req.user;

        const {

            mealCharges,

            additionalCharges,

            discount,

            paymentMode,

            transactionReference,

            totalPayableAmount

        } = req.body;

        // Update Booking

        await new sql.Request(transaction)

            .input("BookingID", sql.VarChar, bookingId)

            .input("MealCharges", sql.Decimal(18, 2), mealCharges)

            .input("AdditionalCharges", sql.Decimal(18, 2), additionalCharges)

            .input("DiscountAmount", sql.Decimal(18, 2), discount)

            .input("TotalPayableAmount", sql.Decimal(18, 2), totalPayableAmount)

            .input("PaymentMode", sql.VarChar, paymentMode)

            .input("TransactionReference", sql.VarChar, transactionReference)

            .input("ModifiedBy", sql.VarChar, currentUser.EmployeeId)

            .query(`

UPDATE GuestHouseRoomBookings

SET

MealCharges=@MealCharges,

AdditionalCharges=@AdditionalCharges,

DiscountAmount=@DiscountAmount,

TotalPayableAmount=@TotalPayableAmount,

PaymentMode=@PaymentMode,

TransactionReference=@TransactionReference,

BookingStatus='Checked Out',

ModifiedBy=@ModifiedBy,

ModifiedDate=GETDATE()

WHERE GHBookingID=@BookingID

`);

        // Update Allocation

        await changeWorkflowStatus(
            transaction,
            {
                bookingId,
                previousStatus: "Checked In",
                currentStatus: "Checked Out",
                actionName: "Check Out",
                authorityRole: "Guest House Incharge",
                authorityName: currentUser.EmployeeName,
                actionBy: currentUser.EmployeeId,
                remarks
            }
        );

        await transaction.commit();

        res.json({

            success: true,

            message: "Guest checked out successfully."

        });

    }

    catch (err) {

        await transaction.rollback();

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getCheckoutApplications = async (req, res) => {

    try {

        const pool = await poolPromise;

        const currentUser = req.user;

        const result = await pool.request()

            .input(
                "EmployeeID",
                sql.VarChar,
                currentUser.EmployeeId
            )

            .query(`

SELECT

B.GHBookingID,

B.GHRBookingNo,

B.GuestName,

B.ArrivalDateTime,

B.DepartureDateTime,

B.BookingStatus,

R.GHRoomNo AS RoomNo,

A.CheckInDateTime,

A.DayRate,

A.IsSingleOccupancy

FROM GuestHouseRoomBookings B

INNER JOIN GuestHouseRoomAllocation A

ON B.GHBookingID=A.GHBookingID

INNER JOIN GuestHouseRoomMaster R

ON R.GHRMID=A.AllocatedRoom

WHERE

B.AssignedAllocatorID=@EmployeeID

AND

B.BookingStatus='Checked In'

ORDER BY

A.CheckInDateTime DESC

`);

        res.json(result.recordset);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getCheckoutDetails = async (req, res) => {

    try {

        const bookingId = req.params.bookingId;

        const pool = await poolPromise;

        //--------------------------------------------------
        // Booking Details
        //--------------------------------------------------

        const bookingResult = await pool.request()

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

        //--------------------------------------------------
        // Allocated Rooms
        //--------------------------------------------------

        const roomResult = await pool.request()

            .input(
                "BookingID",
                sql.VarChar,
                bookingId
            )

            .query(`

SELECT

A.GHRAllocationID,

RM.GHRoomNo,

RT.RoomTypeName,

A.IsSingleOccupancy,

A.DayRate,

A.CheckInDateTime,

DATEDIFF(

DAY,

A.CheckInDateTime,

GETDATE()

)+1 AS StayDays,

A.DayRate *

(

DATEDIFF(

DAY,

A.CheckInDateTime,

GETDATE()

)+1

) AS Amount

FROM GuestHouseRoomAllocation A

INNER JOIN GuestHouseRoomMaster RM

ON RM.GHRMID=A.AllocatedRoom

INNER JOIN RoomTypeMaster RT

ON RT.RoomTypeID=RM.RoomTypeID

WHERE

A.GHBookingID=@BookingID

`);

        res.json({

            booking:

                bookingResult.recordset[0],

            rooms:

                roomResult.recordset

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


exports.allocateRooms = async (req, res) => {

    const transaction = new sql.Transaction(await poolPromise);

    try {

        await transaction.begin();

        const bookingId = req.params.bookingId;

        const currentUser = req.user;

        const { rooms, accommodationAmount, remarks } = req.body;

        const alreadyAllocated =
            await new sql.Request(transaction)

                .input(
                    "BookingID",
                    sql.VarChar,
                    bookingId
                )

                .query(`

SELECT COUNT(*) Total

FROM GuestHouseRoomAllocation

WHERE

GHBookingID=@BookingID

AND

AllocationStatus='Allocated'

`);

        if (alreadyAllocated.recordset[0].Total > 0) {

            throw new Error("Rooms already allocated.");

        }

        for (const room of rooms) {

            const allocationId = await generateAllocationId(transaction);


            await new sql.Request(transaction)

                .input("AllocationID", sql.VarChar, allocationId)

                .input("BookingID", sql.VarChar, bookingId)

                .input("RoomID", sql.VarChar, room.roomId)

                .input("AllocatedBy", sql.VarChar, currentUser.EmployeeId)

                .input("IsSingleOccupancy", sql.Bit, room.isSingleOccupancy)

                .input("DayRate", sql.Decimal(10, 2), room.dayRate)

                .query(`

INSERT INTO GuestHouseRoomAllocation
(
    GHRAllocationID,
    GHBookingID,
    AllocatedRoom,
    AllocatedBy,
    AllocatedOn,
    AllocationStatus,
    IsSingleOccupancy,
    DayRate,
    CreatedBy,
    CreatedDate
)

VALUES
(
    @AllocationID,
    @BookingID,
    @RoomID,
    @AllocatedBy,
    GETDATE(),
    'Allocated',
    @IsSingleOccupancy,
    @DayRate,
    @AllocatedBy,
    GETDATE()
)

                `);
        }

        await new sql.Request(transaction)

            .input(
                "BookingID",
                sql.VarChar,
                bookingId
            )

            .input(
                "AccommodationAmount",
                sql.Decimal(18, 2),
                accommodationAmount
            )

            .input(
                "Remarks",
                sql.NVarChar,
                remarks || ""
            )

            .input(
                "AllocatedBy",
                sql.VarChar,
                currentUser.EmployeeId
            )

            .query(`

UPDATE GuestHouseRoomBookings

SET

AccommodationAmount = @AccommodationAmount,

AllocationRemarks = @Remarks,

ModifiedBy = @AllocatedBy,

ModifiedDate = GETDATE()

WHERE GHBookingID = @BookingID

`);

        await changeWorkflowStatus(
            transaction,
            {
                bookingId,
                previousStatus: "Approved",
                currentStatus: "Allocated",
                actionName: "Allocate Room",
                authorityRole: "Guest House Incharge",
                authorityName: currentUser.EmployeeName,
                actionBy: currentUser.EmployeeId,
                remarks
            }
        );

        await transaction.commit();

        res.json({

            success: true,

            message: "Rooms allocated successfully."

        });

    }

    catch (err) {

        await transaction.rollback();

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.checkInGuest = async (req, res) => {

    const transaction =
        new sql.Transaction(await poolPromise);

    try {

        await transaction.begin();

        const bookingId =
            req.params.bookingId;

        const currentUser =
            req.user;

        if (!currentUser) {

            throw new Error("User not found.");

        }

        const {

            proofType,

            proofNumber,

            remarks,

            occupants

        } = req.body;

        const occupantList =
            occupants
                ? JSON.parse(occupants)
                : [];

        const documentBuffer =
            req.file
                ? req.file.buffer
                : null;

        //----------------------------------------------------
        // Update all allocated rooms for this booking
        //----------------------------------------------------

        await new sql.Request(transaction)

            .input(
                "BookingID",
                sql.VarChar,
                bookingId
            )

            .input(
                "Occupants",
                sql.Int,
                occupantList.length + 1
            )

            .input(
                "ProofType",
                sql.VarChar,
                proofType
            )

            .input(
                "ProofNumber",
                sql.VarChar,
                proofNumber
            )

            .input(
                "CheckInBy",
                sql.VarChar,
                currentUser.EmployeeId
            )

            // Uncomment after adding the column
            // .input(
            //     "Document",
            //     sql.VarBinary(sql.MAX),
            //     documentBuffer
            // )

            .query(`

UPDATE GuestHouseRoomAllocation

SET

CheckOutDateTime=GETDATE(),

CheckOutBy=@EmployeeId,

AllocationStatus='Checked Out'

`);

        //----------------------------------------------------
        // Update Booking Status
        //----------------------------------------------------

        await changeWorkflowStatus(
            transaction,
            {
                bookingId,
                previousStatus: "Allocated",
                currentStatus: "Checked In",
                actionName: "Check In",
                authorityRole: "Guest House Incharge",
                authorityName: currentUser.EmployeeName,
                actionBy: currentUser.EmployeeId,
                remarks
            }
        );

        //----------------------------------------------------
        // Save Occupants
        //----------------------------------------------------

        // Uncomment after creating GuestHouseOccupants table

        /*
        for(const occupant of occupantList){

            await new sql.Request(transaction)

            .input("OccupantID",sql.VarChar,await generateId(transaction,{
                table:"GuestHouseOccupants",
                column:"OccupantID",
                prefix:"GHO"
            }))

            .input("BookingID",sql.VarChar,bookingId)

            .input("Name",sql.NVarChar,occupant.name)

            .input("Relationship",sql.NVarChar,occupant.relationship)

            .input("Age",sql.Int,occupant.age)

            .query(`

INSERT INTO GuestHouseOccupants
(
OccupantID,
GHBookingID,
OccupantName,
Relationship,
Age
)
VALUES
(
@OccupantID,
@BookingID,
@Name,
@Relationship,
@Age
)

`);

        }
        */

        await transaction.commit();

        res.json({

            success: true,

            message: "Guest checked in successfully."

        });

    }

    catch (err) {

        await transaction.rollback();

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getOccupancySummary = async (req, res) => {

    try {

        const pool = await poolPromise;

        const result = await pool.request().query(`

SELECT

    (SELECT COUNT(*)
     FROM GuestHouseRoomMaster
     WHERE IsActive = 1) AS TotalRooms,

    (SELECT COUNT(DISTINCT AllocatedRoom)
     FROM GuestHouseRoomAllocation
     WHERE AllocationStatus = 'Checked In') AS OccupiedRooms,

    (SELECT COUNT(*)
     FROM GuestHouseRoomBookings
     WHERE BookingStatus = 'Allocated') AS PendingCheckIn,

    (SELECT COUNT(*)
     FROM GuestHouseRoomBookings
     WHERE BookingStatus = 'Checked In') AS CurrentGuests

`);

        const data = result.recordset[0];

        data.AvailableRooms =
            data.TotalRooms - data.OccupiedRooms;

        res.json(data);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};


exports.getRoomAvailability = async (req, res) => {

    try {

        const pool = await poolPromise;

        const result = await pool.request().query(`

SELECT

    r.GHRMID AS RoomID,

    r.GHRoomNo AS RoomNo,

    gh.GuestHouseName,

    rt.RoomTypeName,

    b.GHBookingID,

    b.GuestName,

    b.ArrivalDateTime,

    b.DepartureDateTime,

    a.AllocationStatus

FROM GuestHouseRoomMaster r

INNER JOIN GuestHouseMaster gh
    ON r.GuestHouseID = gh.GuestHouseID

INNER JOIN RoomTypeMaster rt
    ON r.RoomTypeID = rt.RoomTypeID

LEFT JOIN GuestHouseRoomAllocation a
    ON r.GHRMID = a.AllocatedRoom
    AND a.AllocationStatus IN ('Allocated','Checked In')

LEFT JOIN GuestHouseRoomBookings b
    ON a.GHBookingID = b.GHBookingID

WHERE r.IsActive = 1

ORDER BY

gh.GuestHouseName,

r.GHRoomNo

`);

        const rooms = {};

        result.recordset.forEach(row => {

            if (!rooms[row.RoomID]) {

                rooms[row.RoomID] = {

                    RoomID: row.RoomID,

                    RoomNo: row.RoomNo,

                    GuestHouse: row.GuestHouseName,

                    RoomType: row.RoomTypeName,

                    Bookings: []

                };

            }

            if (row.GHBookingID) {

                rooms[row.RoomID].Bookings.push({

                    BookingID: row.GHBookingID,

                    GuestName: row.GuestName,

                    ArrivalDateTime: row.ArrivalDateTime,

                    DepartureDateTime: row.DepartureDateTime,

                    Status: row.AllocationStatus

                });

            }

        });

        res.json(Object.values(rooms));

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};