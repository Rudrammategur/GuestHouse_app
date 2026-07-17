const REPORT_QUERIES = {

    /*
    ====================================================
    Booking Report
    ====================================================
    */

    bookings: (whereClause) => `

SELECT

    b.GHBookingID,

    b.GHRBookingNo,

    b.GuestName,

    b.BookedBy,

    gh.GuestHouseName,

    gt.GuestTypeName,

    b.ArrivalDateTime,

    b.DepartureDateTime,

    b.BookingStatus,

    b.CreatedDate

FROM GuestHouseRoomBookings b

LEFT JOIN GuestHouseMaster gh

ON gh.GuestHouseID=b.GuestHouseID

LEFT JOIN GuestTypeMaster gt

ON gt.GuestTypeID=b.GuestTypeID

${whereClause}

ORDER BY

b.CreatedDate DESC

`,



    /*
    ====================================================
    Occupancy Report
    ====================================================
    */

    occupancy: `

SELECT

    gh.GuestHouseID,

    gh.GuestHouseName,

    COUNT(r.RoomTypeID) AS TotalRooms,

    0 AS OccupiedRooms,

    COUNT(r.RoomTypeID) AS AvailableRooms,

    0 AS MaintenanceRooms

FROM GuestHouseMaster gh

LEFT JOIN GuestHouseRoomMaster r

ON gh.GuestHouseID = r.GuestHouseID

WHERE

gh.IsActive = 1

AND

r.IsActive = 1

GROUP BY

gh.GuestHouseID,

gh.GuestHouseName

ORDER BY

gh.GuestHouseName

`,



    /*
    ====================================================
    Revenue Report
    ====================================================
    */

    revenue: `

SELECT

    gh.GuestHouseName,

    COUNT(*) AS TotalBookings,

    0 AS Revenue,

    0 AS CollectedAmount,

    0 AS PendingAmount

FROM GuestHouseRoomBookings b

INNER JOIN GuestHouseMaster gh

ON gh.GuestHouseID = b.GuestHouseID

GROUP BY

gh.GuestHouseName

ORDER BY

gh.GuestHouseName

`,



    /*
    ====================================================
    Guest Statistics
    ====================================================
    */

    guestStatistics: `

SELECT

    gt.GuestTypeName,

    COUNT(*) AS TotalBookings,

    COUNT(*) AS TotalGuests,

    AVG(

        DATEDIFF(

            DAY,

            ArrivalDateTime,

            DepartureDateTime

        )

    ) AS AverageStay

FROM GuestHouseRoomBookings b

INNER JOIN GuestTypeMaster gt

ON gt.GuestTypeID = b.GuestTypeID

GROUP BY

gt.GuestTypeName

ORDER BY

gt.GuestTypeName

`,



    /*
    ====================================================
    Room Utilization
    ====================================================
    */

    roomUtilization: `

SELECT

    r.GHRoomNo,

    gh.GuestHouseName,

    0 AS OccupiedDays,

    0 AS VacantDays,

    0 AS OccupancyPercentage

FROM GuestHouseRoomMaster r

INNER JOIN GuestHouseMaster gh

ON gh.GuestHouseID = r.GuestHouseID

WHERE

r.IsActive = 1

ORDER BY

gh.GuestHouseName,

r.GHRoomNo

`

};

module.exports = REPORT_QUERIES;