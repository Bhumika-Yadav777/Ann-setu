
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import './Login.css';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data, error: loginError } =
      await supabase.auth.signInWithPassword({
        email,
        password
      });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } =
      await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

    if (profileError) {
      setError('Unable to fetch your profile. Please try again.');
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    if (profile.role === 'ngo') {
      const { data: verification, error: verificationError } =
        await supabase
          .from('ngo_verifications')
          .select('status')
          .eq('user_id', data.user.id)
          .maybeSingle();

      setLoading(false);

      if (verificationError) {
        setError('Unable to check NGO verification status.');
        await supabase.auth.signOut();
        return;
      }

      if (!verification || verification.status !== 'approved') {
        navigate('/ngo-verification');
        return;
      }

      navigate('/ngo-dashboard');
      return;
    }

    setLoading(false);

    
if (profile.role === 'donor') {
  navigate('/donor-dashboard');
} 
else if (profile.role === 'beneficiary') {
  navigate('/beneficiary-dashboard');
} 
else if (profile.role === 'ngo') {

  const { data: verificationData, error: verificationError } =
    await supabase
      .from('ngo_verifications')
      .select('status')
      .eq('user_id', data.user.id)
      .maybeSingle();

  if (verificationError) {
    setError('Unable to check NGO verification status.');
    await supabase.auth.signOut();
    return;
  }

  if (!verificationData) {
    // NGO has not submitted an application
    navigate('/ngo-verification');
  }
  else if (verificationData.status === 'pending') {
    // Application is under review
    navigate('/ngo-verification-status');
  }
  else if (verificationData.status === 'approved') {
    // NGO is verified
    navigate('/ngo-dashboard');
  }
  else if (verificationData.status === 'rejected') {
    // NGO needs to correct application
    navigate('/ngo-verification');
  }
} 
else if (profile.role === 'admin') {
  navigate('/admin-dashboard');
} 
else {
  setError('Invalid user role.');
}

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
            Welcome
            <br />
            <span>back!</span>
          </h1>
          <p>
            Every meal shared makes a difference.
            Sign in and continue helping us reduce
            food waste and fight hunger.
          </p>
        </div>

        <div className="welcome-footer">
          Making every meal count.
        </div>
      </section>

      <section className="form-panel">
        <form className="register-form login-form" onSubmit={handleSubmit}>
          <div className="form-heading">
            <span className="form-tag">WELCOME BACK</span>
            <h2>Sign in to AnnSetu</h2>
            <p>Enter your details to access your account.</p>
          </div>

          <div className="form-grid login-grid">
            <div className="form-group full-width">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button className="register-button" type="submit" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In →'}
          </button>

          <p className="login-text">
            Don't have an account? <Link to="/register">Create account</Link>
          </p>
        </form>
      </section>
    </div>
  );
}

export default Login;
