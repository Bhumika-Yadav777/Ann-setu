import { MailCheck } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import './Register.css';

function Register() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'donor'
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.full_name,
          phone: formData.phone,
          role: formData.role
        }
      }
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage('Account created! Please verify your email.');

    setFormData({
      full_name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: 'donor'
    });
  };

  return (
    <div className="auth-page">

      <section className="welcome-panel">
        <div className="brand">
          <span className="brand-icon">♧</span>
          <span>AnnSetu</span>
        </div>

        <div className="welcome-content">
          <span className="welcome-tag">GOOD FOOD. GOOD PURPOSE.</span>

          <h1>
            A little food can
            <br />
            make a <span>big difference.</span>
          </h1>

          <p>
            Join our community to connect surplus food
            with people who need it. Together, we can
            reduce food waste and fight hunger.
          </p>

          <div className="welcome-stats">
            <div>
              <strong>Share</strong>
              <small>Surplus food</small>
            </div>
            <div>
              <strong>Connect</strong>
              <small>With communities</small>
            </div>
            <div>
              <strong>Care</strong>
              <small>For everyone</small>
            </div>
          </div>
        </div>

        <div className="welcome-footer">
          Making every meal count.
        </div>
      </section>

      <section className="form-panel">
        <form className="register-form" onSubmit={handleSubmit}>

          <div className="form-heading">
            <span className="form-tag">GET STARTED</span>
            <h2>Create your account</h2>
            <p>Join us in making a difference, one meal at a time.</p>
          </div>

          <div className="form-grid">

            <div className="form-group full-width">
              <label>Full Name</label>
              <input
                type="text"
                name="full_name"
                placeholder="Enter your full name"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Create password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          <div className="role-section">
            <label className="role-heading">I want to join as a</label>

            <div className="role-options">

              {[
                { value: 'donor', icon: '🍲', title: 'Donor' },
                { value: 'ngo', icon: '🤝', title: 'NGO' },
                { value: 'beneficiary', icon: '💚', title: 'Beneficiary' }
              ].map((role) => (
                <label
                  key={role.value}
                  className={`role-card ${
                    formData.role === role.value ? 'selected' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role.value}
                    checked={formData.role === role.value}
                    onChange={handleChange}
                  />
                  <span className="role-icon">{role.icon}</span>
                  <span>{role.title}</span>
                </label>
              ))}

            </div>
          </div>

          {error && <p className="error-message">{error}</p>}
          {message && (
  <div className="success-message">
    <MailCheck size={24} />
    <div>
      <strong>Verify Your Email Address!</strong>
      <p>{message}</p>
      <p>Please check your inbox and spam folder for the verification link.</p>
    </div>
  </div>
)}

          <button className="register-button" type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account →'}
          </button>

          <p className="login-text">
            Already have an account? <a href="/login">Sign in</a>
          </p>

          <p className="privacy-text">
            By joining, you agree to help build a food-secure community.
          </p>

        </form>
      </section>

    </div>
  );
}

export default Register;
