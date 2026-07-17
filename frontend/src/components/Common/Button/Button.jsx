import "./button.css";

function Button({

    children,

    variant = "primary",

    size = "md",

    icon = null,

    iconPosition = "left",

    fullWidth = false,

    loading = false,

    disabled = false,

    type = "button",

    onClick,

    className = ""

}) {

    return (

        <button

            type={type}

            disabled={disabled || loading}

            onClick={onClick}

            className={`

                erp-btn

                erp-btn-${variant}

                erp-btn-${size}

                ${fullWidth ? "erp-btn-full" : ""}

                ${className}

            `}

        >

            {

                loading && (

                    <span className="erp-btn-spinner"/>

                )

            }

            {

                !loading &&

                icon &&

                iconPosition==="left" &&

                <span className="erp-btn-icon">

                    {icon}

                </span>

            }

            <span>

                {

                    loading

                        ?

                        "Please Wait..."

                        :

                        children

                }

            </span>

            {

                !loading &&

                icon &&

                iconPosition==="right" &&

                <span className="erp-btn-icon">

                    {icon}

                </span>

            }

        </button>

    );

}

export default Button;