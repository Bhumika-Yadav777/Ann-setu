
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../authentication/useAuth";
import { supabase } from "../../../services/supabaseClient";

import {
  LayoutDashboard,
  PlusCircle,
  Package,
  User,
  LogOut,
  Utensils,
  Heart,
  Clock,
  CheckCircle,
  ArrowUpRight,
  MapPin,
  CalendarDays,
  Leaf,
  HandHeart,
  RefreshCw,
} from "lucide-react";

import "./DonorDashboard.css";

function DonorDashboard() {
  const { user, loading, logout } = useAuth();

  const [donations, setDonations] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState("");

  useEffect(() => {
    if (!user?.id) return;

    async function fetchDonations() {
      try {
        setDataLoading(true);
        setDataError("");

        const { data, error } = await supabase
          .from("food_donations")
          .select("*")
          .eq("donor_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        setDonations(data || []);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        setDataError("Unable to load your donations. Please try again.");
      } finally {
        setDataLoading(false);
      }
    }

    fetchDonations();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="donor-loading">
        <Leaf size={30} />
        <p>Preparing your dashboard...</p>
      </div>
    );
  }

  const donorName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Donor";

  const totalDonations = donations.length;

  const availableDonations = donations.filter(
    (item) => item.status === "available"
  ).length;

  const completedDonations = donations.filter(
    (item) =>
      item.status === "delivered" ||
      item.status === "completed"
  ).length;

  const recentDonations = donations.slice(0, 4);

  const formatLabel = (value) =>
    value
      ? value.replaceAll("_", " ").replace(/\b\w/g, (char) =>
          char.toUpperCase()
        )
      : "Not specified";

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="donor-layout">
      <aside className="donor-sidebar">
        <Link to="/donor-dashboard" className="donor-brand">
          <span className="donor-brand-icon">
            <Utensils size={23} />
          </span>
          <span>
            <strong>Ann-Setu</strong>
            <small>Food Sharing Community</small>
          </span>
        </Link>

        <div className="donor-sidebar-section">
          <p className="sidebar-label">WORKSPACE</p>

          <nav className="sidebar-nav">
            <NavLink to="/donor-dashboard" end>
              <LayoutDashboard size={19} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink to="/donor/add-donation">
              <PlusCircle size={19} />
              <span>Add Donation</span>
            </NavLink>

            <NavLink to="/donor/my-donations">
              <Package size={19} />
              <span>My Donations</span>
            </NavLink>

            <NavLink to="/profile">
              <User size={19} />
              <span>My Profile</span>
            </NavLink>
          </nav>
        </div>

        <div className="donor-sidebar-bottom">
          <div className="sidebar-impact">
            <span className="sidebar-impact-icon">
              <HandHeart size={21} />
            </span>
            <strong>Every meal matters.</strong>
            <p>Your kindness can make someone's day better.</p>
          </div>

          <button className="sidebar-logout" onClick={logout}>
            <LogOut size={19} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="donor-main">
        <header className="dashboard-header">
          <div>
            <span className="dashboard-eyebrow">
              <Leaf size={15} /> YOUR DONOR SPACE
            </span>
            <h1>Donor Dashboard</h1>
            <p>Manage your contributions and make every meal count.</p>
          </div>

          <div className="donor-account">
            <div className="donor-avatar">
              {donorName.charAt(0).toUpperCase()}
            </div>
            <div className="donor-account-info">
              <strong>{donorName}</strong>
              <span>Food Donor</span>
            </div>
          </div>
        </header>

        <section className="donor-welcome">
          <div className="welcome-content">
            <span className="welcome-tag">
              <Heart size={14} /> MAKING A DIFFERENCE
            </span>

            <h2>
              Welcome back, {donorName}! <span>👋</span>
            </h2>

            <p>
              Your generosity helps connect surplus food with people
              who need it. Keep sharing, keep caring.
            </p>

            <Link to="/donor/add-donation" className="welcome-button">
              <PlusCircle size={18} />
              Share Food Today
              <ArrowUpRight size={17} />
            </Link>
          </div>

          <div className="welcome-art" aria-hidden="true">
            <div className="welcome-art-circle">
              <HandHeart size={76} strokeWidth={1.4} />
            </div>
            <span className="welcome-leaf leaf-one">🌿</span>
            <span className="welcome-leaf leaf-two">🍃</span>
            <span className="welcome-heart">♥</span>
          </div>
        </section>

        <section className="donor-stats">
          <article className="donor-stat-card">
            <div className="donor-stat-top">
              <span className="stat-icon green">
                <Package size={22} />
              </span>
              <span className="stat-caption">ALL TIME</span>
            </div>
            <h2>{dataLoading ? "..." : totalDonations}</h2>
            <p>Total Donations</p>
            <span className="stat-bottom-text">
              Your contributions so far
            </span>
          </article>

          <article className="donor-stat-card">
            <div className="donor-stat-top">
              <span className="stat-icon orange">
                <Clock size={22} />
              </span>
              <span className="stat-caption">ACTIVE</span>
            </div>
            <h2>{dataLoading ? "..." : availableDonations}</h2>
            <p>Available Donations</p>
            <span className="stat-bottom-text">
              Waiting to be shared
            </span>
          </article>

          <article className="donor-stat-card">
            <div className="donor-stat-top">
              <span className="stat-icon blue">
                <CheckCircle size={22} />
              </span>
              <span className="stat-caption">IMPACT</span>
            </div>
            <h2>{dataLoading ? "..." : completedDonations}</h2>
            <p>Completed Donations</p>
            <span className="stat-bottom-text">
              Successfully delivered
            </span>
          </article>
        </section>

        <section className="recent-donations">
          <div className="section-heading">
            <div>
              <span className="section-kicker">YOUR CONTRIBUTIONS</span>
              <h2>Recent Donations</h2>
              <p>Keep track of the food you have shared.</p>
            </div>

            <div className="recent-heading-actions">
              <button
                type="button"
                className="donor-refresh-btn"
                onClick={() => window.location.reload()}
                title="Refresh dashboard"
              >
                <RefreshCw size={17} />
              </button>

              <Link to="/donor/my-donations" className="view-all-link">
                View all <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>

          {dataError ? (
            <div className="donor-empty-state">
              <p>{dataError}</p>
            </div>
          ) : dataLoading ? (
            <div className="donor-empty-state">
              <Leaf size={30} />
              <p>Loading your recent donations...</p>
            </div>
          ) : recentDonations.length === 0 ? (
            <div className="donor-empty-state">
              <div className="empty-state-icon">
                <Heart size={34} />
              </div>
              <h3>Your sharing journey starts here</h3>
              <p>
                You haven't added any donations yet. Share surplus food
                and help someone in your community.
              </p>
              <Link to="/donor/add-donation" className="empty-state-button">
                <PlusCircle size={17} />
                Add Your First Donation
              </Link>
            </div>
          ) : (
            <div className="recent-donations-list">
              {recentDonations.map((donation) => (
                <article className="recent-donation-item" key={donation.id}>
                  {donation.food_image_url ? (
                    <img
                      className="recent-donation-image"
                      src={donation.food_image_url}
                      alt={donation.food_name || "Food donation"}
                    />
                  ) : (
                    <div className="recent-donation-placeholder">
                      <Package size={27} />
                    </div>
                  )}

                  <div className="recent-donation-info">
                    <h3>{donation.food_name || "Food Donation"}</h3>

                    <p>
                      {donation.quantity}{" "}
                      {formatLabel(donation.quantity_unit)}
                      <span> · </span>
                      {formatLabel(donation.category)}
                    </p>

                    <span className="recent-donation-date">
                      <CalendarDays size={14} />
                      {formatDate(donation.created_at)}
                    </span>

                    {donation.pickup_location && (
                      <span className="recent-donation-location">
                        <MapPin size={14} />
                        {donation.pickup_location}
                      </span>
                    )}
                  </div>

                  <span
                    className={`recent-donation-status status-${(
                      donation.status || "unknown"
                    ).toLowerCase()}`}
                  >
                    {formatLabel(donation.status)}
                  </span>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="donor-footer">
          <span>🌿 Ann-Setu</span>
          <p>Every meal matters. Every connection counts.</p>
        </footer>
      </main>
    </div>
  );
}

export default DonorDashboard;
