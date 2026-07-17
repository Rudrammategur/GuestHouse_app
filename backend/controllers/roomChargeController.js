const { poolPromise } = require("../config/db");
const sql = require("mssql");

exports.getRoomCharge = async (req, res) => {
  try {

    const {roomTypeId } = req.query;

    console.log("RoomTypeID :", roomTypeId);

    const pool = await poolPromise;

    const result = await pool.request()
      .query(`
        SELECT RatePerDay
        FROM RoomTypeMaster
        WHERE RoomTypeID = @RoomTypeID
          AND IsActive = 1
      `);

    console.log(result.recordset);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: "Room charge not configured"
      });
    }

    res.json(result.recordset[0]);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Error fetching room charge",
      error: err.message
    });

  }
};