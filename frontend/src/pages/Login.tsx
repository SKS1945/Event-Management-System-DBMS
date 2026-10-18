import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiOutlineMail, HiLockClosed, HiSparkles } from 'react-icons/hi';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Welcome back!');
      const destination = (location.state as any)?.from?.pathname || (email === 'admin@college.edu' ? '/admin' : '/');
      navigate(destination, { replace: true });
    } else {
      setError(result.message || 'Invalid credentials');
      toast.error(result.message || 'Login failed');
    }
  };

  const handleDemoFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-3">
            <HiLockClosed className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Sign In</h2>
          <p className="mt-2 text-sm text-slate-600">
            Access your college event portal account
          </p>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-dashed border-slate-300">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1">
            <HiSparkles className="text-amber-500 w-4 h-4" /> Quick Demo Fill
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoFill('admin@college.edu', 'admin123')}
              className="px-2.5 py-1.5 text-xs font-medium bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg border border-purple-200 transition text-left flex items-center gap-1.5 cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              Admin Account
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('student@college.edu', 'student123')}
              className="px-2.5 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg border border-blue-200 transition text-left flex items-center gap-1.5 cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Student Account
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <HiOutlineMail className="w-5 h-5" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. rollno@college.edu"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <HiLockClosed className="w-5 h-5" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 transition duration-150 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-sm text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
