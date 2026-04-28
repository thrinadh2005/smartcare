import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
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
          <h1 className="text-3xl font-bold text-secondary-900 tracking-tight">Join SmartCare</h1>
          <p className="text-secondary-500 mt-2 font-medium">Start managing your health today</p>
        </div>

        <div className="card shadow-card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-danger-50 border border-danger-100 text-danger-600 px-4 py-3 rounded-lg text-sm font-medium animate-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <div>
              <label className="label">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input"
                placeholder="John Doe"
                required
              />
            </div>

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
              <label className="label">Password</label>
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

            <div>
              <label className="label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-3 text-lg mt-2"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creating account...</span>
                </div>
              ) : 'Sign Up'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-secondary-100 text-center">
            <p className="text-sm text-secondary-500 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-bold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
        
        <p className="mt-8 text-center text-xs text-secondary-400">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Signup;
