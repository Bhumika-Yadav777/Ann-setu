
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../../services/supabaseClient";

import {
  Search,
  Check,
  X,
  RefreshCw,
  Building2,
  AlertCircle
} from "lucide-react";

function NGOApprovals() {
  const [ngos, setNgos] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  const [selectedNGO, setSelectedNGO] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const fetchNGOs = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);

    const { data, error } = await supabase
      .from("ngo_verifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("NGO fetch error:", error);
      setError("Unable to load NGO applications. Please check admin permissions.");
      setNgos([]);
    } else {
      setError("");
      setNgos(data || []);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchNGOs(false);
  }, [fetchNGOs]);

  // Approve NGO
  const approveNGO = async (ngo) => {
    const confirmed = window.confirm(
      `Are you sure you want to approve ${ngo.ngo_name}?`
    );

    if (!confirmed) return;

    setActionLoading(ngo.id);
    setError("");

    const { error } = await supabase
      .from("ngo_verifications")
      .update({
        status: "approved",
        rejection_reason: null,
        updated_at: new Date().toISOString()
      })
      .eq("id", ngo.id);

    if (error) {
      console.error("Approval error:", error);
      setError("Unable to approve this NGO. Please try again.");
    } else {
      await fetchNGOs(false);
    }

    setActionLoading(null);
  };

  // Reject NGO
  const rejectNGO = async () => {
    if (!rejectionReason.trim()) {
      setError("Please enter a reason for rejection.");
      return;
    }

    setActionLoading(selectedNGO.id);
    setError("");

    const { error } = await supabase
      .from("ngo_verifications")
      .update({
        status: "rejected",
        rejection_reason: rejectionReason.trim(),
        updated_at: new Date().toISOString()
      })
      .eq("id", selectedNGO.id);

    if (error) {
      console.error("Rejection error:", error);
      setError("Unable to reject this NGO. Please try again.");
    } else {
      setSelectedNGO(null);
      setRejectionReason("");
      await fetchNGOs(false);
    }

    setActionLoading(null);
  };

  // Search and filter
  const filteredNGOs = ngos.filter((ngo) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      ngo.ngo_name?.toLowerCase().includes(searchText) ||
      ngo.registration_number?.toLowerCase().includes(searchText) ||
      ngo.city?.toLowerCase().includes(searchText) ||
      ngo.contact_person?.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      ngo.status === statusFilter;

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

  return (
    <div className="admin-table-container">

      {/* Header */}
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

          <button
            type="button"
            onClick={() => fetchNGOs()}
            title="Refresh applications"
            disabled={loading}
          >
            <RefreshCw size={17} />
          </button>
        </div>
      </div>

      {/* Error */}
      {error && !selectedNGO && (
        <p style={modalStyles.pageError}>{error}</p>
      )}

      {/* Table */}
      <div className="admin-table-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              <th>NGO Name</th>
              <th>Registration Number</th>
              <th>Location</th>
              <th>Contact Person</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="empty-table">
                  Loading NGO applications...
                </td>
              </tr>
            ) : filteredNGOs.length > 0 ? (
              filteredNGOs.map((ngo) => (
                <tr key={ngo.id}>
                  <td className="user-name">{ngo.ngo_name}</td>

                  <td>{ngo.registration_number}</td>

                  <td>{ngo.city}, {ngo.state}</td>

                  <td>
                    {ngo.contact_person}
                    <br />
                    <small>{ngo.contact_phone}</small>
                  </td>

                  <td>
                    <span className={`status-badge ${getStatusClass(ngo.status)}`}>
                      {ngo.status}
                    </span>
                  </td>

                  <td>
                    {ngo.status === "pending" ? (
                      <div className="ngo-action-buttons">
                        <button
                          className="ngo-approve-btn"
                          onClick={() => approveNGO(ngo)}
                          disabled={actionLoading === ngo.id}
                        >
                          <Check size={16} />
                          Approve
                        </button>

                        <button
                          className="ngo-reject-btn"
                          onClick={() => {
                            setSelectedNGO(ngo);
                            setRejectionReason("");
                            setError("");
                          }}
                          disabled={actionLoading === ngo.id}
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
                <td colSpan="6" className="empty-table">
                  No NGO applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="admin-table-footer">
        Showing {filteredNGOs.length} of {ngos.length} applications
      </div>

      {/* Rejection Modal */}
      {selectedNGO && (
        <div
          style={modalStyles.overlay}
          onClick={(e) => {
            if (
              e.target === e.currentTarget &&
              actionLoading !== selectedNGO.id
            ) {
              setSelectedNGO(null);
              setError("");
            }
          }}
        >
          <div
            style={modalStyles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="reject-modal-title"
          >

            {/* Modal Icon */}
            <div style={modalStyles.icon}>
              <Building2 size={28} />
            </div>

            {/* Modal Heading */}
            <h2
              id="reject-modal-title"
              style={modalStyles.heading}
            >
              Reject NGO Application
            </h2>

            <p style={modalStyles.description}>
              You are about to reject the verification application of:
            </p>

            {/* Selected NGO */}
            <div style={modalStyles.ngoInfo}>
              <strong>{selectedNGO.ngo_name}</strong>
              <span>
                {selectedNGO.city}, {selectedNGO.state}
              </span>
            </div>

            {/* Rejection Reason */}
            <label style={modalStyles.label}>
              Reason for rejection <span>*</span>
            </label>

            <textarea
              value={rejectionReason}
              onChange={(e) => {
                setRejectionReason(e.target.value);
                setError("");
              }}
              placeholder="Please explain why this NGO application is being rejected..."
              rows="4"
              style={modalStyles.textarea}
            />

            {error && (
              <div style={modalStyles.error}>
                <AlertCircle size={17} />
                {error}
              </div>
            )}

            {/* Modal Buttons */}
            <div style={modalStyles.buttons}>
              <button
                type="button"
                onClick={() => {
                  setSelectedNGO(null);
                  setError("");
                }}
                style={modalStyles.cancel}
                disabled={actionLoading === selectedNGO.id}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={rejectNGO}
                style={modalStyles.reject}
                disabled={actionLoading === selectedNGO.id}
              >
                <X size={16} />
                {actionLoading === selectedNGO.id
                  ? "Processing..."
                  : "Confirm Rejection"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

const modalStyles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 35, 25, 0.62)",
    backdropFilter: "blur(5px)",
    WebkitBackdropFilter: "blur(5px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    zIndex: 9999
  },

  modal: {
    width: "100%",
    maxWidth: "510px",
    background: "#ffffff",
    padding: "35px",
    borderRadius: "20px",
    boxSizing: "border-box",
    color: "#24352d",
    fontFamily: "Arial, sans-serif",
    boxShadow: "0 25px 70px rgba(0,0,0,0.22)",
    border: "1px solid #e5ece5"
  },

  icon: {
    width: "58px",
    height: "58px",
    borderRadius: "16px",
    background: "#fff0ee",
    color: "#b83232",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "22px"
  },

  heading: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#193f30",
    margin: "0 0 12px",
    letterSpacing: "-0.5px"
  },

  description: {
    fontSize: "14px",
    color: "#718078",
    lineHeight: 1.7,
    margin: "0 0 18px"
  },

  ngoInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    padding: "15px 17px",
    background: "#f0f7f1",
    border: "1px solid #dcecdf",
    borderRadius: "11px",
    marginBottom: "24px",
    color: "#193f30",
    fontSize: "14px"
  },

  label: {
    display: "block",
    marginBottom: "10px",
    fontWeight: 700,
    fontSize: "14px",
    color: "#294b3b"
  },

  textarea: {
    display: "block",
    width: "100%",
    minHeight: "125px",
    padding: "14px",
    border: "1px solid #dce5df",
    borderRadius: "10px",
    resize: "vertical",
    fontFamily: "Arial, sans-serif",
    fontSize: "14px",
    lineHeight: 1.6,
    color: "#24352d",
    background: "#fbfcfa",
    outline: "none",
    boxSizing: "border-box"
  },

  error: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#b83232",
    background: "#fff0ee",
    border: "1px solid #f4d0cb",
    borderRadius: "8px",
    padding: "11px",
    marginTop: "12px",
    fontSize: "13px"
  },

  pageError: {
    color: "#b83232",
    background: "#fff0ee",
    border: "1px solid #f4d0cb",
    padding: "12px",
    borderRadius: "8px",
    margin: "15px 0"
  },

  buttons: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "12px",
    marginTop: "28px",
    flexWrap: "wrap"
  },

  cancel: {
    padding: "12px 22px",
    border: "1px solid #dce5df",
    background: "#ffffff",
    color: "#496052",
    borderRadius: "9px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600
  },

  reject: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    padding: "12px 20px",
    border: "none",
    background: "#b83232",
    color: "#ffffff",
    borderRadius: "9px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 700
  }
};

export default NGOApprovals;
