import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router';
import { Box, Mail, Lock, User, UserPlus, Shield, Users, Eye, EyeOff } from 'lucide-react';
import { AuthContext } from '../context/AuthContext.jsx';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Users' // Default role
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const res = await register(formData);
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
        <div className="auth-v2-card auth-signup-card" style={{ maxWidth: '520px' }}>
          <div className="auth-v2-logo">
            <Box className="logo-icon" size={48} />
            <span className="logo-text" style={{ fontSize: '2rem' }}>InvenSync</span>
          </div>

          <h1 className="auth-v2-title">Create Account</h1>
          <p className="auth-v2-subtitle">Join InvenSync to start managing your workflow.</p>

          {error && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-v2-form">
            <div className="form-group">
              <label className="form-label">Are you an Admin or User?</label>
              <div className="role-selector">
                <div 
                  className={`role-option ${formData.role === 'Admin' ? 'selected' : ''}`}
                  onClick={() => setFormData({...formData, role: 'Admin'})}
                >
                  <Shield size={24} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Admin</span>
                </div>
                <div 
                  className={`role-option ${formData.role === 'Users' ? 'selected' : ''}`}
                  onClick={() => setFormData({...formData, role: 'Users'})}
                >
                  <Users size={24} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Users</span>
                </div>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {formData.role === 'Admin' ? 'Admins can manage inventory and fulfill orders.' : 'Users can browse products and place orders.'}
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-with-icon">
                <User className="input-icon" size={18} />
                <input 
                  required 
                  type="text" 
                  className="form-input" 
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-with-icon">
                <Mail className="input-icon" size={18} />
                <input 
                  required 
                  type="email" 
                  className="form-input" 
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
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
              {loading ? 'Creating Account...' : (
                <>
                  <UserPlus size={20} /> Create Account
                </>
              )}
            </button>
          </form>

          <div className="auth-v2-footer">
            Already have an account? <Link to="/login" className="auth-v2-link">Sign in instead</Link>
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
