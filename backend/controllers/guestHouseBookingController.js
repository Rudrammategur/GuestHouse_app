const sql = require("mssql");
const { poolPromise } = require("../config/db");
const { assignWorkflow } = require("../services/assignmentService");

const { generateGuestHouseBookingId, generateGuestHouseBookingNo } = require("../utils/idGenerator");




exports.createBooking = async (req, res) => {

    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);


    try {

        const data = req.body;

        const currentUser = req.user;

        if (!currentUser) {

            return res.status(401).json({

                success: false,

                message: "User not found."

            });

        }

        const workflow =
            await assignWorkflow(

                currentUser.EmployeeId,

                data.ExpenditureHead

            );

        // Parse Room Requirements
        data.RoomRequirements = JSON.parse(
            data.RoomRequirements || "[]"
        );

        data.OccupantsNo = Number(data.OccupantsNo);

        data.TotalRoomsReq = Number(data.TotalRoomsReq);

        const documentBuffer = data.SupportingDoc
            ? Buffer.from(data.SupportingDoc, "base64")
            : null;

        // Step 3
        const totalRoomsReq = data.RoomRequirements.reduce(
            (sum, room) => sum + Number(room.NoOfRooms),
            0
        );

        // Step 4
        await transaction.begin();

        const bookingID = await generateGuestHouseBookingId(transaction);

        const bookingNo = await generateGuestHouseBookingNo(transaction);


        // Step 5
        const request = new sql.Request(transaction);

        // Step 6
        // INSERT INTO GuestHouseRoomBookings
        const bookingResult =
            await request
                .input("BookingID", sql.VarChar, bookingID)

                .input("BookingNo", sql.VarChar, bookingNo)

                .input("GuestTypeID", sql.VarChar, data.GuestTypeID)

                .input("GuestHouseID", sql.VarChar, data.GuestHouseID)

                .input("GuestName", sql.NVarChar, data.GuestName)

                .input("GuestDesignation", sql.NVarChar, data.GuestDesignation)

                .input("GuestAddress", sql.NVarChar, data.GuestAddress)

                .input("PurposeOfVisit", sql.NVarChar, data.PurposeOfVisit)

                .input("GuestNationality", sql.NVarChar, data.GuestNationality)

                .input("GuestContactNo", sql.VarChar, data.GuestContactNo)

                .input("GuestEmailID", sql.VarChar, data.GuestEmailID)

                .input("OccupantsNo", sql.Int, data.OccupantsNo)

                .input("TotalRoomsReq", sql.Int, totalRoomsReq)

                .input("ArrivalDateTime", sql.DateTime, data.ArrivalDateTime)

                .input("DepartureDateTime", sql.DateTime, data.DepartureDateTime)

                .input(
                    "SupportingDoc",
                    sql.VarBinary(sql.MAX),
                    req.file ? req.file.buffer : null
                )

                .input("ExpenditureHead", sql.VarChar, data.ExpenditureHead)

                .input("SplRequests", sql.NVarChar, data.SpecialRequirements)

                .input("ProjectNo", sql.VarChar, data.ProjectNo)

                .input("BookedBy", sql.VarChar, req.user?.EmployeeId)

                .input("BookingDateTime", sql.DateTime, new Date())

                .input("BookingStatus", sql.VarChar, "Submitted")

                .input("ActivityBy", sql.VarChar, req.user?.EmployeeId)

                .input("AssignedVerifierID", sql.VarChar, workflow.verifierId)

                .input("AssignedApproverID", sql.VarChar, workflow.approverId)

                .input("AssignedAllocatorID", sql.VarChar, workflow.allocatorId)

                .query(`
INSERT INTO GuestHouseRoomBookings(

GHBookingID,

GHRBookingNo,

GuestTypeID,

GuestHouseID,

GuestName,

GuestDesignation,

GuestAddress,

PurposeOfVisit,

GuestNationality,

GuestContactNo,

GuestEmailID,

OccupantsNo,

TotalRoomsReq,

SplRequests,

ArrivalDateTime,

DepartureDateTime,

SupportingDoc,

ExpenditureHead,

ProjectNo,

BookedBy,

BookingDateTime,

BookingStatus,

ActivityBy,

AssignedVerifierID,

AssignedApproverID,

AssignedAllocatorID

)

VALUES(
@BookingID,

@BookingNo,

@GuestTypeID,

@GuestHouseID,

@GuestName,

@GuestDesignation,

@GuestAddress,

@PurposeOfVisit,

@GuestNationality,

@GuestContactNo,

@GuestEmailID,

@OccupantsNo,

@TotalRoomsReq,

@SplRequests,

@ArrivalDateTime,

@DepartureDateTime,

@SupportingDoc,

@ExpenditureHead,

@ProjectNo,

@BookedBy,

@BookingDateTime,

@BookingStatus,

@ActivityBy,

@AssignedVerifierID,

@AssignedApproverID,

@AssignedAllocatorID

)
`);

        // Step 8
        // Loop RoomRequirements
        // INSERT GuestHouseBookingRoomDetails

        for (const room of data.RoomRequirements) {

            const detailID =
                `GHRD${Date.now()}${Math.floor(Math.random() * 1000)}`;

            await new sql.Request(transaction)

                .input("DetailID", sql.VarChar, detailID)

                .input("BookingID", sql.VarChar, bookingID)

                .input("RoomTypeID", sql.VarChar, room.RoomTypeID)

                .input("NoOfRooms", sql.Int, room.NoOfRooms)

                .query(`

INSERT INTO GuestHouseBookingRoomDetails(

    GHRDetailID,

    GHBookingID,

    RoomTypeID,

    NoOfRooms

)

VALUES(

    @DetailID,

    @BookingID,

    @RoomTypeID,

    @NoOfRooms

)

`);

        }
        // Step 9
        await transaction.commit();

        await insertWorkflowHistory(
            transaction,
            {
                moduleName: "GuestHouseBooking",
                referenceId: bookingId,
                sequenceNo: 1,
                previousStatus: "",
                currentStatus: "Submitted",
                actionName: "Submit",
                authorityRole: "Applicant",
                authorityName: req.user.EmployeeName,
                actionBy: req.user.EmployeeId,
                remarks: ""
            }
        );


        res.status(201).json({

            success: true,

            BookingID: bookingID,

            BookingNo: bookingNo,

            message: "Booking submitted successfully"

        });

    }
    catch (error) {

        if (transaction._aborted !== true) {
            try {
                await transaction.rollback();
            } catch (err) {
                console.log("Rollback skipped:", err.message);
            }
        }

        console.log("Original Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

exports.getDashboardCounts = async (req, res) => {

    try {

        const pool = await poolPromise;

        const employeeId = req.user.EmployeeId;

        const result = await pool.request()

            .input(
                "EmployeeID",
                sql.VarChar,
                employeeId
            )

            .query(`

SELECT

COUNT(*) TotalApplications,

SUM(CASE WHEN BookingStatus='Submitted' THEN 1 ELSE 0 END) Submitted,

SUM(CASE WHEN BookingStatus='Verified' THEN 1 ELSE 0 END) Verified,

SUM(CASE WHEN BookingStatus='Approved' THEN 1 ELSE 0 END) Approved,

SUM(CASE WHEN BookingStatus='Rejected' THEN 1 ELSE 0 END) Rejected,

SUM(CASE WHEN BookingStatus='Allocated' THEN 1 ELSE 0 END) Allocated,

SUM(CASE WHEN BookingStatus='Checked In' THEN 1 ELSE 0 END) CheckedIn,

SUM(CASE WHEN BookingStatus='Checked Out' THEN 1 ELSE 0 END) Completed,

SUM(CASE WHEN BookingStatus='Cancelled' THEN 1 ELSE 0 END) Cancelled

FROM GuestHouseRoomBookings

WHERE BookedBy=@EmployeeID

`);

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

exports.getMyApplications = async (req, res) => {

    try {

        const pool = await poolPromise;

        const employeeId = req.user.EmployeeId;

        const result = await pool.request()

            .input(
                "EmployeeID",
                sql.VarChar,
                employeeId
            )

            .query(`

SELECT

GHBookingID,

GHRBookingNo,

GuestName,

ArrivalDateTime,

DepartureDateTime,

BookingStatus,

CreatedDate

FROM GuestHouseRoomBookings

WHERE

BookedBy=@EmployeeID

ORDER BY

CreatedDate DESC

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

const { getWorkflowHistory } = require("../services/workflowService");

exports.getApplicationDetails = async (req, res) => {

    try {

        const pool = await poolPromise;

        const bookingId = req.params.bookingId;

        const [

            applicationResult,

            roomResult,

            workflowHistory

        ] = await Promise.all([

            pool.request()

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

gt.GuestTypeName,

b.GuestDesignation,

b.GuestAddress,

b.GuestNationality,

b.GuestContactNo,

b.GuestEmailID,

b.PurposeOfVisit,

b.ArrivalDateTime,

b.DepartureDateTime,

b.BookingStatus,

gh.GuestHouseName,

b.OccupantsNo,

b.ExpenditureHead,

b.ProjectNo,

b.SplRequests,

b.SupportingDoc

FROM GuestHouseRoomBookings b

INNER JOIN GuestHouseMaster gh

ON gh.GuestHouseID=b.GuestHouseID

INNER JOIN GuestTypeMaster gt

ON gt.GuestTypeID=b.GuestTypeID

WHERE

b.GHBookingID=@BookingID

                `),

            pool.request()

                .input(
                    "BookingID",
                    sql.VarChar,
                    bookingId
                )

                .query(`

SELECT

rt.RoomTypeName,

br.NoOfRooms

FROM GuestHouseBookingRoomDetails br

INNER JOIN RoomTypeMaster rt

ON rt.RoomTypeID=br.RoomTypeID

WHERE

br.GHBookingID=@BookingID

                `),

            getWorkflowHistory(
                "GuestHouseBooking",
                bookingId
            )

        ]);

        res.json({

            header: {

                bookingId:
                    applicationResult.recordset[0]?.GHBookingID,

                bookingNo:
                    applicationResult.recordset[0]?.GHRBookingNo,

                status:
                    applicationResult.recordset[0]?.BookingStatus

            },

            application:
                applicationResult.recordset[0],

            roomRequirements:
                roomResult.recordset,

            workflowHistory

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

exports.verifyApplication = async (req, res) => {

    const transaction = new sql.Transaction(
        await poolPromise
    );

    try {

        const bookingId = req.params.bookingId;

        const employeeId = req.user.EmployeeId;

        const remarks = req.body.remarks || "";

        await transaction.begin();

        const bookingResult = await new sql.Request(transaction)

            .input(
                "BookingID",
                sql.VarChar,
                bookingId
            )

            .query(`
                SELECT
                    BookingStatus
                FROM GuestHouseRoomBookings
                WHERE GHBookingID=@BookingID
            `);

        if (bookingResult.recordset.length === 0) {

            throw new Error(
                "Application not found."
            );

        }

        const previousStatus =
            bookingResult.recordset[0].BookingStatus;

        if (previousStatus !== "Submitted") {

            throw new Error(
                "Only submitted applications can be verified."
            );

        }

        await new sql.Request(transaction)

            .input(
                "BookingID",
                sql.VarChar,
                bookingId
            )

            .query(`
                UPDATE GuestHouseRoomBookings
                SET
                    BookingStatus='Verified',
                    ModifiedDate=GETDATE()
                WHERE
                    GHBookingID=@BookingID
            `);

        await insertWorkflowHistory(
            transaction,
            {
                moduleName: "GuestHouseBooking",
                referenceId: bookingId,
                sequenceNo: 2,
                previousStatus: "Submitted",
                currentStatus: "Verified",
                actionName: "Verify",
                authorityRole: "Verifier",
                authorityName: req.user.EmployeeName,
                actionBy: employeeId,
                remarks
            }
        );

        await transaction.commit();

        res.json({

            success: true,

            message: "Application verified successfully."

        });

    }

    catch (err) {

        await transaction.rollback();

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.cancelBooking = async (req, res) => {

    try {

        const { bookingId } = req.params;
        const pool = await poolPromise;

        const result = await pool.request()
            .input("BookingID", sql.VarChar, bookingId)
            .query(`
                UPDATE GuestHouseRoomBookings
                SET BookingStatus='Cancelled'
                WHERE GHBookingID=@BookingID
            `);

        res.json({
            success: true,
            message: "Booking cancelled successfully"
        });

    }
    catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};