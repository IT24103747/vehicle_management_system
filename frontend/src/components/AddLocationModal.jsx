import React, { useState } from 'react';
import { X, Building2, MapPin, DollarSign, Layers } from 'lucide-react';

export default function AddLocationModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    address: '',
    pricePerHour: '100',
    numberOfSlots: '10',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};

    if (!formData.name.trim()) {
      errs.name = '❌ Parking name is required.';
    }

    if (!formData.city.trim()) {
      errs.city = '❌ Location/City is required.';
    }

    if (!formData.address.trim()) {
      errs.address = '❌ Address is required.';
    }

    const priceNum = Number(formData.pricePerHour);
    if (isNaN(priceNum) || priceNum <= 0) {
      errs.pricePerHour = '❌ Price must be greater than 0.';
    }

    const slotsNum = Number(formData.numberOfSlots);
    if (isNaN(slotsNum) || slotsNum <= 0) {
      errs.numberOfSlots = '❌ Number of slots must be greater than 0.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onAdd({
        name: formData.name.trim(),
        city: formData.city.trim(),
        address: formData.address.trim(),
        pricePerHour: Number(formData.pricePerHour),
        numberOfSlots: Number(formData.numberOfSlots),
      });
      setFormData({
        name: '',
        city: '',
        address: '',
        pricePerHour: '100',
        numberOfSlots: '10',
      });
      setErrors({});
      onClose();
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to add parking location.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">Add Parking Location</h3>
            <p className="text-xs text-slate-400 mt-0.5">Register a new parking facility</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Parking Name */}
          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">Parking Name</label>
            <div className="relative">
              <Building2 size={16} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. SLIIT Malabe Parking"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            {errors.name && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.name}</p>}
          </div>

          {/* Location / City */}
          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">Location / City</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g. Malabe or Colombo 03"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            {errors.city && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.city}</p>}
          </div>

          {/* Address */}
          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g. New Kandy Road, Malabe"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            {errors.address && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Price per Hour */}
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">Price Per Hour (Rs.)</label>
              <div className="relative">
                <DollarSign size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="number"
                  min="1"
                  value={formData.pricePerHour}
                  onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
                  placeholder="100"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              {errors.pricePerHour && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.pricePerHour}</p>}
            </div>

            {/* Number of Slots */}
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">Number of Slots</label>
              <div className="relative">
                <Layers size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="number"
                  min="1"
                  value={formData.numberOfSlots}
                  onChange={(e) => setFormData({ ...formData, numberOfSlots: e.target.value })}
                  placeholder="10"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              {errors.numberOfSlots && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.numberOfSlots}</p>}
            </div>
          </div>

          {errors.submit && <p className="text-rose-600 text-xs font-medium bg-rose-50 p-2.5 rounded-lg">{errors.submit}</p>}

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            >
              {isSubmitting ? 'Creating...' : 'Add Parking Location'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
