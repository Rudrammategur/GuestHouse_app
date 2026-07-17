const sql = require("mssql");

exports.buildFilters = (request, filters = {}) => {

    let where = [];

    if (filters.fromDate) {

        where.push("CAST(b.CreatedDate AS DATE) >= @FromDate");

        request.input(
            "FromDate",
            sql.Date,
            filters.fromDate
        );

    }

    if (filters.toDate) {

        where.push("CAST(b.CreatedDate AS DATE) <= @ToDate");

        request.input(
            "ToDate",
            sql.Date,
            filters.toDate
        );

    }

    if (filters.guestHouse) {

        where.push("b.GuestHouseID = @GuestHouseID");

        request.input(
            "GuestHouseID",
            sql.VarChar,
            filters.guestHouse
        );

    }

    if (filters.bookingStatus) {

        where.push("b.BookingStatus = @BookingStatus");

        request.input(
            "BookingStatus",
            sql.VarChar,
            filters.bookingStatus
        );

    }

    if (filters.guestType) {

        where.push("b.GuestTypeID=@GuestTypeID");

        request.input(
            "GuestTypeID",
            sql.VarChar,
            filters.guestType
        );

    }

    return where.length

        ? " WHERE " + where.join(" AND ")

        : "";

};