import "./InfoCard.css";

function InfoCard({

    title,

    subtitle,

    actions,

    children,

    className = "",

    collapsible = false,

    footer = null

}) {

    return (

        <section className={`info-card ${className}`}>

            {(title || subtitle || actions) && (

                <div className="info-card-header">

                    <div className="info-card-title">

                        {title && <h3>{title}</h3>}

                        {subtitle && <p>{subtitle}</p>}

                    </div>

                    {actions && (

                        <div className="info-card-actions">

                            {actions}

                        </div>

                    )}

                </div>

            )}

            <div className="info-card-body">

                {children}

            </div>

            {footer && (

                <div className="info-card-footer">

                    {footer}

                </div>

            )}

        </section>

    );

}

export default InfoCard;