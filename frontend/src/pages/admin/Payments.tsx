import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import type { Payment } from '../../types';
import toast from 'react-hot-toast';
import {
  HiOutlineCreditCard,
  HiOutlineCurrencyRupee,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineRefresh,
  HiOutlineArrowLeft,
  HiOutlineMail,
  HiOutlineAcademicCap,
} from 'react-icons/hi';

interface PaymentSummary {
  totalRecords: number;
  totalCollected: number;
  successCount: number;
  pendingCount: number;
  refundedCount: number;
}

export const Payments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [summary, setSummary] = useState<PaymentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const url = selectedFilter === 'ALL' ? '/payments' : `/payments?status=${selectedFilter}`;
      const res = await api.get(url);
      setPayments(res.data.payments);
      setSummary(res.data.summary);
    } catch (err: any) {
      toast.error('Failed to load payments ledger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [selectedFilter]);

  if (loading && !summary) {
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
      <Link
        to="/admin"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition"
      >
        <HiOutlineArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Razorpay Payments & Financial Ledger
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Reconcile student fee payments, UPI transactions, and refund audits
          </p>
        </div>

        <button
          onClick={fetchPayments}
          className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer self-start sm:self-auto"
        >
          <HiOutlineRefresh className="w-4 h-4" /> Refresh Ledger
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Revenue</p>
            <h3 className="text-3xl font-black text-amber-600 mt-1">
              ₹{summary?.totalCollected ?? 0}
            </h3>
            <p className="text-xs text-slate-500 mt-1">Net confirmed collections</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <HiOutlineCurrencyRupee className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Successful</p>
            <h3 className="text-3xl font-black text-emerald-600 mt-1">
              {summary?.successCount ?? 0}
            </h3>
            <p className="text-xs text-emerald-600 font-medium mt-1">Completed orders</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <HiOutlineCheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending</p>
            <h3 className="text-3xl font-black text-amber-500 mt-1">
              {summary?.pendingCount ?? 0}
            </h3>
            <p className="text-xs text-slate-500 mt-1">Awaiting checkout</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <HiOutlineClock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Refunded</p>
            <h3 className="text-3xl font-black text-purple-600 mt-1">
              {summary?.refundedCount ?? 0}
            </h3>
            <p className="text-xs text-slate-500 mt-1">Cancelled registrations</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <HiOutlineRefresh className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {(['ALL', 'SUCCESS', 'PENDING', 'REFUNDED'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              selectedFilter === filter
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {filter === 'ALL' ? 'All Transactions' : filter}
          </button>
        ))}
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        {payments.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <HiOutlineCreditCard className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Transactions Found</h3>
            <p className="text-sm text-slate-500 mt-1">
              Payments made by students through Razorpay will be tracked here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase text-slate-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Transaction Details</th>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Event</th>
                  <th className="px-6 py-4">Amount & Method</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => {
                  const student = p.registration?.user;
                  const event = p.registration?.event;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-6 py-4">
                        <div className="font-mono text-xs font-bold text-slate-800">
                          {p.razorpayPaymentId || p.razorpayOrderId || `TXN-#${p.id}`}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          Order: {p.razorpayOrderId || 'N/A'}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{student?.name || 'Unknown'}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <HiOutlineMail className="w-3.5 h-3.5 text-slate-400" />
                          {student?.email}
                        </div>
                        {student?.department && (
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <HiOutlineAcademicCap className="w-3.5 h-3.5 text-slate-400" />
                            {student.department}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800 max-w-xs truncate">
                          {event?.title}
                        </div>
                        {event && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block mt-1 ${
                              categoryBadgeColors[event.category] || 'bg-slate-100'
                            }`}
                          >
                            {event.category}
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-extrabold text-base text-slate-900">₹{p.amount}</div>
                        <div className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">
                          {p.method}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`text-xs font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                            p.status === 'SUCCESS'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : p.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : p.status === 'REFUNDED'
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-500">
                        {new Date(p.paidAt || p.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
