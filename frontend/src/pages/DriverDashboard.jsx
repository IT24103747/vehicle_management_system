import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, CalendarClock, Car, Clock, Loader2, MapPin, ReceiptText, RefreshCw, Search, Ticket } from 'lucide-react';
import { useParking } from '../context/ParkingContext';

function normalizeReservation(reservation) {
  const location = reservation.locationId || {};
  const slot = reservation.slotId || {};

  return {
    id: reservation._id || reservation.id || reservation.ticketId,
    ticketId: reservation.ticketId,
    locationName: reservation.locationName || location.name || 'ParkSL Hub',
    address: reservation.address || location.address || location.city || 'Sri Lanka',
    slotNumber: reservation.slotNumber || slot.slotNumber || 'P01',
    vehicleNumber: reservation.vehicleNumber,
    driverName: reservation.driverName,
    driverPhone: reservation.driverPhone,
    durationHours: reservation.durationHours,
    totalCost: reservation.totalCost,
    status: reservation.status || 'RESERVED',
    createdAt: reservation.createdAt,
  };
}

function statusClass(status) {
  if (status === 'ACTIVE') return 'border-rose-200 bg-rose-50 text-rose-700';
  if (status === 'COMPLETED') return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  if (status === 'CANCELLED') return 'border-slate-200 bg-slate-100 text-slate-600';
  return 'border-amber-200 bg-amber-50 text-amber-700';
}

export default function DriverDashboard() {
  const { user, setCurrentTab, fetchDriverReservations } = useParking();
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const localReservations = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('parksl_my_reservations') || '[]').map(normalizeReservation);
    } catch {
      return [];
    }
  }, []);

  const loadReservations = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await fetchDriverReservations(user);
      const backendReservations = data.map(normalizeReservation);
      const existingTicketIds = new Set(backendReservations.map((item) => item.ticketId));
      const mergedLocalReservations = localReservations.filter((item) => !existingTicketIds.has(item.ticketId));
      setReservations([...backendReservations, ...mergedLocalReservations]);
    } catch (err) {
      console.error('Error loading driver reservation history:', err);
      setReservations(localReservations);
      setError('Could not load live reservation history. Showing saved reservations from this browser.');
    } finally {
      setIsLoading(false);
    }
  }, [fetchDriverReservations, localReservations, user]);

  useEffect(() => {
    const timer = window.setTimeout(loadReservations, 0);
    return () => window.clearTimeout(timer);
  }, [loadReservations]);

  const activeReservations = reservations.filter((reservation) => (
    reservation.status === 'RESERVED' || reservation.status === 'ACTIVE'
  ));

  return (
    <section className="min-h-[calc(100svh-4rem)] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl bg-slate-900 p-7 text-white shadow-xl sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-emerald-300">
                <Car size={14} /> Driver dashboard
              </span>
              <h1 className="mt-5 text-3xl font-black sm:text-4xl">Welcome back, {user?.name || 'Driver'}.</h1>
              <p className="mt-3 max-w-xl text-slate-300">Your vehicle: {user?.vehicleNumber || 'Not added yet'}. Find an available parking space before you begin your journey.</p>
            </div>
            <button onClick={() => setCurrentTab('find')} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 font-black text-white transition hover:bg-emerald-400">
              <Search size={18} /> Find available parking
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase text-slate-500">Total Reservations</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{reservations.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase text-slate-500">Active Bookings</p>
            <p className="mt-2 text-3xl font-black text-amber-600">{activeReservations.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase text-slate-500">Vehicle</p>
            <p className="mt-2 text-xl font-black text-slate-900">{user?.vehicleNumber || 'Not added'}</p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700"><MapPin size={24} /></div>
            <div><h2 className="font-black text-slate-900">Ready to park?</h2><p className="mt-1 text-sm text-slate-600">Browse live availability, select a green slot, and reserve it in a few clicks.</p></div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-black text-slate-900">
                <ReceiptText size={20} className="text-emerald-600" /> Reservation History
              </h2>
              <p className="mt-1 text-xs text-slate-500">Your reserved, active, and completed parking bookings.</p>
            </div>
            <button
              type="button"
              onClick={loadReservations}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-200"
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs font-bold text-amber-800">
              <AlertCircle size={15} className="mt-0.5 shrink-0" /> {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex min-h-40 items-center justify-center">
              <div className="text-center">
                <Loader2 size={28} className="mx-auto animate-spin text-emerald-600" />
                <p className="mt-2 text-sm font-bold text-slate-500">Loading reservation history...</p>
              </div>
            </div>
          ) : reservations.length === 0 ? (
            <div className="py-10 text-center">
              <Ticket size={34} className="mx-auto text-slate-300" />
              <h3 className="mt-3 text-base font-black text-slate-800">No Reservations Yet</h3>
              <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">Once you reserve a parking slot, your digital parking passes will appear here.</p>
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
              {reservations.map((reservation) => (
                <article key={reservation.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-lg font-black text-slate-900">{reservation.ticketId}</p>
                      <p className="mt-1 text-sm font-bold text-slate-700">{reservation.locationName}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{reservation.address}</p>
                    </div>
                    <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-black ${statusClass(reservation.status)}`}>
                      {reservation.status}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl bg-white p-3">
                      <p className="font-bold uppercase text-slate-400">Slot</p>
                      <p className="mt-1 font-black text-slate-900">{reservation.slotNumber}</p>
                    </div>
                    <div className="rounded-xl bg-white p-3">
                      <p className="font-bold uppercase text-slate-400">Vehicle</p>
                      <p className="mt-1 font-black text-slate-900">{reservation.vehicleNumber}</p>
                    </div>
                    <div className="rounded-xl bg-white p-3">
                      <p className="flex items-center gap-1 font-bold uppercase text-slate-400"><Clock size={12} /> Duration</p>
                      <p className="mt-1 font-black text-slate-900">{reservation.durationHours} Hours</p>
                    </div>
                    <div className="rounded-xl bg-white p-3">
                      <p className="flex items-center gap-1 font-bold uppercase text-slate-400"><CalendarClock size={12} /> Total</p>
                      <p className="mt-1 font-black text-emerald-700">Rs. {reservation.totalCost}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
