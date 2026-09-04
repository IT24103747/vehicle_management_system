import React from 'react';
import { useParking } from '../context/ParkingContext';
import ProblemSection from '../components/ProblemSection';
import { Search, ArrowRight, MapPin, CheckCircle, Sparkles } from 'lucide-react';

export default function HomePage() {
  const { setCurrentTab, user } = useParking();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[calc(100svh-4rem)] overflow-hidden flex items-center py-12 sm:py-16 bg-gradient-to-b from-emerald-50/60 via-white to-white">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-full mb-6 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-pulse"></span>
            Smart Parking Solution for Sri Lanka
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
            Find Parking. <span className="text-emerald-600">Reserve Your Slot.</span> Save Your Time.
          </h1>

          <p className="mt-5 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Eliminate parking headaches in Colombo, Malabe, and beyond. Real-time slot visibility and instant reservations at your fingertips.
          </p>

          {user?.role === 'DRIVER' && (
            <div className="mt-8 flex items-center justify-center">
              <button
                onClick={() => setCurrentTab('find')}
                className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Search size={18} /> Find Available Parking
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {/* Live Quick Counters */}
          <div className="mt-14 max-w-3xl mx-auto grid grid-cols-3 divide-x divide-slate-200 bg-white border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-100 p-5 sm:p-6">
            <div>
              <p className="text-2xl sm:text-4xl font-black text-emerald-600">12</p>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Active Locations</p>
            </div>
            <div>
              <p className="text-2xl sm:text-4xl font-black text-slate-900">86</p>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Available Slots</p>
            </div>
            <div>
              <p className="text-2xl sm:text-4xl font-black text-emerald-600">124</p>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Today's Bookings</p>
            </div>
          </div>

        </div>
      </section>

      {/* Sri Lankan Problem Section */}
      <ProblemSection />
    </div>
  );
}
