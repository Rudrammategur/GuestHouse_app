import "./StatCard.css";

function StatCard({

    title,

    value,

    subtitle,

    icon,

    color = "primary"

}) {

    return (

        <div className={`stat-card ${color}`}>

            <div className="stat-card-left">

                <p className="stat-title">

                    {title}

                </p>

                <h2 className="stat-value">

                    {value ?? "-"}

                </h2>

                {

                    subtitle && (

                        <span className="stat-subtitle">

                            {subtitle}

                        </span>

                    )

                }

            </div>

            {

                icon && (

                    <div className="stat-icon">

                        {icon}

                    </div>

                )

            }

        </div>

    );

}

export default StatCard;