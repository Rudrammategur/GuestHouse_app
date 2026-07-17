import { useNavigate } from "react-router-dom";
import "../../styles/adminDashboard.css";

function QuickActions() {

    const navigate = useNavigate();

    const actions = [

        {
            title: "Applications",
            icon: "📄",
            route: "/admin/applications"
        },

        {
            title: "Guest Houses",
            icon: "🏨",
            route: "/admin/guesthouses"
        },

        {
            title: "Room Master",
            icon: "🛏️",
            route: "/admin/rooms"
        },

        {
            title: "Guest Types",
            icon: "👤",
            route: "/admin/guest-types"
        },

        {
            title: "Room Charges",
            icon: "💰",
            route: "/admin/room-charges"
        },

        {
            title: "Workflow",
            icon: "⚙️",
            route: "/admin/workflow"
        },

        {
            title: "Users",
            icon: "👥",
            route: "/admin/users"
        },

        {
            title: "Reports",
            icon: "📊",
            route: "/admin/reports"
        }

    ];

    return (

        <div className="dashboard-card-container">

            <h3 className="section-title">

                Quick Actions

            </h3>

            <div className="quick-actions-grid">

                {

                    actions.map(action => (

                        <div

                            key={action.title}

                            className="quick-action-card"

                            onClick={() =>

                                navigate(action.route)

                            }

                        >

                            <div className="action-icon">

                                {action.icon}

                            </div>

                            <div className="action-title">

                                {action.title}

                            </div>

                        </div>

                    ))

                }

            </div>

        </div>

    );

}

export default QuickActions;