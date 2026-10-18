import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import type { DashboardStats, EventItem } from '../../types';
import toast from 'react-hot-toast';
import {
  HiOutlineCalendar,
  HiOutlineTicket,
  HiOutlineCurrencyRupee,
  HiOutlineUserGroup,
  HiOutlinePlus,
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineUsers,
  HiOutlineSparkles,
} from 'react-icons/hi';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, eventsRes] = await Promise.all([
        api.get('/events/admin/stats'),
        api.get('/events?status='), // fetch all events including cancelled
      ]);
      setStats(statsRes.data.stats);
      setEvents(eventsRes.data.events);
    } catch (err: any) {
      toast.error('Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCancelEvent = async (id: number, title: string) => {
    if (!window.confirm(`Are you sure you want to cancel "${title}"?`)) {
      return;
    }

    try {
      await api.delete(`/events/${id}`);
      toast.success(`Event "${title}" has been cancelled`);
      fetchDashboardData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to cancel event');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  const categoryBadgeColors: Record<string, string> = {
    TECH: 'bg-blue-100 text-blue-700 border-blue-200',
    CULTURAL: 'bg-purple-100 text-purple-700 border-purple-200',
    WORKSHOP: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    INFORMALS: 'bg-amber-100 text-amber-700 border-amber-200',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200 mb-2">
            <HiOutlineSparkles /> Admin Control Center
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Event Management & Analytics
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time analytics, registrations ledger, and event administration
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/events/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-100 hover:shadow-lg transition cursor-pointer"
          >
            <HiOutlinePlus className="w-5 h-5" />
            <span>Create Event</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Events</p>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
              {stats?.totalEvents ?? 0}
            </h3>
            <p className="text-xs text-indigo-600 font-medium mt-1">Active across categories</p>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <HiOutlineCalendar className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Registrations</p>
            <h3 className="text-3xl font-extrabold text-emerald-600 mt-1">
              {stats?.totalRegistrations ?? 0}
            </h3>
            <p className="text-xs text-emerald-600 font-medium mt-1">Confirmed student entries</p>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <HiOutlineTicket className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Revenue</p>
            <h3 className="text-3xl font-extrabold text-amber-600 mt-1">
              ₹{stats?.totalRevenue ?? 0}
            </h3>
            <p className="text-xs text-amber-600 font-medium mt-1">Via Razorpay Gateway</p>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <HiOutlineCurrencyRupee className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Students</p>
            <h3 className="text-3xl font-extrabold text-violet-600 mt-1">
              {stats?.activeUsers ?? 0}
            </h3>
            <p className="text-xs text-violet-600 font-medium mt-1">Registered student profiles</p>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <HiOutlineUserGroup className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Category Breakdown (GROUP BY) */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span>Registration Breakdown by Category</span>
          <span className="text-xs font-normal text-slate-400">(DBMS GROUP BY aggregation)</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(['TECH', 'CULTURAL', 'WORKSHOP', 'INFORMALS'] as const).map((cat) => (
            <div
              key={cat}
              className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between"
            >
              <div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${categoryBadgeColors[cat]}`}>
                  {cat}
                </span>
                <p className="text-2xl font-black text-slate-800 mt-2">
                  {stats?.categoryCounts[cat] ?? 0}
                </p>
                <p className="text-xs text-slate-500">Registrations</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">All Campus Events</h2>
            <p className="text-xs text-slate-500">Manage, update, or inspect attendees</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-600 rounded-full w-fit">
            Showing {events.length} Events
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase text-slate-500 tracking-wider">
              <tr>
                <th className="px-6 py-4">Event Details</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Date & Venue</th>
                <th className="px-6 py-4">Capacity</th>
                <th className="px-6 py-4">Fee</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {events.map((event) => {
                const regCount = event._count?.registrations ?? 0;
                const capacityPercentage = Math.min(100, Math.round((regCount / event.maxCapacity) * 100));

                return (
                  <tr key={event.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        {event.imageUrl ? (
                          <img
                            src={event.imageUrl}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                            <HiOutlineCalendar className="w-6 h-6" />
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-slate-900 leading-snug">{event.title}</div>
                          <div className="text-xs text-slate-500 truncate max-w-xs">{event.description}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${categoryBadgeColors[event.category]}`}>
                        {event.category}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">
                        {new Date(event.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                      <div className="text-xs text-slate-500">{event.venue}</div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="w-32">
                        <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                          <span>{regCount} / {event.maxCapacity}</span>
                          <span>{capacityPercentage}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              capacityPercentage >= 90
                                ? 'bg-rose-500'
                                : capacityPercentage >= 50
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${capacityPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {Number(event.fee) === 0 ? (
                        <span className="text-emerald-600 font-bold">Free</span>
                      ) : (
                        `₹${event.fee}`
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          event.status === 'UPCOMING'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : event.status === 'ONGOING'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : event.status === 'COMPLETED'
                            ? 'bg-slate-100 text-slate-600 border border-slate-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {event.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        to={`/admin/events/${event.id}/registrations`}
                        className="inline-flex items-center p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        title="View Registered Students"
                      >
                        <HiOutlineUsers className="w-5 h-5" />
                      </Link>

                      <Link
                        to={`/admin/events/${event.id}/edit`}
                        className="inline-flex items-center p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                        title="Edit Event"
                      >
                        <HiOutlinePencilAlt className="w-5 h-5" />
                      </Link>

                      {event.status !== 'CANCELLED' && (
                        <button
                          onClick={() => handleCancelEvent(event.id, event.title)}
                          className="inline-flex items-center p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Cancel Event"
                        >
                          <HiOutlineTrash className="w-5 h-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
