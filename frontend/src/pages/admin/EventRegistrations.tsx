import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import type { Registration, EventItem } from '../../types';
import toast from 'react-hot-toast';
import {
  HiOutlineArrowLeft,
  HiOutlineUserGroup,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineAcademicCap,
} from 'react-icons/hi';

export const EventRegistrations: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const res = await api.get(`/events/${id}/registrations`);
        setEvent(res.data.event);
        setRegistrations(res.data.registrations);
      } catch (err: any) {
        toast.error('Failed to load registrations');
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  const confirmedCount = registrations.filter((r) => r.status === 'CONFIRMED').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <Link
        to="/admin"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition"
      >
        <HiOutlineArrowLeft className="w-4 h-4" /> Back to Admin Dashboard
      </Link>

      {/* Event Overview Card */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Registered Attendees
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">{event?.title}</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Max Capacity: {event?.maxCapacity} seats • Registration Fee: ₹{event?.fee}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 text-center">
            <span className="text-xs font-bold text-slate-400 uppercase">Confirmed</span>
            <div className="text-xl font-black text-emerald-600">{confirmedCount}</div>
          </div>
          <div className="bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 text-center">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Entries</span>
            <div className="text-xl font-black text-slate-900">{registrations.length}</div>
          </div>
        </div>
      </div>

      {/* Registrations List */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        {registrations.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <HiOutlineUserGroup className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Registrations Yet</h3>
            <p className="text-sm text-slate-500 mt-1">Students who register will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase text-slate-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Registered On</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {registrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{reg.user?.name}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <HiOutlineMail className="w-3.5 h-3.5" /> {reg.user?.email}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                        <HiOutlineAcademicCap className="w-4 h-4 text-slate-400" />
                        {reg.user?.department || 'N/A'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      <span className="inline-flex items-center gap-1">
                        <HiOutlinePhone className="w-3.5 h-3.5 text-slate-400" />
                        {reg.user?.phone || 'N/A'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-600 text-xs">
                      {new Date(reg.registeredAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          reg.status === 'CONFIRMED'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : reg.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {reg.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {reg.payment ? (
                        <div className="text-xs">
                          <span
                            className={`font-bold px-2 py-0.5 rounded-full ${
                              reg.payment.status === 'SUCCESS'
                                ? 'bg-emerald-50 text-emerald-700'
                                : reg.payment.status === 'PENDING'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            ₹{reg.payment.amount} • {reg.payment.status}
                          </span>
                          {reg.payment.razorpayPaymentId && (
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                              {reg.payment.razorpayPaymentId}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">None</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
