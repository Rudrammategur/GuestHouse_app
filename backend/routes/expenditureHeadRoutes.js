const express = require("express");
const router = express.Router();

const {
  getExpenditureHeads
} = require("../controllers/expenditureHeadController");

router.get("/", getExpenditureHeads);

module.exports = router;