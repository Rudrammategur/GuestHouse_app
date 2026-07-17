import "./workflowTimeline.css";

function WorkflowTimeline({

    logs = []

}) {

    if (logs.length === 0) {

        return (

            <div className="workflow-empty">

                No workflow history available.

            </div>

        );

    }

    return (

        <div className="workflow-timeline">

            {

                logs.map((log, index) => (

                    <div

                        key={log.WorkflowHistoryID}

                        className="timeline-item"

                    >

                        {

                            index !== logs.length - 1 &&

                            <div className="timeline-line" />

                        }

                        <div className="timeline-dot" />

                        <div className="timeline-content">

                            <div className="timeline-header">

                                <h4>

                                    {log.CurrentStatus}

                                </h4>

                                <span>

                                    {new Date(

                                        log.ActionDateTime

                                    ).toLocaleString("en-IN")}

                                </span>

                            </div>

                            <p>

                                <strong>

                                    Action

                                </strong>

                                {" : "}

                                {log.ActionName}

                            </p>

                            <p>

                                <strong>

                                    Authority

                                </strong>

                                {" : "}

                                {log.AuthorityRole}

                            </p>

                            <p>

                                <strong>

                                    Performed By

                                </strong>

                                {" : "}

                                {log.AuthorityName}

                            </p>

                            {

                                log.Remarks &&

                                <p>

                                    <strong>

                                        Remarks

                                    </strong>

                                    {" : "}

                                    {log.Remarks}

                                </p>

                            }

                        </div>

                    </div>

                ))

            }

        </div>

    );

}

export default WorkflowTimeline;