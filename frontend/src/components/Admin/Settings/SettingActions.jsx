import "./settings.css";

function SettingActions({

    onSave,

    onReset,

    onReload,

    saving = false

}) {

    return (

        <div className="setting-actions">

            <button

                className="reload-btn"

                onClick={onReload}

                type="button"

            >

                Reload

            </button>

            <button

                className="reset-btn"

                onClick={onReset}

                type="button"

            >

                Reset

            </button>

            <button

                className="save-btn"

                onClick={onSave}

                type="button"

                disabled={saving}

            >

                {

                    saving

                        ?

                        "Saving..."

                        :

                        "Save Settings"

                }

            </button>

        </div>

    );

}

export default SettingActions;