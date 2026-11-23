
import { useState } from "react";
import { Search, Check, X } from "lucide-react";

const initialNGOs = [
  {
    id: 1,
    name: "Helping Hands Foundation",
    email: "helpinghands@gmail.com",
    location: "Bhopal",
    status: "Pending"
  },
  {
    id: 2,
    name: "Green Earth Foundation",
    email: "greenearth@gmail.com",
    location: "Indore",
    status: "Pending"
  },
  {
    id: 3,
    name: "Hope Welfare Society",
    email: "hopewelfare@gmail.com",
    location: "Delhi",
    status: "Approved"
  },
  {
    id: 4,
    name: "Food For All NGO",
    email: "foodforall@gmail.com",
    location: "Mumbai",
    status: "Rejected"
  }
];

function NGOApprovals() {
  const [ngos, setNgos] = useState(initialNGOs);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const updateStatus = (id, newStatus) => {
    setNgos((previousNGOs) =>
      previousNGOs.map((ngo) =>
        ngo.id === id ? { ...ngo, status: newStatus } : ngo
      )
    );
  };

  const filteredNGOs = ngos.filter((ngo) => {
    const matchesSearch =
      ngo.name.toLowerCase().includes(search.toLowerCase()) ||
      ngo.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || ngo.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case "Approved":
        return "status-active";
      case "Pending":
        return "status-pending";
      case "Rejected":
        return "status-expired";
      default:
        return "";
    }
  };

  return (
    <div className="admin-table-container">
      <div className="admin-table-toolbar">
        <div>
          <h2>NGO Verification</h2>
          <p>Review NGO registrations and manage their approval status.</p>
        </div>

        <div className="admin-table-filters">
          <div className="admin-search">
            <Search size={17} />
            <input
              type="text"
              placeholder="Search NGOs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="admin-table-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              <th>NGO Name</th>
              <th>Email</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredNGOs.length > 0 ? (
              filteredNGOs.map((ngo) => (
                <tr key={ngo.id}>
                  <td className="user-name">{ngo.name}</td>
                  <td>{ngo.email}</td>
                  <td>{ngo.location}</td>
                  <td>
                    <span
                      className={`status-badge ${getStatusClass(ngo.status)}`}
                    >
                      {ngo.status}
                    </span>
                  </td>
                  <td>
                    {ngo.status === "Pending" ? (
                      <div className="ngo-action-buttons">
                        <button
                          className="ngo-approve-btn"
                          onClick={() => updateStatus(ngo.id, "Approved")}
                          title="Approve NGO"
                        >
                          <Check size={16} />
                          Approve
                        </button>

                        <button
                          className="ngo-reject-btn"
                          onClick={() => updateStatus(ngo.id, "Rejected")}
                          title="Reject NGO"
                        >
                          <X size={16} />
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="ngo-action-done">
                        No action required
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty-table">
                  No NGOs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="admin-table-footer">
        Showing {filteredNGOs.length} of {ngos.length} NGOs
      </div>
    </div>
  );
}

export default NGOApprovals;
