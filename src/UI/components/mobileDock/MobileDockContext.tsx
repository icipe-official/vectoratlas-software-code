'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ElementType,
  type ReactNode,
} from 'react';

// Dock height plus iPhone home-indicator space
export const DOCK_HEIGHT = 'calc(64px + env(safe-area-inset-bottom, 0px))';

export interface PanelMeta {
  id: string;
  title: string;
  icon: ElementType;
}

interface DockContextValue {
  panels: PanelMeta[];
  activeId: string | null;
  register: (meta: PanelMeta) => void;
  unregister: (id: string) => void;
  show: (id: string) => void;
  minimize: () => void;
}

const MobileDockContext = createContext<DockContextValue | null>(null);

export function MobileDockProvider({ children }: { children: ReactNode }) {
  const [panels, setPanels] = useState<PanelMeta[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Adds the panel's icon to the dock. It does NOT bring the panel to the
  // front, so panels that are open at startup stay minimized.
  const register = useCallback((meta: PanelMeta) => {
    setPanels((prev) =>
      prev.some((p) => p.id === meta.id)
        ? prev.map((p) => (p.id === meta.id ? meta : p))
        : [...prev, meta]
    );
  }, []);

  // Removes the icon; clears the active panel if it was this one
  const unregister = useCallback((id: string) => {
    setPanels((prev) => prev.filter((p) => p.id !== id));
    setActiveId((prev) => (prev === id ? null : prev));
  }, []);

  const show = useCallback((id: string) => setActiveId(id), []);
  const minimize = useCallback(() => setActiveId(null), []);

  const value = useMemo(
    () => ({ panels, activeId, register, unregister, show, minimize }),
    [panels, activeId, register, unregister, show, minimize]
  );

  return (
    <MobileDockContext.Provider value={value}>
      {children}
    </MobileDockContext.Provider>
  );
}

export function useMobileDock() {
  const ctx = useContext(MobileDockContext);
  if (!ctx)
    throw new Error('useMobileDock must be used inside MobileDockProvider');
  return ctx;
}
