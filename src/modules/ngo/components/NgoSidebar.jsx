
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../authentication/useAuth";

function NgoSidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  async function handleSignOut() {
    const confirmed = window.confirm(
      "Are you sure you want to sign out?"
    );

    if (!confirmed) return;

    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Sign out error:", error);
      alert("Unable to sign out. Please try again.");
    }
  }

  return (
    <aside className="ngo-sidebar">

      <div className="ngo-sidebar-brand">
        <div className="ngo-brand-icon">🌿</div>
        <div>
          <h2>Ann-Setu</h2>
          <p>NGO Community Portal</p>
        </div>
      </div>

      <div className="ngo-sidebar-divider"></div>

      <p className="ngo-menu-label">MAIN MENU</p>

      <nav className="ngo-sidebar-nav">

        <NavLink to="/ngo-dashboard" end>
          <span className="ngo-menu-icon">⌂</span>
          <span>Dashboard</span>
          <span className="ngo-menu-arrow">›</span>
        </NavLink>

        <NavLink to="/ngo-dashboard/donations">
          <span className="ngo-menu-icon">🥗</span>
          <span>Available Donations</span>
          <span className="ngo-menu-arrow">›</span>
        </NavLink>

        <NavLink to="/ngo-dashboard/requests">
          <span className="ngo-menu-icon">🤝</span>
          <span>My Requests</span>
          <span className="ngo-menu-arrow">›</span>
        </NavLink>

        <NavLink to="/ngo-dashboard/map">
          <span className="ngo-menu-icon">📍</span>
          <span>Donation Map</span>
          <span className="ngo-menu-arrow">›</span>
        </NavLink>

      </nav>

      <div className="ngo-sidebar-bottom">

        <div className="ngo-sidebar-message">
          <span>💚</span>
          <h4>Every Meal Matters</h4>
          <p>
            Together, we can reduce food waste and
            support our communities.
          </p>
        </div>

        <button
          type="button"
          className="ngo-signout-button"
          onClick={handleSignOut}
        >
          <span>↪</span>
          Sign Out
        </button>

        <p className="ngo-sidebar-footer">
          Made with care · Ann-Setu
        </p>

      </div>

    </aside>
  );
}

export default NgoSidebar;

