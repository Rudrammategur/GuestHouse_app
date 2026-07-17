import SettingControl from "./SettingControl";
import "./settings.css";

function SettingSection({

    title,

    settings = [],

    onChange

}) {

    return (

        <div className="setting-section">

            <div className="setting-section-header">

                <h3>

                    {title}

                </h3>

            </div>

            <div className="setting-section-body">

                {

                    settings.map(setting => (

                        <div

                            className="setting-row"

                            key={setting.SettingID}

                        >

                            <div className="setting-info">

                                <label>

                                    {setting.DisplayName}

                                </label>

                                {

                                    setting.Description && (

                                        <small>

                                            {setting.Description}

                                        </small>

                                    )

                                }

                            </div>

                            <div className="setting-control">

                                <SettingControl

                                    setting={setting}

                                    onChange={onChange}

                                />

                            </div>

                        </div>

                    ))

                }

            </div>

        </div>

    );

}

export default SettingSection;