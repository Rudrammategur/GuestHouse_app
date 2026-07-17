import "./reports.css";

function ReportFilters({

    filters = [],

    values = {},

    onChange,

    onSearch,

    masters = {}

}) {

    const handleChange = (field, value) => {

        onChange({

            ...values,

            [field]: value

        });

    };

    return (

        <div className="report-filters">

            {

                filters.includes("fromDate") && (

                    <div className="filter-item">

                        <label>

                            From Date

                        </label>

                        <input

                            type="date"

                            value={values.fromDate || ""}

                            onChange={(e) =>

                                handleChange(

                                    "fromDate",

                                    e.target.value

                                )

                            }

                        />

                    </div>

                )

            }

            {

                filters.includes("toDate") && (

                    <div className="filter-item">

                        <label>

                            To Date

                        </label>

                        <input

                            type="date"

                            value={values.toDate || ""}

                            onChange={(e) =>

                                handleChange(

                                    "toDate",

                                    e.target.value

                                )

                            }

                        />

                    </div>

                )

            }

            {

                filters.includes("guestHouse") && (

                    <div className="filter-item">

                        <label>

                            Guest House

                        </label>

                        <select

                            value={values.guestHouse || ""}

                            onChange={(e) =>

                                handleChange(

                                    "guestHouse",

                                    e.target.value

                                )

                            }

                        >

                            <option value="">

                                All Guest Houses

                            </option>

                            {

                                (masters.guestHouses || []).map(

                                    gh => (

                                        <option

                                            key={gh.GuestHouseID}

                                            value={gh.GuestHouseID}

                                        >

                                            {gh.GuestHouseName}

                                        </option>

                                    )

                                )

                            }

                        </select>

                    </div>

                )

            }

            {

                filters.includes("bookingStatus") && (

                    <div className="filter-item">

                        <label>

                            Booking Status

                        </label>

                        <select

                            value={values.bookingStatus || ""}

                            onChange={(e) =>

                                handleChange(

                                    "bookingStatus",

                                    e.target.value

                                )

                            }

                        >

                            <option value="">

                                All

                            </option>

                            <option>

                                Submitted

                            </option>

                            <option>

                                Verified

                            </option>

                            <option>

                                Approved

                            </option>

                            <option>

                                Rejected

                            </option>

                            <option>

                                Allocated

                            </option>

                            <option>

                                Checked In

                            </option>

                            <option>

                                Checked Out

                            </option>

                            <option>

                                Cancelled

                            </option>

                        </select>

                    </div>

                )

            }

            {

                filters.includes("guestType") && (

                    <div className="filter-item">

                        <label>

                            Guest Type

                        </label>

                        <select

                            value={values.guestType || ""}

                            onChange={(e) =>

                                handleChange(

                                    "guestType",

                                    e.target.value

                                )

                            }

                        >

                            <option value="">

                                All Guest Types

                            </option>

                            {

                                (masters.guestTypes || []).map(

                                    gt => (

                                        <option

                                            key={gt.GuestTypeID}

                                            value={gt.GuestTypeID}

                                        >

                                            {gt.GuestTypeName}

                                        </option>

                                    )

                                )

                            }

                        </select>

                    </div>

                )

            }

            <div className="filter-buttons">

                <button

                    className="search-btn"

                    onClick={onSearch}

                >

                    Search

                </button>

                <button

                    className="reset-btn"

                    onClick={() =>

                        onChange({})

                    }

                >

                    Reset

                </button>

            </div>

        </div>

    );

}

export default ReportFilters;