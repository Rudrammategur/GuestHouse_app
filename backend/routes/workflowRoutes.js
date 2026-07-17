const express = require("express");

const router = express.Router();

const {
    getWorkflowLogs
} = require("../controllers/workflowController");

router.get(
    "/:moduleName/:referenceId",
    getWorkflowLogs
);

module.exports = router;