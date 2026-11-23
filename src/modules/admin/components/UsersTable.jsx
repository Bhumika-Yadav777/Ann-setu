
import { useState } from "react";
import { Search } from "lucide-react";

const sampleUsers = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    role: "Donor",
    status: "Active"
  },
  {
    id: 2,
    name: "Priya Patel",
    email: "priya@gmail.com",
    role: "NGO",
    status: "Active"
  },
  {
    id: 3,
    name: "Amit Kumar",
    email: "amit@gmail.com",
    role: "Beneficiary",
    status: "Active"
  },
  {
    id: 4,
    name: "Sneha Das",
    email: "sneha@gmail.com",
    role: "Volunteer",
    status: "Active"
  },
  {
    id: 5,
    name: "Green Earth Foundation",
    email: "greenearth@gmail.com",
    role: "NGO",
    status: "Pending"
  }
];

function UsersTable() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const filteredUsers = sampleUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
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
          <p>View and manage registered platform users.</p>
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
            <option value="Donor">Donor</option>
            <option value="NGO">NGO</option>
            <option value="Beneficiary">Beneficiary</option>
            <option value="Volunteer">Volunteer</option>
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
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="user-name">{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className="role-badge">
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${
                        user.status === "Active"
                          ? "status-active"
                          : "status-pending"
                      }`}
                    >
                      {user.status}
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
        Showing {filteredUsers.length} of {sampleUsers.length} users
      </div>
    </div>
  );
}

export default UsersTable;
