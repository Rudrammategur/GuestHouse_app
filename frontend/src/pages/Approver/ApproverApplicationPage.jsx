import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import ApplicationView from "../../components/Dashboard/ApplicationView/ApplicationView";
import TakeAction from "../../components/Workflow/TakeAction";
import "../../styles/workflowLayout.css";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

function ApproverApplicationPage() {

    const { bookingId } = useParams();

    const [application, setApplication] = useState(null);

    const fetchApplication = async () => {

        try {

            const res = await axios.get(
                `${API_URL}/api/approver/application/${bookingId}`
            );

            setApplication(res.data);

        }

        catch (err) {

            console.error(err);

        }

    };

    useEffect(() => {

        fetchApplication();

    }, [bookingId]);

    if (!application) {

        return <h2>Loading...</h2>;

    }

    return (

        <div className="workflow-layout">

            <div className="workflow-left">

                <ApplicationView
                    application={application}
                />

            </div>

            <div className="workflow-right">

                <TakeAction
                    application={application}
                    actionType="Approver"
                    onSuccess={fetchApplication}
                />

            </div>

        </div>

    );

}

export default ApproverApplicationPage;