
import { NavLink } from "react-router-dom";

function NgoSidebar() {
  return (
    <aside className="ngo-sidebar">

      <h2>Food Connect</h2>
      <p>NGO Panel</p>

      <nav>
        <NavLink to="/ngo-dashboard" end>
          Dashboard
        </NavLink>

        <NavLink to="/ngo-dashboard/donations">
          Available Donations
        </NavLink>

        <NavLink to="/ngo-dashboard/requests">
          My Requests
        </NavLink>
      </nav>

    </aside>
  );
}

export default NgoSidebar;
