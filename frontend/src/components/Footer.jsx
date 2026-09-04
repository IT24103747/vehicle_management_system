import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xl font-bold text-white tracking-tight">Park<span className="text-emerald-500">SL</span></span>
          <p className="text-xs text-slate-400 mt-1">SE3090 Mini Hackathon • Built for Sri Lanka</p>
        </div>
        <div className="text-xs text-slate-400 text-center sm:text-right">
          <p>Covering Colombo City Centre, SLIIT Malabe & Kaduwela Town</p>
          <p className="mt-1 text-slate-500">© 2026 ParkSL Team. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
