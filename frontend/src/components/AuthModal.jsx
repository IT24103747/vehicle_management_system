import { useState } from 'react';
import axios from 'axios';
import { Car, Lock, Mail, Phone, User, X } from 'lucide-react';
import { useParking } from '../context/ParkingContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';
const passwordRule = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

export default function AuthModal({ isOpen, onClose }) {
  const { loginUser } = useParking();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', phone: '', vehicleNumber: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const validate = () => {
    const next = {};
    const phoneRule = /^(?:0|94|\+94)?(7[0-9]{8})$/;
    if (mode === 'login') {
      if (!form.email.trim()) next.email = 'Email is required.';
    } else {
      if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = 'Use a valid email address.';
      if (!form.phone.trim()) next.phone = 'Mobile number is required.';
      else if (!phoneRule.test(form.phone.replace(/\s+/g, ''))) next.phone = 'Use a valid Sri Lankan mobile number, e.g. 0771234567.';
    }
    if (!form.password) next.password = 'Password is required.';
    else if (!passwordRule.test(form.password)) next.password = 'Use at least 8 characters with letters and numbers.';
    if (mode === 'register') {
      if (!form.name.trim()) next.name = 'Please enter your full name.';
      if (!form.vehicleNumber.trim()) next.vehicleNumber = 'Vehicle number is required.';
      if (form.password !== form.confirmPassword) next.confirmPassword = 'Passwords do not match.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitError('');
    setIsSubmitting(true);
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const payload = mode === 'login' ? { email: form.email, password: form.password } : form;
      const { data } = await axios.post(`${API_BASE}${endpoint}`, payload);
      loginUser(data.user);
      onClose();
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Could not connect to ParkSL. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = 'w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500';
  const field = (label, key, type, Icon, placeholder) => (
    <div>
      <label className="mb-1 block text-xs font-semibold text-slate-700">{label}</label>
      <div className="relative"><Icon size={16} className="absolute left-3 top-3 text-slate-400" /><input className={inputClass} type={type} value={form[key]} placeholder={placeholder} onChange={(event) => update(key, event.target.value)} /></div>
      {errors[key] && <p className="mt-1 text-xs font-medium text-rose-600">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between bg-slate-900 p-6 text-white"><div><h2 className="text-xl font-black">{mode === 'login' ? 'Driver Sign In' : 'Driver Registration'}</h2><p className="mt-1 text-xs text-slate-400">ParkSL smart parking</p></div><button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"><X size={20} /></button></div>
        <div className="flex border-b border-slate-200"><button type="button" onClick={() => { setMode('login'); setErrors({}); setSubmitError(''); }} className={`flex-1 py-3 text-xs font-black ${mode === 'login' ? 'border-b-2 border-emerald-600 text-emerald-700' : 'text-slate-500'}`}>Sign In</button><button type="button" onClick={() => { setMode('register'); setErrors({}); setSubmitError(''); }} className={`flex-1 py-3 text-xs font-black ${mode === 'register' ? 'border-b-2 border-emerald-600 text-emerald-700' : 'text-slate-500'}`}>Register</button></div>
        <form onSubmit={submit} className="space-y-4 p-6">
          {mode === 'register' && field('Full Name', 'name', 'text', User, 'e.g. Kasun Perera')}
          {field('Email Address', 'email', 'email', Mail, 'you@example.com')}
          {mode === 'register' && field('Sri Lankan Mobile Number', 'phone', 'tel', Phone, '0771234567')}
          {mode === 'register' && field('Vehicle License Plate', 'vehicleNumber', 'text', Car, 'CAB-1234')}
          {field('Password', 'password', 'password', Lock, '8+ characters, letters and numbers')}
          {mode === 'register' && field('Confirm Password', 'confirmPassword', 'password', Lock, 'Re-enter password')}
          {submitError && <p className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700">{submitError}</p>}
          <button disabled={isSubmitting} className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-black text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400">{isSubmitting ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Driver Account'}</button>
        </form>
      </div>
    </div>
  );
}
