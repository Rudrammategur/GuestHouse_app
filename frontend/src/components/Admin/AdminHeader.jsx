import { useLocation } from "react-router-dom";

function AdminHeader() {

    const location = useLocation();

    const pageTitle = location.pathname
        .split("/")
        .filter(Boolean)
        .pop()
        ?.replace("-", " ")
        ?.replace(/\b\w/g, c => c.toUpperCase()) || "Dashboard";

    const today = new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    return (

        <header className="admin-header">

            <div className="header-left">

                <h2>{pageTitle}</h2>

                <span className="header-date">

                    {today}

                </span>

            </div>

            <div className="header-right">

                <button
                    className="header-icon"
                    title="Notifications"
                >

                    🔔

                </button>

                <button
                    className="header-icon"
                    title="Messages"
                >

                    ✉️

                </button>

                <div className="admin-profile">

                    <div className="profile-avatar">

                        A

                    </div>

                    <div className="profile-info">

                        <span className="profile-name">

                            Administrator

                        </span>

                        <span className="profile-role">

                            Super Admin

                        </span>

                    </div>

                </div>

            </div>

        </header>

    );

}

export default AdminHeader;