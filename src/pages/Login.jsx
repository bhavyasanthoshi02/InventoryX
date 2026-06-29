import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router';
import { Box, Mail, Lock, LogIn, Shield, Users, Eye, EyeOff } from 'lucide-react';
import { AuthContext } from '../context/AuthContext.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const res = await login(email, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-wrapper">
      <div className="auth-left-side">
        <div className="auth-v2-card">
          <div className="auth-v2-logo">
            <Box className="logo-icon" size={48} />
            <span className="logo-text" style={{ fontSize: '2rem' }}>InvenSync</span>
          </div>

          <h1 className="auth-v2-title">Welcome Back</h1>
          <p className="auth-v2-subtitle">Log in to manage your inventory and orders.</p>

          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-v2-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-with-icon">
                <Mail className="input-icon" size={18} />
                <input 
                  required 
                  type="email" 
                  className="form-input" 
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-with-icon">
                <Lock className="input-icon" size={18} />
                <input 
                  required 
                  type={showPassword ? "text" : "password"} 
                  className="form-input with-password-toggle" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary full-width" style={{ marginTop: '0.5rem', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {loading ? 'Logging in...' : (
                <>
                  <LogIn size={20} /> Sign In
                </>
              )}
            </button>
          </form>

          <div className="auth-v2-footer">
            Don't have an account? <Link to="/signup" className="auth-v2-link">Sign up now</Link>
          </div>
        </div>
      </div>
      <div className="auth-right-side">
        <div className="spline-container">
          <spline-viewer url="https://prod.spline.design/F7C4VtDSAFdQzmjf/scene.splinecode"></spline-viewer>
        </div>
      </div>
    </div>
  );

}
