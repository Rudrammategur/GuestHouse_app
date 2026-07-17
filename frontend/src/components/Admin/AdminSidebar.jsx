import { NavLink } from "react-router-dom";
import { adminMenu } from "./adminMenu";

function AdminSidebar({ collapsed, setCollapsed }) {

    return (

        <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>

            <div className="sidebar-top">

                <div className="logo">

                    {collapsed ? "ERP" : "Guest House ERP"}

                </div>

                <button
                    className="collapse-btn"
                    onClick={() => setCollapsed(!collapsed)}
                >

                    {collapsed ? "☰" : "◀"}

                </button>

            </div>

            <nav className="sidebar-menu">

                {

                    adminMenu.map((item) => (

                        <NavLink

                            key={item.path}

                            to={item.path}

                            className={({ isActive }) =>
                                isActive
                                    ? "sidebar-link active"
                                    : "sidebar-link"
                            }

                        >

                            <span className="menu-icon">

                                {item.icon}

                            </span>

                            {

                                !collapsed &&

                                <span className="menu-text">

                                    {item.title}

                                </span>

                            }

                        </NavLink>

                    ))

                }

            </nav>

            <div className="sidebar-footer">

                <NavLink
                    to="/login"
                    className="sidebar-link logout-link"
                >

                    <span className="menu-icon">

                        🚪

                    </span>

                    {

                        !collapsed &&

                        <span className="menu-text">

                            Logout

                        </span>

                    }

                </NavLink>

            </div>

        </aside>

    );

}

export default AdminSidebar;