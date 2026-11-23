
import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';

function NGOVerificationStatus() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [status, setStatus] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStatus = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('ngo_verifications')
        .select('status, rejection_reason')
        .eq('user_id', user.id)
        .single();

      if (error) {
        setError('Unable to fetch your verification status.');
      } else {
        setStatus(data.status);
        setReason(data.rejection_reason || '');

        if (data.status === 'approved') {
          navigate('/ngo-dashboard');
        }
      }

      setLoading(false);
    };

    fetchStatus();
  }, [user, navigate]);

  if (loading) {
    return <div style={styles.page}>Loading verification status...</div>;
  }

  if (error) {
    return <div style={styles.page}>{error}</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.icon}>
          {status === 'pending' ? '⏳' :
           status === 'approved' ? '✓' : '✕'}
        </div>

        <h1 style={styles.heading}>NGO Verification Status</h1>

        {status === 'pending' && (
          <>
            <div style={styles.pending}>Pending Approval</div>
            <p style={styles.description}>
              Your NGO verification application has been submitted
              successfully. Our admin team is reviewing your details.
            </p>
            <p style={styles.note}>
              You will get access to the NGO dashboard once your
              application is approved.
            </p>
          </>
        )}

        {status === 'rejected' && (
          <>
            <div style={styles.rejected}>Application Rejected</div>
            <p style={styles.description}>
              Unfortunately, your verification application was rejected.
            </p>
            <div style={styles.reason}>
              <strong>Reason:</strong>
              <p>{reason || 'No reason was provided by the admin.'}</p>
            </div>
            <button
              style={styles.button}
              onClick={() => navigate('/ngo-verification')}
            >
              Update Application
            </button>
          </>
        )}

        {status === 'approved' && (
          <div style={styles.approved}>
            Your NGO has been verified successfully!
          </div>
        )}
      </div>
    </div>
  );
}


const styles = {
  page: {
    minHeight: '100vh',
    width: '100%',
    background: '#f4f7f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '35px 20px',
    fontFamily: 'Arial, sans-serif',
    color: '#24352d',
    boxSizing: 'border-box'
  },

  card: {
    width: '100%',
    maxWidth: '650px',
    background: '#ffffff',
    padding: '45px 45px',
    borderRadius: '20px',
    textAlign: 'center',
    border: '1px solid #e5ece5',
    boxShadow: '0 10px 35px rgba(28, 65, 46, 0.08)',
    boxSizing: 'border-box'
  },

  icon: {
    width: '85px',
    height: '85px',
    margin: '0 auto 22px',
    borderRadius: '50%',
    background: '#e8f3eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '42px'
  },

  heading: {
    fontSize: '29px',
    fontWeight: 700,
    color: '#193f30',
    margin: '0 0 18px',
    textAlign: 'center',
    letterSpacing: '-0.5px'
  },

  pending: {
    display: 'inline-block',
    background: '#fff4dc',
    color: '#946200',
    padding: '11px 24px',
    borderRadius: '30px',
    fontSize: '14px',
    fontWeight: 700,
    border: '1px solid #f5dfad'
  },

  rejected: {
    display: 'inline-block',
    background: '#fff0ee',
    color: '#b83232',
    padding: '11px 24px',
    borderRadius: '30px',
    fontSize: '14px',
    fontWeight: 700,
    border: '1px solid #f4d0cb'
  },

  approved: {
    display: 'inline-block',
    background: '#e9f6ed',
    color: '#26734f',
    padding: '11px 24px',
    borderRadius: '30px',
    fontSize: '14px',
    fontWeight: 700,
    border: '1px solid #cce8d3'
  },

  description: {
    fontSize: '14px',
    color: '#718078',
    lineHeight: 1.8,
    margin: '25px 0',
    textAlign: 'center'
  },

  note: {
    background: '#f0f7f1',
    border: '1px solid #dcecdf',
    padding: '18px 20px',
    borderRadius: '12px',
    fontSize: '13px',
    color: '#587263',
    lineHeight: 1.8,
    textAlign: 'left',
    marginTop: '25px'
  },

  reason: {
    background: '#fff4f2',
    border: '1px solid #f3d8d3',
    padding: '18px 20px',
    borderRadius: '12px',
    textAlign: 'left',
    fontSize: '14px',
    color: '#923b35',
    lineHeight: 1.7,
    marginTop: '22px'
  },

  button: {
    background: 'linear-gradient(110deg, #1c6244, #2c8157)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '14px 28px',
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: '22px',
    boxShadow: '0 5px 14px rgba(32, 104, 69, 0.15)',
    transition: '0.2s ease'
  }
};

export default NGOVerificationStatus;
