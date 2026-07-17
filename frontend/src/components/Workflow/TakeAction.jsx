import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../../styles/takeAction.css";

function TakeAction({

    application,

    refreshApplications,

    actionType = "Verifier"

}) {

    const navigate = useNavigate();

    const approveText =
        actionType === "Approver"
            ? "Approve"
            : "Verify";

    const approveStatus =
        actionType === "Approver"
            ? "Approved"
            : "Verified";

    const [status, setStatus] = useState(approveStatus);

    const [remarks, setRemarks] = useState("");

    const handleSubmit = async () => {

        try {

            let url = "";

            if (actionType === "Verifier") {

                url =
                    status === "Verified"

                        ? `http://localhost:5000/api/verifier/verify/${application.GHBookingID}`

                        : `http://localhost:5000/api/verifier/reject/${application.GHBookingID}`;

            }

            else {

                url =
                    status === "Approved"

                        ? `http://localhost:5000/api/approver/approve/${application.GHBookingID}`

                        : `http://localhost:5000/api/approver/reject/${application.GHBookingID}`;

            }

            const response = await axios.put(

                url,

                {
                    remarks
                }

            );

            toast.success(response.data.message);

            refreshApplications?.();

            setTimeout(() => {

                navigate(

                    actionType === "Verifier"

                        ? "/verifier"

                        : "/approver"

                );

            }, 1000);

        }

        catch (err) {

            console.error(err);

            toast.error(

                err.response?.data?.message ||

                "Something went wrong."

            );

        }

    };

    return (

        <div className="action-card">

            <h3>Take Action</h3>

            <div className="decision-section">

                <label>Decision</label>

                <div className="radio-group">

                    <label>

                        <input

                            type="radio"

                            value={approveStatus}

                            checked={status === approveStatus}

                            onChange={(e) =>
                                setStatus(e.target.value)
                            }

                        />

                        {approveText}

                    </label>

                    <label>

                        <input

                            type="radio"

                            value="Rejected"

                            checked={status === "Rejected"}

                            onChange={(e) =>
                                setStatus(e.target.value)
                            }

                        />

                        Reject

                    </label>

                </div>

            </div>

            <div className="remarks-section">

                <label>Remarks</label>

                <textarea

                    rows="5"

                    value={remarks}

                    onChange={(e) =>
                        setRemarks(e.target.value)
                    }

                    placeholder="Enter remarks"

                />

            </div>

            <button

                className="submit-btn"

                onClick={handleSubmit}

            >

                Submit

            </button>

        </div>

    );

}

export default TakeAction;