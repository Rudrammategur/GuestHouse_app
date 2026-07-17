const sql = require("mssql");
const { poolPromise } = require("../config/db");

exports.getGuestHouseTypes = async (req, res) => {

    try {

        const pool = await poolPromise;

        const result = await pool
            .request()
            .query(`
                SELECT
                    GuestHouseID,
                    GuestHouseName
                FROM GuestHouseMaster
                WHERE IsActive = 1
                ORDER BY GuestHouseName
            `);

        res.json(
            result.recordset
        );

    }
    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message:
                "Failed to fetch guest houses"

        });

    }

};


exports.getRoomTypesByGuestHouse =
    async (req, res) => {

        try {

            const { guestHouseId } =
                req.params;

            const pool = await poolPromise;

            const result =
                await pool
                    .request()
                    .input(
                        "GuestHouseID",
                        sql.VarChar,
                        guestHouseId
                    )
                    .query(`
                    SELECT DISTINCT
                        RT.RoomTypeID,
                        RT.RoomTypeName
                    FROM GuestHouseRoomMaster GHRM
                    INNER JOIN RoomTypeMaster RT
                        ON RT.RoomTypeID =
                           GHRM.RoomTypeID
                    WHERE
                        GHRM.GuestHouseID =
                            @GuestHouseID
                        AND GHRM.IsActive = 1
                        AND RT.IsActive = 1
                    ORDER BY
                        RT.RoomTypeName
                `);

            res.json(
                result.recordset
            );

        }
        catch (error) {

            console.log(error);

            res.status(500).json({
                success: false,
                message:
                    "Failed to load room types"
            });

        }

    };

exports.getGuestTypes = async (req, res) => {

    try {
        const pool = await poolPromise;

        const result = await pool
            .request()
            .query(`
                SELECT
                    GuestTypeID,
                    GuestTypeName
                FROM GuesttypeMaster
                WHERE IsActive = 1
                ORDER BY GuestTypeName
            `);

        res.json(
            result.recordset
        );

    }
    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message:
                "Failed to fetch guest houses"

        });

    }
}


exports.getTariffDetails = async (req, res) => {

    try {

        const pool = await poolPromise;

        const result = await pool
            .request()
            .query(`
                SELECT

    GRC.GHRCID,

    GRC.GuestHouseID,

    GH.GuestHouseName,

    GRC.RoomTypeID,

    RT.RoomTypeName,

    CASE
        WHEN GRC.IsSingleOccupancy = 1
        THEN 'Single Person'
        ELSE 'Two Persons'
    END AS Occupancy,

    GRC.DayRate,

    GRC.[15DayRate],

    GRC.[30DayRate]

FROM GuestHouseRoomCharges GRC

INNER JOIN GuestHouseMaster GH
ON GH.GuestHouseID = GRC.GuestHouseID

INNER JOIN RoomTypeMaster RT
ON RT.RoomTypeID = GRC.RoomTypeID

WHERE
    GRC.IsActive = 1
    AND GH.IsActive = 1
    AND RT.IsActive = 1

ORDER BY

    GH.GuestHouseName,

    RT.RoomTypeName,

    GRC.IsSingleOccupancy;
            `);

        res.status(200).json(result.recordset);

    }
    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: "Failed to fetch tariff details"

        });

    }

};

