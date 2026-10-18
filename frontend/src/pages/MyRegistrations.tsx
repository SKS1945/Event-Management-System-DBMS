import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import type { Registration } from '../types';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  HiOutlineCalendar,
  HiOutlineLocationMarker,
  HiOutlineTicket,
  HiOutlineTrash,
  HiOutlineArrowRight,
  HiOutlineCheckCircle,
} from 'react-icons/hi';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const MyRegistrations: React.FC = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingRegId, setPayingRegId] = useState<number | null>(null);

  const fetchMyRegistrations = async () => {
    try {
      setLoading(true);
      const res = await api.get('/registrations/my');
      setRegistrations(res.data.registrations);
    } catch (err: any) {
      toast.error('Failed to load your registrations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRegistrations();
  }, []);

  const handleCancel = async (id: number, eventTitle: string) => {
    if (!window.confirm(`Are you sure you want to cancel your registration for "${eventTitle}"?`)) {
      return;
    }

    try {
      await api.delete(`/registrations/${id}`);
      toast.success('Registration cancelled');
      fetchMyRegistrations();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to cancel registration');
    }
  };

  const handlePayNow = async (reg: Registration) => {
    try {
      setPayingRegId(reg.id);
      const orderRes = await api.post('/payments/create-order', {
        registrationId: reg.id,
      });

      const { orderId, amount, keyId } = orderRes.data;

      const options = {
        key: keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: Math.round(Number(amount) * 100),
        currency: 'INR',
        name: 'CampusPulse Events',
        description: `Registration for ${reg.event?.title}`,
        order_id: orderId,
        handler: async (response: any) => {
          try {
            await api.post('/payments/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              registrationId: reg.id,
            });

            toast.success('🎉 Payment verified! Your registration is confirmed.');
            fetchMyRegistrations();
          } catch (verifyErr: any) {
            toast.error(verifyErr.response?.data?.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone || '9999999999',
        },
        theme: {
          color: '#4f46e5',
        },
      };

      if (typeof window.Razorpay !== 'undefined') {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast.error('Razorpay SDK failed to load. Please refresh.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to initialize payment');
    } finally {
      setPayingRegId(null);
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="pb-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Event Registrations
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track your tickets, payment receipts, and registered college activities
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-xl transition"
        >
          <span>Browse More Events</span>
          <HiOutlineArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {registrations.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <HiOutlineTicket className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No Registrations Found</h3>
          <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
            You haven't registered for any events yet. Check out the upcoming campus events and join the action!
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md transition"
          >
            Explore Events <HiOutlineArrowRight />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {registrations.map((reg) => {
            const ev = reg.event;
            if (!ev) return null;

            const isConfirmed = reg.status === 'CONFIRMED';
            const isPending = reg.status === 'PENDING';
            const isCancelled = reg.status === 'CANCELLED';

            return (
              <div
                key={reg.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-start space-x-4">
                  {ev.imageUrl ? (
                    <img
                      src={ev.imageUrl}
                      alt=""
                      className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                      <HiOutlineCalendar className="w-8 h-8" />
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          categoryBadgeColors[ev.category] || 'bg-slate-100'
                        }`}
                      >
                        {ev.category}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          isConfirmed
                            ? 'bg-emerald-100 text-emerald-800'
                            : isPending
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {reg.status}
                      </span>
                    </div>

                    <Link
                      to={`/events/${ev.id}`}
                      className="text-lg font-bold text-slate-900 hover:text-indigo-600 transition block"
                    >
                      {ev.title}
                    </Link>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <HiOutlineCalendar className="w-4 h-4 text-slate-400" />
                        {new Date(ev.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <HiOutlineLocationMarker className="w-4 h-4 text-slate-400" />
                        {ev.venue}
                      </span>
                      <span>Ticket Fee: <strong>₹{ev.fee}</strong></span>
                    </div>

                    {/* Payment Metadata if available */}
                    {reg.payment && (
                      <div className="text-[11px] text-slate-500 pt-1">
                        Payment: <span className="font-semibold text-emerald-600">{reg.payment.status}</span>
                        {reg.payment.razorpayPaymentId && (
                          <span className="font-mono text-slate-400 ml-2">
                            Ref: {reg.payment.razorpayPaymentId}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  {isPending && (
                    <button
                      onClick={() => handlePayNow(reg)}
                      disabled={payingRegId === reg.id}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition disabled:opacity-50 cursor-pointer"
                    >
                      {payingRegId === reg.id ? 'Processing...' : `Pay ₹${ev.fee}`}
                    </button>
                  )}

                  {isConfirmed && (
                    <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold px-3 py-1.5 bg-emerald-50 rounded-xl">
                      <HiOutlineCheckCircle className="w-4 h-4" /> Confirmed
                    </div>
                  )}

                  {!isCancelled && (
                    <button
                      onClick={() => handleCancel(reg.id, ev.title)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                      title="Cancel Registration"
                    >
                      <HiOutlineTrash className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
