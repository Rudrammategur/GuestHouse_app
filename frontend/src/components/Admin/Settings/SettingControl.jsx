import "./settings.css";

function SettingControl({

    setting,

    onChange

}) {

    const handleChange = (value) => {

        onChange(

            setting.SettingKey,

            value

        );

    };

    switch (setting.DataType) {

        case "Text":

            return (

                <input

                    type="text"

                    className="setting-input"

                    value={setting.SettingValue || ""}

                    disabled={!setting.IsEditable}

                    onChange={(e) =>

                        handleChange(

                            e.target.value

                        )

                    }

                />

            );

        case "Number":

            return (

                <input

                    type="number"

                    className="setting-input"

                    value={setting.SettingValue || ""}

                    disabled={!setting.IsEditable}

                    onChange={(e) =>

                        handleChange(

                            e.target.value

                        )

                    }

                />

            );

        case "Boolean":

            return (

                <label className="switch">

                    <input

                        type="checkbox"

                        checked={

                            String(setting.SettingValue)

                                .toLowerCase() === "true"

                        }

                        disabled={!setting.IsEditable}

                        onChange={(e) =>

                            handleChange(

                                e.target.checked

                            )

                        }

                    />

                    <span className="slider"></span>

                </label>

            );

        case "Time":

            return (

                <input

                    type="time"

                    className="setting-input"

                    value={setting.SettingValue || ""}

                    disabled={!setting.IsEditable}

                    onChange={(e) =>

                        handleChange(

                            e.target.value

                        )

                    }

                />

            );

        case "Date":

            return (

                <input

                    type="date"

                    className="setting-input"

                    value={setting.SettingValue || ""}

                    disabled={!setting.IsEditable}

                    onChange={(e) =>

                        handleChange(

                            e.target.value

                        )

                    }

                />

            );

        case "Select":

            return (

                <select

                    className="setting-input"

                    value={setting.SettingValue || ""}

                    disabled={!setting.IsEditable}

                    onChange={(e) =>

                        handleChange(

                            e.target.value

                        )

                    }

                >

                    <option value="">

                        Select

                    </option>

                    {

                        setting.Options?.map(option => (

                            <option

                                key={option.Value}

                                value={option.Value}

                            >

                                {option.Label}

                            </option>

                        ))

                    }

                </select>

            );

        default:

            return (

                <input

                    type="text"

                    className="setting-input"

                    value={setting.SettingValue || ""}

                    disabled={!setting.IsEditable}

                    onChange={(e) =>

                        handleChange(

                            e.target.value

                        )

                    }

                />

            );

    }

}

export default SettingControl;