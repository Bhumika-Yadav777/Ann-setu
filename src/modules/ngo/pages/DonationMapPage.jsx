
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import DonationMap from "../components/DonationMap";
import { getAvailableDonations } from "../services/ngoService";

import "../styles/donation-map.css";

function hasValidCoordinates(donation) {
  const lat = Number(donation.latitude);
  const lng = Number(donation.longitude);

  return (
    donation.latitude !== null &&
    donation.latitude !== undefined &&
    donation.latitude !== "" &&
    donation.longitude !== null &&
    donation.longitude !== undefined &&
    donation.longitude !== "" &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

function DonationMapPage() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedDonation, setSelectedDonation] = useState(null);

  async function loadDonations() {
    try {
      setLoading(true);
      setError("");

      const data = await getAvailableDonations();
      setDonations(data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to load donation locations.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDonations();
  }, []);

  const mappedDonations = useMemo(
    () => donations.filter(hasValidCoordinates),
    [donations]
  );

  const filteredDonations = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return donations;

    return donations.filter((donation) =>
      [
        donation.food_name,
        donation.category,
        donation.pickup_location,
        donation.description,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term))
    );
  }, [donations, search]);

  function handleSelectDonation(donation) {
    setSelectedDonation(donation);

    if (hasValidCoordinates(donation)) {
      // The map component receives the selected donation below.
      setSelectedDonation(donation);
    }
  }

  return (
    <main className="ann-map-page">
      <header className="ann-map-header">
        <Link to="/ngo-dashboard" className="ann-map-brand">
          <span className="ann-map-brand-icon">🌿</span>
          <span>Ann-Setu</span>
        </Link>

        <nav className="ann-map-nav">
          <Link to="/ngo-dashboard">Dashboard</Link>
          <Link to="/ngo-dashboard/donations">Discover Donations</Link>
          <Link to="/ngo-dashboard/requests">My Requests</Link>
        </nav>

        <span className="ann-map-header-tag">
          Community Food Sharing
        </span>
      </header>

      <section className="ann-map-hero">
        <div>
          <span className="ann-map-eyebrow">
            ✦ CONNECTING FOOD WITH PEOPLE
          </span>

          <h1>
            Find Food.
            <br />
            <span>Find Hope.</span>
          </h1>

          <p>
            Discover available food donations around your community
            and help good food reach the people who need it.
          </p>
        </div>

        <div className="ann-map-hero-art" aria-hidden="true">
          <span className="ann-map-art-leaf">🌿</span>
          <span className="ann-map-art-heart">♥</span>
          <span className="ann-map-art-food">🥗</span>
        </div>
      </section>

      <section className="ann-map-stats">
        <div className="ann-map-stat">
          <span className="ann-map-stat-icon">🥗</span>
          <div>
            <strong>{donations.length}</strong>
            <span>Available donations</span>
          </div>
        </div>

        <div className="ann-map-stat">
          <span className="ann-map-stat-icon">📍</span>
          <div>
            <strong>{mappedDonations.length}</strong>
            <span>Locations mapped</span>
          </div>
        </div>

        <div className="ann-map-stat">
          <span className="ann-map-stat-icon">🤝</span>
          <div>
            <strong>Share</strong>
            <span>Care for your community</span>
          </div>
        </div>
      </section>

      <section className="ann-map-workspace">
        <aside className="ann-map-sidebar">
          <div className="ann-map-sidebar-heading">
            <div>
              <span className="ann-map-eyebrow">EXPLORE NEARBY</span>
              <h2>Food Donations</h2>
              <p>Find something your community needs.</p>
            </div>

            <button
              className="ann-map-refresh"
              type="button"
              onClick={loadDonations}
              disabled={loading}
              aria-label="Refresh donations"
              title="Refresh donations"
            >
              ↻
            </button>
          </div>

          <div className="ann-map-search">
            <span>⌕</span>
            <input
              type="search"
              placeholder="Search food or location..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="ann-map-list-heading">
            <strong>Available food</strong>
            <span>{filteredDonations.length} found</span>
          </div>

          {loading ? (
            <div className="ann-map-empty">
              <span>🌱</span>
              <p>Loading donations...</p>
            </div>
          ) : error ? (
            <div className="ann-map-empty ann-map-error">
              <p>{error}</p>
              <button type="button" onClick={loadDonations}>
                Try again
              </button>
            </div>
          ) : filteredDonations.length === 0 ? (
            <div className="ann-map-empty">
              <span>🔎</span>
              <h3>No donations found</h3>
              <p>Try another food name or location.</p>
            </div>
          ) : (
            <div className="ann-map-donation-list">
              {filteredDonations.map((donation) => (
                <article
                  key={donation.id}
                  className={`ann-map-donation-card ${
                    selectedDonation?.id === donation.id
                      ? "selected"
                      : ""
                  }`}
                >
                  <button
                    type="button"
                    className="ann-map-card-select"
                    onClick={() => handleSelectDonation(donation)}
                  >
                    <div className="ann-map-food-image">
                      {donation.food_image_url ? (
                        <img
                          src={donation.food_image_url}
                          alt={donation.food_name || "Food donation"}
                        />
                      ) : (
                        <span>🥗</span>
                      )}
                    </div>

                    <div className="ann-map-food-details">
                      <h3>{donation.food_name || "Food Donation"}</h3>

                      <p className="ann-map-food-quantity">
                        {donation.quantity} {donation.quantity_unit}
                      </p>

                      <p className="ann-map-food-location">
                        📍 {donation.pickup_location || "Location not provided"}
                      </p>

                      <span
                        className={`ann-map-coordinate-status ${
                          hasValidCoordinates(donation)
                            ? "is-mapped"
                            : "not-mapped"
                        }`}
                      >
                        {hasValidCoordinates(donation)
                          ? "● On map"
                          : "○ Location coordinates needed"}
                      </span>
                    </div>
                  </button>

                  <Link
                    to={`/ngo-dashboard/donations/${donation.id}`}
                    className="ann-map-view-link"
                  >
                    View donation →
                  </Link>
                </article>
              ))}
            </div>
          )}
        </aside>

        <section className="ann-map-main">
          <div className="ann-map-main-heading">
            <div>
              <span className="ann-map-eyebrow">LIVE DONATION VIEW</span>
              <h2>Explore the Map</h2>
            </div>

            <span className="ann-map-live-label">
              <span></span>
              Interactive map
            </span>
          </div>

          <div className="ann-map-canvas">
            <DonationMap
              donations={mappedDonations}
              selectedDonation={selectedDonation}
            />

            {mappedDonations.length === 0 && (
              <div className="ann-map-overlay-message">
                <span>📍</span>
                <h3>Your community map is ready</h3>
                <p>
                  Add pickup coordinates to your donations to see
                  their exact locations here.
                </p>
                <Link to="/ngo-dashboard/donations">
                  Browse donations →
                </Link>
              </div>
            )}
          </div>

          <div className="ann-map-bottom-note">
            <span>💚</span>
            <p>
              Every donation shared brings us one step closer
              to a community without food waste.
            </p>
          </div>
        </section>
      </section>

      <footer className="ann-map-footer">
        <strong>🌿 Ann-Setu</strong>
        <span>Every Meal Matters. Every Connection Counts.</span>
      </footer>
    </main>
  );
}

export default DonationMapPage;
