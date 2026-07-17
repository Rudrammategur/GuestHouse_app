import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import ERPPage from "../../components/Common/ERPPage";
import ERPTable from "../../components/Common/ERPTable";
import PageHeader from "../../components/Common/PageHeader";
import Button from "../../components/Common/Button/Button.jsx";
import ERPSection from "../../components/Common/ERPSection";
import DashboardCards from "../../components/Dashboard/DashboardCards";
import StatusBadge from "../../components/Common/StatusBadge";
import BookingActions from "../../components/Guesthouse/BookingActions.jsx";
import ERPConfirmDialog from "../../components/Common/ERPConfirmDialog";




const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

const formatDate = value =>
    value
        ? new Date(value).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short"
        })
        : "-";

function EmployeeDashboard() {

    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);

    const [counts, setCounts] = useState({});

    const [loading, setLoading] = useState(true);

    const [showCancelDialog, setShowCancelDialog] = useState(false);

    const [selectedBooking, setSelectedBooking] = useState(null);

    const [cancelLoading, setCancelLoading] = useState(false);

    const [activeTab, setActiveTab] = useState("all");

    const loadDashboard = useCallback(async () => {

        setLoading(true);

        try {

            const [

                applicationResponse,

                countResponse

            ] = await Promise.all([

                axios.get(
                    `${API_URL}/api/guesthouse/my-applications`
                ),

                axios.get(
                    `${API_URL}/api/guesthouse/dashboard-counts`
                )

            ]);

            setApplications(
                applicationResponse.data
            );

            setCounts(
                countResponse.data
            );

        }

        catch (err) {

            toast.error(

                err.response?.data?.message ||

                "Unable to load dashboard"

            );

        }

        finally { setLoading(false); }

    }, []);

    useEffect(() => {

        loadDashboard();

    }, [loadDashboard]);

    const cancelBooking = async () => {

        try {

            setCancelLoading(true);

            await axios.put(

                `${API_URL}/api/guesthouse/${selectedBooking}/cancel`

            );

            toast.success("Application cancelled successfully.");

            setShowCancelDialog(false);

            setSelectedBooking(null);

            loadDashboard();

        }

        catch (err) {

            toast.error(

                err.response?.data?.message ||

                "Unable to cancel application."

            );

        }

        finally {

            setCancelLoading(false);

        }

    };

    const cards = [

        {
            label: "Total",
            count: counts.TotalApplications ?? 0,
            color: "primary"
        },

        {
            label: "Submitted",
            count: counts.Submitted ?? 0,
            color: "warning"
        },

        {
            label: "Approved",
            count: counts.Approved ?? 0,
            color: "success"
        },

        {
            label: "Rejected",
            count: counts.Rejected ?? 0,
            color: "danger"
        },

        {
            label: "Completed",
            count: counts.Completed ?? 0,
            color: "info"
        },

        {
            label: "Cancelled",
            count: counts.Cancelled ?? 0,
            color: "secondary"
        }

    ];

    const columns = [

        {

            key: "BookingNo",

            label: "Booking No",

            render: (row) => (

                row.GHRBookingNo ||

                `GH${String(row.GHBookingID).padStart(5, "0")}`

            )
        },

        {

            key: "GuestName",

            label: "Guest Name"

        },

        {

            key: "GuestHouseName",

            label: "Guest House"

        },

        {

            key: "ArrivalDateTime",

            label: "Arrival",

            render: (row) => formatDate(row.ArrivalDateTime)

        },

        {

            key: "DepartureDateTime",

            label: "Departure",

            render: (row) => formatDate(row.DepartureDateTime)

        },

        {

            key: "BookingStatus",

            label: "Status",

            render: (row) =>

                <StatusBadge

                    status={row.BookingStatus}

                />

        }

    ];


    const filteredApplications =
        applications.filter(app => {

            if (activeTab === "pending") {

                return [

                    "Submitted",

                    "Verified",

                    "Approved",

                    "Allocated",

                    "Checked In"

                ].includes(app.BookingStatus);

            }

            if (activeTab === "approved") {

                return app.BookingStatus === "Approved";

            }

            if (activeTab === "rejected") {

                return app.BookingStatus === "Rejected";

            }

            if (activeTab === "completed") {

                return [

                    "Checked Out",

                    "Cancelled"

                ].includes(app.BookingStatus);

            }

            return true;

        });


    return (

        <ERPPage>

            <PageHeader
                title="Guest House Dashboard"
                subtitle="Manage your guest house bookings"
                actions={
                    <Button
                        onClick={() => navigate("/guesthouse/apply")}
                    >
                        + Apply New Request
                    </Button>
                }
            />

            <DashboardCards cards={cards} />

            <ERPSection title="My Applications">

                <div
                    className="dashboard-tabs"
                    role="tablist"
                >

                    <button

                        className={

                            activeTab === "all"

                                ? "active"

                                : ""

                        }

                        onClick={() =>
                            setActiveTab("all")
                        }

                    >

                        All

                    </button>

                    <button

                        className={

                            activeTab === "pending"

                                ? "active"

                                : ""

                        }

                        onClick={() =>
                            setActiveTab("pending")
                        }

                    >

                        Pending

                    </button>

                    <button

                        className={

                            activeTab === "approved"

                                ? "active"

                                : ""

                        }

                        onClick={() =>
                            setActiveTab("approved")
                        }

                    >

                        Approved

                    </button>

                    <button

                        className={

                            activeTab === "rejected"

                                ? "active"

                                : ""

                        }

                        onClick={() =>
                            setActiveTab("rejected")
                        }

                    >

                        Rejected

                    </button>

                    <button

                        className={

                            activeTab === "completed"

                                ? "active"

                                : ""

                        }

                        onClick={() =>
                            setActiveTab("completed")
                        }

                    >

                        Completed

                    </button>

                </div>


                <ERPTable
                    columns={columns}
                    data={filteredApplications}
                    loading={loading}
                    actions={(row) => (

                        <BookingActions

                            booking={row}

                            onView={() =>
                                navigate(`/guesthouse/application/${row.GHBookingID}`)
                            }

                            onEdit={() =>
                                navigate(`/guesthouse/application/${row.GHBookingID}/edit`)
                            }

                            onPrint={() => {
                                // TODO
                            }}

                            onCancel={() => {

                                setSelectedBooking(row.GHBookingID);

                                setShowCancelDialog(true);

                            }}

                        />

                    )}
                />

            </ERPSection>

            <ERPConfirmDialog

                open={showCancelDialog}

                title="Cancel Application"

                message="Are you sure you want to cancel this guest house application? This action cannot be undone."

                confirmText="Yes, Cancel"

                cancelText="No"

                confirmButtonClass="danger-btn"

                loading={cancelLoading}

                onConfirm={cancelBooking}

                onCancel={() => {

                    setShowCancelDialog(false);

                    setSelectedBooking(null);

                }}

            />

        </ERPPage>

    );

}

export default EmployeeDashboard;


