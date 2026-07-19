import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', averageCycleLength: 28 });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await API.post('/auth/signup', formData);
    loginWithToken(response.data.token, response.data.data.user);
    navigate('/');
  } catch (err) {
    setError(err.response?.data?.message || 'Something went wrong');
  }
};

  return (
    <div className="min-h-screen bg-lavender-light flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-[2.5rem] shadow-xl shadow-lavender-soft">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-lavender-main">Join CycleCare</h1>
          <p className="text-gray-500 mt-2">Start tracking your health today.</p>
        </div>

        {error && <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm mb-4 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full p-4 rounded-2xl bg-lavender-light border-none focus:ring-2 focus:ring-lavender-main outline-none transition-all"
            type="text"
            placeholder="Full Name"
            required
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <input
            className="w-full p-4 rounded-2xl bg-lavender-light border-none focus:ring-2 focus:ring-lavender-main outline-none transition-all"
            type="email"
            placeholder="Email Address"
            required
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input
            className="w-full p-4 rounded-2xl bg-lavender-light border-none focus:ring-2 focus:ring-lavender-main outline-none transition-all"
            type="password"
            placeholder="Create Password"
            required
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <div className="px-2">
            <label className="text-xs font-bold text-gray-400 uppercase">Avg. Cycle Length (Days)</label>
            <input
              className="w-full mt-1 p-4 rounded-2xl bg-lavender-light border-none focus:ring-2 focus:ring-lavender-main outline-none transition-all"
              type="number"
              value={formData.averageCycleLength}
              min="21"
              max="45"
              onChange={(e) => setFormData({...formData, averageCycleLength: e.target.value})}
            />
          </div>
          <button className="w-full bg-lavender-main text-white font-bold py-4 rounded-2xl shadow-lg shadow-lavender-soft hover:bg-lavender-dark transition-all mt-4">
            Create Account
          </button>
        </form>

        <p className="text-center mt-8 text-gray-500">
          Already have an account? <Link to="/login" className="text-lavender-main font-bold">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;