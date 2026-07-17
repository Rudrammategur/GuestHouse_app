import "./infoRow.css";

function InfoRow({

    label,

    value,

    fullWidth = false,

    className = ""

}) {

    return (

        <div
            className={`
                info-row
                ${fullWidth ? "full-width" : ""}
                ${className}
            `}
        >

            <div className="info-label">

                {label}

            </div>

            <div className="info-value">

                {

                    value ||

                    "-"

                }

            </div>

        </div>

    );

}

export default InfoRow;