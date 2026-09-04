import { ParkingProvider, useParking } from './context/ParkingContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import FindParkingPage from './pages/FindParkingPage';
import ReservationForm from './components/ReservationForm';
import OperatorDashboard from './pages/OperatorDashboard';

function AppContent() {
  const { currentTab } = useParking();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar />

      <main className="flex-1">
        {currentTab === 'home' && <HomePage />}

        {currentTab === 'find' && <FindParkingPage />}

        {/* Member 3 Reservation Form */}
        {currentTab === 'reserve' && <ReservationForm />}

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
