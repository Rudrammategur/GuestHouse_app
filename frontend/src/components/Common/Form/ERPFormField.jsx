import "./ERPForm.css";

function ERPFormField({
    label,
    name,
    value,
    onChange,
    required = false,
    type = "text",
    placeholder = ""
}) {

    return (

        <div className="erp-form-group">

            <label>

                {label}

                {required && <span className="required">*</span>}

            </label>

            {type === "file" ? (

                <input
                    type="file"
                    name={name}
                    onChange={onChange}
                    className="erp-input"
                />

            ) : (

                <input

                    type={type}

                    name={name}

                    value={value}

                    placeholder={placeholder}

                    onChange={onChange}

                    className="erp-input"

                />
            )}

        </div>

    );

}

export default ERPFormField;