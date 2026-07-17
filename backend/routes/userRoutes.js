const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController");

const { mockLogin } = require("../middleware/authMiddleware");

router.get(

    "/current-user",

    mockLogin,

    userController.getCurrentUser

);

module.exports = router;