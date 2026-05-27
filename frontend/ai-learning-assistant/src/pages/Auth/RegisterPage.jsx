import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { BrainCircuit, Mail, Lock, ArrowRight, User } from "lucide-react";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setError('');
    setLoading(true);

    try {
      await authService.register(username, email, password);
      toast.success('Registration in successfully! Please Login.');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Failed to register. Please try again.');
      toast.error(err.message || 'Failed to register.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-900 to-slate-800 relative overflow-hidden">
      {/* Background Radial Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-5" />

      {/* Glassmorphism Card Container */}
      <div className="relative w-full max-w-md px-6 py-8 bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500 text-white mb-4 shadow-lg shadow-emerald-500/20">
            <BrainCircuit className="w-7 h-7 text-white" strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-medium text-slate-900 tracking-tight mb-2">
            Create an account
          </h1>
          <p className="text-slate-500 text-sm">
            Start your AI-powered learning experience
          </p>
        </div>

        {/* Form Wrapper */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Username Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 block">
              Username
            </label>
            <div className="relative rounded-lg shadow-xs">
              <div
                className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${
                  focusedField === "username" ? "text-emerald-500" : "text-slate-400"
                }`}
              >
                <User className="" strokeWidth={2} />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setFocusedField("username")}
                onBlur={() => setFocusedField(null)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder-slate-400 text-slate-900 text-sm"
                placeholder="yourusername"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 block">
              Email
            </label>
            <div className="relative rounded-lg shadow-xs">
              <div
                className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${
                  focusedField === "email" ? "text-emerald-500" : "text-slate-400"
                }`}
              >
                <Mail className="" strokeWidth={2} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder-slate-400 text-slate-900 text-sm"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 block">
              Password
            </label>
            <div className="relative rounded-lg shadow-xs">
              <div
                className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${
                  focusedField === "password" ? "text-emerald-500" : "text-slate-400"
                }`}
              >
                <Lock className="" strokeWidth={2} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder-slate-400 text-slate-900 text-sm"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="animate-fade-in">
              <p className="text-sm text-rose-500 font-medium mt-1">
                {error}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 mt-6 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-400 text-white font-medium rounded-lg transition-all cursor-pointer shadow-md shadow-emerald-500/10"
          >
            <span className="flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="" strokeWidth={2.5} />
                </>
              )}
            </span>
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-200/60">
          <p className="text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Subtle footer text */}
        <p className="text-center text-xs text-slate-400 mt-6">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;