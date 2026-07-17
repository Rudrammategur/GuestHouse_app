import "./workflowTab.css";

function WorkflowTab({

    booking

}){

    const timeline=[

        {

            title:"Submitted",

            employee:booking?.BookedBy,

            date:booking?.BookingDateTime

        },

        {

            title:"Verified",

            employee:booking?.VerifiedBy,

            date:booking?.VerifiedDate

        },

        {

            title:"Approved",

            employee:booking?.ApprovedBy,

            date:booking?.ApprovedDate

        },

        {

            title:"Allocated",

            employee:booking?.AllocatedBy,

            date:booking?.AllocatedOn

        },

        {

            title:"Checked In",

            employee:booking?.CheckInBy,

            date:booking?.CheckInDateTime

        },

        {

            title:"Checked Out",

            employee:booking?.CheckOutBy,

            date:booking?.CheckOutDateTime

        }

    ];

    return(

        <div className="workflow-timeline">

            {

                timeline.map((step,index)=>(

                    <div

                        key={index}

                        className="timeline-item"

                    >

                        <div className="timeline-circle"/>

                        <div>

                            <h4>

                                {step.title}

                            </h4>

                            <p>

                                {step.employee||"-"}

                            </p>

                            <small>

                                {

                                    step.date

                                    ?

                                    new Date(

                                        step.date

                                    ).toLocaleString()

                                    :

                                    "-"

                                }

                            </small>

                        </div>

                    </div>

                ))

            }

        </div>

    );

}

export default WorkflowTab;