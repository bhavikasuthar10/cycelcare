import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Heart } from 'lucide-react'; // Icon for a warm touch

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      loginWithToken(response.data.token, response.data.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-lavender-light flex flex-col justify-center items-center p-4">
      {/* Logo/Brand Area */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-3xl shadow-sm mb-4">
          <Heart className="text-lavender-main w-8 h-8 fill-lavender-main" />
        </div>
        <h1 className="text-3xl font-extrabold text-lavender-dark tracking-tight">CycleCare</h1>
        <p className="text-slate-500 mt-2">Welcome back to your safe space.</p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-xl shadow-purple-100/50 p-8 md:p-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-4 rounded-2xl border border-red-100 animate-pulse">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full px-5 py-4 bg-lavender-light/50 border border-lavender-soft rounded-2xl focus:outline-none focus:ring-2 focus:ring-lavender-main/20 focus:border-lavender-main transition-all"
              placeholder="hello@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-5 py-4 bg-lavender-light/50 border border-lavender-soft rounded-2xl focus:outline-none focus:ring-2 focus:ring-lavender-main/20 focus:border-lavender-main transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-lavender-main hover:bg-lavender-dark text-white font-bold rounded-2xl shadow-lg shadow-purple-200 transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {isLoading ? 'Signing you in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-lavender-main font-bold hover:underline">
              Join CycleCare
            </Link>
          </p>
        </div>
      </div>

      {/* Privacy Note */}
      <p className="mt-8 text-[10px] text-slate-400 max-w-xs text-center leading-relaxed">
        Your data is encrypted and private. We never share your health information with third parties.
      </p>
    </div>
  );
};

export default Login;