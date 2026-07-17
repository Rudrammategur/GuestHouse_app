import "../Dashboard/dashboard.css";

function SummaryCard({

    title,

    value,

    icon,

    color = "primary",

    onClick

}) {

    return (

        <div

            className={`summary-card ${color}`}

            onClick={onClick}

        >

            <div className="summary-card-icon">

                {icon}

            </div>

            <div className="summary-card-content">

                <h2>{value}</h2>

                <p>{title}</p>

            </div>

        </div>

    );

}

export default SummaryCard;