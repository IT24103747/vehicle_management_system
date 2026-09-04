import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, Loader2, RefreshCw, Search } from 'lucide-react';
import FilterPills from '../components/FilterPills';
import ParkingCard from '../components/ParkingCard';
import SearchBar from '../components/SearchBar';
import { useParking } from '../context/ParkingContext';

function getLocationId(location) {
  return location._id || location.id;
}

function normalizeSearch(value) {
  return value.trim().toLowerCase();
}

export default function FindParkingPage() {
  const {
    fetchParkingLocations,
    fetchParkingSlots,
    setCurrentTab,
    setSelectedLocation,
    setSelectedSlot,
  } = useParking();

  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [locations, setLocations] = useState([]);
  const [slotsByLocationId, setSlotsByLocationId] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadParkingData = useCallback(async ({ showLoading = true } = {}) => {
    if (showLoading) {
      setIsLoading(true);
    }
    setError('');

    try {
      const nextLocations = await fetchParkingLocations();
      const nextSlotsEntries = await Promise.all(
        nextLocations.map(async (location) => {
          const locationId = getLocationId(location);
          const slots = await fetchParkingSlots(locationId);
          return [locationId, slots];
        }),
      );

      setLocations(nextLocations);
      setSlotsByLocationId(Object.fromEntries(nextSlotsEntries));
    } catch (err) {
      console.error('Error loading parking finder data:', err);
      setError('Could not load parking locations. Please make sure the ParkSL API is running.');
    } finally {
      setIsLoading(false);
    }
  }, [fetchParkingLocations, fetchParkingSlots]);

  useEffect(() => {
    let ignore = false;

    const loadInitialParkingData = async () => {
      try {
        const nextLocations = await fetchParkingLocations();
        if (ignore) return;

        const nextSlotsEntries = await Promise.all(
          nextLocations.map(async (location) => {
            const locationId = getLocationId(location);
            const slots = await fetchParkingSlots(locationId);
            return [locationId, slots];
          }),
        );
        if (ignore) return;

        setLocations(nextLocations);
        setSlotsByLocationId(Object.fromEntries(nextSlotsEntries));
      } catch (err) {
        if (ignore) return;
        console.error('Error loading parking finder data:', err);
        setError('Could not load parking locations. Please make sure the ParkSL API is running.');
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadInitialParkingData();

    return () => {
      ignore = true;
    };
  }, [fetchParkingLocations, fetchParkingSlots]);

  const enrichedLocations = useMemo(() => (
    locations.map((location) => {
      const locationId = getLocationId(location);
      const slots = slotsByLocationId[locationId] || [];
      const availableSlots = slots.filter((slot) => slot.status === 'AVAILABLE').length;

      return {
        ...location,
        locationId,
        slots,
        availableSlots,
        totalSlots: slots.length,
      };
    })
  ), [locations, slotsByLocationId]);

  const filteredLocations = useMemo(() => {
    const search = normalizeSearch(searchTerm);

    return enrichedLocations.filter((location) => {
      const searchableText = `${location.name || ''} ${location.city || ''}`.toLowerCase();
      const matchesSearch = !search || searchableText.includes(search);
      const matchesFilter =
        availabilityFilter === 'all'
        || (availabilityFilter === 'available' && location.availableSlots > 0)
        || (availabilityFilter === 'full' && location.availableSlots === 0);

      return matchesSearch && matchesFilter;
    });
  }, [availabilityFilter, enrichedLocations, searchTerm]);

  const resetSearchAndFilter = () => {
    setSearchTerm('');
    setAvailabilityFilter('all');
  };

  const handleReserve = (location, slot) => {
    setSelectedLocation({
      id: getLocationId(location),
      name: location.name,
      city: location.city,
      address: location.address,
      pricePerHour: location.pricePerHour,
    });
    setSelectedSlot({
      id: slot._id || slot.id,
      locationId: getLocationId(location),
      slotNumber: slot.slotNumber,
      status: slot.status,
      pricePerHour: location.pricePerHour,
    });
    setCurrentTab('reserve');
  };

  const emptyMessage = useMemo(() => {
    const search = searchTerm.trim();

    if (search) {
      return `No parking locations found for "${search}". Try another location.`;
    }

    if (availabilityFilter === 'available') {
      return 'No parking spaces are currently available.';
    }

    if (availabilityFilter === 'full') {
      return 'No full parking locations match this filter.';
    }

    return 'No parking locations are available yet.';
  }, [availabilityFilter, searchTerm]);

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-xl sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-black uppercase text-emerald-300">
                <Search size={14} aria-hidden="true" /> Driver Search
              </span>
              <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">Find Parking</h1>
              <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
                Search parking locations and reserve an available slot before you arrive.
              </p>
            </div>

            <button
              type="button"
              onClick={loadParkingData}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-black text-white transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <RefreshCw size={17} className={isLoading ? 'animate-spin' : ''} aria-hidden="true" />
              Refresh
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full lg:max-w-xl">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              onClear={() => setSearchTerm('')}
            />
          </div>
          <FilterPills selectedFilter={availabilityFilter} onChange={setAvailabilityFilter} />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-bold text-slate-600">
            Showing {filteredLocations.length} of {locations.length} parking locations
          </p>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-700">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-bold">Unable to load parking data</p>
                <p className="mt-1 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex min-h-64 items-center justify-center rounded-3xl border border-slate-200 bg-white">
            <div className="text-center">
              <Loader2 size={32} className="mx-auto animate-spin text-emerald-600" aria-hidden="true" />
              <p className="mt-3 text-sm font-bold text-slate-600">Loading parking locations...</p>
            </div>
          </div>
        ) : filteredLocations.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {filteredLocations.map((location) => (
              <ParkingCard
                key={location.locationId}
                location={location}
                slots={location.slots}
                onReserve={handleReserve}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
            <Search size={36} className="mx-auto text-slate-300" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-black text-slate-900">No Matching Parking</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{emptyMessage}</p>
            {(searchTerm.trim() || availabilityFilter !== 'all') && (
              <button
                type="button"
                onClick={resetSearchAndFilter}
                className="mt-5 rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                Reset Search and Filters
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
