const express = require("express");

const router = express.Router();

const adminController = require("../controllers/adminController");

router.get("/dashboard",adminController.getDashboard);

router.get("/guesthouses",adminController.getGuestHouses);

router.post("/guesthouses",adminController.createGuestHouse);

router.put("/guesthouses/:id",adminController.updateGuestHouse);

router.patch("/guesthouses/:id/status",adminController.toggleGuestHouseStatus);

router.get("/recent-applications",adminController.getRecentApplications);

router.get("/applications",adminController.getApplications);

router.get("/allocation/:bookingId",adminController.getAllocationDetails);

router.get("/rooms",adminController.getRooms);

router.post("/rooms",adminController.createRoom);

router.get("/guesthouses",adminController.getGuestHouses);

router.get("/room-types",adminController.getRoomTypes);

router.put("/rooms/:id",adminController.updateRoom);

router.patch("/rooms/:id/status",adminController.toggleRoomStatus);

router.get("/guest-types",adminController.getGuestTypes);

router.post("/guest-types",adminController.createGuestType);

router.put("/guest-types/:id",adminController.updateGuestType);

router.patch("/guest-types/:id/status",adminController.toggleGuestTypeStatus);

router.get("/room-charges",adminController.getRoomCharges);

router.post("/room-charges",adminController.createRoomCharge);

router.put("/room-charges/:id",adminController.updateRoomCharge);

router.patch("/room-charges/:id/status",adminController.toggleRoomChargeStatus);

router.get("/roles",adminController.getRoles);

router.post("/roles",adminController.createRole);

router.put("/roles/:id",adminController.updateRole);

router.patch("/roles/:id/status",adminController.toggleRoleStatus);

router.get("/user-access",adminController.getUserAccess);

router.post("/user-access",adminController.createUserAccess);

router.put("/user-access/:id",adminController.updateUserAccess);

router.patch("/user-access/:id/status",adminController.toggleUserAccessStatus);

router.get("/employees",adminController.getEmployees);

router.get("/reports/:reportType",adminController.getReport);

router.get("/room-availability",adminController.getRoomAvailability);

router.get("/room-details/:roomId",adminController.getRoomDetails);

router.get("/workflow",adminController.getWorkflowDashboard);

router.get("/workflow/:bookingId",adminController.getWorkflowTimeline);

router.get("/settings/:module",adminController.getSystemSettings);

router.put("/settings/:module",adminController.saveSystemSettings);

// router.put("/rooms/:id",adminController.updateRoom);

// router.delete("/rooms/:id",adminController.deleteRoom);

module.exports = router;