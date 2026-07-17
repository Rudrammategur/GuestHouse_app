import StatCard from "../../Common/StatCard/StatCard";

import "./ApplicationView.css";

function ApplicationSummary({ application }) {

    const arrival = new Date(application.ArrivalDateTime);

    const departure = new Date(application.DepartureDateTime);

    const stayDays = Math.max(
        1,
        Math.ceil(
            (departure - arrival) /
            (1000 * 60 * 60 * 24)
        )
    );

    return (

        <div className="application-summary">

            <StatCard
                title="Status"
                value={application.BookingStatus}
                color="primary"
            />

            <StatCard
                title="Guest"
                value={application.GuestName}
                subtitle={application.GuestTypeName}
                color="info"
            />

            <StatCard
                title="Stay"
                value={`${stayDays} Day${stayDays > 1 ? "s" : ""}`}
                subtitle={`${arrival.toLocaleDateString()} - ${departure.toLocaleDateString()}`}
                color="warning"
            />

            <StatCard
                title="Rooms"
                value={application.TotalRoomsReq}
                subtitle={`${application.OccupantsNo} Guest(s)`}
                color="success"
            />

        </div>

    );

}

export default ApplicationSummary;