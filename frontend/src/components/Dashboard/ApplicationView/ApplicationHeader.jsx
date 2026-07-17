import { useNavigate } from "react-router-dom";

import PageHeader from "../../Common/PageHeader";
import Button from "../../Common/Button/Button";
import StatusBadge from "../../Common/StatusBadge";

import "./ApplicationView.css";

function ApplicationHeader({ application }) {

    const navigate = useNavigate();

    const handlePrint = () => {

        window.print();

    };

    return (

        <PageHeader

            title="Guest House Application"

            subtitle={

                <div className="application-header-info">

                    <span>

                        <strong>Booking No :</strong>

                        {application.GHRBookingNo}

                    </span>

                    <span>

                        <strong>Submitted :</strong>

                        {new Date(

                            application.BookingDateTime

                        ).toLocaleString("en-IN")}

                    </span>

                </div>

            }

            actions={

                <div className="application-header-actions">

                    <StatusBadge

                        status={application.BookingStatus}

                    />

                    <Button

                        variant="outline"

                        onClick={() => navigate(-1)}

                    >

                        ← Back

                    </Button>

                    <Button

                        onClick={handlePrint}

                    >

                        🖨 Print

                    </Button>

                </div>

            }

        />

    );

}

export default ApplicationHeader;