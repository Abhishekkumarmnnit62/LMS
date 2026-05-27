import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import { BrainCircuit, Mail, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('alex@timetoprogram.com');
  const [password, setPassword] = useState('Test@123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { token, user } = await authService.login(email, password);
      login(user, token);
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Invalid email or password';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-slate-50 px-4 select-none">
      {/* Background radial gradient to mimic the clean image backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0%,rgba(248,250,252,1)_100%)] z-0" />

      <div className="relative z-10 w-full max-w-[440px] flex flex-col items-center">
        {/* Main Card */}
        <div className="w-full bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-10 flex flex-col items-center">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-sm mb-5">
              <BrainCircuit className="w-7 h-7" strokeWidth={2} />
            </div>
            <h1 className="text-3xl font-semibold text-slate-900 tracking-tight mb-2">Welcome back</h1>
            <p className="text-sm font-medium text-slate-500">Sign in to continue your journey</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-5">
            {/* Email Field */}
            <div className="flex flex-col space-y-2">
              <label className="text-xs font-bold text-slate-700 tracking-wider uppercase">Email</label>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${
                    focusedField === 'email' ? 'text-emerald-500' : 'text-slate-400'
                  }`}
                >
                  <Mail className="w-5 h-5" strokeWidth={2} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition-all duration-200 text-sm ${
                    focusedField === 'email'
                      ? 'border-emerald-500 ring-1 ring-emerald-500'
                      : 'border-slate-200'
                  }`}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col space-y-2">
              <label className="text-xs font-bold text-slate-700 tracking-wider uppercase">Password</label>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${
                    focusedField === 'password' ? 'text-emerald-500' : 'text-slate-400'
                  }`}
                >
                  <Lock className="w-5 h-5" strokeWidth={2} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none transition-all duration-200 text-sm ${
                    focusedField === 'password'
                      ? 'border-emerald-500 ring-1 ring-emerald-500'
                      : 'border-slate-200'
                  }`}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-xs font-medium bg-red-50 border border-red-100 rounded-lg p-2.5 mt-2">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.99] text-white font-medium py-3.5 px-4 rounded-xl shadow-sm transition-all duration-200 disabled:opacity-70 disabled:pointer-events-none text-sm"
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Footer inside Card */}
          <div className="mt-8 text-center">
            <p className="text-sm font-medium text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Subtle footer text below card */}
        <p className="mt-8 text-xs font-medium text-slate-400 tracking-wide text-center">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default LoginPage;