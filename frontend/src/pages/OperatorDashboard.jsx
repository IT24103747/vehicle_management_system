import { useState, useEffect } from 'react';
import { useParking } from '../context/ParkingContext';
import OperatorStats from '../components/OperatorStats';
import AddLocationModal from '../components/AddLocationModal';
import EditLocationModal from '../components/EditLocationModal';
import SlotManager from '../components/SlotManager';
import OwnerReservations from '../components/OwnerReservations';
import { Building2, Plus, Edit, Trash2, Layers, RefreshCw, ShieldCheck, Ticket } from 'lucide-react';

export default function OperatorDashboard() {
  const {
    user,
    fetchOwnerStats,
    fetchOwnerLocations,
    addLocation,
    updateLocation,
    deleteLocation,
    fetchLocationSlots,
    addSlotToLocation,
    deleteSlot,
    updateSlotStatus,
    fetchReservations,
    updateReservationStatus,
  } = useParking();

  const [stats, setStats] = useState(null);
  const [locations, setLocations] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);

  // Slot Management State
  const [activeSlotLocation, setActiveSlotLocation] = useState(null);
  const [activeSlots, setActiveSlots] = useState([]);

  // Active Tab View: 'locations' or 'reservations'
  const [dashboardTab, setDashboardTab] = useState('locations');

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [sData, lData, rData] = await Promise.all([
        fetchOwnerStats(),
        fetchOwnerLocations(),
        fetchReservations(),
      ]);
      setStats(sData);
      setLocations(lData);
      setReservations(rData);

      // Refresh active slot view if open
      if (activeSlotLocation) {
        const slots = await fetchLocationSlots(activeSlotLocation._id);
        setActiveSlots(slots);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(loadDashboardData, 0);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handlers for Locations
  const handleAddLocation = async (formData) => {
    await addLocation(formData);
    loadDashboardData();
  };

  const handleUpdateLocation = async (id, formData) => {
    await updateLocation(id, formData);
    loadDashboardData();
  };

  const handleDeleteLocation = async (id) => {
    if (window.confirm('Are you sure you want to remove this parking location and all its slots?')) {
      await deleteLocation(id);
      if (activeSlotLocation?._id === id) {
        setActiveSlotLocation(null);
      }
      loadDashboardData();
    }
  };

  // Handlers for Slots
  const handleManageSlots = async (location) => {
    setActiveSlotLocation(location);
    const slots = await fetchLocationSlots(location._id);
    setActiveSlots(slots);
  };

  const handleAddSlot = async (locationId) => {
    await addSlotToLocation(locationId);
    const updatedSlots = await fetchLocationSlots(locationId);
    setActiveSlots(updatedSlots);
    loadDashboardData();
  };

  const handleDeleteSlot = async (slotId) => {
    await deleteSlot(slotId);
    if (activeSlotLocation) {
      const updatedSlots = await fetchLocationSlots(activeSlotLocation._id);
      setActiveSlots(updatedSlots);
    }
    loadDashboardData();
  };

  const handleToggleSlotStatus = async (slotId, status) => {
    await updateSlotStatus(slotId, status);
    if (activeSlotLocation) {
      const updatedSlots = await fetchLocationSlots(activeSlotLocation._id);
      setActiveSlots(updatedSlots);
    }
    loadDashboardData();
  };

  // Handler for Reservation Status Update
  const handleUpdateReservationStatus = async (reservationId, status) => {
    await updateReservationStatus(reservationId, status);
    loadDashboardData();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <Building2 size={240} />
          </div>

          <div className="space-y-2 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-full">
              <ShieldCheck size={14} /> Parking Owner Dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {user?.name || 'Parking Owner'}
            </h1>
            <p className="text-sm text-slate-400 max-w-xl">
              Manage your parking facilities, monitor live slot availability, add new slots, and check in customer reservations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 z-10">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <Plus size={18} /> Add Parking Location
            </button>
            <button
              onClick={loadDashboardData}
              title="Refresh Dashboard Data"
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Live Metrics Stats */}
        <OperatorStats stats={stats} />

        {/* Main Dashboard Navigation Switcher */}
        <div className="flex border-b border-slate-200 gap-4">
          <button
            onClick={() => setDashboardTab('locations')}
            className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              dashboardTab === 'locations'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Building2 size={16} /> My Parking Locations ({locations.length})
          </button>
          <button
            onClick={() => setDashboardTab('reservations')}
            className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              dashboardTab === 'reservations'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Ticket size={16} /> View Customer Reservations ({reservations.length})
          </button>
        </div>

        {/* Tab Content */}
        {dashboardTab === 'locations' ? (
          <div className="space-y-8">
            {/* Active Slot Manager View (If Selected) */}
            {activeSlotLocation && (
              <SlotManager
                location={activeSlotLocation}
                slots={activeSlots}
                reservations={reservations}
                onAddSlot={handleAddSlot}
                onDeleteSlot={handleDeleteSlot}
                onToggleStatus={handleToggleSlotStatus}
                onClose={() => setActiveSlotLocation(null)}
              />
            )}

            {/* Parking Locations Cards Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Registered Parking Facilities</h3>
                <span className="text-xs text-slate-500 font-medium">Click "Manage Slots" to view individual slots</span>
              </div>

              {locations.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center space-y-3">
                  <Building2 className="mx-auto text-slate-300" size={40} />
                  <h4 className="text-base font-bold text-slate-700">No Parking Locations Added Yet</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Start by registering your first parking lot location (e.g. SLIIT Malabe Parking).
                  </p>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
                  >
                    <Plus size={14} /> Add Parking Location
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {locations.map((loc) => (
                    <div
                      key={loc._id}
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-base font-bold text-slate-900">{loc.name}</h4>
                            <p className="text-xs text-slate-500">{loc.address}, {loc.city}</p>
                          </div>
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            Rs. {loc.pricePerHour}/hr
                          </span>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                          <span className="text-slate-600 font-medium flex items-center gap-1">
                            <Layers size={14} className="text-slate-400" /> Slot Availability
                          </span>
                          <span className="font-bold text-slate-900">
                            <span className="text-emerald-600">{loc.availableSlots}</span> / {loc.totalSlots} Available
                          </span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleManageSlots(loc)}
                          className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
                        >
                          Manage Slots
                        </button>
                        <button
                          onClick={() => setEditingLocation(loc)}
                          title="Edit Location"
                          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteLocation(loc._id)}
                          title="Delete Location"
                          className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Reservations Tab */
          <OwnerReservations
            reservations={reservations}
            onUpdateStatus={handleUpdateReservationStatus}
          />
        )}

      </div>

      {/* Modals */}
      <AddLocationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddLocation}
      />

      <EditLocationModal
        isOpen={!!editingLocation}
        onClose={() => setEditingLocation(null)}
        location={editingLocation}
        onUpdate={handleUpdateLocation}
      />
    </div>
  );
}
