import { useState } from 'react';
import { 
  Car, 
  Clock, 
  Phone, 
  User, 
  AlertCircle, 
  Calendar, 
  MapPin, 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles
} from 'lucide-react';
import { useParking } from '../context/ParkingContext';
import ReservationReceipt from './ReservationReceipt';

export default function ReservationForm() {
  const { 
    selectedLocation, 
    selectedSlot, 
    setCurrentTab, 
    createReservation,
    user 
  } = useParking();

  // Form State
  const [driverName, setDriverName] = useState(user?.name || '');
  const [driverPhone, setDriverPhone] = useState(user?.phone || '');
  const [vehicleNumber, setVehicleNumber] = useState(user?.vehicleNumber || '');
  const [durationHours, setDurationHours] = useState(2);
  
  // UI & Feedback State
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState(null);

  // Sri Lankan Validation Regex
  // Matches: "CAB-1234", "WP CAB-1234", "65-4321", "CP CAD-5678", "WP 12-3456", etc.
  const sriLankanPlateRegex = /^(?:[A-Z]{2,3}-\d{4}|\d{2,3}-\d{4}|(?:WP|CP|SP|NP|EP|NW|NC|UP|SG)\s+[A-Z]{2,3}-\d{4}|(?:WP|CP|SP|NP|EP|NW|NC|UP|SG)\s+\d{2,3}-\d{4})$/i;
  // Matches 10-digit Sri Lankan mobile number starting with 07
  const sriLankanPhoneRegex = /^07\d{8}$/;

  const hourlyRate = selectedLocation?.pricePerHour || selectedSlot?.pricePerHour || 100;
  const totalCost = durationHours * hourlyRate;

  // Single Field Validator for real-time check
  const validateField = (field, value) => {
    let error = null;

    if (field === 'driverName') {
      const trimmed = (value ?? '').trim();
      if (!trimmed) {
        error = 'Driver name is required.';
      } else if (trimmed.length < 3) {
        error = 'Driver name must be at least 3 characters.';
      }
    }

    if (field === 'driverPhone') {
      const cleanPhone = (value ?? '').trim().replace(/[\s-]/g, '');
      if (!cleanPhone || !sriLankanPhoneRegex.test(cleanPhone)) {
        error = 'Please enter a valid 10-digit mobile number starting with 07.';
      }
    }

    if (field === 'vehicleNumber') {
      const cleanPlate = (value ?? '').trim().toUpperCase();
      if (!cleanPlate || !sriLankanPlateRegex.test(cleanPlate)) {
        error = 'Please enter a valid Sri Lankan vehicle number (e.g. CAB-1234 or WP CAB-1234).';
      }
    }

    if (field === 'durationHours') {
      const hours = Number(value);
      if (!hours || !Number.isInteger(hours) || hours < 1 || hours > 12) {
        error = 'Duration must be an integer between 1 and 12 hours.';
      }
    }

    return error;
  };

  // Full Form Validation on Submit
  const validateForm = () => {
    const nextErrors = {
      driverName: validateField('driverName', driverName),
      driverPhone: validateField('driverPhone', driverPhone),
      vehicleNumber: validateField('vehicleNumber', vehicleNumber),
      durationHours: validateField('durationHours', durationHours),
    };

    // Filter out null values
    const activeErrors = Object.fromEntries(
      Object.entries(nextErrors).filter(([, msg]) => msg !== null)
    );

    setErrors(activeErrors);
    return Object.keys(activeErrors).length === 0;
  };

  // Live Change Handlers (clears or updates error in real-time)
  const handleNameChange = (e) => {
    const val = e.target.value;
    setDriverName(val);
    const err = validateField('driverName', val);
    setErrors((prev) => ({ ...prev, driverName: err }));
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value;
    setDriverPhone(val);
    const err = validateField('driverPhone', val);
    setErrors((prev) => ({ ...prev, driverPhone: err }));
  };

  const handleVehicleChange = (e) => {
    const val = e.target.value.toUpperCase();
    setVehicleNumber(val);
    const err = validateField('vehicleNumber', val);
    setErrors((prev) => ({ ...prev, vehicleNumber: err }));
  };

  const handleDurationChange = (val) => {
    const num = Number(val);
    setDurationHours(num);
    const err = validateField('durationHours', num);
    setErrors((prev) => ({ ...prev, durationHours: err }));
  };

  const handleConfirmReservation = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const { reservation } = await createReservation({
        userId: user?.id,
        locationId: selectedLocation.id,
        slotId: selectedSlot.id,
        driverName: driverName.trim(),
        driverPhone: driverPhone.trim(),
        vehicleNumber: vehicleNumber.trim().toUpperCase(),
        durationHours: Number(durationHours),
      });

      const location = reservation.locationId || selectedLocation;
      const slot = reservation.slotId || selectedSlot;
      const receiptData = {
        id: reservation._id,
        ticketId: reservation.ticketId,
        locationName: location.name || selectedLocation?.name || 'ParkSL Hub',
        address: location.address || location.city || selectedLocation?.address || selectedLocation?.city || 'Colombo',
        slotNumber: slot.slotNumber || selectedSlot?.slotNumber || 'P01',
        driverName: driverName.trim(),
        driverPhone: driverPhone.trim(),
        vehicleNumber: vehicleNumber.trim().toUpperCase(),
        durationHours: reservation.durationHours,
        hourlyRate: location.pricePerHour || hourlyRate,
        totalCost: reservation.totalCost,
        status: reservation.status,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      // Persist to localStorage for driver records
      try {
        const existing = JSON.parse(localStorage.getItem('parksl_my_reservations') || '[]');
        localStorage.setItem('parksl_my_reservations', JSON.stringify([receiptData, ...existing]));
      } catch (err) {
        console.warn('LocalStorage save error:', err);
      }

      setConfirmedReservation(receiptData);
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Could not complete reservation. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ----------------------------------------------------
  // SCENARIO 1: Digital Confirmation Ticket / Pass
  // ----------------------------------------------------
  if (confirmedReservation) {
    return (
      <ReservationReceipt
        reservation={confirmedReservation}
        onDone={() => {
          setConfirmedReservation(null);
          setCurrentTab('find');
        }}
      />
    );
  }

  // ----------------------------------------------------
  // SCENARIO 2: No Slot Selected Empty State
  // ----------------------------------------------------
  if (!selectedSlot || !selectedLocation) {
    return (
      <section className="min-h-screen bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg text-center">
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 shadow-sm sm:p-10">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-600 shadow-inner">
              <Calendar size={36} />
            </div>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-blue-800">
              No Slot Selected
            </span>
            <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-900">
              Select an Available Parking Slot
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              To reserve a parking spot, first browse our available locations and pick any green slot that fits your vehicle.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => setCurrentTab('find')}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <Car size={18} />
                Browse Available Parking
              </button>
              <button
                type="button"
                onClick={() => setCurrentTab('home')}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-black text-slate-700 transition hover:bg-slate-50"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ----------------------------------------------------
  // SCENARIO 3: Reservation Form with Live Cost Calculator
  // ----------------------------------------------------
  return (
    <section className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        
        {/* Top Header / Breadcrumb */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              type="button"
              onClick={() => setCurrentTab('find')}
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500 hover:text-slate-800 transition mb-2"
            >
              <ArrowLeft size={14} /> Back to Parking Finder
            </button>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Reserve Parking Slot
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Confirm your vehicle details to guarantee your reserved slot.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-800">
            <ShieldCheck size={16} className="text-emerald-600" />
            Instant Digital Confirmation
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* Left Column: Selected Slot & Location Details */}
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">Selected Location</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  Slot {selectedSlot.slotNumber}
                </span>
              </div>

              <div className="mt-4">
                <h2 className="text-xl font-black text-slate-900">{selectedLocation.name}</h2>
                <div className="mt-2 flex items-start gap-2 text-xs text-slate-500">
                  <MapPin size={15} className="shrink-0 text-slate-400 mt-0.5" />
                  <span>{selectedLocation.address || selectedLocation.city}</span>
                </div>
              </div>

              {/* Slot Highlight Badge Card */}
              <div className="mt-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 p-5 text-white shadow-md">
                <p className="text-xs font-black uppercase tracking-wider text-emerald-100">Reserved Spot</p>
                <div className="mt-1 flex items-baseline justify-between">
                  <p className="text-3xl font-black tracking-tight">{selectedSlot.slotNumber}</p>
                  <span className="rounded-xl bg-white/20 px-2.5 py-1 text-xs font-black text-white backdrop-blur-xs">
                    🟢 Ready to Book
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-white/20 pt-3 text-xs text-emerald-100">
                  <span>Standard Vehicle Slot</span>
                  <span className="font-bold">Rs. {hourlyRate}.00 / hr</span>
                </div>
              </div>

              {/* Pricing breakdown helper */}
              <div className="mt-6 space-y-3 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-slate-400" />
                  <span>Reserved spots are held until your designated departure.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-slate-400" />
                  <span>Free cancellation permitted prior to parking occupancy.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Reservation Form & Cost Calculator */}
          <div className="lg:col-span-7">
            <form 
              onSubmit={handleConfirmReservation}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 space-y-6"
            >
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-black text-slate-900">Driver & Vehicle Details</h3>
                <p className="text-xs text-slate-500 mt-0.5">Please ensure plate number and phone number are accurate.</p>
              </div>

              {/* Driver Full Name */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                  Driver Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className={`pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 ${
                    errors.driverName ? 'text-rose-500' : 'text-slate-400'
                  }`}>
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    value={driverName}
                    onChange={handleNameChange}
                    onBlur={() => setErrors((prev) => ({ ...prev, driverName: validateField('driverName', driverName) }))}
                    placeholder="e.g. Kasun Perera"
                    className={`w-full rounded-2xl border py-3.5 pl-11 pr-4 text-sm font-semibold text-slate-900 transition placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                      errors.driverName 
                        ? 'border-rose-500 bg-rose-50/40 text-rose-900 focus:border-rose-500 focus:ring-rose-300' 
                        : 'border-slate-200 bg-slate-50/50 focus:border-emerald-500 focus:bg-white focus:ring-emerald-400'
                    }`}
                  />
                </div>
                {errors.driverName && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-rose-600">
                    <AlertCircle size={14} className="shrink-0" /> {errors.driverName}
                  </p>
                )}
              </div>

              {/* Driver Contact Number */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                  Contact Mobile Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className={`pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 ${
                    errors.driverPhone ? 'text-rose-500' : 'text-slate-400'
                  }`}>
                    <Phone size={18} />
                  </div>
                  <input
                    type="tel"
                    value={driverPhone}
                    onChange={handlePhoneChange}
                    onBlur={() => setErrors((prev) => ({ ...prev, driverPhone: validateField('driverPhone', driverPhone) }))}
                    placeholder="07XXXXXXXX (e.g. 0771234567)"
                    maxLength={10}
                    className={`w-full rounded-2xl border py-3.5 pl-11 pr-4 text-sm font-semibold text-slate-900 transition placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                      errors.driverPhone 
                        ? 'border-rose-500 bg-rose-50/40 text-rose-900 focus:border-rose-500 focus:ring-rose-300' 
                        : 'border-slate-200 bg-slate-50/50 focus:border-emerald-500 focus:bg-white focus:ring-emerald-400'
                    }`}
                  />
                </div>
                {errors.driverPhone ? (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-rose-600">
                    <AlertCircle size={14} className="shrink-0" /> {errors.driverPhone}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-slate-400">We send your digital SMS gate pass to this phone number.</p>
                )}
              </div>

              {/* Vehicle Number */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                  Vehicle Registration Plate <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className={`pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 ${
                    errors.vehicleNumber ? 'text-rose-500' : 'text-slate-400'
                  }`}>
                    <Car size={18} />
                  </div>
                  <input
                    type="text"
                    value={vehicleNumber}
                    onChange={handleVehicleChange}
                    onBlur={() => setErrors((prev) => ({ ...prev, vehicleNumber: validateField('vehicleNumber', vehicleNumber) }))}
                    placeholder="CAB-1234 or WP CAB-1234"
                    className={`w-full rounded-2xl border py-3.5 pl-11 pr-4 text-sm font-semibold uppercase text-slate-900 transition placeholder:normal-case placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                      errors.vehicleNumber 
                        ? 'border-rose-500 bg-rose-50/40 text-rose-900 focus:border-rose-500 focus:ring-rose-300' 
                        : 'border-slate-200 bg-slate-50/50 focus:border-emerald-500 focus:bg-white focus:ring-emerald-400'
                    }`}
                  />
                </div>
                {errors.vehicleNumber ? (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-rose-600">
                    <AlertCircle size={14} className="shrink-0" /> {errors.vehicleNumber}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-slate-400">Format: 2-3 English letters, hyphen, 4 numbers (e.g. CAB-1234 or WP CAB-1234).</p>
                )}
              </div>

              {/* Duration Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                    Parking Duration (Hours) <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {durationHours} {durationHours === 1 ? 'Hour' : 'Hours'}
                  </span>
                </div>

                <div className="grid grid-cols-6 gap-2">
                  {[1, 2, 3, 4, 6, 8].map((hours) => (
                    <button
                      key={hours}
                      type="button"
                      onClick={() => handleDurationChange(hours)}
                      className={`rounded-xl py-2 text-xs font-black transition cursor-pointer ${
                        durationHours === hours
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {hours} hr{hours > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>

                <div className="mt-3">
                  <input
                    type="range"
                    min={1}
                    max={12}
                    value={durationHours}
                    onChange={(e) => handleDurationChange(e.target.value)}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>1 Hour (Min)</span>
                    <span>12 Hours (Max)</span>
                  </div>
                </div>
                {errors.durationHours && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-rose-600">
                    <AlertCircle size={14} className="shrink-0" /> {errors.durationHours}
                  </p>
                )}
              </div>

              {/* ---------------------------------------------------- */}
              {/* DYNAMIC COST CALCULATOR CARD                          */}
              {/* ---------------------------------------------------- */}
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5">
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-emerald-800">
                  <span>Parking Fee Calculation</span>
                  <span>Rs. {hourlyRate}.00 × {durationHours} hr{durationHours > 1 ? 's' : ''}</span>
                </div>
                <div className="mt-3 flex items-baseline justify-between border-t border-emerald-200/60 pt-3">
                  <span className="text-sm font-bold text-slate-700">Total Payable:</span>
                  <span className="text-2xl font-black text-emerald-800">
                    Rs. {totalCost}.00
                  </span>
                </div>
              </div>

              {/* Error message if submission fails */}
              {errors.submit && (
                <div className="rounded-xl bg-rose-50 p-3 text-xs font-bold text-rose-700 flex items-center gap-2">
                  <AlertCircle size={16} /> {errors.submit}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setCurrentTab('find')}
                  className="flex-1 rounded-2xl border border-slate-200 bg-white py-3.5 text-sm font-black text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
                >
                  Back to Locations
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-2 rounded-2xl bg-emerald-600 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Confirming...' : `Confirm & Reserve Slot (${selectedSlot.slotNumber})`}
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
