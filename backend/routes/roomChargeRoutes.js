const express = require("express");
const router = express.Router();

const {
    getRoomCharge
} = require("../controllers/roomChargeController");


router.get("/", getRoomCharge);

module.exports = router;