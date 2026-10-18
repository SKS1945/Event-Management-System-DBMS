import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import type { EventItem, Registration } from '../types';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  HiOutlineCalendar,
  HiOutlineLocationMarker,
  HiOutlineUserGroup,
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
  HiOutlineUser,
  HiOutlineInformationCircle,
  HiSparkles,
} from 'react-icons/hi';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [userRegistration, setUserRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/events/${id}`);
      setEvent(res.data.event);
      setUserRegistration(res.data.userRegistration);
    } catch (err: any) {
      toast.error('Failed to load event details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  if (loading || !event) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  const regCount = event._count?.registrations ?? 0;
  const isFull = regCount >= event.maxCapacity;
  const isCancelled = event.status === 'CANCELLED';
  const remaining = Math.max(0, event.maxCapacity - regCount);
  const feeNumber = Number(event.fee);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/events/${id}` } } });
      return;
    }

    try {
      setIsRegistering(true);
      const res = await api.post(`/registrations/${event.id}`);
      toast.success(res.data.message);
      setUserRegistration(res.data.registration);

      // If paid event, trigger payment immediately or prompt
      if (feeNumber > 0) {
        handleInitiatePayment(res.data.registration.id);
      } else {
        fetchEvent();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleInitiatePayment = async (registrationId: number) => {
    try {
      setIsPaying(true);
      const orderRes = await api.post('/payments/create-order', {
        registrationId,
      });

      const { orderId, amount, keyId } = orderRes.data;

      // Launch Razorpay Sandbox Modal
      const options = {
        key: keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: Math.round(Number(amount) * 100),
        currency: 'INR',
        name: 'CampusPulse Events',
        description: `Registration for ${event.title}`,
        order_id: orderId,
        handler: async (response: any) => {
          try {
            await api.post('/payments/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              registrationId,
            });

            toast.success('🎉 Payment verified! Your registration is confirmed.');
            fetchEvent();
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
      toast.error(err.response?.data?.message || 'Failed to initiate payment');
    } finally {
      setIsPaying(false);
    }
  };

  const categoryBadgeColors: Record<string, string> = {
    TECH: 'bg-blue-600 text-white',
    CULTURAL: 'bg-purple-600 text-white',
    WORKSHOP: 'bg-emerald-600 text-white',
    INFORMALS: 'bg-amber-500 text-white',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition"
      >
        <HiOutlineArrowLeft className="w-4 h-4" /> Back to All Events
      </Link>

      {/* Hero Header */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
        <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                  categoryBadgeColors[event.category] || 'bg-slate-800 text-white'
                }`}
              >
                {event.category}
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full">
                {event.status}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {event.title}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm text-slate-600">
              <div className="flex items-center gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <HiOutlineCalendar className="w-5 h-5 text-indigo-600 shrink-0" />
                <div>
                  <span className="block text-[10px] font-bold uppercase text-slate-400">Date & Time</span>
                  <span className="font-semibold text-slate-800">
                    {new Date(event.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <HiOutlineLocationMarker className="w-5 h-5 text-rose-500 shrink-0" />
                <div>
                  <span className="block text-[10px] font-bold uppercase text-slate-400">Venue</span>
                  <span className="font-semibold text-slate-800 truncate">{event.venue}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <HiOutlineUser className="w-4 h-4 text-indigo-500" />
              <span>Organized by: <strong className="text-slate-700">{event.createdBy?.name}</strong></span>
            </div>
            <span>DBMS Event ID: #{event.id}</span>
          </div>
        </div>

        {/* Hero Image */}
        <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full bg-slate-100">
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-indigo-100 to-violet-50 text-indigo-400">
              <HiOutlineCalendar className="w-20 h-20" />
            </div>
          )}
          {isCancelled && (
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center">
              <span className="text-sm font-extrabold uppercase tracking-widest text-white bg-rose-600 px-4 py-2 rounded-full shadow-lg">
                Event Cancelled
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Details & Registration Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Description & Rules */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <HiOutlineInformationCircle className="w-5 h-5 text-indigo-600" />
              <span>Event Overview & Guidelines</span>
            </h2>
            <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {event.description}
            </div>
          </div>

          {/* Highlights */}
          <div className="bg-indigo-50/60 rounded-3xl p-6 border border-indigo-100 space-y-3">
            <h3 className="font-bold text-indigo-950 text-sm flex items-center gap-1.5">
              <HiSparkles className="text-amber-500" /> Important Attendee Instructions
            </h3>
            <ul className="text-xs text-indigo-900/80 space-y-2 list-disc list-inside">
              <li>Carry your college ID card or digital admission pass for verification at the venue.</li>
              <li>Registrations are unique per student and non-transferable.</li>
              <li>Free cancellation available until 24 hours prior to the scheduled start time.</li>
              <li>For team activities (e.g. hackathons, laser tag, football), team leaders register first.</li>
            </ul>
          </div>
        </div>

        {/* Right: Registration & Ticket Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md sticky top-24 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Admission Fee
              </span>
              <div className="text-3xl font-black text-slate-900 mt-1">
                {feeNumber === 0 ? (
                  <span className="text-emerald-600">FREE ENTRY</span>
                ) : (
                  <span>₹{event.fee} <span className="text-xs font-normal text-slate-400">/ attendee</span></span>
                )}
              </div>
            </div>

            {/* Capacity Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-slate-600">
                <span className="flex items-center gap-1">
                  <HiOutlineUserGroup className="w-4 h-4 text-slate-400" /> Capacity
                </span>
                <span className={isFull ? 'font-bold text-rose-600' : 'font-bold text-slate-900'}>
                  {regCount} / {event.maxCapacity} filled
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isFull ? 'bg-rose-500' : remaining < 10 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{
                    width: `${Math.min(100, Math.round((regCount / event.maxCapacity) * 100))}%`,
                  }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-500 text-right">
                {isFull ? 'All spots booked' : `${remaining} spots remaining`}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2">
              {isCancelled ? (
                <div className="text-center py-3 px-4 bg-slate-100 text-slate-500 rounded-xl text-xs font-bold">
                  Event Cancelled
                </div>
              ) : userRegistration && userRegistration.status === 'CONFIRMED' ? (
                <div className="space-y-3">
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                    <HiOutlineCheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>You are registered! Your spot is confirmed.</span>
                  </div>
                  <Link
                    to="/my-registrations"
                    className="block text-center py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
                  >
                    View in My Registrations
                  </Link>
                </div>
              ) : userRegistration && userRegistration.status === 'PENDING' ? (
                <div className="space-y-3">
                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-semibold">
                    Registration Pending: Complete payment of ₹{event.fee} to confirm.
                  </div>
                  <button
                    onClick={() => handleInitiatePayment(userRegistration.id)}
                    disabled={isPaying}
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-md transition disabled:opacity-50 cursor-pointer"
                  >
                    {isPaying ? 'Loading Razorpay...' : `Pay ₹${event.fee} via Razorpay`}
                  </button>
                </div>
              ) : isFull ? (
                <div className="text-center py-3 px-4 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold">
                  Registration Full (Sold Out)
                </div>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={isRegistering}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-md shadow-indigo-200 hover:shadow-lg transition disabled:opacity-50 cursor-pointer"
                >
                  {isRegistering ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Registering...
                    </span>
                  ) : !isAuthenticated ? (
                    'Sign In to Register'
                  ) : feeNumber === 0 ? (
                    'Register for Free'
                  ) : (
                    `Register & Pay ₹${event.fee}`
                  )}
                </button>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center">
              ⚡ Instant confirmation & ticket receipt generated
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
