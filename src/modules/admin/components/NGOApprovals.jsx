
import { useEffect, useState } from "react";
import { Search, Check, X } from "lucide-react";
import { supabase } from "../../../services/supabaseClient";

function NGOApprovals() {
  const [ngos, setNgos] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  // Fetch NGO verification records
  const fetchNGOs = async () => {
    setLoading(true);
    setError("");

    const { data: ngoData, error: ngoError } = await supabase
      .from("ngo_verifications")
      .select(`
        id,
        user_id,
        ngo_name,
        registration_number,
        address,
        city,
        state,
        status
      `)
      .order("created_at", { ascending: false });

    if (ngoError) {
      console.error("NGO fetch failed:", ngoError.message);
      setError(ngoError.message);
      setLoading(false);
      return;
    }

    // Fetch corresponding profile emails
    const userIds = [
      ...new Set(ngoData.map((ngo) => ngo.user_id))
    ];

    let emailMap = {};

    if (userIds.length > 0) {
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("id, email")
        .in("id", userIds);

      if (profileError) {
        console.error("Profile fetch failed:", profileError.message);
        setError(profileError.message);
        setLoading(false);
        return;
      }

      emailMap = Object.fromEntries(
        profiles.map((profile) => [profile.id, profile.email])
      );
    }

    const formattedNGOs = ngoData.map((ngo) => ({
      id: ngo.id,
      name: ngo.ngo_name,
      email: emailMap[ngo.user_id] || "Email unavailable",
      location: [ngo.city, ngo.state].filter(Boolean).join(", ") ||
        ngo.address || "Not provided",
      status: ngo.status,
      registrationNumber: ngo.registration_number
    }));

    setNgos(formattedNGOs);
    setLoading(false);
  };

  useEffect(() => {
    fetchNGOs();
  }, []);

  // Update NGO verification status in Supabase
  const updateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    setError("");

    const { error: updateError } = await supabase
      .from("ngo_verifications")
      .update({ status: newStatus })
      .eq("id", id);

    if (updateError) {
      console.error("NGO status update failed:", updateError.message);
      setError(updateError.message);
    } else {
      setNgos((previousNGOs) =>
        previousNGOs.map((ngo) =>
          ngo.id === id ? { ...ngo, status: newStatus } : ngo
        )
      );
    }

    setUpdatingId(null);
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
      case "approved":
        return "status-active";
      case "pending":
        return "status-pending";
      case "rejected":
        return "status-expired";
      default:
        return "";
    }
  };

  const formatStatus = (status) =>
    status.charAt(0).toUpperCase() + status.slice(1);

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
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {error && (
        <p className="empty-table">
          Error: {error}
        </p>
      )}

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
            {loading ? (
              <tr>
                <td colSpan="5" className="empty-table">
                  Loading NGOs...
                </td>
              </tr>
            ) : filteredNGOs.length > 0 ? (
              filteredNGOs.map((ngo) => (
                <tr key={ngo.id}>
                  <td className="user-name">{ngo.name}</td>
                  <td>{ngo.email}</td>
                  <td>{ngo.location}</td>
                  <td>
                    <span
                      className={`status-badge ${getStatusClass(ngo.status)}`}
                    >
                      {formatStatus(ngo.status)}
                    </span>
                  </td>
                  <td>
                    {ngo.status === "pending" ? (
                      <div className="ngo-action-buttons">
                        <button
                          className="ngo-approve-btn"
                          onClick={() => updateStatus(ngo.id, "approved")}
                          disabled={updatingId === ngo.id}
                          title="Approve NGO"
                        >
                          <Check size={16} />
                          {updatingId === ngo.id ? "Updating..." : "Approve"}
                        </button>

                        <button
                          className="ngo-reject-btn"
                          onClick={() => updateStatus(ngo.id, "rejected")}
                          disabled={updatingId === ngo.id}
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
