import "./ERPForm.css";

function ERPTextArea({

    label,

    name,

    value,

    onChange,

    rows = 3,

    required = false

}) {

    return (

        <div className="erp-form-group full-width">

            <label>

                {label}

                {required && <span className="required">*</span>}

            </label>

            <textarea

                name={name}

                rows={rows}

                value={value}

                onChange={onChange}

                className="erp-input"

            />

        </div>

    );

}

export default ERPTextArea;