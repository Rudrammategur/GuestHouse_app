import { useEffect, useState } from "react";
import axios from "axios";
import DashboardPage from "../../components/Dashboard/DashboardPage";
import VerifierApplicationPage from "./VerifierApplicationPage.jsx";
import TakeAction from "../../components/Workflow/TakeAction.jsx";
import "../../styles/verifier.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function VerifierDashboard() {

  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");

  const [counts, setCounts] = useState({});

  const filteredApplications = applications.filter(app => {

    switch (activeFilter) {

      case "PendingApplications":

        return app.BookingStatus === "Submitted";

      case "VerifiedApplications":

        return app.BookingStatus === "Verified";

      case "RejectedApplications":

        return app.BookingStatus === "Rejected";

      case "ProcessedApplications":

        return ["Verified", "Rejected"].includes(app.BookingStatus);

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
      label: "Verified Applications",
      count: counts.VerifiedApplications ?? 0,
      className: "verified-card",
      active: activeFilter === "VerifiedApplications",
      onClick: () => setActiveFilter("VerifiedApplications")
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

      `${API_URL}/api/verifier/applications`

    );

    setApplications(res.data);

  };

  const fetchCounts = async () => {

    const res = await axios.get(
      "http://localhost:5000/api/verifier/dashboard-counts"
    );

    setCounts(res.data);

  };

  useEffect(() => {
    console.log("selectedApplication", selectedApplication);
  }, [selectedApplication]);

  return (


    <><DashboardPage
      title="Verifier Dashboard"
      cards={cards}
      applications={filteredApplications}
      viewRoute="/verifier/application"
    />
    </>

  );

}

export default VerifierDashboard;
