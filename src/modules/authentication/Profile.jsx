
import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';
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

  // Fetch profile details
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setProfile(data);
        setFullName(data.full_name);
        setEmail(data.email);
        setPhone(data.phone || '');
      }

      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  // Save profile changes
  const handleSave = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage('');
    setError('');

    const emailChanged = email.trim() !== profile.email;

    // Update name and phone number
    const { data, error: profileError } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        phone: phone
      })
      .eq('id', user.id)
      .select()
      .single();

    if (profileError) {
      setError(profileError.message);
      setSaving(false);
      return;
    }

    setProfile(data);

    // Request email change through Supabase Auth
    if (emailChanged) {
      const { error: emailError } = await supabase.auth.updateUser({
        email: email.trim()
      });

      if (emailError) {
        setError(
          `Profile saved, but email change failed: ${emailError.message}`
        );
        setSaving(false);
        return;
      }

      setMessage(
        'Profile details saved! Please check your email inbox for verification.'
      );
    } else {
      setMessage('Profile updated successfully!');
    }

    setEditing(false);
    setSaving(false);
  };

  // Cancel editing
  const handleCancel = () => {
    setFullName(profile.full_name);
    setEmail(profile.email);
    setPhone(profile.phone || '');
    setEditing(false);
    setMessage('');
    setError('');
  };

  // Logout
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (!profile) {
    return <p>{error || 'Profile not found.'}</p>;
  }

  return (
    <div className="profile-page">
      <div className="profile-card">

        <div className="profile-header">
          <div className="profile-avatar">
            {profile.full_name.charAt(0).toUpperCase()}
          </div>

          <h1>My Profile</h1>
          <p>Manage your AnnSetu account details.</p>
        </div>

        {message && (
          <p className="success-message">{message}</p>
        )}

        {error && (
          <p className="error-message">{error}</p>
        )}

        {editing ? (
          <form onSubmit={handleSave}>

            <div className="profile-field">
              <label>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="profile-field">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="profile-field">
              <label>Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>

          </form>
        ) : (
          <>
            <div className="profile-field">
              <label>Full Name</label>
              <p>{profile.full_name}</p>
            </div>

            <div className="profile-field">
              <label>Email Address</label>
              <p>{profile.email}</p>
            </div>

            <div className="profile-field">
              <label>Phone Number</label>
              <p>{profile.phone || 'Not provided'}</p>
            </div>

            <div className="profile-field">
              <label>Account Role</label>
              <p className="role-badge">
                {profile.role.toUpperCase()}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setMessage('');
                setError('');
                setEditing(true);
              }}
            >
              Edit Profile
            </button>
          </>
        )}

        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>
    </div>
  );
}

export default Profile;
