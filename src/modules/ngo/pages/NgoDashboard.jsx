
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getAvailableDonations,
  getMyRequests
} from "../services/ngoService";

function NgoDashboard() {
  const [donationCount, setDonationCount] = useState(0);
  const [requestCount, setRequestCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [donations, requests] = await Promise.all([
          getAvailableDonations(),
          getMyRequests()
        ]);

        setDonationCount(donations.length);
        setRequestCount(requests.length);

        setPendingCount(
          requests.filter(
            (request) => request.status === "pending"
          ).length
        );

      } catch (error) {
        console.error("Dashboard error:", error);

      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <section>
      <h1>NGO Dashboard</h1>
      <p>Welcome to Food Connect!</p>

      <div className="ngo-stats">

        <div className="stat-card">
          <h3>Available Donations</h3>
          <p>{donationCount}</p>
        </div>

        <div className="stat-card">
          <h3>Total Requests</h3>
          <p>{requestCount}</p>
        </div>

        <div className="stat-card">
          <h3>Pending Requests</h3>
          <p>{pendingCount}</p>
        </div>

      </div>

      <Link to="/ngo/donations">
        Explore Available Food
      </Link>

      <br />

      <Link to="/ngo/requests">
        View My Requests
      </Link>
    </section>
  );
}

export default NgoDashboard;
