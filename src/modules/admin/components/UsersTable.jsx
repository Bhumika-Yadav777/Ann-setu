
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { supabase } from "../../../services/supabaseClient";

function UsersTable() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, role, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to fetch users:", error.message);
        setError(error.message);
      } else {
        setUsers(data || []);
      }

      setLoading(false);
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.full_name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole =
      roleFilter === "All" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="admin-table-container">
      <div className="admin-table-toolbar">
        <div>
          <h2>All Users</h2>
          <p>View registered platform users.</p>
        </div>

        <div className="admin-table-filters">
          <div className="admin-search">
            <Search size={17} />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="All">All Roles</option>
            <option value="donor">Donor</option>
            <option value="ngo">NGO</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <div className="admin-table-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Account</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="empty-table">
                  Loading users...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="4" className="empty-table">
                  Failed to load users: {error}
                </td>
              </tr>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="user-name">{user.full_name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className="role-badge">
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span className="status-badge status-active">
                      Registered
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="empty-table">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="admin-table-footer">
        Showing {filteredUsers.length} of {users.length} users
      </div>
    </div>
  );
}

export default UsersTable;
