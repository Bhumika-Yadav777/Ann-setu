
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, RefreshCw } from 'lucide-react';
import { useAuth } from '../../authentication/useAuth';
import { supabase } from '../../../services/supabaseClient';
import './MyDonations.css';

function MyDonations() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchDonations();
    }
  }, [user?.id]);

  const fetchDonations = async () => {
    setLoading(true);
    setError('');

    const { data, error } = await supabase
      .from('food_donations')
      .select('*')
      .eq('donor_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching donations:', error);
      setError('Unable to load your donations. Please try again.');
    } else {
      setDonations(data || []);
    }

    setLoading(false);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatLabel = (value) => {
    return value
      ?.replaceAll('_', ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="my-donations-page">

      <header className="my-donations-header">
        <button
          className="back-button"
          onClick={() => navigate('/donor-dashboard')}
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="donations-heading">
          <div>
            <h1>My Donations</h1>
            <p>View and track all the food you have donated.</p>
          </div>

          <button
            className="refresh-button"
            onClick={fetchDonations}
            disabled={loading}
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>
      </header>

      <main className="donations-content">

        <div className="donations-count">
          <Package size={22} />
          <span>Total Donations: <strong>{donations.length}</strong></span>
        </div>

        {loading ? (
          <div className="donations-message">
            Loading your donations...
          </div>
        ) : error ? (
          <div className="donations-message error-message">
            {error}
            <button onClick={fetchDonations}>Try Again</button>
          </div>
        ) : donations.length === 0 ? (
          <div className="donations-empty">
            <Package size={48} />
            <h2>No donations yet</h2>
            <p>Your submitted food donations will appear here.</p>

            <button
              onClick={() => navigate('/donor/add-donation')}
            >
              Add Your First Donation
            </button>
          </div>
        ) : (
          <div className="donations-grid">

            {donations.map((donation) => (
              <article className="donation-card" key={donation.id}>

                {donation.food_image_url ? (
                  <img
                    src={donation.food_image_url}
                    alt={donation.food_name}
                    className="donation-image"
                  />
                ) : (
                  <div className="donation-image-placeholder">
                    <Package size={42} />
                  </div>
                )}

                <div className="donation-card-content">

                  <div className="donation-card-heading">
                    <h2>{donation.food_name}</h2>

                    <span className={`status-badge status-${donation.status}`}>
                      {formatLabel(donation.status)}
                    </span>
                  </div>

                  <p className="donation-category">
                    {formatLabel(donation.category)}
                  </p>

                  <div className="donation-details">
                    <p>
                      <strong>Quantity:</strong>{' '}
                      {donation.quantity} {formatLabel(donation.quantity_unit)}
                    </p>

                    <p>
                      <strong>Packaging:</strong>{' '}
                      {formatLabel(donation.packaging_status)}
                    </p>

                    <p>
                      <strong>Pickup:</strong>{' '}
                      {donation.pickup_location}
                    </p>

                    <p>
                      <strong>Donated on:</strong>{' '}
                      {formatDate(donation.created_at)}
                    </p>
                  </div>

                  {donation.description && (
                    <p className="donation-description">
                      {donation.description}
                    </p>
                  )}

                </div>
              </article>
            ))}

          </div>
        )}

      </main>
    </div>
  );
}

export default MyDonations;
