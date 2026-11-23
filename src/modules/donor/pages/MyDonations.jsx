
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  RefreshCw,
  Plus,
  Search,
  MapPin,
  CalendarDays,
  Utensils,
  Clock3,
  CheckCircle2,
  Heart,
  SlidersHorizontal,
} from 'lucide-react';

import { useAuth } from '../../authentication/useAuth';
import { supabase } from '../../../services/supabaseClient';
import './MyDonations.css';

function MyDonations() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const fetchDonations = useCallback(async () => {
    if (!user?.id) {
      setDonations([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    const { data, error: fetchError } = await supabase
      .from('food_donations')
      .select('*')
      .eq('donor_id', user.id)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching donations:', fetchError);
      setError('Unable to load your donations. Please try again.');
    } else {
      setDonations(data || []);
    }

    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  const formatLabel = (value) => {
    if (!value) return 'Not specified';

    return value
      .replaceAll('_', ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatDate = (date) => {
    if (!date) return 'Date unavailable';

    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const availableCount = donations.filter(
    (item) => item.status === 'available'
  ).length;

  const completedCount = donations.filter(
    (item) => ['delivered', 'completed'].includes(item.status)
  ).length;

  const filteredDonations = useMemo(() => {
    return donations.filter((donation) => {
      const searchTerm = search.trim().toLowerCase();

      const matchesSearch =
        !searchTerm ||
        donation.food_name?.toLowerCase().includes(searchTerm) ||
        donation.description?.toLowerCase().includes(searchTerm) ||
        donation.pickup_location?.toLowerCase().includes(searchTerm);

      const matchesStatus =
        statusFilter === 'all' || donation.status === statusFilter;

      const matchesCategory =
        categoryFilter === 'all' || donation.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [donations, search, statusFilter, categoryFilter]);

  const categories = [
    ...new Set(donations.map((item) => item.category).filter(Boolean)),
  ];

  return (
    <div className="my-donations-page">

      <header className="my-donations-topbar">
        <button
          className="my-donations-back"
          onClick={() => navigate('/donor-dashboard')}
        >
          <ArrowLeft size={18} />
          Dashboard
        </button>

        <div className="my-donations-brand">
          <Utensils size={21} />
          <span>Ann-Setu</span>
        </div>

        <button
          className="my-donations-refresh"
          onClick={fetchDonations}
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? 'refresh-spinning' : ''} />
          Refresh
        </button>
      </header>

      <main className="my-donations-main">

        <section className="my-donations-hero">
          <div className="my-donations-hero-content">
            <span className="my-donations-eyebrow">
              YOUR KINDNESS MAKES A DIFFERENCE
            </span>

            <h1>My Donations</h1>

            <p>
              Every meal you share brings hope to someone.
              Keep track of your contributions and the difference
              you are making in your community.
            </p>

            <button
              className="my-donations-add-button"
              onClick={() => navigate('/donor/add-donation')}
            >
              <Plus size={19} />
              Add New Donation
            </button>
          </div>

          <div className="my-donations-hero-art" aria-hidden="true">
            <div className="hero-art-circle">
              <Utensils size={76} />
            </div>
            <span className="hero-art-heart">♥</span>
            <span className="hero-art-leaf">✦</span>
          </div>
        </section>

        <section className="my-donations-stats">
          <article className="my-donations-stat-card">
            <div className="my-donations-stat-icon stat-green">
              <Package size={23} />
            </div>
            <div>
              <span>Total Donations</span>
              <h2>{loading ? '—' : donations.length}</h2>
              <p>All your contributions</p>
            </div>
          </article>

          <article className="my-donations-stat-card">
            <div className="my-donations-stat-icon stat-orange">
              <Clock3 size={23} />
            </div>
            <div>
              <span>Available</span>
              <h2>{loading ? '—' : availableCount}</h2>
              <p>Ready to be shared</p>
            </div>
          </article>

          <article className="my-donations-stat-card">
            <div className="my-donations-stat-icon stat-blue">
              <CheckCircle2 size={23} />
            </div>
            <div>
              <span>Completed</span>
              <h2>{loading ? '—' : completedCount}</h2>
              <p>Successfully delivered</p>
            </div>
          </article>
        </section>

        <section className="my-donations-list-section">
          <div className="my-donations-section-heading">
            <div>
              <span className="my-donations-eyebrow">
                YOUR CONTRIBUTIONS
              </span>
              <h2>Donation History</h2>
              <p>View and manage the food you have shared.</p>
            </div>

            <div className="my-donations-total-pill">
              {filteredDonations.length} donations
            </div>
          </div>

          <div className="my-donations-toolbar">
            <div className="my-donations-search">
              <Search size={19} />
              <input
                type="search"
                placeholder="Search food or pickup location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="my-donations-filters">
              <SlidersHorizontal size={17} />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by status"
              >
                <option value="all">All Statuses</option>
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="delivered">Delivered</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                aria-label="Filter by category"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option value={category} key={category}>
                    {formatLabel(category)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="my-donations-error">
              <p>{error}</p>
              <button onClick={fetchDonations}>Try Again</button>
            </div>
          )}

          {loading ? (
            <div className="my-donations-empty">
              <div className="my-donations-empty-icon">
                <RefreshCw size={32} className="refresh-spinning" />
              </div>
              <h3>Loading your donations...</h3>
              <p>Just a moment while we gather your contributions.</p>
            </div>
          ) : !error && donations.length === 0 ? (
            <div className="my-donations-empty">
              <div className="my-donations-empty-icon">
                <Heart size={38} />
              </div>
              <h3>Your donation journey starts here</h3>
              <p>
                You haven't shared any food yet. Add your first donation
                and help make a difference in someone's life.
              </p>
              <button
                onClick={() => navigate('/donor/add-donation')}
              >
                <Plus size={18} />
                Add Your First Donation
              </button>
            </div>
          ) : !error && filteredDonations.length === 0 ? (
            <div className="my-donations-empty">
              <div className="my-donations-empty-icon">
                <Search size={36} />
              </div>
              <h3>No matching donations</h3>
              <p>Try changing your search or filters.</p>
              <button
                onClick={() => {
                  setSearch('');
                  setStatusFilter('all');
                  setCategoryFilter('all');
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : !error ? (
            <div className="my-donations-grid">
              {filteredDonations.map((donation) => (
                <article className="my-donation-card" key={donation.id}>

                  <div className="my-donation-image-wrap">
                    {donation.food_image_url ? (
                      <img
                        src={donation.food_image_url}
                        alt={donation.food_name || 'Food donation'}
                        className="my-donation-image"
                      />
                    ) : (
                      <div className="my-donation-image-placeholder">
                        <Package size={42} />
                        <span>Food donation</span>
                      </div>
                    )}

                    <span className={`my-donation-status status-${donation.status || 'unknown'}`}>
                      {formatLabel(donation.status)}
                    </span>
                  </div>

                  <div className="my-donation-card-body">
                    <span className="my-donation-category">
                      {formatLabel(donation.category)}
                    </span>

                    <h3>{donation.food_name || 'Food Donation'}</h3>

                    {donation.description && (
                      <p className="my-donation-description">
                        {donation.description}
                      </p>
                    )}

                    <div className="my-donation-details">
                      <div>
                        <Package size={16} />
                        <span>
                          {donation.quantity} {formatLabel(donation.quantity_unit)}
                        </span>
                      </div>

                      <div>
                        <MapPin size={16} />
                        <span>{donation.pickup_location || 'Location not specified'}</span>
                      </div>

                      <div>
                        <CalendarDays size={16} />
                        <span>{formatDate(donation.created_at)}</span>
                      </div>
                    </div>

                    <div className="my-donation-card-footer">
                      <span>
                        Packaging: {formatLabel(donation.packaging_status)}
                      </span>
                      <span className="my-donation-heart">♥</span>
                    </div>
                  </div>

                </article>
              ))}
            </div>
          ) : null}
        </section>

        <footer className="my-donations-footer">
          <Heart size={15} />
          <span>Thank you for helping make every meal matter.</span>
        </footer>

      </main>
    </div>
  );
}

export default MyDonations;
