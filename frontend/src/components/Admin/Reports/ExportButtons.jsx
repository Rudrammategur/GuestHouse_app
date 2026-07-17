import "./reports.css";

function ExportButtons({

    reportName,

    tableData = [],

    onRefresh

}) {

    const exportCSV = () => {

        if (tableData.length === 0) {

            alert("No data available.");

            return;

        }

        const headers = Object.keys(tableData[0]);

        const csv = [

            headers.join(","),

            ...tableData.map(row =>

                headers

                    .map(key => `"${row[key] ?? ""}"`)

                    .join(",")

            )

        ].join("\n");

        const blob = new Blob(

            [csv],

            {

                type: "text/csv;charset=utf-8;"

            }

        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        link.download = `${reportName}.csv`;

        link.click();

    };

    const printReport = () => {

        window.print();

    };

    return (

        <div className="export-toolbar">

            <button

                className="toolbar-btn"

                onClick={onRefresh}

            >

                🔄 Refresh

            </button>

            <button

                className="toolbar-btn"

                onClick={exportCSV}

            >

                📄 Export CSV

            </button>

            <button

                className="toolbar-btn"

                onClick={printReport}

            >

                🖨 Print

            </button>

            <button

                className="toolbar-btn"

                disabled

                title="Coming Soon"

            >

                📊 Excel

            </button>

            <button

                className="toolbar-btn"

                disabled

                title="Coming Soon"

            >

                📕 PDF

            </button>

        </div>

    );

}

export default ExportButtons;