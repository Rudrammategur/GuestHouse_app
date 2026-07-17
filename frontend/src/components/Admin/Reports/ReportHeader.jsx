import "./reports.css";

function ReportHeader({ title, subtitle }) {

    return (

        <div className="report-header">

            <div>

                <h2>{title}</h2>

                <p>{subtitle}</p>

            </div>

        </div>

    );

}

export default ReportHeader;