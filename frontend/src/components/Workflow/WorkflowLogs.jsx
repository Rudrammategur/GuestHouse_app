import { useEffect, useState } from "react";
import axios from "axios";
import "./workflowLogs.css";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

function WorkflowLogs({ moduleName, referenceId }) {

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadLogs();

    }, [moduleName, referenceId]);

    const loadLogs = async () => {

        try {

            const response = await axios.get(

                `${API_URL}/api/workflow/${moduleName}/${referenceId}`

            );

            setLogs(response.data);

        }

        catch (err) { console.log(err);}

        finally { setLoading(false); }

    };

    if (loading) {

        return <p>Loading workflow history...</p>;

    }

    if (logs.length === 0) {

        return (

            <div className="no-logs">

                No workflow history available.

            </div>

        );

    }

    return (

        <div className="workflow-container">

            {
                logs.map(log => (

                    <div
                        className="workflow-item"
                        key={log.WorkflowHistoryID}
                    >

                        <div className="workflow-dot" />

                        <div className="workflow-content">

                            <h4>

                                {log.ActionName}

                            </h4>

                            <p>

                                <strong>Authority :</strong>

                                {" "}

                                {log.AuthorityName}

                                {" "}

                                ({log.AuthorityRole})

                            </p>

                            <p>

                                <strong>Status :</strong>

                                {" "}

                                {log.CurrentStatus}

                            </p>

                            <p>

                                <strong>Remarks :</strong>

                                {" "}

                                {log.Remarks || "-"}

                            </p>

                            <p>

                                <strong>Date :</strong>

                                {" "}

                                {

                                    new Date(

                                        log.ActionDateTime

                                    ).toLocaleString()

                                }

                            </p>

                        </div>

                    </div>

                ))
            }

        </div>

    );

}

export default WorkflowLogs;