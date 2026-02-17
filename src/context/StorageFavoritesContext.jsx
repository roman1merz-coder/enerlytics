import React, { createContext, useState, useContext, useEffect } from 'react';

const StorageFavoritesContext = createContext();

export function StorageFavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('storageFavorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('storageFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (storageId) => {
    setFavorites((prev) =>
      prev.includes(storageId)
        ? prev.filter((id) => id !== storageId)
        : [...prev, storageId]
    );
  };

  const isFavorite = (storageId) => {
    return favorites.includes(storageId);
  };

  return (
    <StorageFavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </StorageFavoritesContext.Provider>
  );
}

export function useStorageFavorites() {
  const context = useContext(StorageFavoritesContext);
  if (!context) {
    throw new Error('useStorageFavorites must be used within StorageFavoritesProvider');
  }
  return context;
}
