import DashboardCards from "./DashboardCards";
import DashboardTable from "./DashboardTable";
import "../Dashboard/dashboard.css";
function DashboardPage({
    title,
    cards,
    applications,
    viewRoute
}) {

    return (

        <div className="dashboard-container">

            <h2 className="dashboard-title">
                {title}
            </h2>

            <DashboardCards
                cards={cards}
            />

            <div className="table-section">

                <DashboardTable
                    applications={applications}
                    viewRoute={viewRoute}
                />

            </div>

        </div>

    );
}

export default DashboardPage;