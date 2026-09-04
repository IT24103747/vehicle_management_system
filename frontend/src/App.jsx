import { ParkingProvider, useParking } from './context/ParkingContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import FindParkingPage from './pages/FindParkingPage';
import OperatorDashboard from './pages/OperatorDashboard';
import { CalendarCheck } from 'lucide-react';

function AppContent() {
  const { currentTab, setCurrentTab, selectedLocation, selectedSlot } = useParking();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar />

      <main className="flex-1">
        {currentTab === 'home' && <HomePage />}

        {currentTab === 'find' && <FindParkingPage />}

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
            {selectedLocation && selectedSlot && (
              <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-left">
                <p className="text-xs font-black uppercase text-emerald-700">Selected Parking Slot</p>
                <p className="mt-1 text-sm font-bold text-slate-900">
                  {selectedLocation.name} - {selectedSlot.slotNumber}
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  Location ID: {selectedLocation.id} | Slot ID: {selectedSlot.id} | Rs. {selectedSlot.pricePerHour}/hour
                </p>
              </div>
            )}
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
