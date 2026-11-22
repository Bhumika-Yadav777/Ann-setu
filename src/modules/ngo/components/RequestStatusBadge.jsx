
function RequestStatusBadge({ status }) {
  const statusColors = {
    pending: "#f59e0b",
    approved: "#16a34a",
    rejected: "#dc2626",
    cancelled: "#64748b",
    completed: "#2563eb"
  };

  const color = statusColors[status] || "#64748b";

  const label = status
    ? status.charAt(0).toUpperCase() + status.slice(1)
    : "Unknown";

  return (
    <span
      style={{
        color: color,
        backgroundColor: `${color}20`,
        padding: "6px 12px",
        borderRadius: "20px",
        fontSize: "13px",
        fontWeight: "600"
      }}
    >
      {label}
    </span>
  );
}

export default RequestStatusBadge;
