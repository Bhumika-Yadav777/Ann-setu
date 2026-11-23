
function StatsCard({ title, value, description, icon: Icon, color }) {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-info">
        <p>{title}</p>
        <h2>{value}</h2>
        <span>{description}</span>
      </div>

      <div
        className="admin-stat-icon"
        style={{
          backgroundColor: color + "18",
          color: color
        }}
      >
        <Icon size={23} />
      </div>
    </div>
  );
}

export default StatsCard;
