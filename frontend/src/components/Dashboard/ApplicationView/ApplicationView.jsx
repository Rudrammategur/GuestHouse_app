import { useState } from "react";

import WorkflowLogs from "../../Workflow/WorkflowLogs";

import ApplicationHeader from "./ApplicationHeader";
import ApplicationSummary from "./ApplicationSummary";
import ApplicationDetails from "./ApplicationDetails";

import "./ApplicationView.css";

function ApplicationView({ application }) {

    const [activeTab, setActiveTab] = useState("application");

    if (!application) {

        return <h3>No Application Found</h3>;

    }

    return (

        <div className="application-view">

            <ApplicationHeader
                application={application}
            />

            <ApplicationSummary
                application={application}
            />

            <div className="application-tabs-card">

                <div className="application-tabs">

                    <button
                        className={activeTab === "application" ? "active" : ""}
                        onClick={() => setActiveTab("application")}
                    >
                        Application Details
                    </button>

                    <button
                        className={activeTab === "logs" ? "active" : ""}
                        onClick={() => setActiveTab("logs")}
                    >
                        Workflow Logs
                    </button>

                </div>

            </div>

            <div className="application-content-card">

                {
                    activeTab === "application"

                        ?

                        <ApplicationDetails
                            application={application}
                        />

                        :

                        <WorkflowLogs
                            moduleName="GuestHouse"
                            referenceId={application.GHBookingID}
                        />
                }

            </div>

        </div>

    );

}

export default ApplicationView;