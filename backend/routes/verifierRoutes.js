const express = require("express");

const router = express.Router();

const verifierController = require("../controllers/verifierController");

router.get(
    "/pending-applications",
    verifierController.getPendingApplications
);

router.get(
    "/dashboard-counts",
    verifierController.getDashboardCounts
);

router.get(
    "/applications",
    verifierController.getApplications
);

router.get(
    "/application/:bookingId",
    verifierController.getApplication
);

router.put(
    "/verify/:bookingId",
    verifierController.verifyApplication
);

router.put(
    "/reject/:bookingId",
    verifierController.rejectApplication
);

router.get(

    "/document/:bookingId",

    verifierController.viewDocument

);

module.exports = router;