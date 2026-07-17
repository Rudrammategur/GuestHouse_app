const express = require("express");

const router = express.Router();

const approverController = require("../controllers/approverController");

router.get(
    "/pending-applications",
    approverController.getPendingApplications
);

router.get(
    "/dashboard-counts",
    approverController.getDashboardCounts
);

router.get(
    "/applications",
    approverController.getApplications
);

router.get(
    "/application/:bookingId",
    approverController.getApplication
);

router.put(
    "/approve/:bookingId",
    approverController.approveApplication
);

router.put(
    "/reject/:bookingId",
    approverController.rejectApplication
);

router.get(
    "/document/:bookingId",
    approverController.viewDocument
);

module.exports = router;