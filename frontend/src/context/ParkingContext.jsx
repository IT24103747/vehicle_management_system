import React, { createContext, useContext, useState, useEffect } from 'react';

const ParkingContext = createContext();

export const ParkingProvider = ({ children }) => {
  // Current logged-in user (Driver or Operator)
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('parksl_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Active navigation tab: 'home' | 'find' | 'reserve' | 'dashboard'
  const [currentTab, setCurrentTab] = useState('home');

  // Selected slot state (for passing between Member 2 and Member 3)
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Sync user state with localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('parksl_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('parksl_user');
    }
  }, [user]);

  const loginUser = (userData) => {
    setUser(userData);
  };

  const logoutUser = () => {
    setUser(null);
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
    }}>
      {children}
    </ParkingContext.Provider>
  );
};

export const useParking = () => useContext(ParkingContext);
