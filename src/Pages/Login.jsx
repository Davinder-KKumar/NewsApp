import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    // For demo purposes, just navigate to home
    navigate('/');
  };

  return (
    <div className="background py-5 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg rounded-lg mt-3">
              <div style={{
                background: 'linear-gradient(to right, black, dimgrey, grey)',
                padding: '1.5rem',
                borderRadius: '8px 8px 0 0'
              }} className="text-center">
                <h3 className="mb-0 font-weight-bold text-white">News Portal Login</h3>
              </div>
              <div className="card-body p-4 p-md-5">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="form-floating mb-4">
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="email">Email address</label>
                  </div>

                  <div className="form-floating mb-4">
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="password">Password</label>
                  </div>

                  <div className="form-check mb-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="rememberMe"
                    />
                    <label className="form-check-label" htmlFor="rememberMe">
                      Remember password
                    </label>
                  </div>

                  <div className="d-grid">
                    <button
                      className="btn custom-btn btn-lg text-uppercase fw-bold mb-4"
                      type="submit"
                    >
                      Sign in
                    </button>
                  </div>

                  <div className="text-center">
                    <Link to="/forgot-password" className="small text-decoration-none">
                      Forgot password?
                    </Link>
                    <div className="mt-3">
                      <span className="text-muted">Don't have an account? </span>
                      <Link to="/register" className="text-decoration-none">
                        Sign up now
                      </Link>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}