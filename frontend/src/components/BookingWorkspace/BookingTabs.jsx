const tabs = [

    {
        key:"booking",
        label:"Booking"
    },

    {
        key:"workflow",
        label:"Workflow"
    },

    {
        key:"allocation",
        label:"Allocation"
    },

    {
        key:"checkin",
        label:"Check-In"
    },

    {
        key:"checkout",
        label:"Check-Out"
    },

    {
        key:"receipt",
        label:"Receipt"
    },

    {
        key:"audit",
        label:"Audit"
    }

];

function BookingTabs({

    activeTab,

    setActiveTab

}){

    return(

        <div className="workspace-tabs">

            {

                tabs.map(tab=>(

                    <button

                        key={tab.key}

                        className={
                            activeTab===tab.key
                            ?"active"
                            :""
                        }

                        onClick={()=>setActiveTab(tab.key)}

                    >

                        {tab.label}

                    </button>

                ))

            }

        </div>

    );

}

export default BookingTabs;