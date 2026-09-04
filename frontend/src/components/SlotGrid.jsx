import { AlertCircle, CheckCircle2, CircleDot, XCircle } from 'lucide-react';

const statusStyles = {
  AVAILABLE: {
    icon: CheckCircle2,
    label: 'Available',
    className: 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:border-emerald-500 hover:bg-emerald-100',
  },
  RESERVED: {
    icon: AlertCircle,
    label: 'Reserved',
    className: 'border-amber-300 bg-amber-50 text-amber-800 cursor-not-allowed opacity-80',
  },
  OCCUPIED: {
    icon: XCircle,
    label: 'Occupied',
    className: 'border-rose-300 bg-rose-50 text-rose-800 cursor-not-allowed opacity-80',
  },
};

function SlotButton({ slot, isSelected, onSelect }) {
  const status = statusStyles[slot.status] || statusStyles.OCCUPIED;
  const StatusIcon = status.icon;
  const isAvailable = slot.status === 'AVAILABLE';

  return (
    <button
      type="button"
      onClick={() => isAvailable && onSelect(slot)}
      disabled={!isAvailable}
      aria-pressed={isSelected}
      aria-label={`${slot.slotNumber} ${status.label}`}
      className={`min-h-20 rounded-xl border-2 px-2 py-2 text-left transition focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
        status.className
      } ${isSelected ? 'ring-2 ring-emerald-600 ring-offset-2 border-emerald-700 bg-emerald-100' : ''}`}
    >
      <span className="flex items-center justify-between gap-2">
        <span className="text-sm font-black text-slate-900">{slot.slotNumber}</span>
        <StatusIcon size={16} aria-hidden="true" />
      </span>
      <span className="mt-2 block text-[11px] font-bold uppercase tracking-wide">{status.label}</span>
      {isSelected && (
        <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
          <CircleDot size={12} aria-hidden="true" /> Selected
        </span>
      )}
    </button>
  );
}

export default function SlotGrid({ slots, selectedSlotId, onSelectSlot }) {
  if (!slots.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
        <p className="text-sm font-bold text-slate-700">No parking slots have been added to this location yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {slots.map((slot) => (
          <SlotButton
            key={slot._id || slot.id}
            slot={slot}
            isSelected={selectedSlotId === (slot._id || slot.id)}
            onSelect={onSelectSlot}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600" aria-label="Parking slot status legend">
        {Object.entries(statusStyles).map(([status, config]) => {
          const StatusIcon = config.icon;
          return (
            <span
              key={status}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${config.className.replace(' hover:border-emerald-500 hover:bg-emerald-100', '')}`}
            >
              <StatusIcon size={13} aria-hidden="true" /> {config.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
