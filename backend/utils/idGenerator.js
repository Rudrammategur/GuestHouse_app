const sql = require("mssql");

// Private helper
async function generateId(
    transaction,
    {
        table,
        column,
        prefix,
        year = new Date().getFullYear(),
        digits = 5
    }
) {

    const finalPrefix = `${prefix}${year}`;

    const result = await new sql.Request(transaction)
        .input("Prefix", sql.VarChar, `${finalPrefix}%`)
        .query(`
            SELECT TOP 1 ${column}
            FROM ${table}
            WHERE ${column} LIKE @Prefix
            ORDER BY ${column} DESC
        `);

    if (result.recordset.length === 0) {
        return `${finalPrefix}${"1".padStart(digits, "0")}`;
    }

    const lastId = result.recordset[0][column];

    const sequence = parseInt(
        lastId.substring(finalPrefix.length),
        10
    );

    return (
        finalPrefix +
        (sequence + 1).toString().padStart(digits, "0")
    );
}

// Export generic function
exports.generateId = generateId;

// Wrapper functions
exports.generateGuestHouseBookingId = (transaction) =>
    generateId(transaction, {
        table: "GuestHouseRoomBookings",
        column: "GHBookingID",
        prefix: "GHB"
    });

exports.generateGuestHouseBookingNo = (transaction) =>
    generateId(transaction, {
        table: "GuestHouseRoomBookings",
        column: "GHRBookingNo",
        prefix: "GHR"
    });

exports.generateAllocationId = (transaction) =>
    generateId(transaction, {
        table: "GuestHouseRoomAllocation",
        column: "GHRAllocationID",
        prefix: "GHRA"
    });

exports.generateWorkflowHistoryId = (transaction) =>
    generateId(transaction, {
        table: "WorkflowHistory",
        column: "WorkflowHistoryID",
        prefix: "WFH"
    });

exports.generateGuestHouseId = (transaction) =>
    generateId(transaction, {
        table: "GuestHouseMaster",
        column: "GuestHouseID",
        prefix: "GH"
    });

exports.generateGuestTypeId = (transaction) =>
    generateId(transaction, {
        table: "GuestTypeMaster",
        column: "GuestTypeID",
        prefix: "GT"
    });

exports.generateRoomChargeId = (transaction) =>
    generateId(transaction, {
        table: "GuestHouseRoomCharges",
        column: "GHRCID",
        prefix: "GHRC"
    });

exports.generateRoleId = (transaction) =>
    generateId(transaction, {
        table: "RoleMaster",
        column: "RoleID",
        prefix: "ROLE"
    });

exports.generateUserAccessId = (transaction) =>
    generateId(transaction, {
        table: "GuestHouseUserAccess",
        column: "UserAccessID",
        prefix: "UA"
    });

    