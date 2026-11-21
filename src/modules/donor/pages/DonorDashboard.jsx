

import { useEffect, useState } from 'react';
import { useAuth } from '../../authentication/useAuth';
import { supabase } from '../../../services/supabaseClient';

import {
  LayoutDashboard,
  PlusCircle,
  Package,
  User,
  LogOut,
  Utensils,
  Heart,
  Clock,
  CheckCircle
} from 'lucide-react';

import './DonorDashboard.css';

function DonorDashboard() {
  const { user, loading, logout } = useAuth();

  const [donations, setDonations] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState('');

  // Fetch logged-in donor's donations
  useEffect(() => {
    if (!user?.id) return;

    const fetchDonations = async () => {
      setDataLoading(true);
      setDataError('');

      const { data, error } = await supabase
        .from('food_donations')
        .select('*')
        .eq('donor_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Dashboard fetch error:', error);
        setDataError('Unable to load donation statistics.');
      } else {
        setDonations(data || []);
      }

      setDataLoading(false);
    };

    fetchDonations();
  }, [user?.id]);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  const donorName =
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'Donor';

  // Calculate live statistics
  const totalDonations = donations.length;

  const availableDonations = donations.filter(
    (item) => item.status === 'available'
  ).length;

  const completedDonations = donations.filter(
    (item) => item.status === 'delivered'
  ).length;

  const recentDonations = donations.slice(0, 3);

  const formatLabel = (value) =>
    value?.replaceAll('_', ' ').replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );

  return (
    <div className="donor-layout">

      {/* Sidebar */}
      <aside className="donor-sidebar">
        <div className="donor-brand">
          <Utensils size={25} />
          <h2>Food Connect</h2>
        </div>

        <p className="sidebar-label">MENU</p>

        <nav className="sidebar-nav">
          <a href="/donor-dashboard" className="active">
            <LayoutDashboard size={19} />
            Dashboard
          </a>

          <a href="/donor/add-donation">
            <PlusCircle size={19} />
            Add Donation
          </a>

          <a href="/donor/my-donations">
            <Package size={19} />
            My Donations
          </a>

          <a href="/profile">
            <User size={19} />
            Profile
          </a>
        </nav>

        <button className="sidebar-logout" onClick={logout}>
          <LogOut size={19} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="donor-main">

        <header className="dashboard-header">
          <div>
            <h1>Donor Dashboard</h1>
            <p>Manage your food donations and make a difference.</p>
          </div>

          <div className="donor-account">
            <div className="donor-avatar">
              {donorName.charAt(0).toUpperCase()}
            </div>
            <span>{donorName}</span>
          </div>
        </header>

        <section className="welcome-section">
          <h2>Welcome back, {donorName}! 👋</h2>
          <p>Your contribution can help reduce food waste and fight hunger.</p>
        </section>

        {/* Statistics */}
        <section className="donor-stats">

          <div className="stat-card">
            <div className="stat-icon green">
              <Package />
            </div>
            <div>
              <p>Total Donations</p>
              <h2>{dataLoading ? '...' : totalDonations}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">
              <Clock />
            </div>
            <div>
              <p>Available Donations</p>
              <h2>{dataLoading ? '...' : availableDonations}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue">
              <CheckCircle />
            </div>
            <div>
              <p>Completed Donations</p>
              <h2>{dataLoading ? '...' : completedDonations}</h2>
            </div>
          </div>

        </section>

        {/* Recent Donations */}
        <section className="recent-donations">

          <div className="section-heading">
            <div>
              <h2>Recent Donations</h2>
              <p>Track your recently submitted food donations.</p>
            </div>

            <a href="/donor/add-donation" className="add-donation-btn">
              <PlusCircle size={18} />
              Add Donation
            </a>
          </div>

          {dataError ? (
            <div className="empty-donations">
              <p>{dataError}</p>
            </div>
          ) : dataLoading ? (
            <div className="empty-donations">
              <p>Loading your recent donations...</p>
            </div>
          ) : recentDonations.length === 0 ? (
            <div className="empty-donations">
              <Heart size={42} />
              <h3>No donations yet</h3>
              <p>Start sharing food with people who need it.</p>
            </div>
          ) : (
            <div className="recent-donations-list">
              {recentDonations.map((donation) => (
                <div className="recent-donation-item" key={donation.id}>

                  {donation.food_image_url ? (
                    <img
                      src={donation.food_image_url}
                      alt={donation.food_name}
                    />
                  ) : (
                    <div className="recent-donation-placeholder">
                      <Package size={24} />
                    </div>
                  )}

                  <div className="recent-donation-info">
                    <h3>{donation.food_name}</h3>
                    <p>
                      {donation.quantity} {formatLabel(donation.quantity_unit)}
                      {' · '}
                      {formatLabel(donation.category)}
                    </p>
                  </div>

                  <span className="recent-donation-status">
                    {formatLabel(donation.status)}
                  </span>

                </div>
              ))}
            </div>
          )}

        </section>

      </main>
    </div>
  );
}

export default DonorDashboard;
