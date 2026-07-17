import { useEffect, useState } from "react";

import axios from "axios";

import SettingSection from "../../components/Admin/Settings/SettingSection";

import SettingActions from "../../components/Admin/Settings/SettingActions";

import "../../styles/systemSettings.css";

const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

function SystemSettings() {

    const [originalSettings, setOriginalSettings] = useState([]);

    const [saving, setSaving] = useState(false);

    const [settings, setSettings] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadSettings();

    }, []);

    const loadSettings = async () => {

        try {

            const response = await axios.get(

                `${API_URL}/api/admin/settings/GuestHouse`

            );

            setSettings(response.data.data);
            setOriginalSettings(response.data.data);

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setLoading(false);

        }

    };

    const updateSetting = (

        settingKey,

        value

    ) => {

        setSettings(current =>

            current.map(setting =>

                setting.SettingKey === settingKey

                    ?

                    {

                        ...setting,

                        SettingValue: value

                    }

                    :

                    setting

            )

        );

    };

    const saveSettings = async () => {

        try {

            setSaving(true);

            await axios.put(

                `${API_URL}/api/admin/settings/GuestHouse`,

                settings

            );

            setOriginalSettings(settings);

            alert("Settings updated successfully.");

        }

        catch (err) {

            console.log(err);

            alert("Unable to save settings.");

        }

        finally {

            setSaving(false);

        }

    };

    const resetSettings = () => {

        setSettings(originalSettings);

    };

    const reloadSettings = () => {

        loadSettings();

    };



    if (loading) {

        return <h3>Loading...</h3>;

    }

    const groupedSettings = settings.reduce(

        (groups, setting) => {

            if (!groups[setting.Category]) {

                groups[setting.Category] = [];

            }

            groups[setting.Category].push(setting);

            return groups;

        },

        {}

    );

    return (

        <div className="system-settings-page">

            <h2>

                System Settings

            </h2>

            {

                Object.entries(

                    groupedSettings

                ).map(

                    ([category, values]) => (

                        <SettingSection

                            key={category}

                            title={category}

                            settings={values}

                            onChange={updateSetting}

                        />

                    )

                )

            }

            <SettingActions

                onSave={saveSettings}

                onReset={resetSettings}

                onReload={reloadSettings}

                saving={saving}

            />

        </div>

    );

}

export default SystemSettings;