import { useMemo, useState } from "react";

import StatusBadge from "./StatusBadge";

function ERPTable({

    columns = [],

    data = [],

    loading = false,

    actions,

    searchable = true,

    pageSize = 10,

    rowNumber = true

}) {

    const [search, setSearch] = useState("");

    const [page, setPage] = useState(1);

    const filteredData = useMemo(() => {

        if (!search)

            return data;

        return data.filter(row =>

            JSON.stringify(row)

                .toLowerCase()

                .includes(search.toLowerCase())

        );

    }, [search, data]);

    const totalPages = Math.ceil(

        filteredData.length / pageSize

    );

    const currentRows = filteredData.slice(

        (page - 1) * pageSize,

        page * pageSize

    );

    if (loading) {

        return <p>Loading...</p>;

    }

    return (

        <div className="erp-table-wrapper">

            {

                searchable &&

                <input

                    className="erp-table-search"

                    placeholder="Search..."

                    value={search}

                    onChange={(e) => {

                        setSearch(e.target.value);

                        setPage(1);

                    }}

                />

            }

            <table className="erp-table">

                <thead>

                    <tr>

                        {

                            rowNumber &&

                            <th>#</th>

                        }

                        {

                            columns.map(col => (

                                <th

                                    key={col.key}

                                >

                                    {col.label}

                                </th>

                            ))

                        }

                        {

                            actions &&

                            <th>

                                Actions

                            </th>

                        }

                    </tr>

                </thead>

                <tbody>

                    {

                        currentRows.length === 0 &&

                        <tr>

                            <td

                                colSpan={columns.length + 2}

                            >

                                No Records Found

                            </td>

                        </tr>

                    }

                    {

                        currentRows.map((row, index) => (

                            <tr key={row.GHBookingID}>

                                {

                                    rowNumber &&

                                    <td>

                                        {

                                            (page - 1) * pageSize +

                                            index + 1

                                        }

                                    </td>

                                }

                                {

                                    columns.map(col => (

                                        <td key={col.key}>

                                            {

                                                col.render

                                                    ? col.render(row)

                                                    : col.type === "status"

                                                        ? (

                                                            <StatusBadge

                                                                status={row[col.key]}

                                                            />

                                                        )

                                                        : row[col.key]

                                            }

                                        </td>

                                    ))

                                }

                                {

                                    actions &&

                                    <td>

                                        {actions(row)}

                                    </td>

                                }

                            </tr>

                        ))

                    }

                </tbody>

            </table>

            {

                totalPages > 1 &&

                <div className="erp-pagination">

                    <button

                        disabled={page === 1}

                        onClick={() =>

                            setPage(page - 1)

                        }

                    >

                        Previous

                    </button>

                    <span>

                        Page

                        {" "}

                        {page}

                        {" / "}

                        {totalPages}

                    </span>

                    <button

                        disabled={

                            page === totalPages

                        }

                        onClick={() =>

                            setPage(page + 1)

                        }

                    >

                        Next

                    </button>

                </div>

            }

        </div>

    );

}

export default ERPTable;