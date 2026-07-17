import "./form.css";

function Input({

    label,

    value,

    onChange,

    placeholder = "",

    type = "text",

    required = false,

    disabled = false,

    error = "",

    helperText = "",

    fullWidth = true,

    ...props

}) {

    return (

        <div className={`erp-form-group ${fullWidth ? "full" : ""}`}>

            {label && (

                <label className="erp-label">

                    {label}

                    {required && (

                        <span className="required">

                            *

                        </span>

                    )}

                </label>

            )}

            <input

                className={`

                    erp-input

                    ${error ? "erp-input-error" : ""}

                `}

                value={value}

                type={type}

                placeholder={placeholder}

                disabled={disabled}

                onChange={onChange}

                {...props}

            />

            {

                helperText && (

                    <small>

                        {helperText}

                    </small>

                )

            }

            {

                error && (

                    <div className="erp-error">

                        {error}

                    </div>

                )

            }

        </div>

    );

}

export default Input;