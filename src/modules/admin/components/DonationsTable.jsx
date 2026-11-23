
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { supabase } from "../../../services/supabaseClient";

function DonationsTable() {
  const [donations, setDonations] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDonations = async () => {
      setLoading(true);
      setError("");

      // Fetch all donations
      const { data: donationData, error: donationError } =
        await supabase
          .from("food_donations")
          .select("*")
          .order("created_at", { ascending: false });

      if (donationError) {
        console.error("Donation fetch failed:", donationError.message);
        setError(donationError.message);
        setLoading(false);
        return;
      }

      // Collect unique donor IDs
      const donorIds = [
        ...new Set(donationData.map((item) => item.donor_id))
      ];

      // Fetch donor profiles separately
      let donorMap = {};

      if (donorIds.length > 0) {
        const { data: profiles, error: profileError } =
          await supabase
            .from("profiles")
            .select("id, full_name")
            .in("id", donorIds);

        if (profileError) {
          console.error("Donor fetch failed:", profileError.message);
          setError(profileError.message);
          setLoading(false);
          return;
        }

        donorMap = Object.fromEntries(
          profiles.map((profile) => [
            profile.id,
            profile.full_name
          ])
        );
      }

      // Combine donation and donor information
      const formattedDonations = donationData.map((item) => ({
        id: item.id,
        food: item.food_name,
        donor: donorMap[item.donor_id] || "Unknown donor",
        quantity: `${item.quantity} ${item.quantity_unit}`,
        category: item.category,
        status: item.status
      }));

      setDonations(formattedDonations);
      setLoading(false);
    };

    fetchDonations();
  }, []);

  const filteredDonations = donations.filter((donation) => {
    const matchesSearch =
      donation.food.toLowerCase().includes(search.toLowerCase()) ||
      donation.donor.toLowerCase().includes(search.toLowerCase()) ||
      donation.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || donation.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "available":
        return "status-active";
      case "completed":
        return "status-completed";
      case "requested":
        return "status-requested";
      case "expired":
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
          <h2>All Donations</h2>
          <p>Monitor food donations submitted by registered donors.</p>
        </div>

        <div className="admin-table-filters">
          <div className="admin-search">
            <Search size={17} />
            <input
              type="text"
              placeholder="Search donations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="available">Available</option>
            <option value="requested">Requested</option>
            <option value="completed">Completed</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      <div className="admin-table-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Donation ID</th>
              <th>Food Item</th>
              <th>Donor</th>
              <th>Quantity</th>
              <th>Category</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="empty-table">
                  Loading donations...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="6" className="empty-table">
                  Failed to load donations: {error}
                </td>
              </tr>
            ) : filteredDonations.length > 0 ? (
              filteredDonations.map((donation) => (
                <tr key={donation.id}>
                  <td className="user-name">{donation.id}</td>
                  <td className="user-name">{donation.food}</td>
                  <td>{donation.donor}</td>
                  <td>{donation.quantity}</td>
                  <td>{donation.category}</td>
                  <td>
                    <span
                      className={`status-badge ${getStatusClass(
                        donation.status
                      )}`}
                    >
                      {formatStatus(donation.status)}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="empty-table">
                  No donations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="admin-table-footer">
        Showing {filteredDonations.length} of {donations.length} donations
      </div>
    </div>
  );
}

export default DonationsTable;
