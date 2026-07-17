# Guest House ERP Database Design

## Master Tables

### GuestHouseTypeMaster

| Column             | Type    |
| ------------------ | ------- |
| GuestHouseTypeID   | VARCHAR |
| GuestHouseTypeName | VARCHAR |
| IsActive           | BIT     |

---

### RoomTypeMaster

| Column       | Type    |
| ------------ | ------- |
| RoomTypeID   | INT     |
| RoomTypeName | VARCHAR |
| IsActive     | BIT     |

---

### OccupancyTypeMaster

| Column            | Type    |
| ----------------- | ------- |
| OccupancyTypeID   | INT     |
| OccupancyTypeName | VARCHAR |

Values:

0 = NA

1 = Single Occupancy

2 = Double Occupancy

---

## Tariff Master

### GuestHouseTariffMaster

| Column           | Type    |
| ---------------- | ------- |
| TariffID         | INT     |
| GuestHouseTypeID | VARCHAR |
| RoomTypeID       | INT     |
| OccupancyTypeID  | INT     |
| MinDays          | INT     |
| MaxDays          | INT     |
| RatePerDay       | DECIMAL |
| EffectiveFrom    | DATE    |
| EffectiveTo      | DATE    |
| IsActive         | BIT     |

---

## Transaction Tables

### GuestHouseBookings

Stores application data.

### GuestHouseWorkflowHistory

Stores approval trail.

Columns:

* WorkflowID
* BookingID
* ActionTaken
* ActionBy
* ActionDate
* Remarks
* ForwardedTo

---

## Future Tables

### RoomAllocation

### CheckInCheckOut

### Notifications

### UserRoleMapping
