const express = require("express");
const router = express.Router();
const upload = require ("../middleware/uploadMiddleware");
const {
    getApplications,
    getDashboardCounts,
    getApplication,
    getAvailableRooms,
    allocateRooms,
    getReceiptDetails,
    getCheckoutDetails,
    getCheckoutApplications,
    checkInGuest,
    getCheckInApplication,
    checkoutGuest,
    getOccupancySummary,
    getRoomAvailability
} = require("../controllers/guestHouseInchargeController");

router.get("/applications", getApplications);

router.get("/dashboard-counts", getDashboardCounts);

router.get("/applications/:bookingId", getApplication);

router.get("/applications/:bookingId/available-rooms",getAvailableRooms);

router.post("/applications/:bookingId/allocations",allocateRooms);

router.get("/receipt/:bookingId", getReceiptDetails);

router.get("/checkout/:bookingId", getCheckoutDetails);

router.post("/checkout/:bookingId", checkoutGuest);

// router.post(
//     "/checkout/:bookingId/generate-receipt",
//     generateReceipt
// );

router.put("/allocate/:bookingId", allocateRooms);

router.get("/checkin/:bookingId",getCheckInApplication);

router.post("/checkin/:bookingId", upload.single("document"),checkInGuest);

router.get("/checkout-applications",getCheckoutApplications);

router.get("/occupancy-summary", getOccupancySummary);

router.get("/room-availability", getRoomAvailability);

  
module.exports = router;