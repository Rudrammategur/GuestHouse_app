const sql = require("mssql");
const { poolPromise } = require("../config/db");

const { generateGuestHouseId, generateGuestTypeId } = require("../utils/idGenerator");

const REPORT_QUERIES = require("../config/reportQueries");

const { buildFilters } = require("../utils/reportQueryBuilder");

const {

    getModuleSettings,

    updateSettings

} = require("../services/systemSettingsService");

const { getWorkflowHistory } = require("../services/workflowService");
exports.getDashboard = async (req, res) => {

    try {

        const pool = await poolPromise;

        // =============================
        // Dashboard Counts
        // =============================

        const [
            countsResult,
            operationsResult,
            occupiedResult,
            vacantResult,
            activitiesResult,
            arrivalsResult,
            departuresResult
        ] = await Promise.all([
            pool.request().query(`

SELECT

COUNT(*) AS TotalApplications,

SUM(CASE WHEN BookingStatus='Checked In' THEN 1 ELSE 0 END) AS CheckedIn,

SUM(CASE WHEN BookingStatus='Checked Out' THEN 1 ELSE 0 END) AS CheckedOut

FROM GuestHouseRoomBookings

`),

            // =============================
            // Today's Operations
            // =============================

            pool.request().query(`

SELECT

SUM(

CASE

WHEN CAST(ArrivalDateTime AS DATE)=CAST(GETDATE() AS DATE)

THEN 1

ELSE 0

END

) AS TodayArrivals,

SUM(

CASE

WHEN CAST(DepartureDateTime AS DATE)=CAST(GETDATE() AS DATE)

THEN 1

ELSE 0

END

) AS TodayDepartures

FROM GuestHouseRoomBookings

`),

            // =============================
            // Occupied Rooms
            // =============================

            pool.request().query(`

SELECT

COUNT(*) AS OccupiedRooms

FROM GuestHouseRoomAllocation

WHERE AllocationStatus='Checked In'

`),

            // =============================
            // Vacant Rooms
            // =============================

            pool.request().query(`

SELECT

COUNT(*) AS VacantRooms

FROM GuestHouseRoomMaster

WHERE GHRMID NOT IN (

SELECT AllocatedRoom

FROM GuestHouseRoomAllocation

WHERE AllocationStatus='Checked In'

)

`),

            // =============================
            // Recent Activities
            // =============================
            pool.request().query(`

SELECT TOP(5)

GHRBookingNo,

GuestName,

BookingStatus,

ModifiedDate

FROM GuestHouseRoomBookings

ORDER BY ModifiedDate DESC

`),
            pool.request().query(`

SELECT

TOP (5)

GHRBookingNo,

GuestName,

ArrivalDateTime

FROM GuestHouseRoomBookings

WHERE CAST(ArrivalDateTime AS DATE)=CAST(GETDATE() AS DATE)

ORDER BY ArrivalDateTime

`),
            pool.request().query(`

SELECT

TOP (5)

GHRBookingNo,

GuestName,

DepartureDateTime

FROM GuestHouseRoomBookings

WHERE CAST(DepartureDateTime AS DATE)=CAST(GETDATE() AS DATE)

ORDER BY DepartureDateTime

`)]);

        const counts = countsResult.recordset[0];

        const operations = {

            todayArrivals:

                operationsResult.recordset[0].TodayArrivals || 0,

            todayDepartures:

                operationsResult.recordset[0].TodayDepartures || 0,

            occupiedRooms:

                occupiedResult.recordset[0].OccupiedRooms || 0,

            vacantRooms:

                vacantResult.recordset[0].VacantRooms || 0

        };

        const activities = activitiesResult.recordset.map(item => ({

            title: item.BookingStatus,

            description: `${item.GHRBookingNo} - ${item.GuestName}`,

            time: item.ModifiedDate

                ? new Date(item.ModifiedDate).toLocaleString()

                : "-"

        }));

        const occupancy =

            operations.occupiedRooms +

                operations.vacantRooms === 0

                ? 0

                :

                Math.round(

                    (

                        operations.occupiedRooms /

                        (

                            operations.occupiedRooms +

                            operations.vacantRooms

                        )

                    ) * 100

                );

        res.json({

            counts: {

                totalApplications:

                    counts.TotalApplications || 0,

                checkedIn:

                    counts.CheckedIn || 0,

                checkedOut:

                    counts.CheckedOut || 0,

                occupancy

            },

            operations,

            activities,
            arrivals: arrivalsResult.recordset,

            departures: departuresResult.recordset

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


exports.getGuestHouses = async (req, res) => {

    try {

        const pool = await poolPromise;

        const result = await pool.request().query(`

SELECT

GuestHouseID,

GuestHouseName,

Address,

Description,

IsActive

FROM GuestHouseMaster

ORDER BY GuestHouseName

`);

        res.json(result.recordset);

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

//Create GuestHouse
exports.createGuestHouse = async (req, res) => {

    try {

        const pool = await poolPromise;

        const currentUser = req.user;

        const {

            GuestHouseName,

            Location,

            Address,

            ContactPerson,

            ContactNo,

            ContactEmailID

        } = req.body;

        const exists = await pool.request()

            .input(
                "GuestHouseName",
                sql.VarChar,
                GuestHouseName
            )

            .query(`

SELECT GuestHouseID

FROM GuestHouseMaster

WHERE GuestHouseName=@GuestHouseName

`);

        if (exists.recordset.length > 0) {

            return res.status(400).json({

                success: false,

                message: "Guest House already exists."

            });

        }

        const guestHouseId = await generateGuestHouseId(null);

        await pool.request()

            .input("GuestHouseID", sql.VarChar, guestHouseId)

            .input("GuestHouseName", sql.VarChar, GuestHouseName)

            .input("Location", sql.VarChar, Location)

            .input("Address", sql.VarChar, Address)

            .input("ContactPerson", sql.VarChar, ContactPerson)

            .input("ContactNo", sql.VarChar, ContactNo)

            .input("ContactEmailID", sql.VarChar, ContactEmailID)

            .input("CreatedBy", sql.VarChar, currentUser.EmployeeId)

            .query(`

INSERT INTO GuestHouseMaster
(
    GuestHouseID,
    GuestHouseName,
    Location,
    Address,
    ContactPerson,
    ContactNo,
    ContactEmailID,
    IsActive,
    CreatedBy,
    CreatedDate
)

VALUES
(
    @GuestHouseID,
    @GuestHouseName,
    @Location,
    @Address,
    @ContactPerson,
    @ContactNo,
    @ContactEmailID,
    1,
    @CreatedBy,
    GETDATE()
)

`);

        res.json({

            success: true,

            message: "Guest House created successfully."

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

//Update GuestHouse
exports.updateGuestHouse = async (req, res) => {

    try {

        const pool = await poolPromise;

        const currentUser = req.user;

        const guestHouseId = req.params.id;

        const {

            GuestHouseName,

            Location,

            Address,

            ContactPerson,

            ContactNo,

            ContactEmailID

        } = req.body;

        await pool.request()

            .input("GuestHouseID", sql.VarChar, guestHouseId)

            .input("GuestHouseName", sql.VarChar, GuestHouseName)

            .input("Location", sql.VarChar, Location)

            .input("Address", sql.VarChar, Address)

            .input("ContactPerson", sql.VarChar, ContactPerson)

            .input("ContactNo", sql.VarChar, ContactNo)

            .input("ContactEmailID", sql.VarChar, ContactEmailID)

            .input("ModifiedBy", sql.VarChar, currentUser.EmployeeId)

            .query(`

UPDATE GuestHouseMaster

SET

GuestHouseName=@GuestHouseName,

Location=@Location,

Address=@Address,

ContactPerson=@ContactPerson,

ContactNo=@ContactNo,

ContactEmailID=@ContactEmailID,

ModifiedBy=@ModifiedBy,

ModifiedDate=GETDATE()

WHERE GuestHouseID=@GuestHouseID

`);

        res.json({

            success: true,

            message: "Guest House updated successfully."

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

//Toggle Status
exports.toggleGuestHouseStatus = async (req, res) => {

    try {

        const pool = await poolPromise;

        const currentUser = req.user;

        await pool.request()

            .input(

                "GuestHouseID",

                sql.VarChar,

                req.params.id

            )

            .input(

                "ModifiedBy",

                sql.VarChar,

                currentUser.EmployeeId

            )

            .query(`

UPDATE GuestHouseMaster

SET

IsActive=

CASE

WHEN IsActive=1

THEN 0

ELSE 1

END,

ModifiedBy=@ModifiedBy,

ModifiedDate=GETDATE()

WHERE GuestHouseID=@GuestHouseID

`);

        res.json({

            success: true,

            message: "Status updated successfully."

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




exports.getRecentApplications = async (req, res) => {

    try {

        const pool = await poolPromise;

        const result = await pool.request().query(`

SELECT TOP (10)

GHBookingID,

GHRBookingNo,

GuestName,

ArrivalDateTime,

DepartureDateTime,

BookingStatus,

CreatedDate

FROM GuestHouseRoomBookings

ORDER BY CreatedDate DESC

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

exports.getApplications = async (req, res) => {

    try {

        const pool = await poolPromise;

        const result = await pool.request().query(`

SELECT

GHBookingID,

GHRBookingNo,

GuestName,

BookedBy,

ArrivalDateTime,

DepartureDateTime,

BookingStatus,

CreatedDate

FROM GuestHouseRoomBookings

ORDER BY CreatedDate DESC

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

exports.getAllocationDetails = async (req, res) => {

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

SELECT

a.GHRAllocationID,

a.AllocatedRoom,

a.CheckInOccupantsNo,

a.DayRate,

a.IsSingleOccupancy,

a.AllocatedBy,

a.AllocatedOn,

r.RoomTypeName,

r.RoomNumber

FROM GuestHouseRoomAllocation a

INNER JOIN GuestHouseRooms r

ON a.AllocatedRoom = r.RoomTypeID

WHERE a.GHBookingID=@BookingID

ORDER BY r.RoomNumber

`);

        res.json(result.recordset);

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};
exports.getRooms = async (req, res) => {

    try {

        const pool = await poolPromise;

        const result = await pool.request().query(`

    SELECT

r.GHRMID,

r.GHRoomNo,

r.IsActive,

g.GuestHouseName,

t.RoomTypeName

FROM GuestHouseRoomMaster r

LEFT JOIN GuestHouseMaster g

ON r.GuestHouseID=g.GuestHouseID

LEFT JOIN RoomTypeMaster t

ON r.RoomTypeID=t.RoomTypeID

ORDER BY

g.GuestHouseName,

r.GHRoomNo

`);

        res.json(result.recordset);

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.createRoom = async (req, res) => {

    try {

        const pool = await poolPromise;

        const {

            roomNumber,

            guestHouseId,

            roomTypeId,

            floor

        } = req.body;

        await pool.request()

            .input("RoomNumber", sql.VarChar, roomNumber)

            .input("GuestHouseID", sql.VarChar, guestHouseId)

            .input("RoomTypeID", sql.VarChar, roomTypeId)

            .input("Floor", sql.Int, floor)

            .query(`

INSERT INTO GuestHouseRooms(

RoomNumber,

GuestHouseID,

RoomTypeID,

Floor,

IsActive

)

VALUES(

@RoomNumber,

@GuestHouseID,

@RoomTypeID,

@Floor,

1

)

`);

        res.json({

            success: true,

            message: "Room Added Successfully"

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.getGuestHouses = async (req, res) => {

    try {

        const pool = await poolPromise;

        const result = await pool.request().query(`

SELECT

    GuestHouseID,

    GuestHouseName,

    Location,

    Address,

    ContactPerson,

    ContactNo,

    ContactEmailID,

    IsActive

FROM GuestHouseMaster

ORDER BY GuestHouseName

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



exports.getRoomTypes = async (req, res) => {

    const pool = await poolPromise;

    const result = await pool.request().query(`

SELECT

RoomTypeID,

RoomTypeName

FROM RoomTypeMaster

WHERE IsActive = 1

ORDER BY RoomTypeName

`);

    res.json(result.recordset);

};

exports.updateRoom = async (req, res) => {

    try {

        const pool = await poolPromise;

        const roomId = req.params.id;

        const {

            roomNumber,

            guestHouseId,

            roomTypeId,

            isActive

        } = req.body;

        await pool.request()

            .input("RoomID", sql.VarChar, roomId)

            .input("RoomNumber", sql.VarChar, roomNumber)

            .input("GuestHouseID", sql.VarChar, guestHouseId)

            .input("RoomTypeID", sql.VarChar, roomTypeId)

            .input("IsActive", sql.Bit, isActive)

            .query(`

UPDATE GuestHouseRooms

SET

RoomNumber=@RoomNumber,

GuestHouseID=@GuestHouseID,

RoomTypeID=@RoomTypeID,

IsActive=@IsActive

WHERE RoomTypeID=@RoomID

`);

        res.json({

            success: true,

            message: "Room Updated Successfully"

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.toggleRoomStatus = async (req, res) => {

    try {

        const pool = await poolPromise;

        const roomId = req.params.id;

        await pool.request()

            .input(
                "RoomID",
                sql.VarChar,
                roomId
            )

            .query(`

UPDATE GuestHouseRooms

SET

IsActive=

CASE

WHEN IsActive=1

THEN 0

ELSE 1

END

WHERE RoomTypeID=@RoomID

`);

        res.json({

            success: true,

            message: "Room status updated."

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};


exports.getReceipt = async (req, res) => {

}


//Guest Types
//Get guest types
exports.getGuestTypes = async (req, res) => {

    try {

        const pool = await poolPromise;

        const result = await pool.request().query(`

            SELECT

                GuestTypeID,

                GuestTypeName,

                IsActive

            FROM GuestTypeMaster

            ORDER BY GuestTypeName

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

exports.createGuestType = async (req, res) => {

    try {

        const pool = await poolPromise;

        const currentUser = req.user;

        const { GuestTypeName } = req.body;

        const exists = await pool.request()

            .input(
                "GuestTypeName",
                sql.VarChar,
                GuestTypeName
            )

            .query(`

                SELECT GuestTypeID

                FROM GuestTypeMaster

                WHERE GuestTypeName=@GuestTypeName

            `);

        if (exists.recordset.length > 0) {

            return res.status(400).json({

                success: false,

                message: "Guest Type already exists."

            });

        }

        const guestTypeId = await generateGuestTypeId(null);

        await pool.request()

            .input(
                "GuestTypeID",
                sql.VarChar,
                guestTypeId
            )

            .input(
                "GuestTypeName",
                sql.VarChar,
                GuestTypeName
            )

            .input(
                "CreatedBy",
                sql.VarChar,
                currentUser.EmployeeId
            )

            .query(`

                INSERT INTO GuestTypeMaster
                (
                    GuestTypeID,
                    GuestTypeName,
                    IsActive,
                    CreatedBy,
                    CreatedDate
                )

                VALUES
                (
                    @GuestTypeID,
                    @GuestTypeName,
                    1,
                    @CreatedBy,
                    GETDATE()
                )

            `);

        res.json({

            success: true,

            message: "Guest Type created successfully."

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

exports.updateGuestType = async (req, res) => {

    try {

        const pool = await poolPromise;

        const currentUser = req.user;

        const { GuestTypeName } = req.body;

        await pool.request()

            .input(
                "GuestTypeID",
                sql.VarChar,
                req.params.id
            )

            .input(
                "GuestTypeName",
                sql.VarChar,
                GuestTypeName
            )

            .input(
                "ModifiedBy",
                sql.VarChar,
                currentUser.EmployeeId
            )

            .query(`

                UPDATE GuestTypeMaster

                SET

                    GuestTypeName=@GuestTypeName,

                    ModifiedBy=@ModifiedBy,

                    ModifiedDate=GETDATE()

                WHERE GuestTypeID=@GuestTypeID

            `);

        res.json({

            success: true,

            message: "Guest Type updated successfully."

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

exports.toggleGuestTypeStatus = async (req, res) => {

    try {

        const pool = await poolPromise;

        const currentUser = req.user;

        await pool.request()

            .input(
                "GuestTypeID",
                sql.VarChar,
                req.params.id
            )

            .input(
                "ModifiedBy",
                sql.VarChar,
                currentUser.EmployeeId
            )

            .query(`

                UPDATE GuestTypeMaster

                SET

                    IsActive=
                        CASE
                            WHEN IsActive=1
                            THEN 0
                            ELSE 1
                        END,

                    ModifiedBy=@ModifiedBy,

                    ModifiedDate=GETDATE()

                WHERE GuestTypeID=@GuestTypeID

            `);

        res.json({

            success: true,

            message: "Status updated successfully."

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


//Room Charges
exports.getRoomCharges = async (req, res) => {

    try {

        const pool = await poolPromise;

        const result = await pool.request().query(`

SELECT

    c.GHRCID,

    c.GuestHouseID,

    gh.GuestHouseName,

    c.RoomTypeID,

    rt.RoomTypeName,

    c.IsSingleOccupancy,

    c.DayRate,

    c.[15DayRate] AS FifteenDayRate,

    c.[30DayRate] AS ThirtyDayRate,

    c.IsActive

FROM GuestHouseRoomCharges c

INNER JOIN GuestHouseMaster gh

ON c.GuestHouseID=gh.GuestHouseID

INNER JOIN RoomTypeMaster rt

ON c.RoomTypeID=rt.RoomTypeID

ORDER BY

gh.GuestHouseName,

rt.RoomTypeName

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

exports.createRoomCharge = async (req, res) => {

    try {

        const pool = await poolPromise;

        const currentUser = req.user;

        const {

            GuestHouseID,

            RoomTypeID,

            IsSingleOccupancy,

            DayRate,

            FifteenDayRate,

            ThirtyDayRate

        } = req.body;

        const exists = await pool.request()

            .input("GuestHouseID", sql.VarChar, GuestHouseID)

            .input("RoomTypeID", sql.VarChar, RoomTypeID)

            .input("IsSingleOccupancy", sql.Bit, IsSingleOccupancy)

            .query(`

                SELECT GHRCID

                FROM GuestHouseRoomCharges

                WHERE

                    GuestHouseID=@GuestHouseID

                    AND RoomTypeID=@RoomTypeID

                    AND IsSingleOccupancy=@IsSingleOccupancy

            `);

        if (exists.recordset.length > 0) {

            return res.status(400).json({

                success: false,

                message: "Charges already configured."

            });

        }

        const chargeId = await generateRoomChargeId(null);

        await pool.request()

            .input("GHRCID", sql.VarChar, chargeId)

            .input("GuestHouseID", sql.VarChar, GuestHouseID)

            .input("RoomTypeID", sql.VarChar, RoomTypeID)

            .input("IsSingleOccupancy", sql.Bit, IsSingleOccupancy)

            .input("DayRate", sql.Decimal(10, 2), DayRate)

            .input("FifteenDayRate", sql.Decimal(10, 2), FifteenDayRate)

            .input("ThirtyDayRate", sql.Decimal(10, 2), ThirtyDayRate)

            .input("CreatedBy", sql.VarChar, currentUser.EmployeeId)

            .query(`

                INSERT INTO GuestHouseRoomCharges
                (
                    GHRCID,
                    GuestHouseID,
                    RoomTypeID,
                    IsSingleOccupancy,
                    DayRate,
                    [15DayRate],
                    [30DayRate],
                    IsActive,
                    CreatedBy,
                    CreatedDate
                )

                VALUES
                (
                    @GHRCID,
                    @GuestHouseID,
                    @RoomTypeID,
                    @IsSingleOccupancy,
                    @DayRate,
                    @FifteenDayRate,
                    @ThirtyDayRate,
                    1,
                    @CreatedBy,
                    GETDATE()
                )

            `);

        res.json({

            success: true,

            message: "Room Charges created successfully."

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

exports.updateRoomCharge = async (req, res) => {

    try {

        const pool = await poolPromise;

        const currentUser = req.user;

        const {

            GuestHouseID,

            RoomTypeID,

            IsSingleOccupancy,

            DayRate,

            FifteenDayRate,

            ThirtyDayRate

        } = req.body;

        await pool.request()

            .input("GHRCID", sql.VarChar, req.params.id)

            .input("GuestHouseID", sql.VarChar, GuestHouseID)

            .input("RoomTypeID", sql.VarChar, RoomTypeID)

            .input("IsSingleOccupancy", sql.Bit, IsSingleOccupancy)

            .input("DayRate", sql.Decimal(10, 2), DayRate)

            .input("FifteenDayRate", sql.Decimal(10, 2), FifteenDayRate)

            .input("ThirtyDayRate", sql.Decimal(10, 2), ThirtyDayRate)

            .input("ModifiedBy", sql.VarChar, currentUser.EmployeeId)

            .query(`

                UPDATE GuestHouseRoomCharges

                SET

                    GuestHouseID=@GuestHouseID,

                    RoomTypeID=@RoomTypeID,

                    IsSingleOccupancy=@IsSingleOccupancy,

                    DayRate=@DayRate,

                    [15DayRate]=@FifteenDayRate,

                    [30DayRate]=@ThirtyDayRate,

                    ModifiedBy=@ModifiedBy,

                    ModifiedDate=GETDATE()

                WHERE

                    GHRCID=@GHRCID

            `);

        res.json({

            success: true,

            message: "Room Charges updated successfully."

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

exports.toggleRoomChargeStatus = async (req, res) => {

    try {

        const pool = await poolPromise;

        const currentUser = req.user;

        await pool.request()

            .input("GHRCID", sql.VarChar, req.params.id)

            .input("ModifiedBy", sql.VarChar, currentUser.EmployeeId)

            .query(`

                UPDATE GuestHouseRoomCharges

                SET

                    IsActive=

                        CASE

                            WHEN IsActive=1

                            THEN 0

                            ELSE 1

                        END,

                    ModifiedBy=@ModifiedBy,

                    ModifiedDate=GETDATE()

                WHERE

                    GHRCID=@GHRCID

            `);

        res.json({

            success: true,

            message: "Status updated successfully."

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

exports.getRoles = async (req, res) => {

    try {

        const pool = await poolPromise;

        const result = await pool.request().query(`

SELECT

RoleID,

RoleName,

Description,

IsActive

FROM RoleMaster

ORDER BY

RoleName

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

exports.createRole = async (req, res) => {

    try {

        const pool = await poolPromise;

        const currentUser = req.user;

        const {

            RoleName,

            Description

        } = req.body;

        const exists = await pool.request()

            .input(
                "RoleName",
                sql.VarChar,
                RoleName
            )

            .query(`

SELECT RoleID

FROM RoleMaster

WHERE RoleName=@RoleName

`);

        if (exists.recordset.length > 0) {

            return res.status(400).json({

                success: false,

                message: "Role already exists."

            });

        }

        const roleId =

            await generateRoleId(null);

        await pool.request()

            .input(
                "RoleID",
                sql.VarChar,
                roleId
            )

            .input(
                "RoleName",
                sql.VarChar,
                RoleName
            )

            .input(
                "Description",
                sql.NVarChar,
                Description
            )

            .input(
                "CreatedBy",
                sql.VarChar,
                currentUser.EmployeeId
            )

            .query(`

INSERT INTO RoleMaster
(
RoleID,
RoleName,
Description,
IsActive,
CreatedBy,
CreatedDate
)

VALUES
(
@RoleID,
@RoleName,
@Description,
1,
@CreatedBy,
GETDATE()
)

`);

        res.json({

            success: true,

            message: "Role created successfully."

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

exports.updateRole = async (req, res) => {

    try {

        const pool = await poolPromise;

        const currentUser = req.user;

        const {

            RoleName,

            Description

        } = req.body;

        await pool.request()

            .input(
                "RoleID",
                sql.VarChar,
                req.params.id
            )

            .input(
                "RoleName",
                sql.VarChar,
                RoleName
            )

            .input(
                "Description",
                sql.NVarChar,
                Description
            )

            .input(
                "ModifiedBy",
                sql.VarChar,
                currentUser.EmployeeId
            )

            .query(`

UPDATE RoleMaster

SET

RoleName=@RoleName,

Description=@Description,

ModifiedBy=@ModifiedBy,

ModifiedDate=GETDATE()

WHERE

RoleID=@RoleID

`);

        res.json({

            success: true,

            message: "Role updated successfully."

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

exports.toggleRoleStatus = async (req, res) => {

    try {

        const pool = await poolPromise;

        const currentUser = req.user;

        await pool.request()

            .input(
                "RoleID",
                sql.VarChar,
                req.params.id
            )

            .input(
                "ModifiedBy",
                sql.VarChar,
                currentUser.EmployeeId
            )

            .query(`

UPDATE RoleMaster

SET

IsActive=

CASE

WHEN IsActive=1

THEN 0

ELSE 1

END,

ModifiedBy=@ModifiedBy,

ModifiedDate=GETDATE()

WHERE

RoleID=@RoleID

`);

        res.json({

            success: true,

            message: "Status updated."

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

exports.getEmployees = async (req, res) => {

    try {

        const pool = await poolPromise;

        const result = await pool.request().query(`

SELECT

EmployeeID,

EmployeeName,

DepartmentName

FROM EmployeeMaster

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

exports.getUserAccess = async (req, res) => {

    try {

        const pool = await poolPromise;

        const result = await pool.request().query(`

SELECT

ua.UserAccessID,

ua.GuestHouseID,

gh.GuestHouseName,

ua.EmployeeID,

emp.EmployeeName,

ua.RoleID,

rm.RoleName,

ua.IsDefault,

ua.IsActive

FROM GuestHouseUserAccess ua

INNER JOIN GuestHouseMaster gh

ON ua.GuestHouseID = gh.GuestHouseID

INNER JOIN EmployeeMaster emp

ON ua.EmployeeID = emp.EmployeeID

INNER JOIN RoleMaster rm

ON ua.RoleID = rm.RoleID

ORDER BY

gh.GuestHouseName,

rm.RoleName,

emp.EmployeeName

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

exports.createUserAccess = async (req, res) => {

    try {

        const pool = await poolPromise;

        const currentUser = req.user;

        const {

            GuestHouseID,
            EmployeeID,
            RoleID,
            IsDefault

        } = req.body;

        // Check duplicate mapping

        const exists = await pool.request()

            .input("GuestHouseID", sql.VarChar, GuestHouseID)
            .input("EmployeeID", sql.VarChar, EmployeeID)
            .input("RoleID", sql.VarChar, RoleID)

            .query(`

SELECT UserAccessID

FROM GuestHouseUserAccess

WHERE

GuestHouseID=@GuestHouseID

AND EmployeeID=@EmployeeID

AND RoleID=@RoleID

AND IsActive=1

`);

        if (exists.recordset.length > 0) {

            return res.status(400).json({

                success: false,

                message: "User access already exists."

            });

        }

        const userAccessId =
            await generateUserAccessId(null);

        const transaction =
            new sql.Transaction(pool);

        await transaction.begin();

        try {

            if (IsDefault) {

                await new sql.Request(transaction)

                    .input("GuestHouseID", sql.VarChar, GuestHouseID)

                    .input("RoleID", sql.VarChar, RoleID)

                    .query(`

UPDATE GuestHouseUserAccess

SET IsDefault=0

WHERE

GuestHouseID=@GuestHouseID

AND RoleID=@RoleID

`);

            }

            await new sql.Request(transaction)

                .input("UserAccessID", sql.VarChar, userAccessId)

                .input("GuestHouseID", sql.VarChar, GuestHouseID)

                .input("EmployeeID", sql.VarChar, EmployeeID)

                .input("RoleID", sql.VarChar, RoleID)

                .input("IsDefault", sql.Bit, IsDefault)

                .input("CreatedBy", sql.VarChar, currentUser.EmployeeId)

                .query(`

INSERT INTO GuestHouseUserAccess
(
UserAccessID,
GuestHouseID,
EmployeeID,
RoleID,
IsDefault,
IsActive,
CreatedBy,
CreatedDate
)

VALUES
(
@UserAccessID,
@GuestHouseID,
@EmployeeID,
@RoleID,
@IsDefault,
1,
@CreatedBy,
GETDATE()
)

`);

            await transaction.commit();

            res.json({

                success: true,

                message: "User access created successfully."

            });

        }

        catch (err) {

            await transaction.rollback();

            throw err;

        }

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.updateUserAccess = async (req, res) => {

    try {

        const pool = await poolPromise;

        const currentUser = req.user;

        const {

            GuestHouseID,
            EmployeeID,
            RoleID,
            IsDefault

        } = req.body;

        const transaction =
            new sql.Transaction(pool);

        await transaction.begin();

        try {

            if (IsDefault) {

                await new sql.Request(transaction)

                    .input("GuestHouseID", sql.VarChar, GuestHouseID)

                    .input("RoleID", sql.VarChar, RoleID)

                    .query(`

UPDATE GuestHouseUserAccess

SET IsDefault=0

WHERE

GuestHouseID=@GuestHouseID

AND RoleID=@RoleID

`);

            }

            await new sql.Request(transaction)

                .input("UserAccessID", sql.VarChar, req.params.id)

                .input("GuestHouseID", sql.VarChar, GuestHouseID)

                .input("EmployeeID", sql.VarChar, EmployeeID)

                .input("RoleID", sql.VarChar, RoleID)

                .input("IsDefault", sql.Bit, IsDefault)

                .input("ModifiedBy", sql.VarChar, currentUser.EmployeeId)

                .query(`

UPDATE GuestHouseUserAccess

SET

GuestHouseID=@GuestHouseID,

EmployeeID=@EmployeeID,

RoleID=@RoleID,

IsDefault=@IsDefault,

ModifiedBy=@ModifiedBy,

ModifiedDate=GETDATE()

WHERE

UserAccessID=@UserAccessID

`);

            await transaction.commit();

            res.json({

                success: true,

                message: "User access updated successfully."

            });

        }

        catch (err) {

            await transaction.rollback();

            throw err;

        }

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.toggleUserAccessStatus = async (req, res) => {

    try {

        const pool = await poolPromise;

        const currentUser = req.user;

        await pool.request()

            .input("UserAccessID", sql.VarChar, req.params.id)

            .input("ModifiedBy", sql.VarChar, currentUser.EmployeeId)

            .query(`

UPDATE GuestHouseUserAccess

SET

IsActive=

CASE

WHEN IsActive=1

THEN 0

ELSE 1

END,

ModifiedBy=@ModifiedBy,

ModifiedDate=GETDATE()

WHERE

UserAccessID=@UserAccessID

`);

        res.json({

            success: true,

            message: "Status updated successfully."

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

/*
===========================================================
Generic Reports
===========================================================
*/

exports.getReport = async (req, res) => {

    try {

        const { reportType } = req.params;

        if (!REPORT_QUERIES[reportType]) {

            return res.status(404).json({

                success: false,

                message: "Invalid report type."

            });

        }

        const pool = await poolPromise;

        const request = pool.request();

        const whereClause = buildFilters(

            request,

            req.query

        );

        const sqlQuery =

            REPORT_QUERIES[reportType](

                whereClause

            );

        const result =

            await request.query(

                sqlQuery

            );

        let summary = {};

        switch (reportType) {

            case "bookings":

                summary = {

                    TotalBookings:

                        result.recordset.length,

                    Approved:

                        result.recordset.filter(

                            x => x.BookingStatus === "Approved"

                        ).length,

                    Pending:

                        result.recordset.filter(

                            x =>

                                [

                                    "Submitted",

                                    "Verified"

                                ].includes(

                                    x.BookingStatus

                                )

                        ).length,

                    Rejected:

                        result.recordset.filter(

                            x =>

                                x.BookingStatus === "Rejected"

                        ).length

                };

                break;

            case "occupancy":

                summary = {

                    TotalRooms:

                        result.recordset.reduce(

                            (a, b) =>

                                a + b.TotalRooms,

                            0

                        ),

                    Occupied:

                        result.recordset.reduce(

                            (a, b) =>

                                a + b.OccupiedRooms,

                            0

                        ),

                    Available:

                        result.recordset.reduce(

                            (a, b) =>

                                a + b.AvailableRooms,

                            0

                        ),

                    Maintenance:

                        result.recordset.reduce(

                            (a, b) =>

                                a + b.MaintenanceRooms,

                            0

                        )

                };

                break;

            case "revenue":

                summary = {

                    Revenue:

                        result.recordset.reduce(

                            (a, b) =>

                                a + Number(b.Revenue),

                            0

                        ),

                    Collected:

                        result.recordset.reduce(

                            (a, b) =>

                                a + Number(b.CollectedAmount),

                            0

                        ),

                    Pending:

                        result.recordset.reduce(

                            (a, b) =>

                                a + Number(b.PendingAmount),

                            0

                        )

                };

                break;

            case "guestStatistics":

                summary = {

                    GuestTypes:

                        result.recordset.length,

                    TotalGuests:

                        result.recordset.reduce(

                            (a, b) =>

                                a + Number(b.TotalGuests),

                            0

                        )

                };

                break;

            case "roomUtilization":

                summary = {

                    TotalRooms:

                        result.recordset.length

                };

                break;

            default:

                summary = {};

        }

        res.json({

            success: true,

            reportType,

            summary,

            data: result.recordset

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

/*
=====================================================
Room Availability Calendar
=====================================================
*/

exports.getRoomAvailability = async (req, res) => {

    try {

        const pool = await poolPromise;

        const {

            guestHouse,

            month,

            year

        } = req.query;

        const request = pool.request();

        let whereClause = `
            WHERE r.IsActive = 1
        `;

        if (guestHouse) {

            whereClause += `
                AND
                r.GuestHouseID=@GuestHouseID
            `;

            request.input(
                "GuestHouseID",
                sql.VarChar,
                guestHouse
            );

        }

        const result = await request.query(`

SELECT

r.RoomTypeID,

r.GHRoomNo,

r.RoomTypeID,

gh.GuestHouseName,

gh.GuestHouseID

FROM GuestHouseRoomMaster r

INNER JOIN GuestHouseMaster gh

ON gh.GuestHouseID=r.GuestHouseID

${whereClause}

ORDER BY

gh.GuestHouseName,

r.GHRoomNo

`);

        const bookingRequest = pool.request();

        if (guestHouse) {

            bookingRequest.input(

                "GuestHouseID",

                sql.VarChar,

                guestHouse

            );

        }

        let bookingWhere = `
            WHERE
            b.BookingStatus IN
            (
                'Approved',
                'Allocated',
                'CheckedIn'
            )
        `;

        if (guestHouse) {

            bookingWhere += `
                AND
                b.GuestHouseID=@GuestHouseID
            `;

        }

        const bookings = await bookingRequest.query(`

SELECT

d.RoomTypeID,

b.GHBookingID,

b.GuestName,

b.BookingStatus,

b.ArrivalDateTime,

b.DepartureDateTime

FROM GuestHouseBookingRoomDetails d

INNER JOIN GuestHouseRoomBookings b

ON b.GHBookingID=d.GHBookingID

${bookingWhere}

`);

        const bookingMap = {};

        bookings.recordset.forEach(booking => {

            if (!bookingMap[booking.RoomTypeID]) {

                bookingMap[
                    booking.RoomTypeID
                ] = [];

            }

            bookingMap[
                booking.RoomTypeID
            ].push(booking);

        });

        const rooms = result.recordset.map(room => ({

            ...room,

            Bookings:

                bookingMap[
                room.RoomTypeID
                ] || []

        }));

        const occupancy = {

            TotalRooms:

                rooms.length,

            OccupiedRooms:

                rooms.filter(

                    room =>

                        room.Bookings.length > 0

                ).length,

            AvailableRooms:

                rooms.filter(

                    room =>

                        room.Bookings.length === 0

                ).length

        };

        res.json({

            occupancy,

            rooms

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

/*
=====================================================
Room Details
=====================================================
*/

exports.getRoomDetails = async (req, res) => {

    try {

        const pool = await poolPromise;

        const result = await pool.request()

            .input(

                "RoomID",

                sql.VarChar,

                req.params.roomId

            )

            .query(`

SELECT

b.GHRBookingNo,

b.GuestName,

b.BookingStatus,

b.ArrivalDateTime,

b.DepartureDateTime,

b.BookedBy

FROM GuestHouseBookingRoomDetails d

INNER JOIN GuestHouseRoomBookings b

ON b.GHBookingID=d.GHBookingID

WHERE

d.RoomTypeID=@RoomID

ORDER BY

b.ArrivalDateTime DESC

        `);

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

/*
====================================================
Workflow Dashboard
====================================================
*/

exports.getWorkflowDashboard = async (req, res) => {

    try {

        const pool = await poolPromise;

        const result = await pool.request().query(`

SELECT

b.GHBookingID,

b.GHRBookingNo,

b.GuestName,

b.BookingStatus,

b.CreatedDate,

ISNULL(

    (

        SELECT TOP 1

        AuthorityRole

        FROM WorkflowHistory

        WHERE

        ModuleName='GuestHouse'

        AND

        ReferenceID=b.GHBookingID

        ORDER BY

        SequenceNo DESC

    ),

    '-'

) AS PendingWith

FROM GuestHouseRoomBookings b

ORDER BY

b.CreatedDate DESC

        `);

        const summary = {

            Submitted:

                result.recordset.filter(

                    x => x.BookingStatus === "Submitted"

                ).length,

            Verified:

                result.recordset.filter(

                    x => x.BookingStatus === "Verified"

                ).length,

            Approved:

                result.recordset.filter(

                    x => x.BookingStatus === "Approved"

                ).length,

            Allocated:

                result.recordset.filter(

                    x => x.BookingStatus === "Allocated"

                ).length,

            CheckedIn:

                result.recordset.filter(

                    x => x.BookingStatus === "CheckedIn"

                ).length

        };

        res.json({

            success: true,

            summary,

            data: result.recordset

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

/*
====================================================
Workflow Timeline
====================================================
*/

exports.getWorkflowTimeline = async (

    req,

    res

) => {

    try {

        const logs = await getWorkflowHistory(

            "GuestHouse",

            req.params.bookingId

        );

        res.json({

            success: true,

            bookingId: req.params.bookingId,

            totalSteps: logs.length,

            data: logs

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

/*
=========================================================
System Settings
=========================================================
*/

exports.getSystemSettings = async (

    req,

    res

) => {

    try {

        const settings = await getModuleSettings(

            req.params.module

        );

        res.json({

            success: true,

            data: settings

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

/*
=========================================================
Save System Settings
=========================================================
*/

exports.saveSystemSettings = async (

    req,

    res

) => {

    try {

        await updateSettings(

            req.params.module,

            req.body,

            req.user.EmployeeId

        );

        res.json({

            success: true,

            message: "Settings updated successfully."

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

