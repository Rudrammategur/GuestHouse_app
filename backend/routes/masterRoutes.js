const express = require("express");

const router = express.Router();

const {
    getGuestHouseTypes,
    getRoomTypesByGuestHouse,
    getGuestTypes,
    getTariffDetails,
    getApplicationById,
    getProjects
} = require("../controllers/masterController");


router.get(
    "/guesthouse-types",
    getGuestHouseTypes
);

router.get(
    "/room-types/:guestHouseId",
    getRoomTypesByGuestHouse
);

router.get("/guest-types", getGuestTypes);

router.get(
    "/tariff-details",
    getTariffDetails
);

router.get(
    "/application/:bookingId",
    getApplicationById
);

router.get(
    "/projects",
    getProjects
);


module.exports = router;