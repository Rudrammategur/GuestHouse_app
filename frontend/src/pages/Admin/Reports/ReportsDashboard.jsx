import { useNavigate } from "react-router-dom";
// import "../../styles/adminReports.css";

function ReportsDashboard() {

    const navigate = useNavigate();

    const reports = [

        {
            title: "Booking Report",
            description: "View all Guest House bookings.",
            reportType: "bookings"
        },

        {
            title: "Occupancy Report",
            description: "Current room occupancy.",
            reportType: "occupancy"
        },

        {
            title: "Revenue Report",
            description: "Revenue generated from Guest House.",
            reportType: "revenue"
        },

        {
            title: "Guest Statistics",
            description: "Guest category wise statistics.",
            reportType: "guestStatistics"
        },

        {
            title: "Room Utilization",
            description: "Room utilization report.",
            reportType: "roomUtilization"
        }

    ];

    return (

        <div className="admin-report-dashboard">

            <h2>Reports</h2>

            <div className="report-card-grid">

                {

                    reports.map(report => (

                        <div

                            key={report.reportType}

                            className="report-card"

                            onClick={() =>

                                navigate(

                                    `/admin/reports/${report.reportType}`

                                )

                            }

                        >

                            <h3>

                                {report.title}

                            </h3>

                            <p>

                                {report.description}

                            </p>

                        </div>

                    ))

                }

            </div>

        </div>

    );

}

export default ReportsDashboard;