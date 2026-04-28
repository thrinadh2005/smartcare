import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center bg-primary-600 p-4 rounded-2xl shadow-lg mb-4">
            <span className="text-white text-3xl font-bold">SC</span>
          </div>
          <h1 className="text-3xl font-bold text-secondary-900 tracking-tight">SmartCare</h1>
          <p className="text-secondary-500 mt-2 font-medium">Your personalized health companion</p>
        </div>

        <div className="card shadow-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-danger-50 border border-danger-100 text-danger-600 px-4 py-3 rounded-lg text-sm font-medium animate-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="label mb-0">Password</label>
                <a href="#" className="text-xs font-semibold text-primary-600 hover:text-primary-700">Forgot password?</a>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-3 text-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Signing in...</span>
                </div>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-secondary-100 text-center">
            <p className="text-sm text-secondary-500 font-medium">
              New to SmartCare?{' '}
              <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-bold">
                Create an account
              </Link>
            </p>
          </div>
        </div>
        
        <p className="mt-8 text-center text-xs text-secondary-400">
          &copy; 2026 SmartCare Health Systems. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
