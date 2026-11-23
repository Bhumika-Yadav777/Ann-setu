
import { useState } from "react";
import { Search } from "lucide-react";

const sampleDonations = [
  {
    id: "DON001",
    food: "Vegetable Biryani",
    donor: "Rahul Sharma",
    quantity: "20 Plates",
    category: "Cooked Food",
    status: "Available"
  },
  {
    id: "DON002",
    food: "Fresh Apples",
    donor: "Green Restaurant",
    quantity: "10 Kg",
    category: "Fruits",
    status: "Completed"
  },
  {
    id: "DON003",
    food: "Rice and Dal",
    donor: "Priya Patel",
    quantity: "15 Plates",
    category: "Cooked Food",
    status: "Requested"
  },
  {
    id: "DON004",
    food: "Bread Packets",
    donor: "City Bakery",
    quantity: "30 Packets",
    category: "Bakery",
    status: "Available"
  },
  {
    id: "DON005",
    food: "Fresh Vegetables",
    donor: "Amit Kumar",
    quantity: "8 Kg",
    category: "Vegetables",
    status: "Expired"
  }
];

function DonationsTable() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredDonations = sampleDonations.filter((donation) => {
    const matchesSearch =
      donation.food.toLowerCase().includes(search.toLowerCase()) ||
      donation.donor.toLowerCase().includes(search.toLowerCase()) ||
      donation.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || donation.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case "Available":
        return "status-active";
      case "Completed":
        return "status-completed";
      case "Requested":
        return "status-requested";
      case "Expired":
        return "status-expired";
      default:
        return "";
    }
  };

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
            <option value="Available">Available</option>
            <option value="Requested">Requested</option>
            <option value="Completed">Completed</option>
            <option value="Expired">Expired</option>
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
            {filteredDonations.length > 0 ? (
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
                      {donation.status}
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
        Showing {filteredDonations.length} of {sampleDonations.length} donations
      </div>
    </div>
  );
}

export default DonationsTable;
