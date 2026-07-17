import "../../styles/adminDashboard.css";

function ActivityTimeline({

    activities = []

}) {

    return (

        <div className="dashboard-card-container">

            <h3 className="section-title">

                Recent Activities

            </h3>

            {

                activities.length === 0

                    ?

                    <p>

                        No recent activity.

                    </p>

                    :

                    activities.map((activity, index) => (

                        <div

                            key={index}

                            className="timeline-row"

                        >

                            <div className="timeline-dot" />

                            <div>

                                <strong>

                                    {activity.title}

                                </strong>

                                <p>

                                    {activity.description}

                                </p>

                                <small>

                                    {activity.time}

                                </small>

                            </div>

                        </div>

                    ))

            }

        </div>

    );

}

export default ActivityTimeline;