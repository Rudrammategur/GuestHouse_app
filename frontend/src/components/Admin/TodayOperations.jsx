import "../../styles/adminDashboard.css";

function TodayOperations({

    operations = {}

}) {

    return (

        <div className="dashboard-card-container">

            <h3 className="section-title">

                Today's Operations

            </h3>

            <div className="operations-list">

                <div className="operation-item">

                    <span>Today's Arrivals</span>

                    <strong>

                        {operations.todayArrivals || 0}

                    </strong>

                </div>

                <div className="operation-item">

                    <span>Today's Departures</span>

                    <strong>

                        {operations.todayDepartures || 0}

                    </strong>

                </div>

                <div className="operation-item">

                    <span>Occupied Rooms</span>

                    <strong>

                        {operations.occupiedRooms || 0}

                    </strong>

                </div>

                <div className="operation-item">

                    <span>Vacant Rooms</span>

                    <strong>

                        {operations.vacantRooms || 0}

                    </strong>

                </div>

            </div>

        </div>

    );

}

export default TodayOperations;