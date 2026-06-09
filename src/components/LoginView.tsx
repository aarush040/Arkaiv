import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { AuthUser } from '../types';
import authService from '../services/authService';

interface LoginViewProps {
  onLoginSuccess: (user: AuthUser, wasRegistering: boolean) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [isRegister, setIsRegister] = useState<boolean>(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim() || !password.trim()) {
      setError('Please provide your valid Email ID and Password credentials.');
      return;
    }

    if (isRegister) {
      if (!name.trim()) {
        setError('Please enter your Name for your personalized NEP academic track.');
        return;
      }
      if (!phone.trim()) {
        setError('Please enter a valid Phone number for instant roadmap text notifications.');
        return;
      }
      if (password.length < 6) {
        setError('Your custom password must consist of at least 6 characters.');
        return;
      }

      setIsLoading(true);

      try {
        const response = await authService.register({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        });

        const newUser: AuthUser = {
          name: response.user?.name || name.trim(),
          email: response.user?.email || email.trim().toLowerCase(),
          phone: phone.trim(),
        };

        setSuccess('Registration completed successfully! Setting up your interactive roadmap workspace...');
        setIsLoading(false);

        setTimeout(() => {
          onLoginSuccess(newUser, true);
        }, 1200);
      } catch (err: any) {
        const message = err.response?.data?.error || err.message || 'Registration failed. Please try again.';
        setError(message);
        setIsLoading(false);
      }

    } else {
      setIsLoading(true);

      try {
        const response = await authService.login({
          email: email.trim().toLowerCase(),
          password,
        });

        const matchedUser: AuthUser = {
          name: response.user?.name || 'User',
          email: response.user?.email || email.trim().toLowerCase(),
          phone: response.user?.phone || '',
        };

        setSuccess(`Welcome back, ${matchedUser.name}! Opening your high-contrast learning desk...`);
        setIsLoading(false);

        setTimeout(() => {
          onLoginSuccess(matchedUser, false);
        }, 1100);
      } catch (err: any) {
        const message = err.response?.data?.error || err.message || 'Authentication failure: Incorrect Email ID or Password.';
        setError(message);
        setIsLoading(false);
      }
    }
  };

  const handleGoogleSignIn = () => {
    // Delegate the redirect to authService so the redirect target is
    // centralized. The backend handles the actual OAuth flow and ultimately
    // redirects back to /auth/callback with the JWT tokens in the query string.
    authService.loginWithGoogle();
  };

  return (
    <div id="arkaiv-login-root" className="min-h-screen bg-[#f8fafc] flex flex-col justify-between p-4 md:p-8 max-w-5xl mx-auto">

      {/* NEP ALIGNMENT TOP BANNER */}
      <div className="w-full bg-[#eef2ff] border border-[#c7d2fe] p-3 rounded-2xl flex flex-col sm:flex-row items-center gap-2.5 text-center sm:text-left mb-4 shadow-xs">
        <div className="inline-flex h-7 px-2.5 rounded bg-indigo-600 text-white font-extrabold text-[10px] items-center justify-center tracking-wider shrink-0 select-none">
          NEP 2020 APPROVED
        </div>
        <p className="text-xs font-semibold text-indigo-900 leading-normal">
          ARKAIV runs high-precision career mapping with national curricula parameters to build dynamic pathways.
        </p>
      </div>

      {/* App brand identifier */}
      <header className="flex justify-between items-center py-2 mb-4 border-b border-slate-100">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-indigo-600 font-display">
            ARKA<span className="text-white bg-indigo-600 px-1.5 rounded-md ml-0.5 inline-block">IV</span>
          </h1>
          <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-0.5">
            Personalized Career & Competency Roadmap Engine
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 select-none">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
          <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-700">
            Secure Authentication v2.0
          </span>
        </div>
      </header>

      {/* Main Authentic Card Area */}
      <main className="flex-1 flex flex-col justify-center py-6">
        <div className="w-full max-w-md mx-auto bg-white border border-slate-200 shadow-xl rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden">

          {/* Subtle decoration accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400" />

          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 font-display">
              {isRegister ? 'Create Your Account' : 'Sign In To Proceed'}
            </h2>
            <p className="text-xs font-medium text-slate-500 leading-relaxed">
              {isRegister
                ? 'Join your peers on custom CBSE, SWAYAM and NCERT educational mapping.'
                : 'Welcome back! Log in to resume your active competency timeline metrics.'}
            </p>
          </div>

          {/* Toggle Tab */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => {
                setIsRegister(true);
                setError(null);
                setSuccess(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                isRegister
                  ? 'bg-white text-indigo-600 shadow-sm font-extrabold'
                  : 'text-slate-650 hover:text-slate-900'
              }`}
            >
              Sign Up / Register
            </button>
            <button
              onClick={() => {
                setIsRegister(false);
                setError(null);
                setSuccess(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                !isRegister
                  ? 'bg-white text-indigo-600 shadow-sm font-extrabold'
                  : 'text-slate-650 hover:text-slate-900'
              }`}
            >
              Log In
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4 text-left">

            {/* NAME FIELD (Register only) */}
            <AnimatePresence initial={false}>
              {isRegister && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-1.5 overflow-hidden"
                >
                  <label className="block text-xs font-black uppercase text-slate-550 tracking-wider">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-600 text-slate-900 shadow-2xs"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* EMAIL FIELD */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black uppercase text-slate-550 tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="name@university.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-600 text-slate-900 shadow-2xs"
                  required
                />
              </div>
            </div>

            {/* PHONE FIELD (Register only) */}
            <AnimatePresence initial={false}>
              {isRegister && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-1.5 overflow-hidden"
                >
                  <label className="block text-xs font-black uppercase text-slate-550 tracking-wider">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-600 text-slate-900 shadow-2xs"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* PASSWORD FIELD */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black uppercase text-slate-550 tracking-wider">
                  Password
                </label>
                {!isRegister && (
                  <button
                    type="button"
                    onClick={() => {
                      setError('To reset your password, please contact support or sign in with Google.');
                    }}
                    className="text-[10px] font-bold text-indigo-600 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-600 text-slate-900 shadow-2xs"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Status alerts */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs mt-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="leading-tight font-medium">{error}</p>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs mt-2 animate-pulse"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="leading-tight font-medium">{success}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Submit Trigger */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-md active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>
                  <span>{isRegister ? 'Register & Setup' : 'Proceed Log In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Google Sign-In panel (replaces the previous Sandbox Assessment Utility) */}
          <div className="pt-2 border-t border-slate-100 flex flex-col items-center">
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
              Quick Access
            </span>
            <button
              onClick={handleGoogleSignIn}
              type="button"
              className="mt-2 flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-400 text-[10px] font-bold text-slate-650 rounded-lg transition-all cursor-pointer shadow-3xs"
            >
              {/* Google "G" multi-color logo (inline SVG) */}
              <svg
                className="w-3.5 h-3.5 shrink-0"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-6.627 0-12-5.373-12-12h-8c0 11.045 8.955 20 20 20z" />
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

        </div>
      </main>

      {/* FOOTER NEP CREDITS */}
      <footer className="text-center text-slate-400 text-[10px] uppercase font-bold tracking-widest pt-4">
        ARKAIV Integrated Registry • Approved NEP Syllabus Standards
      </footer>

    </div>
  );
}
