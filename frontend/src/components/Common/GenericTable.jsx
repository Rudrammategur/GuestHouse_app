import { useEffect, useState } from "react";

function GenericTable({


    columns,

    tableData,

    loading,

    emptyMessage

}) {

    const [filters, setFilters] = useState({});

    const [sortColumn, setSortColumn] = useState("");

    const [sortDirection, setSortDirection] = useState("asc");

    const filteredData = tableData.filter(row => {

        return columns.every(col => {

            const value = row[col.accessor];

            const filterValue = filters[col.accessor];

            if (!filterValue) return true;

            return String(value)

                .toLowerCase()

                .includes(filterValue.toLowerCase());

        });

    });

    const sortedData = [...filteredData];

    if (sortColumn) {

        sortedData.sort((a, b) => {

            const x = a[sortColumn];

            const y = b[sortColumn];

            if (x < y)

                return sortDirection === "asc"

                    ? -1

                    : 1;

            if (x > y)

                return sortDirection === "asc"

                    ? 1

                    : -1;

            return 0;

        });

    }

    const formatValue = (value) => {

        if (

            value === null ||

            value === undefined

        )

            return "-";

        if (

            typeof value === "string" &&

            value.includes("T")

        ) {

            const d = new Date(value);

            if (!isNaN(d))

                return d.toLocaleString();

        }

        return value;

    };

    if (loading) {

        return (

            <div className="loading-state">

                Loading...

            </div>

        );

    }

    return (

        <table className="erp-table">

            <thead>

                <tr>

                    {

                        columns.map(col => (

                            <th key={col.accessor}> {col.header} </th>

                        ))

                    }

                </tr>

            </thead>

            <tbody>

                {

                    tableData.length === 0

                        ?

                        <tr>

                            <td

                                colSpan={columns.length}

                                className="empty-state"

                            >

                                {emptyMessage}

                            </td>

                        </tr>

                        :

                        tableData.map((row, index) => (

                            <tr key={index}>

                                {

                                    columns.map(col => (

                                        <td

                                            key={col.accessor}

                                        >

                                            {

                                                col.render

                                                    ?

                                                    col.render(row)

                                                    :

                                                    formatValue(

                                                        row[col.accessor]

                                                    )

                                            }

                                        </td>

                                    ))

                                }

                            </tr>

                        ))

                }

            </tbody>

        </table>

    );

}

export default GenericTable;