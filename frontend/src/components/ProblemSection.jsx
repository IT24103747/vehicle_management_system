import React from 'react';
import { Clock, Fuel, CheckCircle2 } from 'lucide-react';

export default function ProblemSection() {
  return (
    <section className="py-16 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-wider text-emerald-700 uppercase bg-emerald-100 px-3 py-1 rounded-full">
            Local Sri Lankan Challenge
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3">
            Why Parking in Sri Lanka Needs an Urgent Digital Fix
          </h2>
          <p className="text-slate-600 text-base mt-2">
            In bustling commercial hotspots like Pettah, Colombo City Centre, and student hubs like SLIIT Malabe, finding an open parking spot is a daily struggle.
          </p>
        </div>

        {/* 3 Problem Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center mb-4 font-bold">
              <Clock size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">20–30 Mins Wasted Daily</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Drivers continuously circle congested blocks in Malabe and Colombo, searching blindly for available slots, leading to missed appointments and frustration.
            </p>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-rose-100 text-rose-700 rounded-xl flex items-center justify-center mb-4 font-bold">
              <Fuel size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Fuel Waste & High Costs</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              With high fuel prices in Sri Lanka, idle crawling in bumper-to-bumper traffic just to locate parking burns unnecessary liters of petrol every month.
            </p>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-4 font-bold">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">ParkSL's 2-Minute Solution</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Search nearby lots in real-time, view open spots (🟢), and lock your slot before departing home. Drive directly into your reserved bay with zero hassle.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
