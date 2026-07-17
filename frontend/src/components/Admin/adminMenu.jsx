import { FaCalendarAlt } from "react-icons/fa";

export const adminMenu = [

    {
        title: "Dashboard",
        icon: "🏠",
        path: "/admin/dashboard"
    },

    {
        title: "Applications",
        icon: "📄",
        path: "/admin/applications"
    },

    {
        title: "Guest Houses",
        icon: "🏢",
        path: "/admin/guesthouses"
    },

    {
        title: "Workflow",
        icon: "⚙️",
        path: "/admin/workflow"
    },

    {
        title: "Room Availability",

        icon: <FaCalendarAlt />,

        path: "/admin/room-availability"
    },

    {
        title: "Users",
        icon: "👥",
        path: "/admin/users"
    },

    {
        title: "Reports",
        icon: "📊",
        path: "/admin/reports"
    },

    {
        title: "Audit Logs",
        icon: "📋",
        path: "/admin/audit"
    },

    {
        title: "Settings",
        icon: "🔧",
        path: "/admin/settings"
    }

];