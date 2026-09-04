import React from 'react';
import { ParkingProvider, useParking } from './context/ParkingContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import OperatorDashboard from './pages/OperatorDashboard';
import { Search, CalendarCheck } from 'lucide-react';

function AppContent() {
  const { currentTab, setCurrentTab } = useParking();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar />

      <main className="flex-1">
        {currentTab === 'home' && <HomePage />}

        {/* Placeholder tab for Member 2 */}
        {currentTab === 'find' && (
          <div className="max-w-4xl mx-auto my-16 p-8 bg-white border border-slate-200 rounded-3xl shadow-sm text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Find Parking View</h2>
            <p className="text-slate-600 mt-2 max-w-md mx-auto text-sm">
              Member 2 will plug in the search bar, availability filters, and slot visualizer grid here!
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => setCurrentTab('home')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}

        {/* Placeholder tab for Member 3 */}
        {currentTab === 'reserve' && (
          <div className="max-w-4xl mx-auto my-16 p-8 bg-white border border-slate-200 rounded-3xl shadow-sm text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CalendarCheck size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Reserve Slot View</h2>
            <p className="text-slate-600 mt-2 max-w-md mx-auto text-sm">
              Member 3 will plug in the vehicle reservation form, duration selector, and digital ticket confirmation here!
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => setCurrentTab('home')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}

        {/* Member 4 Operator Dashboard */}
        {currentTab === 'dashboard' && <OperatorDashboard />}
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ParkingProvider>
      <AppContent />
    </ParkingProvider>
  );
}
