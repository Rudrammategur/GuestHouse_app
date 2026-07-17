import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardPage from "../../components/dashboard/DashboardPage";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

function GHCheckOutDashboard() {

    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);

    const [counts, setCounts] = useState({

        CurrentOccupancy:0,

        TodayDepartures:0,

        OverStayed:0,

        CheckedOutToday:0

    });

    useEffect(()=>{

        loadApplications();

    },[]);

    const loadApplications = async()=>{

        try{

            const res = await axios.get(

                `${API_URL}/api/guesthouse-incharge/checkout-applications`

            );

            setApplications(res.data);

        }

        catch(err){

            console.log(err);

        }

    };

    const enhancedData = applications.map(row=>({

        ...row,

        BookingID:row.GHRBookingNo,

        RoomNo:row.RoomNo,

        CheckInDate:new Date(

            row.CheckInDateTime

        ).toLocaleDateString(),

        DepartureDate:new Date(

            row.DepartureDateTime

        ).toLocaleDateString(),

        StayStatus:row.BookingStatus,

        action:(

            <button

                className="checkout-btn"

                onClick={()=>navigate(

                    `/gh-incharge/checkout/${row.GHBookingID}`

                )}

            >

                Check Out

            </button>

        )

    }));


    return(

        <DashboardPage

            title="Guest House Check-Out Dashboard"

            cards={[

                {

                    title:"Current Occupancy",

                    value:counts.CurrentOccupancy

                },

                {

                    title:"Today's Departures",

                    value:counts.TodayDepartures

                },

                {

                    title:"Overstayed Guests",

                    value:counts.OverStayed

                },

                {

                    title:"Checked Out Today",

                    value:counts.CheckedOutToday

                }

            ]}

            applications={enhancedData}
            viewRoute="/gh-incharge/checkout"

        />

    );

}

export default GHCheckOutDashboard;