
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Pencil,
  LogOut,
  Save,
  X,
  ArrowLeft,
  Leaf,
  Heart,
  Sprout
} from 'lucide-react';

import { supabase } from '../../services/supabaseClient';
import { useAuth } from './useAuth';
import './Profile.css';

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);

  const formatName = (name) => {
    if (!name) return 'User';

    return name
      .trim()
      .split(/\s+/)
      .map((word) =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(' ');
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Profile fetch error:', error);
        setError('Unable to load your profile.');
      } else {
        setProfile(data);
        setFullName(data.full_name || '');
        setEmail(data.email || user.email || '');
        setPhone(data.phone || '');
      }

      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage('');
    setError('');

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      setSaving(false);
      return;
    }

    try {
      const currentEmail = profile.email || user?.email || '';
      const emailChanged = email.trim() !== currentEmail;

      const { data, error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName.trim(),
          phone: phone.trim()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (profileError) throw profileError;

      setProfile(data);

      if (emailChanged) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: email.trim()
        });

        if (emailError) {
          throw new Error(
            `Profile saved, but email change failed: ${emailError.message}`
          );
        }

        setMessage(
          'Profile saved! Please verify your new email address.'
        );
      } else {
        setMessage('Your profile has been updated successfully!');
      }

      setEditing(false);
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message || 'Unable to update your profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFullName(profile.full_name || '');
    setEmail(profile.email || user?.email || '');
    setPhone(profile.phone || '');
    setEditing(false);
    setMessage('');
    setError('');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="profile-loading-icon">
          <Sprout size={30} />
        </div>
        <h2>Growing your profile...</h2>
        <p>Please wait a moment.</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-loading">
        <div className="profile-loading-icon">
          <User size={28} />
        </div>
        <h2>Profile not found</h2>
        <p>{error || 'Unable to find your account information.'}</p>
        <button onClick={() => navigate(-1)} type="button">
          Go Back
        </button>
      </div>
    );
  }

  const displayName = formatName(profile.full_name);
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <main className="profile-page">
      <div className="profile-container">

        <button
          className="profile-back-button"
          onClick={() => navigate(-1)}
          type="button"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        <div className="profile-heading">
          <div>
            <span className="profile-eyebrow">
              <Leaf size={15} />
              YOUR ANN-SETU ACCOUNT
            </span>

            <h1>My Profile</h1>

            <p>
              Your details, your contribution, your connection.
            </p>
          </div>

          <div className="profile-heading-icon">
            <Sprout size={28} />
          </div>
        </div>

        <section className="profile-card">

          {/* Simple green strip without image or text */}
          <div className="profile-cover"></div>

          <div className="profile-intro">
            <div className="profile-avatar">
              <span>{initials}</span>

              <div className="avatar-leaf">
                <Leaf size={14} />
              </div>
            </div>

            <div className="profile-intro-info">
              <span className="profile-member-label">
                ANN-SETU MEMBER
              </span>

              <h2>{displayName}</h2>

              <p>{profile.email || user?.email}</p>

              <span className="profile-account-badge">
                <ShieldCheck size={15} />
                Account Details
              </span>
            </div>

            {!editing && (
              <button
                className="edit-profile-button"
                type="button"
                onClick={() => {
                  setMessage('');
                  setError('');
                  setEditing(true);
                }}
              >
                <Pencil size={16} />
                Edit Profile
              </button>
            )}
          </div>

          <div className="profile-divider" />

          <section className="profile-information">
            <div className="profile-section-heading">
              <div>
                <span className="profile-section-label">
                  YOUR INFORMATION
                </span>

                <h2>Personal Information</h2>

                <p>
                  Manage your personal details and contact information.
                </p>
              </div>

              <div className="section-decoration">
                <Heart size={21} />
              </div>
            </div>

            {message && (
              <div className="profile-alert success-message">
                <ShieldCheck size={18} />
                <span>{message}</span>
              </div>
            )}

            {error && (
              <div className="profile-alert error-message">
                <span>{error}</span>
              </div>
            )}

            {editing ? (
              <form className="profile-edit-form" onSubmit={handleSave}>
                <div className="profile-form-grid">

                  <div className="profile-field">
                    <label htmlFor="profile-name">Full Name</label>

                    <div className="profile-input-wrapper">
                      <User size={19} />

                      <input
                        id="profile-name"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>

                  <div className="profile-field">
                    <label htmlFor="profile-email">Email Address</label>

                    <div className="profile-input-wrapper">
                      <Mail size={19} />

                      <input
                        id="profile-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="profile-field">
                    <label htmlFor="profile-phone">Phone Number</label>

                    <div className="profile-input-wrapper">
                      <Phone size={19} />

                      <input
                        id="profile-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                </div>

                <div className="profile-edit-actions">
                  <button
                    type="submit"
                    className="save-profile-button"
                    disabled={saving}
                  >
                    <Save size={17} />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>

                  <button
                    type="button"
                    className="cancel-profile-button"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    <X size={17} />
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-details-grid">

                <div className="profile-detail-card">
                  <div className="detail-icon">
                    <User size={21} />
                  </div>

                  <div className="detail-content">
                    <span>Full Name</span>
                    <strong>{displayName}</strong>
                  </div>
                </div>

                <div className="profile-detail-card">
                  <div className="detail-icon">
                    <Mail size={21} />
                  </div>

                  <div className="detail-content">
                    <span>Email Address</span>
                    <strong>{profile.email || user?.email}</strong>
                  </div>
                </div>

                <div className="profile-detail-card">
                  <div className="detail-icon">
                    <Phone size={21} />
                  </div>

                  <div className="detail-content">
                    <span>Phone Number</span>
                    <strong>{profile.phone || 'Not provided'}</strong>
                  </div>
                </div>

                <div className="profile-detail-card">
                  <div className="detail-icon">
                    <ShieldCheck size={21} />
                  </div>

                  <div className="detail-content">
                    <span>Account Role</span>
                    <strong className="profile-role">
                      {formatName(profile.role)}
                    </strong>
                  </div>
                </div>

              </div>
            )}
          </section>

          <footer className="profile-security">
            <div className="security-icon">
              <ShieldCheck size={22} />
            </div>

            <div className="security-copy">
              <h3>Account Security</h3>
              <p>
                Keep your account information safe and up to date.
              </p>
            </div>

            <button
              className="profile-logout-button"
              onClick={handleLogout}
              type="button"
            >
              <LogOut size={17} />
              Logout
            </button>
          </footer>
        </section>

        <div className="profile-footer-text">
          <Heart size={14} fill="currentColor" />
          <span>Made with care by Ann-Setu</span>
          <Leaf size={14} />
        </div>

      </div>
    </main>
  );
}

export default Profile;
