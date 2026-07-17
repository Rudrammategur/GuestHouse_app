import "../../styles/adminDashboard.css";

function TodayGuests({

    arrivals=[],

    departures=[]

}){

    return(

        <div className="dashboard-card-container">

            <h3>

                Today's Guests

            </h3>

            <div className="guest-section">

                <h4>

                    Arrivals

                </h4>

                {

                    arrivals.length===0

                    ?

                    <p>No arrivals today.</p>

                    :

                    arrivals.map(guest=>(

                        <div
                            key={guest.GHRBookingNo}
                            className="guest-item"
                        >

                            <strong>

                                {guest.GHRBookingNo}

                            </strong>

                            <span>

                                {guest.GuestName}

                            </span>

                        </div>

                    ))

                }

            </div>

            <div className="guest-section">

                <h4>

                    Departures

                </h4>

                {

                    departures.length===0

                    ?

                    <p>No departures today.</p>

                    :

                    departures.map(guest=>(

                        <div
                            key={guest.GHRBookingNo}
                            className="guest-item"
                        >

                            <strong>

                                {guest.GHRBookingNo}

                            </strong>

                            <span>

                                {guest.GuestName}

                            </span>

                        </div>

                    ))

                }

            </div>

        </div>

    );

}

export default TodayGuests;