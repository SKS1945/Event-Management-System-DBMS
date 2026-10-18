import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiSparkles, HiOutlineArrowRight } from 'react-icons/hi';

export const Home: React.FC = () => {
  const { user, isAdmin } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white p-8 md:p-14 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-semibold mb-6 border border-white/10">
            <HiSparkles className="text-amber-400" /> College Events 2026 Season
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Discover & Join Campus Events That Inspire
          </h1>
          <p className="mt-4 text-indigo-100 text-base md:text-lg">
            From high-stakes hackathons and soulful cultural fests to hands-on AI workshops and exhilarating informals like laser tag & soapy football.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            {isAdmin ? (
              <Link
                to="/admin"
                className="px-6 py-3 rounded-xl bg-white text-indigo-950 font-bold hover:bg-indigo-50 shadow-lg transition flex items-center gap-2"
              >
                Go to Admin Dashboard <HiOutlineArrowRight />
              </Link>
            ) : user ? (
              <Link
                to="/my-registrations"
                className="px-6 py-3 rounded-xl bg-white text-indigo-950 font-bold hover:bg-indigo-50 shadow-lg transition flex items-center gap-2"
              >
                View My Registrations <HiOutlineArrowRight />
              </Link>
            ) : (
              <Link
                to="/register"
                className="px-6 py-3 rounded-xl bg-white text-indigo-950 font-bold hover:bg-indigo-50 shadow-lg transition flex items-center gap-2"
              >
                Get Started Now <HiOutlineArrowRight />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
