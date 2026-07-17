import { useEffect, useState } from "react";
import axios from "axios";
import "./workflow.css";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

function WorkflowFilters({

    filters,

    setFilters,

    onSearch

}) {

    const [workflowUsers, setWorkflowUsers] = useState([]);

    useEffect(() => {

        loadWorkflowUsers();

    }, []);

    const loadWorkflowUsers = async () => {

        try {

            const response = await axios.get(

                `${API_URL}/api/user-access/workflow-users`

            );

            setWorkflowUsers(response.data);

        }

        catch (err) {

            console.log(err);

        }

    };

    const updateFilter = (field, value) => {

        setFilters({

            ...filters,

            [field]: value

        });

    };

    const resetFilters = () => {

        setFilters({

            bookingNo: "",

            guestName: "",

            status: "",

            pendingWith: "",

            fromDate: "",

            toDate: ""

        });

    };

    return (

        <div className="workflow-filters">

            <div className="filter-group">

                <label>

                    Booking No

                </label>

                <input

                    type="text"

                    value={filters.bookingNo}

                    placeholder="Booking Number"

                    onChange={(e)=>

                        updateFilter(

                            "bookingNo",

                            e.target.value

                        )

                    }

                />

            </div>

            <div className="filter-group">

                <label>

                    Guest Name

                </label>

                <input

                    type="text"

                    value={filters.guestName}

                    placeholder="Guest Name"

                    onChange={(e)=>

                        updateFilter(

                            "guestName",

                            e.target.value

                        )

                    }

                />

            </div>

            <div className="filter-group">

                <label>

                    Status

                </label>

                <select

                    value={filters.status}

                    onChange={(e)=>

                        updateFilter(

                            "status",

                            e.target.value

                        )

                    }

                >

                    <option value="">

                        All

                    </option>

                    <option value="Submitted">

                        Submitted

                    </option>

                    <option value="Verified">

                        Verified

                    </option>

                    <option value="Approved">

                        Approved

                    </option>

                    <option value="Allocated">

                        Allocated

                    </option>

                    <option value="CheckedIn">

                        Checked In

                    </option>

                    <option value="CheckedOut">

                        Checked Out

                    </option>

                    <option value="Rejected">

                        Rejected

                    </option>

                    <option value="Cancelled">

                        Cancelled

                    </option>

                </select>

            </div>

            <div className="filter-group">

                <label>

                    Pending With

                </label>

                <select

                    value={filters.pendingWith}

                    onChange={(e)=>

                        updateFilter(

                            "pendingWith",

                            e.target.value

                        )

                    }

                >

                    <option value="">

                        All

                    </option>

                    {

                        workflowUsers.map(user=>(

                            <option

                                key={user.EmployeeID}

                                value={user.Role}

                            >

                                {user.EmployeeName}

                                {" - "}

                                {user.Role}

                            </option>

                        ))

                    }

                </select>

            </div>

            <div className="filter-group">

                <label>

                    From Date

                </label>

                <input

                    type="date"

                    value={filters.fromDate}

                    onChange={(e)=>

                        updateFilter(

                            "fromDate",

                            e.target.value

                        )

                    }

                />

            </div>

            <div className="filter-group">

                <label>

                    To Date

                </label>

                <input

                    type="date"

                    value={filters.toDate}

                    onChange={(e)=>

                        updateFilter(

                            "toDate",

                            e.target.value

                        )

                    }

                />

            </div>

            <div className="workflow-filter-buttons">

                <button

                    className="search-btn"

                    onClick={onSearch}

                >

                    Search

                </button>

                <button

                    className="reset-btn"

                    onClick={resetFilters}

                >

                    Reset

                </button>

            </div>

        </div>

    );

}

export default WorkflowFilters;