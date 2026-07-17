import "./reports.css";

function ReportTable({

    columns = [],

    tableData = [],

    loading = false

}) {

    if (loading) {

        return (

            <div className="report-loading">

                Loading Report...

            </div>

        );

    }

    if (tableData.length === 0) {

        return (

            <div className="report-empty">

                No Records Found

            </div>

        );

    }

    return (

        <div className="report-table-container">

            <table className="report-table">

                <thead>

                    <tr>

                        {

                            columns.map(column => (

                                <th key={column.accessor}>

                                    {column.header}

                                </th>

                            ))

                        }

                    </tr>

                </thead>

                <tbody>

                    {

                        tableData.map((row, rowIndex) => (

                            <tr key={rowIndex}>

                                {

                                    columns.map(column => (

                                        <td key={column.accessor}>

                                            {

                                                column.render

                                                    ? column.render(row)

                                                    : row[column.accessor]

                                            }

                                        </td>

                                    ))

                                }

                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

}

export default ReportTable;