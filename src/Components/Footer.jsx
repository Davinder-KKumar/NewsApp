import React, { useState } from 'react';
import { newsletterService } from '../services/newsletter.service';

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);
      setError(null);
      await newsletterService.subscribe(email);
      alert("Thank you for subscribing to our newsletter!");
      setEmail("");
    } catch (err) {
      setError(err.message || "Failed to subscribe. Please try again.");
      alert(err.message || "Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className='background text-light p-3 mt-1'>
      <div className='container-fluid'>
        <div className='row align-items-center'>
          {/* Copyright Section */}
          <div className='col-12 col-md-6'>
            <p className='mb-0'>© 2025 MyNewsApp. All rights reserved.</p>
          </div>
          
          {/* Newsletter Section */}
          <div className='col-12 col-md-6'>
            <form className='d-flex justify-content-md-end mt-3 mt-md-0' onSubmit={handleSubmit}>
              <div className='input-group' style={{ maxWidth: '400px' }}>
                <input 
                  type="email" 
                  className={`form-control ${error ? 'is-invalid' : ''}`}
                  placeholder='Subscribe to Newsletter'
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  required
                  disabled={loading}
                />
                <button 
                  className='btn btn-outline-light me-2' 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <span>
                      <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                      Subscribing...
                    </span>
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </div>
              {error && (
                <div className="invalid-feedback d-block">
                  {error}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </footer>
  )
}
