import "./SectionHeader.css";

function SectionHeader({

    title,

    subtitle

}) {

    return (

        <div className="section-header">

            <div>

                <h3>{title}</h3>

                {subtitle && <p>{subtitle}</p>}

            </div>

            {

                actions &&

                <div className="section-actions">

                    {actions}

                </div>

            }

        </div>

    );

}

export default SectionHeader;