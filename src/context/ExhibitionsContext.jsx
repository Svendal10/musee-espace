import { createContext, useContext, useEffect, useState } from 'react';

const ExhibitionsContext = createContext(null);
const STORAGE_KEY = 'musee-espace:exhibitions';

function generateId() {
  return 'exp_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function ExhibitionsProvider({ children }) {
  const [exhibitions, setExhibitions] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(exhibitions));
  }, [exhibitions]);

  const createExhibition = (name = 'Nouvelle exposition') => {
    const newExp = {
      id: generateId(),
      name,
      description: '',
      items: [],
      createdAt: new Date().toISOString(),
    };
    setExhibitions((prev) => [...prev, newExp]);
    return newExp;
  };

  const renameExhibition = (id, name) => {
    setExhibitions((prev) => prev.map((e) => (e.id === id ? { ...e, name } : e)));
  };

  const updateDescription = (id, description) => {
    setExhibitions((prev) => prev.map((e) => (e.id === id ? { ...e, description } : e)));
  };

  const deleteExhibition = (id) => {
    setExhibitions((prev) => prev.filter((e) => e.id !== id));
  };

  const addItem = (id, media) => {
    setExhibitions((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        if (e.items.some((it) => it.id === media.id)) return e;
        return { ...e, items: [...e.items, { ...media, comment: '' }] };
      })
    );
  };

  const removeItem = (id, mediaId) => {
    setExhibitions((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, items: e.items.filter((it) => it.id !== mediaId) } : e
      )
    );
  };

  const updateItemComment = (id, mediaId, comment) => {
    setExhibitions((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, items: e.items.map((it) => (it.id === mediaId ? { ...it, comment } : it)) }
          : e
      )
    );
  };

  const reorderItems = (id, fromIndex, toIndex) => {
    setExhibitions((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        const items = [...e.items];
        const [moved] = items.splice(fromIndex, 1);
        items.splice(toIndex, 0, moved);
        return { ...e, items };
      })
    );
  };

  const getExhibition = (id) => exhibitions.find((e) => e.id === id);

  const encodeExhibition = (exhibition) => {
    const json = JSON.stringify(exhibition);
    const b64 = btoa(unescape(encodeURIComponent(json)));
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };

  const decodeExhibition = (str) => {
    try {
      const b64 = str.replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(escape(atob(b64)));
      return JSON.parse(json);
    } catch {
      return null;
    }
  };

  return (
    <ExhibitionsContext.Provider
      value={{
        exhibitions,
        createExhibition,
        renameExhibition,
        updateDescription,
        deleteExhibition,
        addItem,
        removeItem,
        updateItemComment,
        reorderItems,
        getExhibition,
        encodeExhibition,
        decodeExhibition,
      }}
    >
      {children}
    </ExhibitionsContext.Provider>
  );
}

export function useExhibitions() {
  const ctx = useContext(ExhibitionsContext);
  if (!ctx) throw new Error('useExhibitions doit être dans ExhibitionsProvider');
  return ctx;
}
