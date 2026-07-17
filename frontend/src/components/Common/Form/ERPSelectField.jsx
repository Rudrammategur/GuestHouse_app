import "./ERPForm.css";

function ERPSelectField({

    label,

    name,

    value,

    onChange,

    options = [],

    required = false

}) {

    return (

        <div className="erp-form-group">

            <label>

                {label}

                {required && <span className="required">*</span>}

            </label>

            <select

                name={name}

                value={value}

                onChange={onChange}

                className="erp-input"

            >

                <option value="">

                    Select

                </option>

                {

                    options.map(option => (

                        <option

                            key={option.value}

                            value={option.value}

                        >

                            {option.label}

                        </option>

                    ))

                }

            </select>

        </div>

    );

}

export default ERPSelectField;