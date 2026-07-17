import InfoCard from "../../Common/InfoCard/InfoCard";
import InfoRow from "../../Common/InfoRow/infoRow";
import StatusBadge from "../../Common/StatusBadge";
import ERPTable from "../../Common/ERPTable";
import Button from "../../Common/Button/Button";

function ApplicationDetails({ application }) {

    return (

        <>
            <div className="application-details">

                {/* Booking Summary */}

                <InfoCard
                    className="full-width"
                    title={`Booking #${application.GHRBookingNo}`}
                    subtitle={`Submitted by ${application.BookedBy}`}
                    actions={
                        <StatusBadge
                            status={application.BookingStatus}
                        />
                    }
                >

                    <InfoRow
                        label="Booking Date"
                        value={new Date(application.BookingDateTime).toLocaleString()}
                    />

                    <InfoRow
                        label="Booking Status"
                        value={application.BookingStatus}
                    />

                </InfoCard>


                {/* Guest Information */}

                <InfoCard
                    title="Guest Information"
                >

                    <InfoRow label="Guest Type" value={application.GuestTypeName} />

                    <InfoRow label="Guest Name" value={application.GuestName} />

                    <InfoRow label="Designation" value={application.GuestDesignation} />

                    <InfoRow label="Relationship" value={application.GuestRelationship} />

                    <InfoRow label="Nationality" value={application.GuestNationality} />

                    <InfoRow label="Contact Number" value={application.GuestContactNo} />

                    <InfoRow label="Email" value={application.GuestEmailID} />

                    <InfoRow label="Address" value={application.GuestAddress} />

                </InfoCard>


                {/* Visit */}

                <InfoCard
                    title="Visit Information"
                >

                    <InfoRow label="Purpose" value={application.PurposeOfVisit} />

                    <InfoRow label="Arrival" value={new Date(application.ArrivalDateTime).toLocaleString()} />

                    <InfoRow label="Departure" value={new Date(application.DepartureDateTime).toLocaleString()} />

                    <InfoRow label="Occupants" value={application.OccupantsNo} />

                    <InfoRow label="Special Request" value={application.SplRequests} />

                </InfoCard>


                {/* Accommodation */}

                <InfoCard
                    title="Accommodation"
                >

                    <InfoRow
                        label="Guest House"
                        value={application.GuestHouseName}
                    />

                    <InfoRow
                        label="Rooms Requested"
                        value={application.TotalRoomsReq}
                    />

                </InfoCard>


                {/* Financial */}

                <InfoCard
                    title="Financial Information"
                >

                    <InfoRow
                        label="Expenditure Head"
                        value={application.ExpenditureHead}
                    />

                    <InfoRow
                        label="Project Number"
                        value={application.ProjectNo}
                    />

                </InfoCard>


                {/* Workflow */}

                <InfoCard
                    className="full-width"
                    title="Workflow Assignment"
                >

                    <InfoRow
                        label="Verifier"
                        value={`${application.AssignedVerifier?.EmployeeName || "-"} (${application.AssignedVerifier?.EmployeeId || "-"})`}
                    />

                    <InfoRow
                        label="Approver"
                        value={`${application.AssignedApprover?.EmployeeName || "-"} (${application.AssignedApprover?.EmployeeId || "-"})`}
                    />

                    <InfoRow
                        label="GH Incharge"
                        value={`${application.AssignedAllocator?.EmployeeName || "-"} (${application.AssignedAllocator?.EmployeeId || "-"})`}
                    />

                </InfoCard>


                {/* Requested Rooms */}

                <InfoCard
                    className="full-width"
                    title="Requested Room Types"
                >

                    <ERPTable
                        rowNumber={false}
                        searchable={false}
                        columns={[
                            {
                                key: "RoomTypeName",
                                label: "Room Type"
                            },
                            {
                                key: "NoOfRooms",
                                label: "Rooms"
                            }
                        ]}
                        data={application.RoomRequirements || []}
                    />

                </InfoCard>


                {/* Documents */}

                <InfoCard
                    className="full-width"
                    title="Supporting Documents"
                >

                    {

                        application.SupportingDoc ?

                            <Button
                                onClick={() =>
                                    window.open(
                                        `http://localhost:5000/api/verifier/document/${application.GHBookingID}`,
                                        "_blank"
                                    )
                                }
                            >

                                View Document

                            </Button>

                            :

                            <p>

                                No supporting document uploaded.

                            </p>

                    }

                </InfoCard>

            </div>
        </>

    );

}

export default ApplicationDetails;