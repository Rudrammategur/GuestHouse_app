import "../Dashboard/dashboard.css";
<DashboardTabs

    value={activeTab}

    onChange={setActiveTab}

    tabs={[

        "all",

        "pending",

        "approved",

        "rejected",

        "completed"

    ]}

/>