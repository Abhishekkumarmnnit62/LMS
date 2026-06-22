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
      toast.success('Registration successful! Please Login.');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Failed to register. Please try again.');
      toast.error(err.message || 'Failed to register.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC] px-4 py-12">
      {/* Centered Main Form Card */}
      <div className="w-full max-w-[440px] px-10 py-12 bg-white border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
        
        {/* Header matched to login style */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#00BA74] text-white mb-5">
            <BrainCircuit className="w-6 h-6 text-white" strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
            Create An Account
          </h1>
          <p className="text-slate-400 text-xs">
            Start your AI-powered learning experience 
          </p>
        </div>

        {/* Form Wrapper */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Username Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" strokeWidth={2} />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setFocusedField("username")}
                onBlur={() => setFocusedField(null)}
                className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-slate-100 rounded-xl focus:outline-hidden focus:border-[#00BA74] focus:bg-white transition-all placeholder-slate-300 text-slate-700 text-sm"
                placeholder="yourusername"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" strokeWidth={2} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-slate-100 rounded-xl focus:outline-hidden focus:border-[#00BA74] focus:bg-white transition-all placeholder-slate-300 text-slate-700 text-sm"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" strokeWidth={2} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-slate-100 rounded-xl focus:outline-hidden focus:border-[#00BA74] focus:bg-white transition-all placeholder-slate-300 text-slate-700 text-sm"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-center">
              <p className="text-xs text-rose-500 font-medium">
                {error}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 mt-6 px-4 py-3.5 bg-[#00BA74] hover:bg-[#00a365] disabled:bg-[#52d4a3] text-white font-medium rounded-xl transition-all cursor-pointer text-sm shadow-xs"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Create account
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </>
            )}
          </button>
        </form>

        {/* Footer Link layout matches your screenshot */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#00BA74] hover:underline transition-all"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Terms and Privacy positioned structurally outside the main card container */}
      <p className="text-center text-[11px] text-slate-400 mt-8 tracking-wide">
        By continuing, you agree to our Terms & Privacy Policy
      </p>
    </div>
  );
};

export default RegisterPage;