import { useEffect, useMemo, useState } from 'react';
import { Banknote, MapPin, Navigation, Ticket } from 'lucide-react';
import SlotGrid from './SlotGrid';

function getAvailabilityLabel(availableSlots) {
  if (availableSlots === 0) return 'Full';
  if (availableSlots <= 3) return 'Few Slots Left';
  return 'Available';
}

function getBadgeClass(label) {
  if (label === 'Full') return 'bg-rose-50 text-rose-700 border-rose-200';
  if (label === 'Few Slots Left') return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-emerald-50 text-emerald-700 border-emerald-200';
}

export default function ParkingCard({ location, slots, onReserve }) {
  const [selectedSlotId, setSelectedSlotId] = useState(null);

  const availableSlots = useMemo(
    () => slots.filter((slot) => slot.status === 'AVAILABLE').length,
    [slots],
  );
  const totalSlots = slots.length;
  const badgeLabel = getAvailabilityLabel(availableSlots);
  const isFull = availableSlots === 0;
  const selectedSlot = slots.find((slot) => (slot._id || slot.id) === selectedSlotId && slot.status === 'AVAILABLE') || null;

  useEffect(() => {
    if (!selectedSlotId) return undefined;

    const freshSlot = slots.find((slot) => (slot._id || slot.id) === selectedSlotId);
    if (freshSlot?.status === 'AVAILABLE') return undefined;

    const clearSelectionTimer = window.setTimeout(() => {
      setSelectedSlotId(null);
    }, 0);

    return () => window.clearTimeout(clearSelectionTimer);
  }, [selectedSlotId, slots]);

  const handleReserve = () => {
    if (!selectedSlot || selectedSlot.status !== 'AVAILABLE') return;
    onReserve(location, selectedSlot);
  };

  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-black text-slate-900">{location.name}</h2>
          <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-slate-600">
            <MapPin size={15} className="text-emerald-600" aria-hidden="true" />
            {location.city}
          </p>
          {location.address && (
            <p className="mt-1 text-sm leading-6 text-slate-500">{location.address}</p>
          )}
        </div>

        <span className={`inline-flex shrink-0 items-center justify-center rounded-full border px-3 py-1 text-xs font-black ${getBadgeClass(badgeLabel)}`}>
          {badgeLabel}
        </span>
      </div>

      <div className="my-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase text-slate-500">Slots Available</p>
          <p className="mt-1 text-2xl font-black text-slate-900">
            <span className={availableSlots > 0 ? 'text-emerald-600' : 'text-rose-600'}>{availableSlots}</span>
            <span className="text-slate-400"> / {totalSlots}</span>
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase text-slate-500">Hourly Price</p>
          <p className="mt-1 flex items-center gap-1 text-2xl font-black text-slate-900">
            <Banknote size={20} className="text-emerald-600" aria-hidden="true" />
            Rs. {location.pricePerHour}/hour
          </p>
        </div>
      </div>

      <div className="flex-1">
        <SlotGrid
          slots={slots}
          selectedSlotId={selectedSlot ? selectedSlot._id || selectedSlot.id : null}
          onSelectSlot={(slot) => setSelectedSlotId(slot._id || slot.id)}
        />
      </div>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <div className="mb-3 min-h-5 text-sm font-bold text-slate-700">
          {selectedSlot ? `Selected Slot: ${selectedSlot.slotNumber}` : 'Select an available slot to reserve.'}
        </div>
        <button
          type="button"
          onClick={handleReserve}
          disabled={!selectedSlot || isFull}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-black text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
        >
          {isFull ? (
            <>
              <Navigation size={17} aria-hidden="true" /> No Slots Available
            </>
          ) : (
            <>
              <Ticket size={17} aria-hidden="true" /> Reserve Selected Slot
            </>
          )}
        </button>
      </div>
    </article>
  );
}
