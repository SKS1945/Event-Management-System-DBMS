import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineCalendar,
  HiOutlineTicket,
  HiOutlinePlusCircle,
  HiOutlineViewGrid,
  HiOutlineCreditCard,
  HiOutlineUserCircle,
  HiOutlineLogout,
  HiMenu,
  HiX,
} from 'react-icons/hi';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Primary Nav */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
                <HiOutlineCalendar className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  CampusPulse
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold -mt-1">
                  Event Management
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <Link
                to="/"
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition"
              >
                Browse Events
              </Link>

              {isAuthenticated && !isAdmin && (
                <Link
                  to="/my-registrations"
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition"
                >
                  <HiOutlineTicket className="w-4 h-4 text-indigo-500" />
                  <span>My Registrations</span>
                </Link>
              )}

              {isAdmin && (
                <>
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition"
                  >
                    <HiOutlineViewGrid className="w-4 h-4 text-violet-500" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/admin/events/new"
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition"
                  >
                    <HiOutlinePlusCircle className="w-4 h-4 text-emerald-500" />
                    <span>Add Event</span>
                  </Link>
                  <Link
                    to="/admin/payments"
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition"
                  >
                    <HiOutlineCreditCard className="w-4 h-4 text-amber-500" />
                    <span>Payments</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right Action Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 pl-3 pr-2 py-1.5 bg-slate-50 rounded-full border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex flex-col text-left pr-2">
                    <span className="text-xs font-semibold text-slate-800 leading-tight">
                      {user.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full w-fit ${
                        isAdmin
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {isAdmin ? 'ADMIN' : 'STUDENT'}
                    </span>
                  </div>
                </div>

                <Link
                  to="/profile"
                  className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                  title="Profile"
                >
                  <HiOutlineUserCircle className="w-5 h-5" />
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition"
                >
                  <HiOutlineLogout className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-50"
          >
            Browse Events
          </Link>

          {isAuthenticated && !isAdmin && (
            <Link
              to="/my-registrations"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-50"
            >
              My Registrations
            </Link>
          )}

          {isAdmin && (
            <>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-50"
              >
                Admin Dashboard
              </Link>
              <Link
                to="/admin/events/new"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-50"
              >
                Create New Event
              </Link>
              <Link
                to="/admin/payments"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-50"
              >
                Payment Ledger
              </Link>
            </>
          )}

          <div className="pt-4 border-t border-slate-100">
            {isAuthenticated && user ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3 px-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">{user.name}</div>
                    <div className="text-xs text-slate-500">{user.email}</div>
                  </div>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
                >
                  My Profile
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-3 py-2 text-base font-semibold text-rose-600 hover:bg-rose-50 rounded-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 px-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 px-4 border border-slate-300 rounded-xl font-medium text-slate-700"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 px-4 bg-indigo-600 text-white rounded-xl font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
