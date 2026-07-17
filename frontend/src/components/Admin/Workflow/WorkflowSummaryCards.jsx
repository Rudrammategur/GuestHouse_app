import "./workflow.css";

function WorkflowSummaryCards({ summary = {} }) {

    const cards = [

        {
            title: "Submitted",
            value: summary.Submitted || 0,
            className: "submitted"
        },

        {
            title: "Verified",
            value: summary.Verified || 0,
            className: "verified"
        },

        {
            title: "Approved",
            value: summary.Approved || 0,
            className: "approved"
        },

        {
            title: "Allocated",
            value: summary.Allocated || 0,
            className: "allocated"
        },

        {
            title: "Checked In",
            value: summary.CheckedIn || 0,
            className: "checkedin"
        },

        {
            title: "Checked Out",
            value: summary.CheckedOut || 0,
            className: "checkedout"
        },

        {
            title: "Rejected",
            value: summary.Rejected || 0,
            className: "rejected"
        },

        {
            title: "Cancelled",
            value: summary.Cancelled || 0,
            className: "cancelled"
        }

    ];

    return (

        <div className="workflow-summary">

            {

                cards.map(card => (

                    <div

                        key={card.title}

                        className={`workflow-card ${card.className}`}

                    >

                        <h3>

                            {card.value}

                        </h3>

                        <p>

                            {card.title}

                        </p>

                    </div>

                ))

            }

        </div>

    );

}

export default WorkflowSummaryCards;