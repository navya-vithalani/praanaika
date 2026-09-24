import { create } from 'zustand';
import type { Mode } from '../data/types';
import { readStorage, writeStorage } from '../services/storage';

interface SessionStore {
  mode: Mode;
  demoDay: number;
  setMode: (mode: Mode) => void;
  setDemoDay: (demoDay: number) => void;
  resetProfile: () => void;
}

const initial = readStorage('session.v1', { mode: 'none' as Mode, demoDay: 56 });

export const useSessionStore = create<SessionStore>((set) => ({
  ...initial,
  setMode: (mode) => set(() => {
    const next = { ...useSessionStore.getState(), mode };
    writeStorage('session.v1', { mode, demoDay: next.demoDay });
    return { mode };
  }),
  setDemoDay: (demoDay) => set(() => {
    const next = { ...useSessionStore.getState(), demoDay };
    writeStorage('session.v1', { mode: next.mode, demoDay });
    return { demoDay };
  }),
  resetProfile: () => {
    writeStorage('session.v1', { mode: 'none', demoDay: 56 });
    set({ mode: 'none', demoDay: 56 });
  },
}));
