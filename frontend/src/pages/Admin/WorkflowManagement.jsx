import { useEffect, useState } from "react";
import axios from "axios";

import WorkflowSummaryCards from "../../components/Admin/Workflow/WorkflowSummaryCards";
import WorkflowFilters from "../../components/Admin/Workflow/WorkflowFilters";
import WorkflowTable from "../../components/Admin/Workflow/WorkflowTable";
import WorkflowTimelineModal from "../../components/Admin/Workflow/WorkflowTimelineModal";

import "../../styles/workFlowManagement.css";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

function WorkflowManagement() {

    const [summary, setSummary] = useState({});

    const [applications, setApplications] = useState([]);

    const [filters, setFilters] = useState({

        bookingNo: "",

        guestName: "",

        status: "",

        pendingWith: ""

    });

    const [selectedBooking, setSelectedBooking] = useState(null);

    const [showTimeline, setShowTimeline] = useState(false);

    useEffect(() => {

        loadWorkflow();

    }, []);

    const loadWorkflow = async () => {

        try {

            const response = await axios.get(

                `${API_URL}/api/admin/workflow`,

                {

                    params: filters

                }

            );

            setSummary(

                response.data.summary

            );

            setApplications(

                response.data.data

            );

        }

        catch (err) {

            console.log(err);

        }

    };

    const openTimeline = (bookingId) => {

        setSelectedBooking(

            bookingId

        );

        setShowTimeline(true);

    };

    return (

        <div className="workflow-page">

            <h2>

                Workflow Management

            </h2>

            <WorkflowSummaryCards

                summary={summary}

            />

            <WorkflowFilters

                filters={filters}

                setFilters={setFilters}

                onSearch={loadWorkflow}

            />

            <WorkflowTable

                applications={applications}

                onViewTimeline={openTimeline}

            />

            {

                showTimeline && (

                    <WorkflowTimelineModal

                        bookingId={selectedBooking}

                        onClose={()=>

                            setShowTimeline(false)

                        }

                    />

                )

            }

        </div>

    );

}

export default WorkflowManagement;