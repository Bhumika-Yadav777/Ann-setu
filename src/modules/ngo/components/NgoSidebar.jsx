
import { NavLink } from "react-router-dom";

function NgoSidebar() {
  return (
    <aside className="ngo-sidebar">

      <h2>Food Connect</h2>
      <p>NGO Panel</p>

      <nav>
        <NavLink to="/ngo" end>
          Dashboard
        </NavLink>

        <NavLink to="/ngo/donations">
          Available Donations
        </NavLink>

        <NavLink to="/ngo/requests">
          My Requests
        </NavLink>
      </nav>

    </aside>
  );
}

export default NgoSidebar;
