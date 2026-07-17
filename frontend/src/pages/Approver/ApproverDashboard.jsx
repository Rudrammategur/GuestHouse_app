import { useEffect, useState } from "react";
import axios from "axios";
import DashboardPage from "../../components/Dashboard/DashboardPage";
import ApproverApplicationPage from "./ApproverApplicationPage.jsx";
import TakeAction from "../../components/Workflow/TakeAction.jsx";
import "../../styles/verifier.css";

function ApproverDashboard() {

  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");

  const [counts, setCounts] = useState({});

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const filteredApplications = applications.filter(app => {

    switch (activeFilter) {

      case "PendingApplications":

        return app.BookingStatus === "Verified";

      case "ApprovedApplications":

        return app.BookingStatus === "Approved";

      case "RejectedApplications":

        return app.BookingStatus === "Rejected";

      case "ProcessedApplications":

        return ["Approved", "Rejected"].includes(app.BookingStatus);

      case "All":

      default:

        return true;

    }

  });

  const cards = [

    {
      label: "All Applications",
      count: counts.TotalApplications ?? 0,
      className: "total-card",
      active: activeFilter === "All",
      onClick: () => setActiveFilter("All")
    },

    {
      label: "Pending Applications",
      count: counts.PendingApplications ?? 0,
      className: "pending-card",
      active: activeFilter === "PendingApplications",
      onClick: () => setActiveFilter("PendingApplications")
    },

    {
      label: "Approved Applications",
      count: counts.ApprovedApplications ?? 0,
      className: "verified-card",
      active: activeFilter === "ApprovedApplications",
      onClick: () => setActiveFilter("ApprovedApplications")
    },

    {
      label: "Rejected Applications",
      count: counts.RejectedApplications ?? 0,
      className: "rejected-card",
      active: activeFilter === "RejectedApplications",
      onClick: () => setActiveFilter("RejectedApplications")
    },

    {
      label: "All Processed Applications",
      count: counts.AllProcessedApplications ?? 0,
      className: "processed-card",
      active: activeFilter === "ProcessedApplications",
      onClick: () => setActiveFilter("ProcessedApplications")
    }

  ];

  useEffect(() => {

    fetchApplications();
    fetchCounts();

  }, []);

  const fetchApplications = async () => {

    const res = await axios.get(

      `${API_URL}/api/approver/applications`

    );

    setApplications(res.data);

  };

  const fetchCounts = async () => {

    const res = await axios.get(
      "http://localhost:5000/api/approver/dashboard-counts"
    );

    setCounts(res.data);

  };

  useEffect(() => {
    console.log("selectedApplication", selectedApplication);
  }, [selectedApplication]);

  return (


    <><DashboardPage
      title="Approver Dashboard"
      cards={cards}
      applications={filteredApplications}
      viewRoute="/approver/application"
    />
    </>
  );
}

export default ApproverDashboard;