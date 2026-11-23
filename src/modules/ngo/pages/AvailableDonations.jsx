
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAvailableDonations } from "../services/ngoService";
import DonationCard from "../components/DonationCard";
import "../styles/available-donations.css";

const categories = [
  { value: "cooked_meals", label: "Cooked Meals" },
  { value: "fruits", label: "Fruits" },
  { value: "vegetables", label: "Vegetables" },
  { value: "bakery", label: "Bakery Items" },
  { value: "dairy", label: "Dairy Products" },
  { value: "packaged_food", label: "Packaged Food" },
  { value: "other", label: "Other" },
];

function AvailableDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minQuantity, setMinQuantity] = useState("");
  const [quantityUnit, setQuantityUnit] = useState("");
  const [location, setLocation] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  async function loadDonations() {
    try {
      setLoading(true);
      setError("");

      const data = await getAvailableDonations();
      setDonations(data || []);
    } catch (err) {
      setError(err.message || "Unable to load donations.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDonations();
  }, []);

  function toggleCategory(value) {
    setSelectedCategories((previous) =>
      previous.includes(value)
        ? previous.filter((item) => item !== value)
        : [...previous, value]
    );
  }

  const filteredDonations = useMemo(() => {
    let results = donations.filter((donation) => {
      const searchText = search.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        donation.food_name?.toLowerCase().includes(searchText) ||
        donation.description?.toLowerCase().includes(searchText) ||
        donation.category?.toLowerCase().includes(searchText);

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(donation.category);

      const matchesLocation =
        !location.trim() ||
        donation.pickup_location
          ?.toLowerCase()
          .includes(location.trim().toLowerCase());

      const matchesQuantity =
        !minQuantity ||
        (quantityUnit &&
          donation.quantity_unit === quantityUnit &&
          Number(donation.quantity) >= Number(minQuantity));

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLocation &&
        matchesQuantity
      );
    });

    results = [...results];

    if (sortBy === "newest") {
      results.sort(
        (a, b) =>
          new Date(b.created_at || 0) -
          new Date(a.created_at || 0)
      );
    } else if (sortBy === "oldest") {
      results.sort(
        (a, b) =>
          new Date(a.created_at || 0) -
          new Date(b.created_at || 0)
      );
    } else if (sortBy === "quantity-high") {
      results.sort(
        (a, b) => Number(b.quantity) - Number(a.quantity)
      );
    } else if (sortBy === "quantity-low") {
      results.sort(
        (a, b) => Number(a.quantity) - Number(b.quantity)
      );
    }

    return results;
  }, [
    donations,
    search,
    selectedCategories,
    location,
    minQuantity,
    quantityUnit,
    sortBy,
  ]);

  function clearFilters() {
    setSearch("");
    setSelectedCategories([]);
    setMinQuantity("");
    setQuantityUnit("");
    setLocation("");
    setSortBy("newest");
  }

  if (loading) {
    return (
      <main className="ann-loading">
        <div className="ann-loading-icon">🌱</div>
        <h2>Preparing something meaningful...</h2>
        <p>Finding food donations for your community.</p>
      </main>
    );
  }

  return (
    <main className="available-donations ann-page">

      {/* NAVIGATION */}

      <header className="ann-header">
        <Link to="/ngo-dashboard" className="ann-logo">
          <span className="ann-logo-icon">🌿</span>
          <span>Ann-Setu</span>
        </Link>

        <nav className="ann-navigation">
          <Link to="/ngo-dashboard" className="ann-nav-link">
            Home
          </Link>

          <a href="#donations" className="ann-nav-link active">
            Discover
          </a>

          <Link to="/ngo-dashboard/map" className="ann-nav-link">
            Donation Map
          </Link>

          <Link
            to="/ngo-dashboard/requests"
            className="ann-nav-button"
          >
            My Requests
          </Link>
        </nav>
      </header>

      {/* HERO SECTION */}

      <section className="ann-hero">
        <div className="ann-hero-decoration ann-decoration-one"></div>
        <div className="ann-hero-decoration ann-decoration-two"></div>

        <div className="ann-hero-content">
          <span className="ann-eyebrow">
            ✦ FOOD SHARING · COMMUNITY CARE
          </span>

          <h1>
            Together, We Can
            <br />
            <span>End Food Waste.</span>
          </h1>

          <p>
            Every meal deserves a purpose. Connect surplus food
            with the communities that need it. Together, we can
            make sure good food never goes to waste.
          </p>

          <div className="ann-hero-actions">
            <a href="#donations" className="ann-primary-button">
              Explore Donations <span>→</span>
            </a>

            <Link
              to="/ngo-dashboard/map"
              className="ann-secondary-button"
            >
              ⌖ Explore Donation Map
            </Link>
          </div>

          <div className="ann-hero-note">
            <span className="ann-note-icon">♥</span>
            <span>
              Small acts of sharing create a big difference.
            </span>
          </div>
        </div>

        <div className="ann-hero-visual">
          <div className="ann-hero-image">
            <img
              src="https://images.unsplash.com/photo-1547592180-85f173990554?w=1000&auto=format&fit=crop"
              alt="Fresh and nutritious food"
            />
          </div>

          <div className="ann-floating-card">
            <span className="ann-floating-icon">🌱</span>
            <div>
              <strong>Share More</strong>
              <p>Waste Less. Care More.</p>
            </div>
          </div>

          <div className="ann-hero-circle">
            <span>FOOD</span>
            <strong>FOR ALL</strong>
          </div>
        </div>
      </section>

      {/* COMMUNITY IMPACT */}

      <section className="ann-impact-strip">
        <div className="ann-impact-item">
          <span className="ann-impact-icon">🥗</span>
          <div>
            <strong>{donations.length}</strong>
            <p>Available Donations</p>
          </div>
        </div>

        <div className="ann-impact-divider"></div>

        <div className="ann-impact-item">
          <span className="ann-impact-icon">🤝</span>
          <div>
            <strong>One Community</strong>
            <p>United Through Sharing</p>
          </div>
        </div>

        <div className="ann-impact-divider"></div>

        <div className="ann-impact-item">
          <span className="ann-impact-icon">🌍</span>
          <div>
            <strong>Less Waste</strong>
            <p>A Better Tomorrow</p>
          </div>
        </div>
      </section>

      {/* DISCOVER DONATIONS */}

      <section className="ann-discover-section" id="donations">
        <div className="ann-section-heading">
          <div>
            <span className="ann-eyebrow">
              DISCOVER · CONNECT · SHARE
            </span>

            <h2>Find Food. Make a Difference.</h2>

            <p>
              Explore available donations and connect with
              donors in your community.
            </p>
          </div>

          <div className="ann-results-count">
            <strong>{filteredDonations.length}</strong>
            <span>Donations available</span>
          </div>
        </div>

        {/* SEARCH BAR */}

        <div className="ann-search-container">
          <span className="ann-search-icon">⌕</span>

          <input
            type="search"
            placeholder="Search meals, fruits, vegetables..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setSearch(search.trim())}
          >
            Discover
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
            <button type="button" onClick={loadDonations}>
              Try again
            </button>
          </div>
        )}

        {/* FILTERS AND DONATION CARDS */}

        <div className="ann-content-layout">

          <aside className="ann-filter-panel">
            <div className="ann-filter-title">
              <div>
                <span className="ann-eyebrow">
                  REFINE YOUR SEARCH
                </span>
                <h3>Find What You Need</h3>
              </div>

              <button type="button" onClick={clearFilters}>
                Reset
              </button>
            </div>

            {/* CATEGORY FILTER */}

            <div className="ann-filter-group">
              <h4>Food Categories</h4>

              {categories.map((item) => (
                <label className="ann-filter-option" key={item.value}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(item.value)}
                    onChange={() => toggleCategory(item.value)}
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>

            {/* QUANTITY FILTER */}

            <div className="ann-filter-group">
              <h4>Minimum Quantity</h4>

              <input
                className="ann-filter-input"
                type="number"
                min="0"
                placeholder="Enter quantity"
                value={minQuantity}
                onChange={(e) => setMinQuantity(e.target.value)}
              />

              <select
                className="ann-filter-input"
                value={quantityUnit}
                onChange={(e) => setQuantityUnit(e.target.value)}
              >
                <option value="">Select unit</option>
                <option value="servings">Servings</option>
                <option value="kg">Kg</option>
                <option value="grams">Grams</option>
                <option value="packets">Packets</option>
                <option value="litres">Litres</option>
              </select>

              {minQuantity && !quantityUnit && (
                <small>
                  Select a unit to apply the quantity filter.
                </small>
              )}
            </div>

            {/* LOCATION FILTER */}

            <div className="ann-filter-group">
              <h4>Pickup Location</h4>

              <input
                className="ann-filter-input"
                type="text"
                placeholder="Enter city or area"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="ann-clear-button"
              onClick={clearFilters}
            >
              Clear All Filters
            </button>
          </aside>

          {/* RESULTS */}

          <section className="ann-donation-results">
            <div className="ann-results-toolbar">
              <div>
                <h3>Available Donations</h3>
                <p>Good food deserves a good destination.</p>
              </div>

              <div className="ann-results-actions">
                <select
                  aria-label="Sort donations"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="quantity-high">
                    Quantity: High to Low
                  </option>
                  <option value="quantity-low">
                    Quantity: Low to High
                  </option>
                </select>

                <button
                  type="button"
                  className="ann-refresh-button"
                  onClick={loadDonations}
                >
                  ↻ Refresh
                </button>
              </div>
            </div>

            {filteredDonations.length === 0 ? (
              <div className="ann-empty-state">
                <span>🌱</span>
                <h3>No donations found</h3>
                <p>
                  Try adjusting your search or filters
                  to discover more donations.
                </p>

                <button type="button" onClick={clearFilters}>
                  Explore All Donations
                </button>
              </div>
            ) : (
              <div className="donation-grid">
                {filteredDonations.map((donation) => (
                  <DonationCard
                    key={donation.id}
                    donation={donation}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </section>

      {/* FOOTER */}

      <footer className="ann-footer">
        <div className="ann-footer-brand">🌿 Ann-Setu</div>

        <p>
          Connecting surplus food with people who need it.
          Together, let's make every meal matter.
        </p>

        <span>Made with care for a better tomorrow ♥</span>
      </footer>
    </main>
  );
}

export default AvailableDonations;
