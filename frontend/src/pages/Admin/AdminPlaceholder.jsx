import { MdMenu, MdNotificationsNone, MdPersonOutline, MdLogout } from "react-icons/md";
import { useUser } from "../../context/UserContext";

function AdminHeader({ onMenuToggle, pageTitle }) {
  const { currentUser } = useUser();

  const initials = currentUser?.EmployeeName
    ? currentUser.EmployeeName.split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "AD";

  return (
    <header className="admin-header">
      {/* Left: hamburger + page title */}
      <div className="admin-header__left">
        <button
          className="admin-header__menu-btn"
          onClick={onMenuToggle}
          aria-label="Toggle sidebar"
        >
          <MdMenu />
        </button>
        <div className="admin-header__title-group">
          <span className="admin-header__breadcrumb">Admin</span>
          {pageTitle && (
            <>
              <span className="admin-header__breadcrumb-sep">/</span>
              <span className="admin-header__page-title">{pageTitle}</span>
            </>
          )}
        </div>
      </div>

      {/* Right: notifications + user chip */}
      <div className="admin-header__right">
        <button className="admin-header__icon-btn" aria-label="Notifications">
          <MdNotificationsNone />
          <span className="admin-header__notif-dot" aria-hidden="true" />
        </button>

        <div className="admin-header__user">
          <div className="admin-header__avatar" aria-hidden="true">
            {initials}
          </div>
          <div className="admin-header__user-info">
            <span className="admin-header__user-name">
              {currentUser?.EmployeeName || "Admin"}
            </span>
            <span className="admin-header__user-role">
              {currentUser?.Role || "Administrator"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
