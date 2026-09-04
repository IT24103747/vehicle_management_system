import React from 'react';
import { Ticket, Car, Clock, CheckCircle2, ArrowRightLeft, User, Phone } from 'lucide-react';

export default function OwnerReservations({ reservations, onUpdateStatus }) {
  if (!reservations || reservations.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
        <Ticket className="mx-auto text-slate-300 mb-2" size={32} />
        <h4 className="text-base font-bold text-slate-700">No Reservations Found</h4>
        <p className="text-xs text-slate-400 mt-1">Customer driver bookings for your parking locations will appear here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Customer Reservations</h3>
          <p className="text-xs text-slate-500">Manage vehicle check-ins and check-outs</p>
        </div>
        <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold rounded-full">
          {reservations.filter(r => r.status === 'RESERVED' || r.status === 'ACTIVE').length} Active
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Ticket ID</th>
              <th className="py-3 px-4">Vehicle & Driver</th>
              <th className="py-3 px-4">Location & Slot</th>
              <th className="py-3 px-4">Duration & Cost</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {reservations.map((res) => {
              const locationName = res.locationId?.name || 'SLIIT Malabe';
              const slotNumber = res.slotId?.slotNumber || 'P03';

              const isReserved = res.status === 'RESERVED';
              const isActive = res.status === 'ACTIVE';
              const isCompleted = res.status === 'COMPLETED';

              return (
                <tr key={res._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {res.ticketId}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-slate-100 rounded-lg text-slate-700">
                        <Car size={14} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{res.vehicleNumber}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <User size={10} /> {res.driverName || 'Driver'} {res.driverPhone ? `• ${res.driverPhone}` : ''}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-800">{locationName}</p>
                    <span className="inline-block mt-0.5 text-xs font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                      Slot: {slotNumber}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 text-xs font-medium text-slate-700">
                      <Clock size={12} className="text-slate-400" />
                      {res.durationHours} Hours
                    </div>
                    <p className="text-xs font-bold text-emerald-700 mt-0.5">Rs. {res.totalCost}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1 ${
                        isReserved
                          ? 'bg-amber-100 text-amber-800'
                          : isActive
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isReserved && '🟡 RESERVED'}
                      {isActive && '🔴 ACTIVE (OCCUPIED)'}
                      {isCompleted && '🟢 COMPLETED'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {isReserved && (
                      <button
                        onClick={() => onUpdateStatus(res._id, 'ACTIVE')}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all cursor-pointer inline-flex items-center gap-1"
                      >
                        <ArrowRightLeft size={12} /> Mark Vehicle Arrived
                      </button>
                    )}
                    {isActive && (
                      <button
                        onClick={() => onUpdateStatus(res._id, 'COMPLETED')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all cursor-pointer inline-flex items-center gap-1"
                      >
                        <CheckCircle2 size={12} /> Mark Vehicle Departed
                      </button>
                    )}
                    {isCompleted && (
                      <span className="text-xs text-slate-400 font-medium">Completed</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
