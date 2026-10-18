import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import type { EventItem, Category } from '../types';
import { EventCard } from '../components/EventCard';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineSearch,
  HiSparkles,
  HiOutlineArrowRight,
  HiOutlineFilter,
  HiOutlineCalendar,
  HiOutlineTicket,
  HiOutlineLightningBolt,
  HiOutlineBookOpen,
} from 'react-icons/hi';

export const Home: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('date');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await api.get('/events');
        setEvents(res.data.events);
      } catch (err: any) {
        console.error('Failed to fetch events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const categories: { label: string; value: string; icon: React.ReactNode }[] = [
    { label: 'All Events', value: 'ALL', icon: <HiOutlineCalendar className="w-4 h-4" /> },
    { label: 'Tech & Hackathons', value: 'TECH', icon: <HiOutlineLightningBolt className="w-4 h-4 text-blue-500" /> },
    { label: 'Cultural & Music', value: 'CULTURAL', icon: <HiSparkles className="w-4 h-4 text-purple-500" /> },
    { label: 'Workshops & Bootcamps', value: 'WORKSHOP', icon: <HiOutlineBookOpen className="w-4 h-4 text-emerald-500" /> },
    { label: 'Informals & Fun', value: 'INFORMALS', icon: <HiOutlineTicket className="w-4 h-4 text-amber-500" /> },
  ];

  // Client-side search and filtering
  const filteredEvents = events
    .filter((event) => {
      const matchesCategory =
        selectedCategory === 'ALL' || event.category === (selectedCategory as Category);

      const matchesSearch =
        searchTerm.trim() === '' ||
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'fee_asc') return Number(a.fee) - Number(b.fee);
      if (sortBy === 'fee_desc') return Number(b.fee) - Number(a.fee);
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-indigo-900/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] opacity-20 [background-size:24px_24px]"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 backdrop-blur-md text-indigo-300 text-xs font-bold border border-indigo-500/30">
            <HiSparkles className="text-amber-400" /> College Fest & Technical Events 2026
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Connect, Compete & Celebrate on Campus
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Your all-in-one portal for college competitions, workshops, and informal activities.
            Register online, secure your ticket via Razorpay, and stay tuned.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            {isAdmin ? (
              <Link
                to="/admin"
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-sm shadow-lg shadow-indigo-600/30 transition flex items-center gap-2"
              >
                Go to Admin Dashboard <HiOutlineArrowRight />
              </Link>
            ) : user ? (
              <Link
                to="/my-registrations"
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-sm shadow-lg shadow-indigo-600/30 transition flex items-center gap-2"
              >
                View My Registered Events <HiOutlineArrowRight />
              </Link>
            ) : (
              <Link
                to="/register"
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-sm shadow-lg shadow-indigo-600/30 transition flex items-center gap-2"
              >
                Join CampusPulse <HiOutlineArrowRight />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <HiOutlineSearch className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search events by title, keyword, or venue..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm outline-none transition"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <HiOutlineFilter className="w-5 h-5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="date">Date: Soonest First</option>
              <option value="fee_asc">Fee: Free & Low to High</option>
              <option value="fee_desc">Fee: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <HiOutlineCalendar className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No Events Found</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
              We couldn't find any events matching your search or category filter. Try clearing your filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('ALL');
              }}
              className="mt-6 px-4 py-2 bg-indigo-50 text-indigo-600 font-bold text-xs rounded-xl hover:bg-indigo-100 transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
