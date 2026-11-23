
import { useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  ShieldCheck,
  ArrowLeft,
  FileCheck,
  MapPin,
  UserRound,
  CheckCircle2,
  Leaf
} from 'lucide-react';

function NGOVerification() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    ngo_name: '',
    registration_number: '',
    registration_type: '',
    address: '',
    city: '',
    state: '',
    contact_person: '',
    contact_phone: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      setError('Please log in before submitting your application.');
      return;
    }

    setLoading(true);
    setError('');

    const { error } = await supabase
      .from('ngo_verifications')
      .insert({
        user_id: user.id,
        ...formData
      });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    navigate('/ngo-verification-status');
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    border: '1px solid #dce7df',
    borderRadius: '9px',
    fontSize: '14px',
    color: '#24352d',
    background: '#fbfdfb',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'Arial, sans-serif'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '9px',
    fontSize: '13px',
    fontWeight: 600,
    color: '#344b3e'
  };

  const renderInput = (name, label, placeholder, type = 'text') => (
    <div style={styles.field}>
      <label style={labelStyle}>{label} *</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={formData[name]}
        onChange={handleChange}
        required
        style={inputStyle}
        onFocus={(e) => e.target.style.borderColor = '#26734f'}
        onBlur={(e) => e.target.style.borderColor = '#dce7df'}
      />
    </div>
  );

  return (
    <div style={styles.page}>

      <div style={styles.topBar}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={styles.backButton}
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </button>

        <div style={styles.brand}>
          <Leaf size={19} color="#26734f" />
          <span>AnnSetu</span>
        </div>
      </div>

      <div style={styles.container}>

        {/* Header */}
        <div style={styles.hero}>
          <div style={styles.heroContent}>
            <div style={styles.heroTag}>
              <ShieldCheck size={15} />
              NGO PARTNER ONBOARDING
            </div>

            <h1 style={styles.heroTitle}>
              Become an <span style={{ color: '#b9e4c5' }}>AnnSetu</span>
              <br />Verified NGO Partner
            </h1>

            <p style={styles.heroDescription}>
              Join our mission to reduce food waste and connect surplus
              food with communities that need it. Complete your
              organisation details to get started.
            </p>

            <div style={styles.heroPoints}>
              <span><CheckCircle2 size={16} /> Secure verification</span>
              <span><CheckCircle2 size={16} /> Admin reviewed</span>
              <span><CheckCircle2 size={16} /> Community impact</span>
            </div>
          </div>

          <div style={styles.heroDecoration}>
            <div style={styles.heroCircle}>
              <Building2 size={65} color="#ffffff" strokeWidth={1.3} />
            </div>
            <div style={styles.floatingIcon}>
              <Leaf size={25} color="#26734f" />
            </div>
          </div>
        </div>

        {/* Progress */}
        <div style={styles.progressCard}>
          <div style={styles.progressStep}>
            <div style={styles.stepNumber}>1</div>
            <div>
              <strong>Submit Details</strong>
              <p>Complete the application form</p>
            </div>
          </div>

          <div style={styles.progressLine} />

          <div style={styles.progressStep}>
            <div style={styles.stepNumberPending}>2</div>
            <div>
              <strong>Admin Review</strong>
              <p>Our team verifies your details</p>
            </div>
          </div>

          <div style={styles.progressLine} />

          <div style={styles.progressStep}>
            <div style={styles.stepNumberPending}>3</div>
            <div>
              <strong>Get Verified</strong>
              <p>Access your NGO dashboard</p>
            </div>
          </div>
        </div>

        {/* Information */}
        <div style={styles.infoBox}>
          <div style={styles.infoIcon}>
            <ShieldCheck size={23} color="#26734f" />
          </div>
          <div>
            <h3 style={styles.infoTitle}>Before you begin</h3>
            <p style={styles.infoText}>
              Keep your NGO registration documents ready. Make sure
              the information entered below matches your official
              registration records. Your dashboard access will be
              enabled after admin approval.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* Organisation details */}
          <div style={styles.formSection}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionIcon}>
                <Building2 size={21} color="#26734f" />
              </div>
              <div>
                <h2 style={styles.sectionTitle}>Organisation Information</h2>
                <p style={styles.sectionSubtitle}>
                  Provide your official NGO registration details.
                </p>
              </div>
            </div>

            <div style={styles.formGrid}>
              <div style={styles.fullWidth}>
                {renderInput(
                  'ngo_name',
                  'Official NGO Name',
                  'Enter your registered organisation name'
                )}
              </div>

              {renderInput(
                'registration_number',
                'Registration Number',
                'Enter NGO registration number'
              )}

              <div style={styles.field}>
                <label style={labelStyle}>Registration Type *</label>
                <select
                  name="registration_type"
                  value={formData.registration_type}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = '#26734f'}
                  onBlur={(e) => e.target.style.borderColor = '#dce7df'}
                >
                  <option value="">Select registration type</option>
                  <option value="Trust">Trust</option>
                  <option value="Society">Society</option>
                  <option value="Section 8 Company">Section 8 Company</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Address details */}
          <div style={styles.formSection}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionIcon}>
                <MapPin size={21} color="#26734f" />
              </div>
              <div>
                <h2 style={styles.sectionTitle}>Registered Address</h2>
                <p style={styles.sectionSubtitle}>
                  Where your organisation is officially registered.
                </p>
              </div>
            </div>

            <div style={styles.formGrid}>
              <div style={styles.fullWidth}>
                {renderInput(
                  'address',
                  'Complete Address',
                  'House number, street, area and locality'
                )}
              </div>

              {renderInput('city', 'City', 'Enter city')}
              {renderInput('state', 'State', 'Enter state')}
            </div>
          </div>

          {/* Contact details */}
          <div style={styles.formSection}>
            <div style={styles.sectionHeader}>
              <div style={styles.sectionIcon}>
                <UserRound size={21} color="#26734f" />
              </div>
              <div>
                <h2 style={styles.sectionTitle}>Contact Information</h2>
                <p style={styles.sectionSubtitle}>
                  Details of the person responsible for communication.
                </p>
              </div>
            </div>

            <div style={styles.formGrid}>
              {renderInput(
                'contact_person',
                'Contact Person Name',
                'Enter authorised contact person name'
              )}

              {renderInput(
                'contact_phone',
                'Contact Phone Number',
                'Enter contact number',
                'tel'
              )}
            </div>
          </div>

          {error && (
            <div style={styles.errorBox}>
              {error}
            </div>
          )}

          {/* Submit */}
          <div style={styles.submitArea}>
            <div style={styles.submitNote}>
              <FileCheck size={20} color="#26734f" />
              <span>
                By submitting, you confirm that the information provided is accurate.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitButton,
                background: loading ? '#718078' : '#26734f',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.background = '#1d5c3d';
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.background = '#26734f';
              }}
            >
              {loading ? 'Submitting Application...' : 'Submit Verification Application →'}
            </button>

            <p style={styles.footerText}>
              Your application will be reviewed by the AnnSetu admin team.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f2f6f2',
    padding: '22px 5%',
    boxSizing: 'border-box',
    fontFamily: 'Arial, sans-serif',
    color: '#24352d'
  },

  topBar: {
    maxWidth: '1200px',
    margin: '0 auto 22px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#ffffff',
    color: '#26734f',
    border: '1px solid #dce8df',
    padding: '10px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer'
  },

  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    fontSize: '21px',
    fontWeight: 800,
    color: '#173d32'
  },

  container: {
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
    background: '#ffffff',
    borderRadius: '18px',
    overflow: 'hidden',
    boxShadow: '0 8px 35px rgba(23, 61, 50, 0.07)'
  },

  hero: {
    background: 'linear-gradient(120deg, #173d32, #26734f)',
    padding: '48px 55px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '30px',
    color: '#ffffff'
  },

  heroContent: {
    maxWidth: '690px'
  },

  heroTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255,255,255,0.13)',
    color: '#d9f0df',
    padding: '8px 13px',
    borderRadius: '30px',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '1px',
    marginBottom: '20px'
  },

  heroTitle: {
    fontSize: '36px',
    lineHeight: 1.25,
    fontWeight: 750,
    margin: '0 0 15px'
  },

  heroDescription: {
    color: '#d5e6da',
    fontSize: '14px',
    lineHeight: 1.8,
    maxWidth: '600px',
    margin: '0 0 23px'
  },

  heroPoints: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    fontSize: '12px',
    color: '#e4f2e8'
  },

  heroDecoration: {
    position: 'relative',
    width: '155px',
    height: '155px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(255,255,255,0.25)',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.08)'
  },

  heroCircle: {
    width: '110px',
    height: '110px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.13)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  floatingIcon: {
    position: 'absolute',
    right: '-5px',
    bottom: '5px',
    width: '43px',
    height: '43px',
    borderRadius: '50%',
    background: '#e5f3e8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  progressCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    padding: '25px 50px',
    background: '#fbfdfb',
    borderBottom: '1px solid #edf2ee'
  },

  progressStep: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    minWidth: 0
  },

  stepNumber: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    background: '#26734f',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    flexShrink: 0
  },

  stepNumberPending: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    background: '#e9f0eb',
    color: '#718078',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    flexShrink: 0
  },

  progressLine: {
    height: '1px',
    flex: 1,
    background: '#dce8df',
    minWidth: '15px'
  },

  infoBox: {
    margin: '30px 45px 10px',
    padding: '18px 20px',
    display: 'flex',
    gap: '15px',
    alignItems: 'flex-start',
    background: '#edf6ef',
    border: '1px solid #dcecdf',
    borderRadius: '11px'
  },

  infoIcon: {
    width: '40px',
    height: '40px',
    background: '#dcefe1',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },

  infoTitle: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#173d32',
    margin: '0 0 6px'
  },

  infoText: {
    fontSize: '13px',
    lineHeight: 1.7,
    color: '#587263',
    margin: 0
  },

  formSection: {
    margin: '30px 45px',
    padding: '25px 28px',
    border: '1px solid #e8eee9',
    borderRadius: '13px',
    background: '#ffffff'
  },

  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '13px',
    marginBottom: '25px'
  },

  sectionIcon: {
    width: '43px',
    height: '43px',
    borderRadius: '11px',
    background: '#e9f4ec',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },

  sectionTitle: {
    color: '#173d32',
    fontSize: '17px',
    fontWeight: 700,
    margin: '0 0 5px'
  },

  sectionSubtitle: {
    color: '#89958e',
    fontSize: '12px',
    margin: 0
  },

  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '22px 25px'
  },

  field: {
    minWidth: 0
  },

  fullWidth: {
    gridColumn: '1 / -1'
  },

  errorBox: {
    margin: '0 45px 20px',
    padding: '14px',
    color: '#b83227',
    background: '#fff0ee',
    border: '1px solid #f4d0cb',
    borderRadius: '9px',
    fontSize: '13px'
  },

  submitArea: {
    margin: '35px 45px 40px',
    paddingTop: '25px',
    borderTop: '1px solid #edf1ed',
    textAlign: 'center'
  },

  submitNote: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '9px',
    color: '#718078',
    fontSize: '12px',
    marginBottom: '20px'
  },

  submitButton: {
    width: '100%',
    maxWidth: '520px',
    padding: '16px 22px',
    color: '#ffffff',
    border: 'none',
    borderRadius: '9px',
    fontSize: '14px',
    fontWeight: 700,
    fontFamily: 'Arial, sans-serif',
    transition: 'background 0.2s',
    boxShadow: '0 4px 12px rgba(38, 115, 79, 0.18)'
  },

  footerText: {
    color: '#89958e',
    fontSize: '12px',
    marginTop: '16px'
  }
};

export default NGOVerification;
