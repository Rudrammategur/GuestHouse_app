import { Outlet } from "react-router-dom";
import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import "../../styles/admin.css";

function AdminLayout() {

    const [collapsed, setCollapsed] = useState(false);

    return (

        <div className="admin-layout">

            <AdminSidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />

            <div
                className={`admin-main ${collapsed ? "expanded" : ""}`}
            >

                <AdminHeader />

                <main className="admin-content">

                    <Outlet />

                </main>

            </div>

        </div>

    );

}

export default AdminLayout;