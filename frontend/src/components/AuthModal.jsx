import React, { useState } from 'react';
import axios from 'axios';
import { useParking } from '../context/ParkingContext';
import { X, User, Phone, Car, ShieldCheck, Mail, Lock, KeyRound } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default function AuthModal({ isOpen, onClose }) {
  const { loginUser } = useParking();
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    vehicleNumber: '',
    role: 'DRIVER' // 'DRIVER' or 'OPERATOR'
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};

    if (activeTab === 'login') {
      if (!formData.email.trim() && !formData.phone.trim()) {
        errs.loginId = 'Please enter your Email or Mobile Number';
      }
      if (formData.email.trim() && !formData.password) {
        errs.password = 'Password is required for email login';
      }
    } else {
      if (!formData.name.trim()) errs.name = 'Please enter your full name';
      
      const phoneRegex = /^(?:0|94|\+94)?(7[0-9]{8})$/;
      if (!formData.phone.trim()) {
        errs.phone = 'Mobile number is required';
      } else if (!phoneRegex.test(formData.phone.replace(/\s+/g, ''))) {
        errs.phone = 'Enter a valid Sri Lankan mobile number (e.g., 0771234567)';
      }

      if (formData.role === 'DRIVER') {
        const vehicleRegex = /^[A-Z]{2,3}-[0-9]{4}$|^[0-9]{2,3}-[0-9]{4}$|^[A-Z]{2}\s[A-Z]{2,3}-[0-9]{4}$/i;
        if (!formData.vehicleNumber.trim()) {
          errs.vehicleNumber = 'Vehicle number is required for drivers';
        } else if (!vehicleRegex.test(formData.vehicleNumber.trim())) {
          errs.vehicleNumber = 'Format example: CAB-1234, WP BD-5678, or 65-1234';
        }
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitError('');
    setIsSubmitting(true);

    try {
      if (activeTab === 'login') {
        const payload = formData.email.trim() 
          ? { email: formData.email.trim(), password: formData.password }
          : { phone: formData.phone.trim() };

        const response = await axios.post(`${API_BASE}/api/auth/login`, payload);
        loginUser(response.data.user);
        onClose();
      } else {
        const response = await axios.post(`${API_BASE}/api/auth/register`, formData);
        loginUser(response.data.user);
        onClose();
      }
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickFillOwner = () => {
    setActiveTab('login');
    setFormData({
      ...formData,
      email: 'owner@parksl.lk',
      password: 'Password123',
      role: 'OPERATOR'
    });
    setErrors({});
    setSubmitError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-100">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">{activeTab === 'login' ? 'Sign In to ParkSL' : 'Join ParkSL'}</h3>
            <p className="text-xs text-slate-400 mt-0.5">Smart Parking for Sri Lanka</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setSubmitError(''); }}
            className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'login' ? 'border-emerald-600 text-emerald-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('register'); setSubmitError(''); }}
            className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'register' ? 'border-emerald-600 text-emerald-700 bg-white' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Register Account
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {activeTab === 'login' ? (
            <>
              {/* Email / Username */}
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Email Address or Mobile</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={formData.email || formData.phone}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val.includes('@')) {
                        setFormData({ ...formData, email: val, phone: '' });
                      } else {
                        setFormData({ ...formData, phone: val, email: '' });
                      }
                    }}
                    placeholder="owner@parksl.lk or 0771234567"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                {errors.loginId && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.loginId}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter password"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                {errors.password && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.password}</p>}
              </div>

              {/* Quick Fill Owner Credentials Banner */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <KeyRound size={16} className="text-emerald-700" />
                  <div>
                    <p className="text-xs font-bold text-emerald-900">Parking Owner Credentials</p>
                    <p className="text-[11px] text-emerald-700">owner@parksl.lk / Password123</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={quickFillOwner}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Quick Fill
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Role Switcher */}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5 uppercase tracking-wide">Account Type</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'DRIVER' })}
                    className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      formData.role === 'DRIVER' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Car size={14} /> Driver
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'OPERATOR' })}
                    className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      formData.role === 'OPERATOR' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ShieldCheck size={14} /> Parking Owner
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Kasun Perera"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                {errors.name && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.name}</p>}
              </div>

              {/* Mobile Number */}
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Sri Lankan Mobile Number</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0771234567"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                {errors.phone && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.phone}</p>}
              </div>

              {/* Vehicle Number (Shown for drivers) */}
              {formData.role === 'DRIVER' && (
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Vehicle License Plate</label>
                  <div className="relative">
                    <Car size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={formData.vehicleNumber}
                      onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                      placeholder="e.g. CAB-1234 or WP BD-5678"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl uppercase focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  {errors.vehicleNumber && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.vehicleNumber}</p>}
                </div>
              )}
            </>
          )}

          {submitError && <p className="text-rose-600 text-xs font-medium bg-rose-50 p-2.5 rounded-lg border border-rose-200">{submitError}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
          >
            {isSubmitting ? 'Processing...' : activeTab === 'login' ? 'Sign In' : 'Create Free Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
