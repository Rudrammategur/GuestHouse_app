import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GenericDashboardPage from "../../components/Common/GenericDashboardPage";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

function AdminApplications() {

    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);

    const [loading, setLoading] = useState(true);

    const [selectedApplication, setSelectedApplication] = useState(null);

    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {

        loadApplications();

    }, []);

    const loadApplications = async () => {

        try {

            const response = await axios.get(

                `${API_URL}/api/admin/applications`

            );

            setApplications(

                response.data

            );

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setLoading(false);

        }

    };

    const cards = [

        {
            label: "Total",
            count: applications.length,
            className: "total-card"
        },

        {
            label: "Submitted",
            count: applications.filter(
                a => a.BookingStatus === "Submitted"
            ).length,
            className: "submitted-card"
        },

        {
            label: "Approved",
            count: applications.filter(
                a => a.BookingStatus === "Approved"
            ).length,
            className: "approved-card"
        },

        {
            label: "Checked In",
            count: applications.filter(
                a => a.BookingStatus === "Checked In"
            ).length,
            className: "verified-card"
        }

    ];

    const columns = [

        {
            header: "Booking No",
            accessor: "GHRBookingNo"
        },

        {
            header: "Guest",
            accessor: "GuestName"
        },

        {
            header: "Booked By",
            accessor: "BookedBy"
        },

        {
            header: "Guest House",
            accessor: "GuestHouseName"
        },

        {
            header: "Arrival",
            accessor: "ArrivalDateTime"
        },

        {
            header: "Departure",
            accessor: "DepartureDateTime"
        },

        {
            header: "Status",
            accessor: "BookingStatus"
        },

        {

            header: "Action",

            render: (row) => (

                <button

                    className="view-btn"

                    onClick={() =>
                        navigate(`/admin/application/${row.GHBookingID}`)
                    }

                >

                    View

                </button>

            )

        }

    ];

    return (

        <GenericDashboardPage

            title="Guest House Applications"

            cards={cards}

            columns={columns}

            tableData={applications}

            loading={loading}

            emptyMessage="No Applications Found"

        />

    );

}

export default AdminApplications;