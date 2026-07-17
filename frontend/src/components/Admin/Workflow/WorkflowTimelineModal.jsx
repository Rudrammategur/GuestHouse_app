import { useEffect, useState } from "react";
import axios from "axios";
import "./workflow.css";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

function WorkflowTimelineModal({

    bookingId,

    onClose

}) {

    const [timeline, setTimeline] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadTimeline();

    }, [bookingId]);

    const loadTimeline = async () => {

        try {

            setLoading(true);

            const response = await axios.get(

                `${API_URL}/api/admin/workflow/${bookingId}`

            );

            setTimeline(

                response.data.data

            );

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="workflow-modal-overlay">

            <div className="workflow-modal">

                <div className="workflow-modal-header">

                    <h2>

                        Workflow Timeline

                    </h2>

                    <button

                        className="close-btn"

                        onClick={onClose}

                    >

                        ✕

                    </button>

                </div>

                {

                    loading

                    ?

                    (

                        <div className="timeline-loading">

                            Loading...

                        </div>

                    )

                    :

                    (

                        <div className="timeline-container">

                            {

                                timeline.length === 0

                                ?

                                (

                                    <div className="timeline-empty">

                                        No Workflow History Found

                                    </div>

                                )

                                :

                                (

                                    timeline.map(item => (

                                        <div

                                            className="timeline-item"

                                            key={item.WorkflowHistoryID}

                                        >

                                            <div

                                                className="timeline-dot"

                                            />

                                            <div

                                                className="timeline-content"

                                            >

                                                <h4>

                                                    {item.ActionName}

                                                </h4>

                                                <p>

                                                    <strong>

                                                        Status :

                                                    </strong>

                                                    {" "}

                                                    {

                                                        item.CurrentStatus

                                                    }

                                                </p>

                                                <p>

                                                    <strong>

                                                        Authority :

                                                    </strong>

                                                    {" "}

                                                    {

                                                        item.AuthorityName

                                                    }

                                                    {" ("}

                                                    {

                                                        item.AuthorityRole

                                                    }

                                                    {")"}

                                                </p>

                                                <p>

                                                    <strong>

                                                        Action By :

                                                    </strong>

                                                    {" "}

                                                    {

                                                        item.ActionBy

                                                    }

                                                </p>

                                                <p>

                                                    <strong>

                                                        Remarks :

                                                    </strong>

                                                    {" "}

                                                    {

                                                        item.Remarks || "-"

                                                    }

                                                </p>

                                                <small>

                                                    {

                                                        new Date(

                                                            item.ActionDateTime

                                                        )

                                                        .toLocaleString()

                                                    }

                                                </small>

                                            </div>

                                        </div>

                                    ))

                                )

                            }

                        </div>

                    )

                }

            </div>

        </div>

    );

}

export default WorkflowTimelineModal;