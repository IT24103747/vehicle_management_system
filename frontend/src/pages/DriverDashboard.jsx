import { Car, MapPin, Search } from 'lucide-react';
import { useParking } from '../context/ParkingContext';

export default function DriverDashboard() {
  const { user, setCurrentTab } = useParking();

  return (
    <section className="min-h-[calc(100svh-4rem)] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl bg-slate-900 p-7 text-white shadow-xl sm:p-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-emerald-300">
            <Car size={14} /> Driver dashboard
          </span>
          <h1 className="mt-5 text-3xl font-black sm:text-4xl">Welcome back, {user?.name || 'Driver'}.</h1>
          <p className="mt-3 max-w-xl text-slate-300">Your vehicle: {user?.vehicleNumber || 'Not added yet'}. Find an available parking space before you begin your journey.</p>
          <button onClick={() => setCurrentTab('find')} className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 font-black text-white transition hover:bg-emerald-400">
            <Search size={18} /> Find available parking
          </button>
        </div>
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700"><MapPin size={24} /></div>
            <div><h2 className="font-black text-slate-900">Ready to park?</h2><p className="mt-1 text-sm text-slate-600">Browse live availability, select a green slot, and reserve it in a few clicks.</p></div>
          </div>
        </div>
      </div>
    </section>
  );
}
