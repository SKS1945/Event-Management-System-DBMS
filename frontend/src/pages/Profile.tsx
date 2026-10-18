import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { HiOutlineUser, HiOutlineMail, HiOutlinePhone, HiOutlineAcademicCap } from 'react-icons/hi';

export const Profile: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!user) return null;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await api.put('/users/me', { name, phone, department });
      await refreshUser();
      toast.success('Profile updated successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center space-x-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-indigo-100">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
            <p className="text-sm text-slate-500">{user.email}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
              {user.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="mt-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <HiOutlineUser className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Email (Read-Only)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <HiOutlineMail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full pl-10 pr-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <HiOutlinePhone className="w-5 h-5" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Department
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <HiOutlineAcademicCap className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={isUpdating}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-xs transition cursor-pointer"
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
