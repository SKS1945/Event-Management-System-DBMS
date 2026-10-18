import React from 'react';
import { Link } from 'react-router-dom';
import type { EventItem } from '../types';
import {
  HiOutlineCalendar,
  HiOutlineLocationMarker,
  HiOutlineUserGroup,
  HiOutlineArrowRight,
} from 'react-icons/hi';

interface EventCardProps {
  event: EventItem;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const regCount = event._count?.registrations ?? 0;
  const isFull = regCount >= event.maxCapacity;
  const isCancelled = event.status === 'CANCELLED';
  const remaining = Math.max(0, event.maxCapacity - regCount);

  const categoryBadgeColors: Record<string, string> = {
    TECH: 'bg-blue-600 text-white',
    CULTURAL: 'bg-purple-600 text-white',
    WORKSHOP: 'bg-emerald-600 text-white',
    INFORMALS: 'bg-amber-500 text-white',
  };

  const formattedDate = new Date(event.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col group">
      {/* Banner Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-slate-100 to-indigo-50 text-indigo-400">
            <HiOutlineCalendar className="w-14 h-14" />
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span
            className={`text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm ${
              categoryBadgeColors[event.category] || 'bg-slate-700 text-white'
            }`}
          >
            {event.category}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          <span className="text-xs font-black px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-md text-white shadow-sm">
            {Number(event.fee) === 0 ? 'FREE' : `₹${event.fee}`}
          </span>
        </div>

        {isCancelled && (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center">
            <span className="text-xs font-extrabold uppercase tracking-widest text-white bg-rose-600 px-3 py-1 rounded-full">
              Cancelled
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-indigo-600 transition line-clamp-1">
            {event.title}
          </h3>

          <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          <div className="mt-4 space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <HiOutlineCalendar className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <HiOutlineLocationMarker className="w-4 h-4 text-rose-500 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>
        </div>

        {/* Bottom Capacity & Action */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-500 flex items-center gap-1">
              <HiOutlineUserGroup className="w-4 h-4" /> Capacity
            </span>
            <span
              className={`font-bold ${
                isFull ? 'text-rose-600' : remaining < 10 ? 'text-amber-600' : 'text-slate-700'
              }`}
            >
              {isFull ? 'Sold Out' : `${remaining} spots left`}
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mb-4">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isFull
                  ? 'bg-rose-500'
                  : remaining < 10
                  ? 'bg-amber-500'
                  : 'bg-indigo-600'
              }`}
              style={{
                width: `${Math.min(100, Math.round((regCount / event.maxCapacity) * 100))}%`,
              }}
            ></div>
          </div>

          <Link
            to={`/events/${event.id}`}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
              isCancelled
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed pointer-events-none'
                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white'
            }`}
          >
            <span>View Details & Register</span>
            <HiOutlineArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
