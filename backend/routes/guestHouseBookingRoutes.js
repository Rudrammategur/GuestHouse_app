const express = require("express");

const router = express.Router();

const guestHouseBookingController = require("../controllers/guestHouseBookingController");

const upload = require("../middleware/uploadMiddleware");

router.post("/", upload.single("SupportingDoc"), guestHouseBookingController.createBooking);

router.get("/dashboard-counts", guestHouseBookingController.getDashboardCounts);

router.get("/my-applications", guestHouseBookingController.getMyApplications);

router.get("/application/:bookingId", guestHouseBookingController.getApplicationDetails);

router.post("/verifier/verify/:bookingId", guestHouseBookingController.verifyApplication);

router.put("/:bookingId/cancel", guestHouseBookingController.cancelBooking);

module.exports = router;