exports.getProjects = async (req, res) => {

    try {

        const pool = await poolPromise;

        const result = await pool.request().query(`

            SELECT ProjectRefNo,ProjectName 
FROM Projects.dbo.CreateProjectDetails
Where ActiveStatus = 'Active' ORDER BY ProjectName

        `);

        res.status(200).json(result.recordset);

    }
    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

exports.getApplicationById = async (req, res) => {

    try {

        res.json({

            BookingID: 101,

            GuestTypeName: "Official Guest",

            GuestName: "Dr. Guest",

            GuestDesignation: "Professor, IIT Mandi",

            PurposeOfVisit: "Official Visit",

            GuestNationality: "Indian",

            GuestContactNo: "9876543210",

            GuestEmailID: "guest@gmail.com",

            ArrivalDateTime: "2026-07-01T10:00:00",

            DepartureDateTime: "2026-07-05T10:00:00",

            BookingStatus: "Approved",

            BookedBy: "EMP001",

            RoomRequirements: [

                {
                    RoomTypeID: 1,
                    RoomTypeName: "Single Room",
                    NoOfRooms: 1
                },

                {
                    RoomTypeID: 2,
                    RoomTypeName: "Double Room",
                    NoOfRooms: 2
                }

            ]

        });

    }

    catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};










// const sql = require("mssql");
// const { poolPromise } = require("../config/db");


// exports.getGuestHouseTypes = async (req, res) => {

//     try {

//         const pool = await poolPromise;

//         const result = await pool.request()
//             .query(`
//                 SELECT
//                     GuestHouseID,
//                     GuestHouseName
//                 FROM CONTRACTSERVICES..GuestHouseMaster
//                 WHERE IsActive = 1
//                 ORDER BY GuestHouseName
//             `);

//         res.status(200).json(result.recordset);

//     }

//     catch (err) {

//         console.log(err);

//         res.status(500).json({
//             success: false,
//             message: err.message
//         });

//     }

// };

// exports.getRoomTypes = async (req, res) => {

//     try {

//         const { guestHouseTypeId: guestHouseId } = req.params;

//         const pool = await poolPromise;

//         const result = await pool.request()

//             .input(
//                 "GuestHouseID",
//                 sql.Int,
//                 guestHouseId
//             )

//             .query(`

//                 SELECT

//                     RT.RoomTypeID,
//                     RT.RoomTypeName

//                 FROM GuestHouseTypeRoomTypeMapping GM

//                 INNER JOIN RoomTypeMaster RT

//                     ON GM.RoomTypeID = RT.RoomTypeID

//                 WHERE

//                     GM.GuestHouseID = @GuestHouseID

//                     AND GM.IsActive = 1

//                 ORDER BY RT.RoomTypeName

//             `);

//         res.status(200).json(
//             result.recordset
//         );

//     }

//     catch (err) {

//         console.log(err);

//         res.status(500).json({

//             success: false,

//             message: err.message

//         });

//     }

// };

// exports.getTariffDetails = async (req, res) => {

//     try {

//         const pool = await poolPromise;

//         const result = await pool.request()
//             .query(`

//                 SELECT

//                     G.GuestHouseTypeName,

//                     R.RoomTypeName,

//                     T.MinDays,

//                     T.MaxDays,

//                     T.RatePerDay

//                 FROM GuestHouseTariffMaster T

//                 INNER JOIN GuestHouseTypeMaster G

//                     ON T.GuestHouseTypeID =
//                        G.GuestHouseTypeID

//                 INNER JOIN RoomTypeMaster R

//                     ON T.RoomTypeID =
//                        R.RoomTypeID

//                 WHERE T.IsActive = 1

//                 ORDER BY

//                     G.GuestHouseTypeName,

//                     R.RoomTypeName,

//                     T.MinDays

//             `);

//         res.json(result.recordset);

//     }

//     catch (err) {

//         res.status(500).json({
//             success: false,
//             message: err.message
//         });

//     }

// };

// exports.getApplicationById = async (req, res) => {

//     try {

//         const { bookingId } = req.params;

//         const pool = await poolPromise;

//         const result = await pool.request()
//             .input(
//                 "BookingID",
//                 sql.Int,
//                 bookingId
//             )
//             .query(`

//                 SELECT
//                     B.BookingID,
//                     G.GuestTypeName,
//                     R.RoomTypeName,
//                     B.GuestName,
//                     B.GuestDesignation,
//                     B.PurposeOfVisit,
//                     B.ArrivalDateTime,
//                     B.DepartureDateTime,
//                     B.BookingStatus,
//                     B.BookingDateTime,
//                     B.BookedBy

//                 FROM GuestHouseBookings B

//                 INNER JOIN GuestTypeMaster G
//                 ON B.GuestTypeID=G.GuestTypeID

//                 INNER JOIN RoomTypeMaster R
//                 ON B.RoomTypeID=R.RoomTypeID

//                 WHERE BookingID=@BookingID

//             `);

//         res.json(
//             result.recordset[0]
//         );

//     }

//     catch (err) {

//         res.status(500).json({
//             success: false,
//             message: err.message
//         });

//     }

// };
