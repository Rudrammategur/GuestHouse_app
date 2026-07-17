const sql = require("mssql");

const { poolPromise } = require("../config/db");
const {
  getWorkflowHistory,
  changeWorkflowStatus
} = require("../services/WorkflowService");


const { getEmployeeById } = require("../services/employeeService");

exports.getDashboardCounts = async (req, res) => {

  try {

    const currentUser = req.user;

    const pool = await poolPromise;

    const result = await pool.request()

      .input(
        "EmployeeID",
        sql.VarChar,
        currentUser.EmployeeId
      )

      .query(`
        SELECT

COUNT(*) AS TotalApplications,

SUM(CASE WHEN BookingStatus='Verified' THEN 1 ELSE 0 END) AS PendingApplications,

SUM(CASE WHEN BookingStatus='Approved' THEN 1 ELSE 0 END) AS VerifiedApplications,

SUM(CASE WHEN BookingStatus='Rejected' THEN 1 ELSE 0 END) AS RejectedApplications,

SUM(CASE
        WHEN BookingStatus IN ('Approved','Rejected')
        THEN 1
        ELSE 0
    END) AS AllProcessedApplications

FROM GuestHouseRoomBookings

WHERE AssignedApproverID=@EmployeeID

    AND IsActive = 1

    AND BookingStatus IN
    (
        'Verified',
        'Approved',
        'Rejected'
    )

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

exports.rejectApplication = async (req, res) => {

  const transaction =
    new sql.Transaction(await poolPromise);

  try {

    await transaction.begin();

    const bookingId =
      req.params.bookingId;

    const currentUser = req.user;

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    const remarks =
      req.body.remarks || "";

    await changeWorkflowStatus(
      transaction,
      {
        bookingId,
        previousStatus: "Verified",
        currentStatus: "Rejected",
        actionName: "Reject",
        authorityRole: "Approver",
        authorityName: currentUser.EmployeeName,
        actionBy: currentUser.EmployeeId,
        remarks
      }
    );

    await transaction.commit();

    res.json({

      success: true,

      message: "Application Rejected Successfully"

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

exports.getApplications = async (req, res) => {

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

    b.GHBookingID,

    b.GHRBookingNo,

    b.GuestName,

    gt.GuestTypeName,

    b.TotalRoomsReq,

    b.BookedBy,

    b.ArrivalDateTime,

    b.DepartureDateTime,

    b.BookingDateTime,

    b.BookingStatus

FROM GuestHouseRoomBookings b

LEFT JOIN GuestTypeMaster gt

ON gt.GuestTypeID = b.GuestTypeID

WHERE

    b.AssignedApproverID = @EmployeeID

    AND b.IsActive = 1

    AND b.BookingStatus IN
    (
        'Verified',
        'Approved',
        'Rejected'
    )

ORDER BY

    b.BookingDateTime DESC

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

exports.getApplication = async (req, res) => {

  try {

    const pool = await poolPromise;

    const bookingId = req.params.bookingId;

    // Booking Details
    const bookingResult = await pool.request()

      .input(
        "BookingID",
        sql.VarChar,
        bookingId
      )

      .query(`

SELECT

    b.*,

    gt.GuestTypeName,

    gh.GuestHouseName

FROM GuestHouseRoomBookings b

LEFT JOIN GuestTypeMaster gt
ON gt.GuestTypeID = b.GuestTypeID

LEFT JOIN GuestHouseMaster gh
ON gh.GuestHouseID = b.GuestHouseID

WHERE b.GHBookingID = @BookingID

`);

    if (bookingResult.recordset.length === 0) {

      return res.status(404).json({

        success: false,

        message: "Application not found."

      });

    }

    // Room Requirements
    const roomResult = await pool.request()

      .input(
        "BookingID",
        sql.VarChar,
        bookingId
      )

      .query(`

SELECT

    d.RoomTypeID,

    rt.RoomTypeName,

    d.NoOfRooms

FROM GuestHouseBookingRoomDetails d

LEFT JOIN RoomTypeMaster rt
ON rt.RoomTypeID = d.RoomTypeID

WHERE d.GHBookingID = @BookingID

`);

    const application = bookingResult.recordset[0];

    application.AssignedVerifier =
      getEmployeeById(application.AssignedVerifierID);

    application.AssignedApprover =
      getEmployeeById(application.AssignedApproverID);

    application.AssignedAllocator =
      getEmployeeById(application.AssignedAllocatorID);

    application.RoomRequirements = roomResult.recordset;

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


exports.getPendingApplications = async (req, res) => {

  const currentUser = req.user;

  const pool = await poolPromise;

  const result = await pool.request()

    .input(
      "EmployeeID",
      sql.VarChar,
      currentUser.EmployeeId
    )

    .query(`

SELECT *

FROM GuestHouseRoomBookings

WHERE

AssignedApproverID=@EmployeeID

AND BookingStatus='Verified'

ORDER BY BookingDateTime DESC

`);

  res.json(result.recordset);

};

exports.approveApplication = async (req, res) => {

  const transaction =
    new sql.Transaction(await poolPromise);

  try {

    await transaction.begin();

    const bookingId = req.params.bookingId;

    const currentUser = req.user;

    const remarks = req.body.remarks || "";

    await changeWorkflowStatus(
      transaction,
      {
        bookingId,
        previousStatus: "Verified",
        currentStatus: "Approved",
        actionName: "Approve",
        authorityRole: "Approver",
        authorityName: currentUser.EmployeeName,
        actionBy: currentUser.EmployeeId,
        remarks
      }
    );
    await transaction.commit();

    res.json({

      success: true,

      message: "Approved"

    });

  }

  catch (err) {

    await transaction.rollback();

    res.status(500).json(err);

  }

};


exports.viewDocument = async (req, res) => {

  try {

    const pool = await poolPromise;

    const bookingId = req.params.bookingId;

    const result = await pool.request()

      .input(
        "BookingID",
        sql.VarChar,
        bookingId
      )

      .query(`

SELECT SupportingDoc

FROM GuestHouseRoomBookings

WHERE GHBookingID=@BookingID

`);

    if (
      result.recordset.length === 0 ||
      !result.recordset[0].SupportingDoc
    ) {

      return res.status(404).send("Document not found.");

    }

    const buffer = result.recordset[0].SupportingDoc;

    if (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4E &&
      buffer[3] === 0x47
    ) {

      res.setHeader("Content-Type", "image/png");

    }
    else {

      res.setHeader("Content-Type", "application/pdf");

    }

    res.send(buffer);

  }

  catch (err) {

    console.log(err);

    res.status(500).json({

      success: false,

      message: err.message

    });

  }

};




