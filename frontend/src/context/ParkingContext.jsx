import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ParkingContext = createContext();
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const ParkingProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('parksl_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentTab, setCurrentTab] = useState(() => {
    try {
      const savedUser = localStorage.getItem('parksl_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.role === 'OPERATOR') return 'dashboard';
        if (parsed.role === 'DRIVER') return 'driver';
      }
    } catch {
      // fallback
    }
    return 'home';
  });

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('parksl_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('parksl_user');
    }
  }, [user]);

  const loginUser = (userData) => {
    setUser(userData);
    if (userData?.role === 'OPERATOR') {
      setCurrentTab('dashboard');
    } else if (userData?.role === 'DRIVER') {
      setCurrentTab('driver');
    }
  };

  const logoutUser = () => {
    setUser(null);
    setCurrentTab('home');
  };

  // API Helpers for Member 4
  const fetchOwnerStats = async () => {
    const res = await axios.get(`${API_BASE}/api/owner/stats`);
    return res.data;
  };

  const fetchOwnerLocations = async () => {
    const res = await axios.get(`${API_BASE}/api/owner/locations`);
    return res.data;
  };

  const addLocation = async (locationData) => {
    const res = await axios.post(`${API_BASE}/api/owner/locations`, locationData);
    return res.data;
  };

  const updateLocation = async (id, locationData) => {
    const res = await axios.put(`${API_BASE}/api/owner/locations/${id}`, locationData);
    return res.data;
  };

  const deleteLocation = async (id) => {
    const res = await axios.delete(`${API_BASE}/api/owner/locations/${id}`);
    return res.data;
  };

  const fetchLocationSlots = async (locationId) => {
    const res = await axios.get(`${API_BASE}/api/owner/locations/${locationId}/slots`);
    return res.data;
  };

  const fetchParkingLocations = fetchOwnerLocations;
  const fetchParkingSlots = fetchLocationSlots;

  const addSlotToLocation = async (locationId) => {
    const res = await axios.post(`${API_BASE}/api/owner/locations/${locationId}/slots`);
    return res.data;
  };

  const deleteSlot = async (slotId) => {
    const res = await axios.delete(`${API_BASE}/api/owner/slots/${slotId}`);
    return res.data;
  };

  const updateSlotStatus = async (slotId, status) => {
    const res = await axios.patch(`${API_BASE}/api/owner/slots/${slotId}/status`, { status });
    return res.data;
  };

  const createReservation = async (reservationData) => {
    const res = await axios.post(`${API_BASE}/api/reservations`, reservationData);
    return res.data;
  };

  const fetchDriverReservations = async (driver = user) => {
    const params = {
      userId: driver?.id,
      phone: driver?.phone,
      vehicleNumber: driver?.vehicleNumber,
    };
    const res = await axios.get(`${API_BASE}/api/driver/reservations`, { params });
    return res.data;
  };

  const fetchReservations = async () => {
    const res = await axios.get(`${API_BASE}/api/owner/reservations`);
    return res.data;
  };

  const updateReservationStatus = async (reservationId, status) => {
    const res = await axios.patch(`${API_BASE}/api/owner/reservations/${reservationId}/status`, { status });
    return res.data;
  };

  return (
    <ParkingContext.Provider value={{
      user,
      loginUser,
      logoutUser,
      currentTab,
      setCurrentTab,
      selectedLocation,
      setSelectedLocation,
      selectedSlot,
      setSelectedSlot,
      fetchOwnerStats,
      fetchOwnerLocations,
      fetchParkingLocations,
      fetchParkingSlots,
      addLocation,
      updateLocation,
      deleteLocation,
      fetchLocationSlots,
      addSlotToLocation,
      deleteSlot,
      updateSlotStatus,
      createReservation,
      fetchDriverReservations,
      fetchReservations,
      updateReservationStatus,
    }}>
      {children}
    </ParkingContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useParking = () => useContext(ParkingContext);
