import React, { createContext, useState, useContext, useEffect } from 'react';

const StorageCompareContext = createContext();

export function StorageCompareProvider({ children }) {
  const [selectedStorage, setSelectedStorage] = useState(() => {
    const saved = localStorage.getItem('storageCompareList');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('storageCompareList', JSON.stringify(selectedStorage));
  }, [selectedStorage]);

  const addStorage = (storage) => {
    if (selectedStorage.length >= 4) {
      alert('You can compare up to 4 storage systems at a time');
      return false;
    }
    if (selectedStorage.find((s) => s.id === storage.id)) {
      return false; // Already added
    }
    setSelectedStorage([...selectedStorage, storage]);
    return true;
  };

  const removeStorage = (storageId) => {
    setSelectedStorage(selectedStorage.filter((s) => s.id !== storageId));
  };

  const clearAll = () => {
    setSelectedStorage([]);
  };

  return (
    <StorageCompareContext.Provider
      value={{
        selectedStorage,
        addStorage,
        removeStorage,
        clearAll,
      }}
    >
      {children}
    </StorageCompareContext.Provider>
  );
}

export function useStorageCompare() {
  const context = useContext(StorageCompareContext);
  if (!context) {
    throw new Error('useStorageCompare must be used within StorageCompareProvider');
  }
  return context;
}
