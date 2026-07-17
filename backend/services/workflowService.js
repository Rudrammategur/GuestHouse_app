const sql = require("mssql");

const { poolPromise } = require("../config/db");

const {
    generateWorkflowHistoryId
} = require("../utils/idGenerator");


/*
---------------------------------------------------------
Workflow Users
---------------------------------------------------------
*/

exports.getWorkflowUsers = async () => {

    const pool = await poolPromise;

    const result = await pool.request().query(`

        SELECT *

        FROM GuestHouseUserAccess

        WHERE IsActive=1

    `);

    return result.recordset;

};


/*
---------------------------------------------------------
Update Booking Status
---------------------------------------------------------
*/

exports.updateBookingStatus = async (

    transaction,

    bookingId,

    status,

    employeeId

) => {

    await new sql.Request(transaction)

        .input(
            "BookingID",
            sql.VarChar,
            bookingId
        )

        .input(
            "Status",
            sql.VarChar,
            status
        )

        .input(
            "EmployeeID",
            sql.VarChar,
            employeeId
        )

        .query(`

UPDATE GuestHouseRoomBookings

SET

BookingStatus=@Status,

ActivityBy=@EmployeeID

WHERE

GHBookingID=@BookingID

`);

};


/*
---------------------------------------------------------
Get Workflow History
---------------------------------------------------------
*/

exports.getWorkflowHistory = async (

    moduleName,

    referenceId

) => {

    const pool = await poolPromise;

    const result = await pool.request()

        .input(
            "ModuleName",
            sql.VarChar,
            moduleName
        )

        .input(
            "ReferenceID",
            sql.VarChar,
            referenceId
        )

        .query(`

SELECT

WorkflowHistoryID,

SequenceNo,

PreviousStatus,

CurrentStatus,

ActionName,

AuthorityRole,

AuthorityName,

ActionBy,

ActionDateTime,

Remarks

FROM WorkflowHistory

WHERE

ModuleName=@ModuleName

AND

ReferenceID=@ReferenceID

AND

IsActive=1

ORDER BY

SequenceNo,
ActionDateTime

`);

    return result.recordset;

};


/*
---------------------------------------------------------
Get Next Sequence No
---------------------------------------------------------
*/

exports.getNextSequenceNo = async (

    transaction,

    moduleName,

    referenceId

) => {

    const result = await new sql.Request(transaction)

        .input(
            "ModuleName",
            sql.VarChar,
            moduleName
        )

        .input(
            "ReferenceID",
            sql.VarChar,
            referenceId
        )

        .query(`

SELECT

ISNULL(MAX(SequenceNo),0)+1 AS NextSequence

FROM WorkflowHistory

WHERE

ModuleName=@ModuleName

AND

ReferenceID=@ReferenceID

`);

    return result.recordset[0].NextSequence;

};


/*
---------------------------------------------------------
Insert Workflow History
---------------------------------------------------------
*/

exports.insertWorkflowHistory = async (

    transaction,

    {

        moduleName,

        referenceId,

        previousStatus,

        currentStatus,

        actionName,

        authorityRole,

        authorityName,

        actionBy,

        remarks="",

        ipAddress=null,

        deviceInfo=null

    }

) => {

    const workflowHistoryId =
        await generateWorkflowHistoryId(transaction);

    const sequenceNo =
        await exports.getNextSequenceNo(

            transaction,

            moduleName,

            referenceId

        );

    await new sql.Request(transaction)

        .input(
            "WorkflowHistoryID",
            sql.VarChar,
            workflowHistoryId
        )

        .input(
            "ModuleName",
            sql.VarChar,
            moduleName
        )

        .input(
            "ReferenceID",
            sql.VarChar,
            referenceId
        )

        .input(
            "SequenceNo",
            sql.Int,
            sequenceNo
        )

        .input(
            "PreviousStatus",
            sql.VarChar,
            previousStatus
        )

        .input(
            "CurrentStatus",
            sql.VarChar,
            currentStatus
        )

        .input(
            "ActionName",
            sql.VarChar,
            actionName
        )

        .input(
            "AuthorityRole",
            sql.VarChar,
            authorityRole
        )

        .input(
            "AuthorityName",
            sql.VarChar,
            authorityName
        )

        .input(
            "ActionBy",
            sql.VarChar,
            actionBy
        )

        .input(
            "Remarks",
            sql.NVarChar,
            remarks
        )

        .input(
            "IPAddress",
            sql.VarChar,
            ipAddress
        )

        .input(
            "DeviceInfo",
            sql.NVarChar,
            deviceInfo
        )

        .query(`

INSERT INTO WorkflowHistory
(
    WorkflowHistoryID,
    ModuleName,
    ReferenceID,
    SequenceNo,
    PreviousStatus,
    CurrentStatus,
    ActionName,
    AuthorityRole,
    AuthorityName,
    ActionBy,
    ActionDateTime,
    Remarks,
    IPAddress,
    DeviceInfo,
    IsActive,
    CreatedBy,
    CreatedDate
)

VALUES
(
    @WorkflowHistoryID,
    @ModuleName,
    @ReferenceID,
    @SequenceNo,
    @PreviousStatus,
    @CurrentStatus,
    @ActionName,
    @AuthorityRole,
    @AuthorityName,
    @ActionBy,
    GETDATE(),
    @Remarks,
    @IPAddress,
    @DeviceInfo,
    1,
    @ActionBy,
    GETDATE()
)

`);

};


/*
---------------------------------------------------------
Change Workflow Status
---------------------------------------------------------
*/

exports.changeWorkflowStatus = async (

    transaction,

    {

        bookingId,

        moduleName="GuestHouse",

        previousStatus,

        currentStatus,

        actionName,

        authorityRole,

        authorityName,

        actionBy,

        remarks="",

        ipAddress=null,

        deviceInfo=null

    }

) => {

    await exports.updateBookingStatus(

        transaction,

        bookingId,

        currentStatus,

        actionBy

    );

    await exports.insertWorkflowHistory(

        transaction,

        {

            moduleName,

            referenceId: bookingId,

            previousStatus,

            currentStatus,

            actionName,

            authorityRole,

            authorityName,

            actionBy,

            remarks,

            ipAddress,

            deviceInfo

        }

    );

};