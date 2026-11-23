
import {
  LayoutDashboard,
  Users,
  Utensils,
  Building2,
  LogOut
} from "lucide-react";

const navigation = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "donations", label: "Donations", icon: Utensils },
  { id: "ngos", label: "NGO Approvals", icon: Building2 }
];

function AdminSidebar({ activePage, onNavigate }) {
  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <div className="admin-brand-icon">A</div>
        <div>
          <h2>Ann-Setu</h2>
          <span>Admin Panel</span>
        </div>
      </div>

      <div className="admin-nav-section">
        <p className="admin-nav-heading">MENU</p>

        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              className={`admin-nav-item ${
                activePage === item.id ? "active" : ""
              }`}
              onClick={() => onNavigate(item.id)}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="admin-sidebar-bottom">
        <button
          className="admin-nav-item logout-button"
          onClick={() => alert("Logout functionality will be connected later.")}
        >
          <LogOut size={19} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
