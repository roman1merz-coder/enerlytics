import { createContext, useContext, useState, useEffect } from 'react';

const CompareContext = createContext();

export function CompareProvider({ children }) {
  const [selectedCars, setSelectedCars] = useState(() => {
    const saved = localStorage.getItem('compareList');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('compareList', JSON.stringify(selectedCars));
  }, [selectedCars]);

  const addCar = (car) => {
    if (selectedCars.find((c) => c.id === car.id)) return;
    if (selectedCars.length < 4) {
      setSelectedCars([...selectedCars, car]);
    }
  };

  const removeCar = (carId) => {
    setSelectedCars(selectedCars.filter((c) => c.id !== carId));
  };

  const clearAll = () => {
    setSelectedCars([]);
  };

  return (
    <CompareContext.Provider value={{ selectedCars, addCar, removeCar, clearAll }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within CompareProvider');
  }
  return context;
}
