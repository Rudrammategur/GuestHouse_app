import "../Common/section.css";

function ERPSection({

    title,

    actions,

    children

}) {

    return (

        <div className="erp-section">

            {

                (title || actions) &&

                <div className="erp-section-header">

                    <h3>

                        {title}

                    </h3>

                    <div>

                        {actions}

                    </div>

                </div>

            }

            <div className="erp-section-body">

                {children}

            </div>

        </div>

    );

}

export default ERPSection;