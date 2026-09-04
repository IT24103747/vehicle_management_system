import React from 'react';
import { Building2, Layers, CheckCircle2, AlertCircle, Car } from 'lucide-react';

export default function OperatorStats({ stats }) {
  const cards = [
    {
      title: 'My Parking Locations',
      value: stats?.totalLocations || 0,
      icon: Building2,
      color: 'bg-blue-500/10 text-blue-600 border-blue-200',
    },
    {
      title: 'Total Slots',
      value: stats?.totalSlots || 0,
      icon: Layers,
      color: 'bg-slate-500/10 text-slate-700 border-slate-200',
    },
    {
      title: 'Available Slots',
      value: stats?.availableSlots || 0,
      icon: CheckCircle2,
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
    },
    {
      title: 'Reserved Slots',
      value: stats?.reservedSlots || 0,
      icon: AlertCircle,
      color: 'bg-amber-500/10 text-amber-600 border-amber-200',
    },
    {
      title: 'Occupied Slots',
      value: stats?.occupiedSlots || 0,
      icon: Car,
      color: 'bg-rose-500/10 text-rose-600 border-rose-200',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-2xl border bg-white shadow-sm flex flex-col justify-between transition-all hover:shadow-md ${card.color}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{card.title}</span>
              <div className={`p-2 rounded-xl ${card.color}`}>
                <Icon size={18} />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-slate-900">{card.value}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
