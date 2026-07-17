# Guest House ERP Workflow

## Application Workflow

Applicant
↓
Verifier
↓
Approver
↓
Guest House Incharge
↓
Room Allocation
↓
Check In
↓
Check Out

---

## Applicant

Creates Guest House Application

Fields:

* Guest House Type
* Guest Type
* Room Type
* Occupancy
* Arrival Date
* Departure Date
* Purpose

Status:

Pending

---

## Verifier

Actions:

* Verify
* Reject

Status Changes:

Pending → Verified

Pending → Rejected

---

## Approver

Actions:

* Approve
* Reject

Status Changes:

Verified → Approved

Verified → Rejected

---

## Guest House Incharge

Actions:

* Allocate Room
* Check In
* Check Out

Status Changes:

Approved → Allocated

Allocated → Checked In

Checked In → Checked Out

---

## Future Integration

CIMS Authentication

User Login
↓
Employee Details Fetch
↓
Role Mapping
↓
ERP Access

No separate login required.

---

## Audit Trail

Every workflow action must be stored in:

GuestHouseWorkflowHistory

Information:

* Action
* User
* Date Time
* Remarks
* Forwarded To
