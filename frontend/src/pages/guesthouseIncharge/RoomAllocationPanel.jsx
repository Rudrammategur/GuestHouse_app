import { useMemo, useState } from "react";
import { useEffect } from "react";


function RoomAllocationPanel({

  application,

  rooms,

  selectedRooms,

  onSelectionChange,

  onAllocate,

  saving

}) {
  const isApproved = application.BookingStatus === "Approved";
  const requirements = application.RoomRequirements || [];
  const allocations = application.Allocations || [];


  const durationDays = useMemo(() => {

    if (
      !application.ArrivalDateTime ||
      !application.DepartureDateTime
    ) return 0;

    const arrival =
      new Date(application.ArrivalDateTime);

    const departure =
      new Date(application.DepartureDateTime);

    const diff =
      departure - arrival;

    return Math.ceil(
      diff / (1000 * 60 * 60 * 24)
    );

  }, [application]);

  const selectedRoomDetails = rooms.filter(room =>
    selectedRooms.some(
      selected =>
        selected.roomId === room.GuestHouseRoomID
    )
  );

  const changeOccupancy = (roomId, isSingle) => {

    onSelectionChange(

      selectedRooms.map(room =>

        room.roomId === roomId

          ? {

            ...room,

            isSingleOccupancy: isSingle,

            dayRate: isSingle
              ? room.singleRate
              : room.doubleRate

          }

          : room

      )

    );

  };


  const toggleRoom = (room, maxRooms) => {

    const exists = selectedRooms.find(
      r => r.roomId === room.GuestHouseRoomID
    );

    if (exists) {

      onSelectionChange(
        selectedRooms.filter(
          r => r.roomId !== room.GuestHouseRoomID
        )
      );

      return;
    }

    if (selectedCount(room.RoomTypeID) >= maxRooms)
      return;

    onSelectionChange([

      ...selectedRooms,

      {

        roomId: room.GuestHouseRoomID,

        roomNumber: room.RoomNumber,

        roomTypeId: room.RoomTypeID,

        roomTypeName: room.RoomTypeName,

        // ⭐ Store both rates
        singleRate: Number(room.SingleRate),

        doubleRate: Number(room.DoubleRate),

        // Default selection
        isSingleOccupancy: true,

        dayRate: Number(room.SingleRate)

      }

    ]);

  };

  const roomCharges = useMemo(() => {

    return selectedRooms.reduce(
      (sum, room) =>
        sum +
        (
          Number(room.dayRate || 0)
          *
          durationDays
        ),
      0
    );

  }, [selectedRooms,durationDays]);

  const selectedCount = (roomTypeId) => {

    return selectedRooms.filter(

      room => room.roomTypeId === roomTypeId

    ).length;

  };

  const selectionComplete = requirements.every(
    (requirement) => selectedCount(requirement.RoomTypeID) === Number(requirement.NoOfRooms)
  );



  return (
    <aside className="allocation-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Room assignment</span>
          <h2>{isApproved ? "Allocate Rooms" : "Allocation Details"}</h2>
        </div>
        <span className={`status-pill status-${application.BookingStatus?.toLowerCase()}`}>
          {application.BookingStatus}
        </span>
      </div>

      {allocations.length > 0 && (
        <section className="allocation-section">
          <h3>Allocated Rooms</h3>
          <div className="allocated-list">
            {allocations.map((allocation) => (
              <div className="allocated-room" key={allocation.GHRoomAllocationID}>
                <strong>Room {allocation.RoomNumber}</strong>
                <span>{allocation.RoomTypeName}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {isApproved && requirements.map((requirement) => {
        const matchingRooms = rooms.filter((room) => room.RoomTypeID === requirement.RoomTypeID);
        const chosen = selectedCount(requirement.RoomTypeID);
        return (
          <section className="allocation-section" key={requirement.RoomTypeID}>
            <div className="requirement-heading">
              <div>
                <h3>{requirement.RoomTypeName}</h3>
                <span>{matchingRooms.length} available</span>
              </div>
              <span className={chosen === Number(requirement.NoOfRooms) ? "quantity complete" : "quantity"}>
                {chosen} / {requirement.NoOfRooms} selected
              </span>
            </div>
            <div className="room-options">
              {matchingRooms.map((room) => {
                const checked = selectedRooms.some(
                  selected =>
                    selected.roomId === room.GuestHouseRoomID
                );

                const disabled =
                  !checked &&
                  chosen >= Number(requirement.NoOfRooms);


                return (
                  <label className={`room-option ${checked ? "selected" : ""} ${disabled ? "disabled" : ""}`} key={room.GuestHouseRoomID}>
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disabled}
                      onChange={() => toggleRoom(room, Number(requirement.NoOfRooms))}
                    />
                    <span>Room {room.RoomNumber}</span>

                    {
                      checked && room.RoomTypeName === "Double" && (

                        <div className="occupancy-panel">

                          <label>

                            <input
                              type="radio"
                              checked={
                                selectedRooms.find(
                                  r => r.roomId === room.GuestHouseRoomID
                                )?.isSingleOccupancy
                              }
                              onChange={() =>
                                changeOccupancy(
                                  room.GuestHouseRoomID,
                                  true
                                )
                              }
                            />

                            Single Occupancy

                          </label>

                          <label>

                            <input
                              type="radio"
                              checked={
                                !selectedRooms.find(
                                  r => r.roomId === room.GuestHouseRoomID
                                )?.isSingleOccupancy
                              }
                              onChange={() =>
                                changeOccupancy(
                                  room.GuestHouseRoomID,
                                  false
                                )
                              }
                            />

                            Double Occupancy

                          </label>

                          <p>

                            Rate : ₹{

                              selectedRooms.find(

                                r => r.roomId === room.GuestHouseRoomID

                              )?.dayRate

                            } / day

                          </p>

                        </div>

                      )
                    }
                  </label>
                );
              })}
              {matchingRooms.length === 0 && <p className="room-warning">No rooms are available for these dates.</p>}
            </div>
          </section>
        );
      })}

      <div className="charge-breakdown">

        <h3>Room Charge Breakdown</h3>

        <table className="charge-table">

          <thead>
            <tr>
              <th>Room No</th>
              <th>Room Type</th>
              <th>No. of occupants</th>
              <th>Rate/Day</th>
              <th>Duration</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>

            {selectedRooms.map(room => (

              <tr key={room.roomId}>

                <td>{room.roomNumber}</td>

                <td>{room.roomTypeName}</td>

                <td>
                  {room.roomTypeName === "Double"
                    ? (room.isSingleOccupancy
                      ? "Single"
                      : "Double")
                    : "-"}
                </td>

                <td>₹ {room.dayRate}</td>

                <td>{durationDays}</td>

                <td>₹ {room.dayRate * durationDays}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="amount-summary">

        <h3>Estimated Accommodation Charges</h3>

        <div className="summary-row">
          <span>Duration</span>
          <strong>{durationDays} Days</strong>
        </div>

        <div className="summary-row">
          <span>Selected Rooms</span>
          <strong>{selectedRooms.length}</strong>
        </div>

        <div className="summary-row">
          <span>Room Charges</span>
          <strong>₹ {roomCharges}</strong>
        </div>

        <div className="summary-total">
          Estimated Amount
          <strong>
            ₹ {roomCharges}
          </strong>
        </div>

      </div>

      {isApproved && (
        <button type="button" className="allocate-submit" disabled={!selectionComplete || saving} onClick={onAllocate}>
          {saving ? "Allocating…" : "Allocate Selected Rooms"}
        </button>
      )}
    </aside>
  );
}

export default RoomAllocationPanel;
