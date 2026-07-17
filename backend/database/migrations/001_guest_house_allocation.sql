/* Run once against the database containing GuestHouseBookings. Safe to re-run. */

IF COL_LENGTH('GuestHouseBookings', 'GuestHouseID') IS NULL
  ALTER TABLE GuestHouseBookings ADD GuestHouseID INT NULL;

IF COL_LENGTH('GuestHouseBookings', 'MealsRequired') IS NULL
  ALTER TABLE GuestHouseBookings ADD MealsRequired BIT NULL;

IF COL_LENGTH('GuestHouseBookings', 'SpecialRequirements') IS NULL
  ALTER TABLE GuestHouseBookings ADD SpecialRequirements NVARCHAR(1000) NULL;

IF COL_LENGTH('GuestHouseBookings', 'TotalRoomsReq') IS NULL
  ALTER TABLE GuestHouseBookings ADD TotalRoomsReq INT NULL;

IF COL_LENGTH('GuestHouseBookings', 'ExpenditureHead') IS NULL
  ALTER TABLE GuestHouseBookings ADD ExpenditureHead NVARCHAR(100) NULL;

IF COL_LENGTH('GuestHouseBookings', 'ProjectNumber') IS NULL
  ALTER TABLE GuestHouseBookings ADD ProjectNumber NVARCHAR(100) NULL;

IF OBJECT_ID('GuestHouseBookingRoomDetails', 'U') IS NULL
BEGIN
  CREATE TABLE GuestHouseBookingRoomDetails (
    GHBookingRoomID INT IDENTITY(1,1) PRIMARY KEY,
    GHBookingID INT NOT NULL,
    RoomTypeID INT NOT NULL,
    NoOfRooms INT NOT NULL,
    CONSTRAINT CK_GHBookingRoomDetails_NoOfRooms CHECK (NoOfRooms > 0),
    CONSTRAINT UQ_GHBookingRoomDetails UNIQUE (GHBookingID, RoomTypeID),
    CONSTRAINT FK_GHBookingRoomDetails_Booking FOREIGN KEY (GHBookingID)
      REFERENCES GuestHouseBookings(BookingID),
    CONSTRAINT FK_GHBookingRoomDetails_RoomType FOREIGN KEY (RoomTypeID)
      REFERENCES RoomTypeMaster(RoomTypeID)
  );
END;

IF OBJECT_ID('GuestHouseRoomAllocation', 'U') IS NULL
BEGIN
  CREATE TABLE GuestHouseRoomAllocation (
    GHRoomAllocationID INT IDENTITY(1,1) PRIMARY KEY,
    GHBookingID INT NOT NULL,
    GuestHouseRoomID INT NOT NULL,
    AllocatedBy NVARCHAR(100) NOT NULL,
    AllocatedDate DATETIME2 NOT NULL CONSTRAINT DF_GHRoomAllocation_Date DEFAULT SYSDATETIME(),
    CONSTRAINT UQ_GHRoomAllocation_BookingRoom UNIQUE (GHBookingID, GuestHouseRoomID),
    CONSTRAINT FK_GHRoomAllocation_Booking FOREIGN KEY (GHBookingID)
      REFERENCES GuestHouseBookings(BookingID),
    CONSTRAINT FK_GHRoomAllocation_Room FOREIGN KEY (GuestHouseRoomID)
      REFERENCES GuestHouseRoomMaster(GuestHouseRoomID)
  );
END;

IF NOT EXISTS (
  SELECT 1 FROM sys.indexes
  WHERE name = 'IX_GHRoomAllocation_Room' AND object_id = OBJECT_ID('GuestHouseRoomAllocation')
)
  CREATE INDEX IX_GHRoomAllocation_Room ON GuestHouseRoomAllocation(GuestHouseRoomID, GHBookingID);
