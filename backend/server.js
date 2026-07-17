const express = require("express");
const db = require("./config/db");
const app = express();
const cors = require("cors");
const expenditureHeadRoutes = require("./routes/expenditureHeadRoutes");
const guestHouseBookingRoutes = require("./routes/guestHouseBookingRoutes");
const verifierRoutes = require("./routes/verifierRoutes");
const approverRoutes = require("./routes/approverRoutes");
const userRoutes = require("./routes/userRoutes");
const masterRoutes = require("./routes/masterRoutes");
const guestHouseInchargeRoutes = require("./routes/guestHouseInchargeRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const workflowRoutes = require("./routes/workflowRoutes");
const { mockLogin } = require("./middleware/authMiddleware");


app.use(express.json());
app.use(cors());
app.use(mockLogin);
app.use("/api/expenditure-heads",expenditureHeadRoutes);
app.use("/api/guesthouse",guestHouseBookingRoutes);
app.use("/api/verifier", verifierRoutes);
app.use("/api/approver",approverRoutes);
app.use("/api/user",userRoutes);
app.use("/api/master",masterRoutes);
app.use("/api/guesthouse-incharge", guestHouseInchargeRoutes);
app.use("/api/bookings",bookingRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/workflow",workflowRoutes);


const { sql, poolPromise } = require("./config/db");

// app.post("/api/login", async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const pool = await poolPromise;

//         const result = await pool.request()
//             .input("email", sql.VarChar, email)
//             .input("password", sql.VarChar, password)
//             .query(`
//         SELECT 
//           e.EmployeeId,
//           e.EmployeeName,
//           e.OfficialMailID,
//           u.role
//         FROM HR..VW_EmployeeBasicDetails e
//         JOIN HR..UserAuth u 
//           ON e.OfficialMailID = u.email
//         WHERE e.OfficialMailID = @email 
//           AND u.password = @password
//       `);

//         if (result.recordset.length === 0) {
//             return res.status(401).json({ message: "Invalid credentials" });
//         }

//         res.json(result.recordset[0]);

//     } catch (err) {
//         console.log(err);
//         res.status(500).send(err);
//     }
// });

// //admin submits add guest house form
// app.post("/api/admin/guesthouse", async (req, res) => {
//     try {
//         const {
//             name,
//             description,
//             incharge_type,
//             incharge_name,
//             incharge_mobile,
//             incharge_email,
//             gender_applicable,
//             location,
//             status
//         } = req.body;

//         const pool = await poolPromise;

//         await pool.request()
//             .input("name", name)
//             .input("description", description)
//             .input("type", incharge_type)
//             .input("iname", incharge_name)
//             .input("mobile", incharge_mobile)
//             .input("email", incharge_email)
//             .input("gender", gender_applicable)
//             .input("location", location)
//             .input("status", status)
//             .query(`
//         INSERT INTO HR.dbo.guesthouses
//         (name, description, incharge_type, incharge_name, incharge_mobile, incharge_email, gender_applicable, location, status)
//         VALUES (@name, @description, @type, @iname, @mobile, @email, @gender, @location, @status)
//       `);

//         res.json({ message: "Guest House Created" });

//     } catch (err) {
//         res.status(500).send(err);
//     }
// });


// //user submits guest house booking form
// app.post("/api/guesthouse", async (req, res) => {
//     try {
//         const pool = await poolPromise;

//         let {
//             userId,
//             guesthouse_id,
//             guest_name,
//             guestTypeID,
//             booking_type,
//             arrival,
//             departure,
//             rooms
//         } = req.body;

//         // ✅ FIX DATE FORMAT HERE
//         arrival = arrival.replace("T", " ") + ":00";
//         departure = departure.replace("T", " ") + ":00";

//         console.log("Converted:", arrival, departure);

//         await pool.request()
//             .input("userId", userId)
//             .input("guesthouse_id", guesthouse_id)
//             .input("guest_name", guest_name)
//             .input("guestTypeID", guestTypeID)
//             .input("booking_type", booking_type)
//             .input("arrival", arrival)
//             .input("departure", departure)
//             .input("rooms", rooms)
//             .input("status", "Submitted")
//             .query(`
//         INSERT INTO HR.dbo.guesthouse_bookings
//         (user_id, guesthouse_id, guest_name, guestTypeID, booking_type, arrival, departure, rooms, status)
//         VALUES 
//         (@userId, @guesthouse_id, @guest_name, @guestTypeID, @booking_type, @arrival, @departure, @rooms, @status)
//       `);

//         res.json({ message: "Booking Submitted" });

//     } catch (err) {
//         console.log("ERROR:", err);
//         res.status(500).json({ error: err.message });
//     }
// });

// //show submitted guesthouse bookings to the user
// app.get("/api/my-bookings/:userId", async (req, res) => {
//     try {
//         const pool = await poolPromise;
//         const { userId } = req.params;

//         const result = await pool.request()
//             .input("userId", userId)
//             .query(`
//         SELECT 
//           b.id,
//           g.name AS guesthouse_name,
//           b.guest_name,
//           b.booking_type,
//           b.arrival,
//           b.departure,
//           b.status
//         FROM HR.dbo.guesthouse_bookings b
//         JOIN HR.dbo.guesthouses g ON b.guesthouse_id = g.id
//         WHERE b.user_id = @userId
//         ORDER BY b.id DESC
//       `);

//         res.json(result.recordset);

//     } catch (err) {
//         res.status(500).send(err);
//     }
// });

// //show submitted transport bookings to the user
// app.get(
//   "/api/my-transport-bookings/:userId",
//   async (req, res) => {

//     try {

//       const pool = await poolPromise;

//       const { userId } = req.params;

//       const result = await pool.request()
//         .input("userId", userId)
//         .query(`
//           SELECT *
//           FROM HR.dbo.transport_bookings
//           WHERE user_id = @userId
//           ORDER BY id DESC
//         `);

//       res.json(result.recordset);

//     } catch (err) {

//       console.log(err);

//       res.status(500).send(err);
//     }
// });

// //shows the approved & pending req stat to the user on dashboard
// app.get("/api/dashboard-stats/:userId", async (req, res) => {
//   try {
//     const pool = await poolPromise;
//     const { userId } = req.params;

//     const result = await pool.request()
//       .input("userId", userId)
//       .query(`
//         SELECT
//           SUM(CASE WHEN status = 'Submitted' THEN 1 ELSE 0 END) AS pendingCount,
//           SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) AS approvedCount,
//           SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) AS rejectedCount
//         FROM HR.dbo.guesthouse_bookings
//         WHERE user_id = @userId
//       `);

//     res.json(result.recordset[0]);

//   } catch (err) {
//     console.log(err);
//     res.status(500).send(err);
//   }
// });


//pending requests of users at approver side
// app.get("/api/pending-bookings", async (req, res) => {
//     try {
//         const pool = await poolPromise;

//         const result = await pool.request()
//             .input("role", sql.VarChar, role)
//             .query(`
//     SELECT 
//       b.id,
//       b.user_id,
//       g.name AS guesthouse_name,
//       b.guest_name,
//       b.booking_type,
//       b.arrival,
//       b.departure,
//       b.status
//     FROM HR.dbo.guesthouse_bookings b
//     JOIN HR.dbo.guesthouses g 
//       ON b.guesthouse_id = g.id
//     WHERE b.status = 'Pending'
//       AND b.approver_role = @role
//     ORDER BY b.id DESC
//   `);

//         res.json(result.recordset);

//         console.log("ROLE FROM FRONTEND:", req.query.role);

//     } catch (err) {
//         console.log(err);
//         res.status(500).send(err);
//     }
// });


// app.get("/api/pending-bookings", async (req, res) => {
//   try {
//     const { role } = req.query;
//     const pool = await poolPromise;

//     const result = await pool.request()
//       .input("role", role)
//       .query(`
//         SELECT * 
//         FROM HR.dbo.guesthouse_bookings
//         WHERE status = 'Pending'
//         AND approver_role = @role
//       `);

//     res.json(result.recordset);

//   } catch (err) {
//     console.log(err);
//     res.status(500).send(err);
//   }
// });


// app.get("/api/pending-bookings", async (req, res) => {
//   try {
//     const { userId } = req.query;

//     const pool = await poolPromise;

//     const result = await pool.request()
//       .input("userId", userId)
//       .query(`
//         SELECT 
//           b.id,
//           b.user_id,
//           g.name AS guesthouse_name,
//           b.guest_name,
//           b.booking_type,
//           b.arrival,
//           b.departure,
//           b.status
//         FROM HR.dbo.guesthouse_bookings b

//         JOIN HR.dbo.guesthouses g 
//           ON b.guesthouse_id = g.id

//         JOIN HR.dbo.userAuth u 
//           ON u.email = @email

//         WHERE b.status = 'Pending'
//           AND b.approver_role = u.role

//         ORDER BY b.id DESC
//       `);

//     res.json(result.recordset);

//   } catch (err) {
//     console.log(err);
//     res.status(500).send(err);
//   }
// });


// //API for approve/reject
// app.put("/api/update-booking-status/:id", async (req, res) => {
//     try {
//         const { status } = req.body;
//         const { id } = req.params;

//         const pool = await poolPromise;

//         await pool.request()
//             .input("status", status)
//             .input("id", id)
//             .query(`
//         UPDATE HR.dbo.guesthouse_bookings
//         SET status = @status
//         WHERE id = @id
//       `);

//         res.json({ message: "Status updated successfully" });

//     } catch (err) {
//         console.log(err);
//         res.status(500).send(err);
//     }
// });

// app.post("/api/transport", async (req, res) => {
//     const pool = await poolPromise;

//     const {
//         userId,
//         vehicle_type,
//         pickup_location,
//         drop_location,
//         journey_date,
//         purpose,
//         localContactPerson
//     } = req.body;

//     await pool.request()
//         .input("userId", userId)
//         .input("vehicle_type", vehicle_type)
//         .input("pickup", pickup_location)
//         .input("drop", drop_location)
//         .input("date", journey_date)
//         .input("purpose", purpose)
//         .query(`
//       INSERT INTO transport_bookings
//       (user_id, vehicle_type, pickup_location, drop_location, journey_date, purpose)
//       VALUES (@userId, @vehicle_type, @pickup, @drop, @date, @purpose)
//     `);

//     res.json({ message: "Transport booking submitted" });
// });

// //approve API
// app.put("/api/approve/:id", async (req, res) => {
//     const pool = await poolPromise;

//     await pool.request()
//         .input("id", req.params.id)
//         .query(`
//       UPDATE guesthouse_bookings SET status='Approved' WHERE id=@id
//     `);

//     res.json({ message: "Approved" });
// });

// function getApprover(dept, type) {
//     if (type === "personal") return "incharge@iit.edu";
//     if (type === "project") return "rnd@iit.edu";

//     const deptMap = {
//         CSE: "cse_dean@iit.edu",
//         ECE: "ece_dean@iit.edu"
//     };

//     return deptMap[dept];
// }

// app.get("/api/approvals/:email", async (req, res) => {
//     try {
//         const pool = await poolPromise;

//         const result = await pool.request()
//             .input("email", sql.VarChar, req.params.email)
//             .query(`
//                 SELECT * FROM bookings WHERE approver_email = @email
//             `);

//         res.json(result.recordset);

//     } catch (err) {
//         res.status(500).send(err);
//     }
// });

// app.patch("/api/bookings/:id", async (req, res) => {
//     const { status } = req.body;
//     const id = req.params.id;

//     try {
//         const pool = await poolPromise;

//         await pool.request()
//             .input("status", sql.VarChar, status)
//             .input("id", sql.Int, id)
//             .query(`
//                 UPDATE bookings SET status = @status WHERE id = @id
//             `);

//         res.json({ message: "Updated" });
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });

// app.get("/api/my-bookings/:userId", async (req, res) => {
//     try {
//         const pool = await poolPromise;

//         const result = await pool.request()
//             .input("userId", sql.Int, req.params.userId)
//             .query(`
//                 SELECT * FROM bookings WHERE user_id = @userId
//             `);

//         res.json(result.recordset);
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });

// app.get("/api/bookings", async (req, res) => {
//     try {

//         const pool = await poolPromise;

//         const result = await pool.request()
//             .query(`
//                 SELECT * FROM bookings
//             `);

//         res.json(result.recordset);
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });

// app.delete("/api/bookings/:id", async (req, res) => {
//     try {
//         const pool = await poolPromise;

//         await pool.request()
//             .input("id", sql.Int, req.params.id)
//             .query(`
//                 DELETE FROM bookings WHERE id = @id
//             `);

//         res.json({ message: "Deleted" });
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });

// app.get("/", async (req, res) => {
//     res.send("Hello World");
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
