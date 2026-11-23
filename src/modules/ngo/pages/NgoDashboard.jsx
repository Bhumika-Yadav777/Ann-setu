
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAvailableDonations,
  getMyRequests
} from "../services/ngoService";

import "../styles/ngo.css";

function NgoDashboard() {
  const [donationCount, setDonationCount] = useState(0);
  const [requestCount, setRequestCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [recentRequests, setRecentRequests] = useState([]);
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
          requests.filter((r) => r.status === "pending").length
        );

        setApprovedCount(
          requests.filter((r) => r.status === "approved").length
        );

        setRecentRequests(requests.slice(0, 3));
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="ngo-dashboard-loading">
        <span>🌿</span>
        <h2>Preparing your dashboard...</h2>
        <p>Bringing your community impact together.</p>
      </div>
    );
  }

  return (
    <main className="ngo-dashboard-page">

      {/* Welcome Banner */}
      <section className="ngo-welcome-banner">
        <div className="ngo-welcome-content">
          <span className="ngo-welcome-tag">
            🌿 NGO COMMUNITY PORTAL
          </span>

          <h1>
            Welcome to <span>Ann-Setu!</span>
          </h1>

          <p>
            Together, we can connect surplus food with people
            who need it. Every donation makes a difference.
          </p>

          <Link
            to="/ngo-dashboard/donations"
            className="ngo-welcome-button"
          >
            Explore Donations <span>→</span>
          </Link>
        </div>

        <div className="ngo-welcome-illustration">
          <div className="ngo-illustration-circle">
            <span>🥗</span>
          </div>
          <span className="ngo-floating-leaf leaf-one">🌿</span>
          <span className="ngo-floating-leaf leaf-two">🍃</span>
          <span className="ngo-floating-heart">♥</span>
        </div>
      </section>

      {/* Dashboard Heading */}
      <section className="ngo-dashboard-heading">
        <div>
          <span className="ngo-section-label">YOUR OVERVIEW</span>
          <h2>Dashboard Overview</h2>
          <p>Here is what's happening in your food-sharing community.</p>
        </div>
      </section>

      {/* Statistics */}
      <section className="ngo-stats-grid">

        <article className="ngo-stat-card stat-green">
          <div className="ngo-stat-top">
            <span className="ngo-stat-icon">🥗</span>
            <span className="ngo-stat-caption">Food available</span>
          </div>
          <h3>{donationCount}</h3>
          <p>Available Donations</p>
        </article>

        <article className="ngo-stat-card stat-orange">
          <div className="ngo-stat-top">
            <span className="ngo-stat-icon">📋</span>
            <span className="ngo-stat-caption">Your activity</span>
          </div>
          <h3>{requestCount}</h3>
          <p>Total Requests</p>
        </article>

        <article className="ngo-stat-card stat-yellow">
          <div className="ngo-stat-top">
            <span className="ngo-stat-icon">⏳</span>
            <span className="ngo-stat-caption">Awaiting response</span>
          </div>
          <h3>{pendingCount}</h3>
          <p>Pending Requests</p>
        </article>

        <article className="ngo-stat-card stat-blue">
          <div className="ngo-stat-top">
            <span className="ngo-stat-icon">✓</span>
            <span className="ngo-stat-caption">Accepted</span>
          </div>
          <h3>{approvedCount}</h3>
          <p>Approved Requests</p>
        </article>

      </section>

      {/* Quick Actions */}
      <section className="ngo-quick-section">
        <div className="ngo-section-heading">
          <div>
            <span className="ngo-section-label">GET STARTED</span>
            <h2>Quick Actions</h2>
          </div>
        </div>

        <div className="ngo-quick-grid">

          <Link
            to="/ngo-dashboard/donations"
            className="ngo-action-card"
          >
            <span className="ngo-action-icon">🍱</span>
            <div>
              <h3>Find Food Donations</h3>
              <p>Discover food shared by generous donors.</p>
            </div>
            <span className="ngo-action-arrow">→</span>
          </Link>

          <Link
            to="/ngo-dashboard/map"
            className="ngo-action-card"
          >
            <span className="ngo-action-icon">📍</span>
            <div>
              <h3>Explore Donation Map</h3>
              <p>Find donation pickup locations.</p>
            </div>
            <span className="ngo-action-arrow">→</span>
          </Link>

          <Link
            to="/ngo-dashboard/requests"
            className="ngo-action-card"
          >
            <span className="ngo-action-icon">🤝</span>
            <div>
              <h3>Manage My Requests</h3>
              <p>Check your food request status.</p>
            </div>
            <span className="ngo-action-arrow">→</span>
          </Link>

        </div>
      </section>

      {/* Recent Requests */}
      <section className="ngo-recent-section">
        <div className="ngo-section-heading">
          <div>
            <span className="ngo-section-label">STAY UPDATED</span>
            <h2>Recent Requests</h2>
          </div>

          <Link
            to="/ngo-dashboard/requests"
            className="ngo-view-all"
          >
            View All →
          </Link>
        </div>

        {recentRequests.length === 0 ? (
          <div className="ngo-empty-requests">
            <span>📦</span>
            <h3>No requests yet</h3>
            <p>
              Your food requests will appear here once you
              request a donation.
            </p>
            <Link to="/ngo-dashboard/donations">
              Explore Donations →
            </Link>
          </div>
        ) : (
          <div className="ngo-recent-list">
            {recentRequests.map((request) => (
              <article className="ngo-recent-item" key={request.id}>
                <div className="ngo-recent-food-icon">🍽️</div>

                <div className="ngo-recent-details">
                  <h3>
                    {request.donation?.food_name || "Food Donation"}
                  </h3>
                  <p>
                    {request.donation?.category || "Food request"}
                    {" · "}
                    {request.created_at
                      ? new Date(request.created_at).toLocaleDateString("en-IN")
                      : "Date unavailable"}
                  </p>
                </div>

                <span
                  className={`ngo-request-status status-${request.status || "unknown"}`}
                >
                  {request.status || "Unknown"}
                </span>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Community Message */}
      <section className="ngo-impact-banner">
        <div className="ngo-impact-icon">💚</div>
        <div>
          <h2>Every Meal Matters. Every Connection Counts.</h2>
          <p>
            Your efforts help build a community where good food
            reaches people instead of going to waste.
          </p>
        </div>
      </section>

    </main>
  );
}

export default NgoDashboard;
