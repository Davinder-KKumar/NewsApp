import React, { useState, useEffect } from 'react';
import { AdminService } from '../services/admin.service';

export default function Admin() {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({ activeSubscribers: 0 });
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10);

    useEffect(() => {
        fetchSubscribers();
        fetchStats();
    }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchSubscribers = async () => {
        try {
            setLoading(true);
            const response = await AdminService.getNewsletterSubscribers(currentPage, pageSize);
            setSubscribers(response.content || []);
            setError(null);
        } catch (err) {
            setError('Failed to fetch subscribers. ' + err.message);
            setSubscribers([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await AdminService.getNewsletterStats();
            setStats(response);
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        }
    };

  return (
    <div className="background min-vh-100 py-3">
      <div className="container-fluid px-4">
        <div className="card shadow-sm">
          <div style={{
            background: 'linear-gradient(to right, black, dimgrey, grey)',
            padding: '1rem',
            borderRadius: '4px 4px 0 0'
          }} className="text-center">
            <h4 className="mb-0 text-white">Newsletter Subscribers</h4>
          </div>
          
          <div className="card-body p-3">
            <div className="row g-2">
              <div className="col-12">
                <div className="small-card bg-light p-2 rounded">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">Total Active Subscribers:</span>
                    <span className="h5 mb-0">{stats.activeSubscribers}</span>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="table-responsive">
                  {loading ? (
                    <div className="text-center p-2">
                      <div className="spinner-border spinner-border-sm" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : error ? (
                    <div className="alert alert-danger py-2">{error}</div>
                  ) : (
                    <>
                      <table className="table table-sm table-hover">
                        <thead className="table-dark">
                          <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody className="align-middle">
                          {subscribers.map(subscriber => (
                            <tr key={subscriber.id}>
                              <td>{subscriber.id}</td>
                              <td>{subscriber.email}</td>
                              <td>{new Date(subscriber.subscribedAt).toLocaleDateString()}</td>
                              <td>
                                <span className={`badge ${subscriber.active ? 'bg-success' : 'bg-danger'}`}>
                                  {subscriber.active ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td>
                                <button
                                  className="btn btn-outline-danger btn-sm py-0 px-2"
                                  onClick={async () => {
                                    try {
                                      await AdminService.unsubscribe(subscriber.email);
                                      fetchSubscribers();
                                    } catch (err) {
                                      setError('Failed to unsubscribe user: ' + err.message);
                                    }
                                  }}
                                >
                                  Unsubscribe
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div className="d-flex justify-content-center mt-2">
                        <button
                          className="btn btn-sm btn-outline-dark me-2"
                          disabled={currentPage === 0}
                          onClick={() => setCurrentPage(prev => prev - 1)}
                        >
                          Previous
                        </button>
                        <button
                          className="btn btn-sm btn-outline-dark"
                          disabled={subscribers.length < pageSize}
                          onClick={() => setCurrentPage(prev => prev + 1)}
                        >
                          Next
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {!loading && !error && subscribers.length === 0 && (
                  <div className="alert alert-info py-2 text-center">
                    No subscribers found.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
