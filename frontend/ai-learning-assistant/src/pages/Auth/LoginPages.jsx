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
      
      setError(error.message);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <div className="" />

      <div className="">
        <div className="">
          {/* Header */}
          <div className="">
            <div className="">
              <BrainCircuit className="" strokeWidth={2} />
            </div>
            <h1 className="">Welcome back</h1>
            <p className="">Sign in to continue your journey</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="">
            {/* Email Field */}
            <div className="">
              <label className="">Email</label>
              <div className="">
                <div
                  className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${
                    focusedField === 'email' ? 'text-emerald-500' : 'text-slate-400'
                  }`}
                >
                  <Mail className="" strokeWidth={2} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className=""
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="">
              <label className="">Password</label>
              <div className="">
                <div
                  className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors ${
                    focusedField === 'password' ? 'text-emerald-500' : 'text-slate-400'
                  }`}
                >
                  <Lock className="" strokeWidth={2} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className=""
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm mt-2">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className=""
            >
              <span className="">
                {loading ? (
                  <>
                    <div className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="" strokeWidth={2.5} />
                  </>
                )}
              </span>
            </button>
            <div className="" />
          </form>

          {/* Footer */}
          <div className="">
            <p className="">
              Don't have an account?{' '}
              <Link to="/register" className="">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Subtle footer text */}
        <p className="">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default LoginPage;