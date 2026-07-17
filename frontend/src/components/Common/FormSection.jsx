import "./formLayout.css";

function FormSection({

    title,

    subtitle,

    children,

    actions

}) {

    return (

        <div className="form-section">

            <div className="form-section-header">

                <div>

                    <h3>

                        {title}

                    </h3>

                    {

                        subtitle && (

                            <p>

                                {subtitle}

                            </p>

                        )

                    }

                </div>

                <div>

                    {actions}

                </div>

            </div>

            <div className="form-section-body">

                {children}

            </div>

        </div>

    );

}

export default FormSection;