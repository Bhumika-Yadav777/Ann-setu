
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  getMyRequests,
  cancelFoodRequest,
} from "../services/ngoService";

import RequestStatusBadge from "../components/RequestStatusBadge";
import "../styles/my-requests.css";

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadRequests() {
    try {
      setLoading(true);
      setError("");

      const data = await getMyRequests();
      setRequests(data || []);
    } catch (err) {
      setError(err.message || "Unable to load your requests.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(requestId) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this food request?"
    );

    if (!confirmed) return;

    try {
      setError("");
      await cancelFoodRequest(requestId);
      await loadRequests();
    } catch (err) {
      setError(err.message || "Unable to cancel this request.");
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  const counts = useMemo(
    () => ({
      total: requests.length,
      pending: requests.filter((r) => r.status === "pending").length,
      approved: requests.filter((r) => r.status === "approved").length,
      completed: requests.filter((r) => r.status === "completed").length,
    }),
    [requests]
  );

  if (loading) {
    return (
      <main className="requests-loading">
        <div className="requests-loading-icon">🌿</div>
        <h2>Loading your requests...</h2>
        <p>Getting your community contributions ready.</p>
      </main>
    );
  }

  return (
    <main className="my-requests-page">
      <header className="requests-header">
        <Link to="/ngo-dashboard" className="requests-brand">
          <span className="requests-brand-icon">🌿</span>
          <span>Ann-Setu</span>
        </Link>

        <nav className="requests-navigation">
          <Link to="/ngo-dashboard">Dashboard</Link>
          <Link to="/ngo-dashboard/donations">Discover Food</Link>
          <Link to="/ngo-dashboard/map">Donation Map</Link>
          <span className="requests-nav-active">My Requests</span>
        </nav>
      </header>

      <section className="requests-hero">
        <div className="requests-hero-content">
          <span className="requests-eyebrow">
            YOUR COMMUNITY JOURNEY
          </span>

          <h1>
            My Food
            <br />
            <span>Requests.</span>
          </h1>

          <p>
            Keep track of the food donations you have requested.
            Every connection brings us closer to a world with less
            food waste and more care.
          </p>

          <Link
            to="/ngo-dashboard/donations"
            className="requests-explore-button"
          >
            Explore Donations <span>→</span>
          </Link>
        </div>

        <div className="requests-hero-art" aria-hidden="true">
          <div className="requests-art-circle">
            <span>🥗</span>
          </div>
          <div className="requests-art-leaf leaf-one">🌿</div>
          <div className="requests-art-leaf leaf-two">🍃</div>
          <div className="requests-art-note">
            <span>♥</span>
            Every meal matters
          </div>
        </div>
      </section>

      <section className="requests-summary">
        <div className="requests-summary-card">
          <span className="summary-icon">📋</span>
          <div>
            <strong>{counts.total}</strong>
            <p>Total Requests</p>
          </div>
        </div>

        <div className="requests-summary-card">
          <span className="summary-icon pending-icon">⏳</span>
          <div>
            <strong>{counts.pending}</strong>
            <p>Pending</p>
          </div>
        </div>

        <div className="requests-summary-card">
          <span className="summary-icon approved-icon">✓</span>
          <div>
            <strong>{counts.approved}</strong>
            <p>Approved</p>
          </div>
        </div>

        <div className="requests-summary-card">
          <span className="summary-icon completed-icon">🌱</span>
          <div>
            <strong>{counts.completed}</strong>
            <p>Completed</p>
          </div>
        </div>
      </section>

      <section className="requests-content">
        <div className="requests-section-heading">
          <div>
            <span className="requests-eyebrow">YOUR ACTIVITY</span>
            <h2>Request History</h2>
            <p>All your food donation requests in one place.</p>
          </div>

          <button
            type="button"
            className="requests-refresh-button"
            onClick={loadRequests}
          >
            ↻ Refresh
          </button>
        </div>

        {error && (
          <div className="requests-error">
            <span>{error}</span>
            <button type="button" onClick={loadRequests}>
              Try again
            </button>
          </div>
        )}

        {requests.length === 0 ? (
          <div className="requests-empty-state">
            <div className="empty-illustration">
              <span>🥬</span>
              <span>🍎</span>
              <span>🥖</span>
            </div>

            <span className="requests-eyebrow">
              A NEW JOURNEY BEGINS
            </span>

            <h3>No food requests yet</h3>

            <p>
              You haven't requested any food donations yet.
              Explore available donations and connect with food donors
              in your community.
            </p>

            <Link
              to="/ngo-dashboard/donations"
              className="requests-empty-button"
            >
              Find Food Donations <span>→</span>
            </Link>
          </div>
        ) : (
          <div className="requests-list">
            {requests.map((request) => (
              <article className="request-card" key={request.id}>
                <div className="request-card-top">
                  <div className="request-food-icon">🥗</div>

                  <div className="request-food-heading">
                    <span className="request-card-label">
                      FOOD DONATION
                    </span>

                    <h3>
                      {request.donation?.food_name || "Food Donation"}
                    </h3>

                    <p>
                      {request.donation?.category
                        ?.replaceAll("_", " ") || "Food category"}
                    </p>
                  </div>

                  <RequestStatusBadge status={request.status} />
                </div>

                <div className="request-card-details">
                  <div>
                    <span>QUANTITY</span>
                    <strong>
                      {request.donation?.quantity ?? "Not specified"}{" "}
                      {request.donation?.quantity_unit || ""}
                    </strong>
                  </div>

                  <div>
                    <span>REQUESTED ON</span>
                    <strong>
                      {request.created_at
                        ? new Date(request.created_at).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "Date unavailable"}
                    </strong>
                  </div>
                </div>

                {request.donation?.pickup_location && (
                  <p className="request-location">
                    <span>📍</span>
                    {request.donation.pickup_location}
                  </p>
                )}

                {request.message && (
                  <div className="request-message">
                    <span>Your message</span>
                    <p>{request.message}</p>
                  </div>
                )}

                <div className="request-card-footer">
                  <span className="request-thank-you">
                    ♥ Thank you for making a difference
                  </span>

                  {request.status === "pending" && (
                    <button
                      type="button"
                      className="request-cancel-button"
                      onClick={() => handleCancel(request.id)}
                    >
                      Cancel Request
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="requests-footer">
        <strong>🌿 Ann-Setu</strong>
        <p>Connecting surplus food with communities that need it.</p>
        <span>Made with care ♥</span>
      </footer>
    </main>
  );
}

export default MyRequests;
