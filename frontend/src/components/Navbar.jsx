import React, { useState } from 'react';
import { useParking } from '../context/ParkingContext';
import AuthModal from './AuthModal';
import { Search, ShieldCheck, LogOut, Menu, X, User } from 'lucide-react';

export default function Navbar() {
  const { user, logoutUser, currentTab, setCurrentTab } = useParking();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div 
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md shadow-emerald-500/30">
              🅿️
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900">Park<span className="text-emerald-600">SL</span></span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">Sri Lanka</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium text-slate-600">
            <button
              onClick={() => setCurrentTab('home')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${currentTab === 'home' ? 'text-emerald-700 bg-emerald-50 font-bold' : 'hover:text-slate-900 hover:bg-slate-50'}`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentTab('find')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${currentTab === 'find' ? 'text-emerald-700 bg-emerald-50 font-bold' : 'hover:text-slate-900 hover:bg-slate-50'}`}
            >
              <Search size={16} /> Find Parking
            </button>
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${currentTab === 'dashboard' ? 'text-emerald-700 bg-emerald-50 font-bold' : 'hover:text-slate-900 hover:bg-slate-50'}`}
            >
              <ShieldCheck size={16} /> Owner Dashboard
            </button>
          </nav>

          {/* User Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-xl shadow-sm">
                <div className="w-8 h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center text-xs font-bold shadow-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-900 leading-tight">{user.name}</p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {user.role} {user.vehicleNumber ? `• ${user.vehicleNumber}` : ''}
                  </p>
                </div>
                <button 
                  onClick={logoutUser}
                  title="Log out"
                  className="ml-2 p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="px-4 py-2 text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <User size={16} /> Register / Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 rounded-lg hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-2">
            <button 
              onClick={() => { setCurrentTab('home'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2 font-medium text-slate-700"
            >
              Home
            </button>
            <button 
              onClick={() => { setCurrentTab('find'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2 font-medium text-slate-700"
            >
              Find Parking
            </button>
            <button 
              onClick={() => { setCurrentTab('dashboard'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2 font-medium text-slate-700"
            >
              Owner Dashboard
            </button>
            <div className="pt-3 border-t border-slate-100">
              {user ? (
                <div className="flex justify-between items-center py-2">
                  <div>
                    <p className="text-sm font-bold">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.role} • {user.phone}</p>
                  </div>
                  <button onClick={logoutUser} className="text-rose-600 text-sm font-medium">Log out</button>
                </div>
              ) : (
                <button
                  onClick={() => { setIsAuthOpen(true); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 bg-emerald-600 text-white font-medium rounded-xl text-center"
                >
                  Register / Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
