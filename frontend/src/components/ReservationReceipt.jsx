import { 
  CheckCircle, 
  Printer, 
  Home, 
  MapPin, 
  Calendar, 
  Clock, 
  Car, 
  Phone, 
  User, 
  QrCode, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useParking } from '../context/ParkingContext';

export default function ReservationReceipt({ reservation, onDone }) {
  const { setCurrentTab } = useParking();

  if (!reservation) return null;

  const handleDone = () => {
    if (onDone) {
      onDone();
    } else {
      setCurrentTab('home');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100/70 px-4 py-8 sm:px-6 sm:py-12 lg:px-8 print:bg-white print:p-0">
      <div className="mx-auto max-w-md print:max-w-full">
        
        {/* Print-only Header */}
        <div className="hidden print:block mb-4 text-center">
          <h1 className="text-xl font-black text-slate-900">ParkSL — Smart Parking Sri Lanka</h1>
          <p className="text-xs text-slate-500">Official Digital Parking Pass</p>
        </div>

        {/* Digital Boarding Pass Ticket Container */}
        <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200/80 transition-all print:shadow-none print:border-slate-300">
          
          {/* Top Section: Confirmed Status Header */}
          <div className="relative bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-center text-white sm:p-8">
            {/* Background pattern accents */}
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-xl pointer-events-none"></div>
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-emerald-400/20 blur-xl pointer-events-none"></div>

            <div className="relative z-10">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 shadow-inner backdrop-blur-md">
                <CheckCircle size={36} className="text-white drop-shadow-sm" />
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-800/50 px-3 py-1 text-xs font-black uppercase tracking-wider text-emerald-100 backdrop-blur-sm">
                <Sparkles size={12} /> Reservation Confirmed!
              </span>
              <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl text-white">
                Digital Parking Pass
              </h2>
              <p className="mt-1 text-xs font-medium text-emerald-100">
                Present this pass at the entrance gate scanner
              </p>
            </div>
          </div>

          {/* Ticket Body */}
          <div className="p-6 sm:p-7 space-y-6">
            
            {/* Ticket ID & Status Badge */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">Ticket ID</p>
                <p className="text-2xl font-black tracking-tight text-slate-900 font-mono">
                  {reservation.ticketId || 'PS1024'}
                </p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-black text-amber-800">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
                  RESERVED
                </span>
                <p className="mt-1 text-[11px] font-bold text-slate-400">
                  {reservation.date || 'Today'} · {reservation.createdAt || 'Just now'}
                </p>
              </div>
            </div>

            {/* Assigned Slot Highlight Card */}
            <div className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-wider text-emerald-700">
                    Assigned Slot
                  </p>
                  <p className="text-3xl font-black text-emerald-900 tracking-tight">
                    {reservation.slotNumber || 'P01'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-black uppercase tracking-wider text-emerald-700">
                    Vehicle Number
                  </p>
                  <p className="text-lg font-black text-slate-900 font-mono">
                    {reservation.vehicleNumber}
                  </p>
                </div>
              </div>
            </div>

            {/* Location & Driver Details */}
            <div className="grid grid-cols-1 gap-4 text-xs">
              <div className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-3 border border-slate-100">
                <MapPin size={16} className="mt-0.5 shrink-0 text-slate-400" />
                <div>
                  <p className="font-black text-slate-800">{reservation.locationName}</p>
                  <p className="text-slate-500 mt-0.5">{reservation.address}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                  <User size={14} className="text-slate-400" />
                  <div className="truncate">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Driver</p>
                    <p className="font-bold text-slate-800 truncate">{reservation.driverName || 'Driver'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                  <Phone size={14} className="text-slate-400" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Contact</p>
                    <p className="font-bold text-slate-800">{reservation.driverPhone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Perforated Divider Line with Cutout Notches */}
            <div className="relative my-2">
              <div className="absolute -left-9 top-1/2 -mt-3 h-6 w-6 rounded-full bg-slate-100 border border-slate-200 print:hidden"></div>
              <div className="border-b-2 border-dashed border-slate-200"></div>
              <div className="absolute -right-9 top-1/2 -mt-3 h-6 w-6 rounded-full bg-slate-100 border border-slate-200 print:hidden"></div>
            </div>

            {/* Price & Duration Breakdown */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Clock size={13} className="text-slate-400" /> Duration
                </span>
                <span className="font-bold text-slate-900">{reservation.durationHours} Hours</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Parking Rate</span>
                <span className="font-bold text-slate-900">Rs. {reservation.hourlyRate || 100}.00 / hr</span>
              </div>
              <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-sm">
                <span className="font-black text-slate-900">Total Fee (LKR)</span>
                <span className="text-xl font-black text-emerald-700">
                  Rs. {reservation.totalCost}.00
                </span>
              </div>
            </div>

            {/* Mock SVG QR Code Section */}
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-4 text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-xl bg-white p-2 shadow-xs border border-slate-200">
                <QrCode size={72} className="text-slate-900" />
              </div>
              <p className="mt-2 text-xs font-black text-slate-800 uppercase tracking-wider">
                Scan at Entry Barrier
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Barcode validated for vehicle {reservation.vehicleNumber}
              </p>
            </div>

            {/* Action Buttons (Hidden when printing) */}
            <div className="flex flex-col gap-2.5 pt-2 sm:flex-row print:hidden">
              <button
                type="button"
                onClick={handlePrint}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-black text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 cursor-pointer shadow-xs"
              >
                <Printer size={15} /> Print / Save Pass
              </button>

              <button
                type="button"
                onClick={handleDone}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-xs font-black text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-700 cursor-pointer shadow-md"
              >
                <Home size={15} /> Done / Back to Home
              </button>
            </div>

          </div>
        </div>

        {/* Helper Note */}
        <p className="mt-4 text-center text-xs text-slate-400 print:hidden">
          A confirmation SMS has also been dispatched to {reservation.driverPhone}.
        </p>

      </div>
    </div>
  );
}
