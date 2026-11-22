
import { useEffect, useState } from "react";
import { getAvailableDonations } from "../services/ngoService";
import DonationCard from "../components/DonationCard";

function AvailableDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDonations() {
    try {
      setLoading(true);
      setError("");

      const data = await getAvailableDonations();
      setDonations(data);

    } catch (err) {
      setError(err.message);

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDonations();
  }, []);

  if (loading) return <p>Loading donations...</p>;

  return (
    <section>
      <h1>Available Food Donations</h1>

      {error && <p className="error-message">{error}</p>}

      <button onClick={loadDonations}>
        Refresh
      </button>

      {donations.length === 0 ? (
        <p>No available donations right now.</p>
      ) : (
        <div className="donation-grid">
          {donations.map((donation) => (
            <DonationCard
              key={donation.id}
              donation={donation}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default AvailableDonations;
