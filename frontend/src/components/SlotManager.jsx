import React from 'react';
import { Plus, Trash2, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

export default function SlotManager({ location, slots, onAddSlot, onDeleteSlot, onToggleStatus, onClose }) {
  if (!location) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-slate-900">{location.name}</h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Rs. {location.pricePerHour}/hr
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{location.address}, {location.city}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onAddSlot(location._id)}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Plus size={14} /> Add Parking Slot
          </button>
          <button
            onClick={onClose}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Close Slots View
          </button>
        </div>
      </div>

      {/* Slots Grid */}
      {slots.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <p className="text-sm font-semibold text-slate-600">No parking slots configured yet.</p>
          <p className="text-xs text-slate-400 mt-1">Click "+ Add Parking Slot" to create the first slot.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {slots.map((slot) => {
            const isAvailable = slot.status === 'AVAILABLE';
            const isOccupied = slot.status === 'OCCUPIED';
            const isReserved = slot.status === 'RESERVED';

            return (
              <div
                key={slot._id}
                className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${
                  isAvailable
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : isOccupied
                    ? 'bg-rose-50/50 border-rose-200'
                    : 'bg-amber-50/50 border-amber-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-900">{slot.slotNumber}</span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      isAvailable
                        ? 'bg-emerald-100 text-emerald-800'
                        : isOccupied
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {isAvailable && <><CheckCircle2 size={12} /> AVAILABLE</>}
                    {isOccupied && <><XCircle size={12} /> OCCUPIED</>}
                    {isReserved && <><AlertCircle size={12} /> RESERVED</>}
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-200/50">
                  {/* Status toggle button */}
                  {isAvailable && (
                    <button
                      onClick={() => onToggleStatus(slot._id, 'OCCUPIED')}
                      className="text-xs px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Mark Occupied
                    </button>
                  )}
                  {isOccupied && (
                    <button
                      onClick={() => onToggleStatus(slot._id, 'AVAILABLE')}
                      className="text-xs px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Mark Available
                    </button>
                  )}
                  {isReserved && (
                    <span className="text-[11px] text-amber-700 font-medium italic">
                      Use Reservations tab to check-in
                    </span>
                  )}

                  <button
                    onClick={() => onDeleteSlot(slot._id)}
                    title="Remove Slot"
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white/80 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
