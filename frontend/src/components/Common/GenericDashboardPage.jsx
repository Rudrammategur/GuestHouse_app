import GenericTable from "./GenericTable";
import DashboardCards from "../Dashboard/DashboardCards";

function GenericDashboardPage({

    title,

    cards = [],

    toolbar = null,

    filters = null,

    columns = [],

    tableData = [],

    loading = false,

    emptyMessage = "No Records Found"

}) {

    return (

        <div className="dashboard-container">

            <h2 className="dashboard-title">

                {title}

            </h2>

            {

                cards.length > 0 &&

                <DashboardCards

                    cards={cards}

                />

            }

            {

                toolbar

            }

            {

                filters

            }

            <div className="table-section">

                <GenericTable

                    columns={columns}

                    tableData={tableData}

                    loading={loading}

                    emptyMessage={emptyMessage}

                />

            </div>

        </div>

    );

}

export default GenericDashboardPage;