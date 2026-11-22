
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getDonationById,
  createFoodRequest
} from "../services/ngoService";

function DonationDetails() {
  const { id } = useParams();

  const [donation, setDonation] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadDonation() {
      try {
        const data = await getDonationById(id);
        setDonation(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadDonation();
  }, [id]);

  async function handleRequest() {
    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      await createFoodRequest(id, message);

      setSuccess("Your food request was submitted!");
      setMessage("");

    } catch (err) {
      setError(err.message);

    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p>Loading donation...</p>;

  if (!donation) {
    return <p>{error || "Donation not found."}</p>;
  }

  return (
    <section className="donation-details">

      <h1>{donation.food_name}</h1>

      {donation.food_image_url && (
        <img
          src={donation.food_image_url}
          alt={donation.food_name}
          className="details-image"
        />
      )}

      <p>Category: {donation.category}</p>

      <p>
        Quantity: {donation.quantity}{" "}
        {donation.quantity_unit}
      </p>

      <p>Description: {donation.description}</p>

      <p>Pickup: {donation.pickup_location}</p>

      <p>Packaging: {donation.packaging_status}</p>

      <h3>Request this food</h3>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write a message to the donor (optional)"
      />

      <button
        onClick={handleRequest}
        disabled={
          submitting || donation.status !== "available"
        }
      >
        {submitting ? "Submitting..." : "Request Food"}
      </button>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

    </section>
  );
}

export default DonationDetails;
