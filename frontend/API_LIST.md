# Guest House ERP API List

Base URL

/api

---

## Master APIs

### Guest House Types

GET

/api/master/guesthouse-types

---

### Room Types

GET

/api/master/room-types/:guestHouseTypeId

---

### Occupancy Types

GET

/api/master/occupancy-types

---

### Tariff

GET

/api/master/tariff

Parameters:

guestHouseTypeId

roomTypeId

occupancyTypeId

days

---

## Booking APIs

### Create Booking

POST

/api/guesthouse/create

---

### Get Booking By ID

GET

/api/guesthouse/:bookingId

---

### Get All Bookings

GET

/api/guesthouse

---

## Verifier APIs

### Pending Applications

GET

/api/verifier/pending-applications

---

### Dashboard Counts

GET

/api/verifier/dashboard-counts

---

### Verify / Reject

PUT

/api/verifier/:bookingId

Request Body

{
status,
remarks
}

---

## Approver APIs

GET

/api/approver/pending-applications

PUT

/api/approver/:bookingId

---

## Guest House Incharge APIs

GET

/api/incharge/approved-applications

PUT

/api/incharge/allocate-room

PUT

/api/incharge/check-in

PUT

/api/incharge/check-out
