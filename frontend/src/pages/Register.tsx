import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  HiOutlineUser,
  HiOutlineMail,
  HiLockClosed,
  HiOutlinePhone,
  HiOutlineAcademicCap,
  HiOutlineUserAdd,
} from 'react-icons/hi';

export const Register: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    department: 'Computer Science',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const departments = [
    'Computer Science',
    'Information Technology',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Business Administration (MBA)',
    'Other',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    const result = await signup({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone || undefined,
      department: formData.department,
    });
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Registration successful! Welcome to CampusPulse.');
      navigate('/');
    } else {
      setError(result.message || 'Registration failed');
      toast.error(result.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-3">
            <HiOutlineUserAdd className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
          <p className="mt-2 text-sm text-slate-600">
            Join CampusPulse to participate in campus events & activities
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <HiOutlineUser className="w-5 h-5" />
              </div>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Rahul Sharma"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              College Email *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <HiOutlineMail className="w-5 h-5" />
              </div>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. rahul@college.edu"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <HiLockClosed className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <HiLockClosed className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm outline-none transition"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <HiOutlinePhone className="w-5 h-5" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Department
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <HiOutlineAcademicCap className="w-5 h-5" />
                </div>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm outline-none transition"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 transition duration-150 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-sm text-slate-600">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
