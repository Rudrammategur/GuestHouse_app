import { useState } from "react";

import BookingHeader from "./BookingHeader";
import BookingTabs from "./BookingTabs";

import BookingTab from "./tabs/BookingTab";
import WorkflowTab from "./tabs/WorkflowTab";
import AllocationTab from "./tabs/AllocationTab";
import CheckInTab from "./tabs/CheckInTab";
import CheckOutTab from "./tabs/CheckOutTab";
import ReceiptTab from "./tabs/ReceiptTab";
import AuditTab from "./tabs/AuditTab";

import "../../styles/bookingWorkspace.css";

function BookingWorkspace({

    booking,

    role = "Admin"

}){

    const [activeTab,setActiveTab]=
        useState("booking");

    const renderTab=()=>{

        switch(activeTab){

            case "booking":

                return(

                    <BookingTab

                        booking={booking}

                    />

                );

            case "workflow":

                return(

                    <WorkflowTab

                        booking={booking}

                    />

                );

            case "allocation":

                return(

                    <AllocationTab

                        booking={booking}

                    />

                );

            case "checkin":

                return(

                    <CheckInTab

                        booking={booking}

                    />

                );

            case "checkout":

                return(

                    <CheckOutTab

                        booking={booking}

                    />

                );

            case "receipt":

                return(

                    <ReceiptTab

                        booking={booking}

                    />

                );

            case "audit":

                return(

                    <AuditTab

                        booking={booking}

                    />

                );

            default:

                return null;

        }

    };

    return(

        <div className="booking-workspace">

            <BookingHeader

                booking={booking}

            />

            <BookingTabs

                role={role}

                activeTab={activeTab}

                setActiveTab={setActiveTab}

            />

            <div className="workspace-content">

                {renderTab()}

            </div>

        </div>

    );

}

export default BookingWorkspace;