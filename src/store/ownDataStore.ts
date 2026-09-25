import { create } from 'zustand';
import type { CheckIn, LogEntry } from '../data/types';
import { readStorage, writeStorage } from '../services/storage';

interface OwnDataStore {
  checkins: CheckIn[];
  logs: LogEntry[];
  addCheckIn: (checkin: CheckIn) => void;
  addLog: (log: LogEntry) => void;
  updateLog: (id: string, changes: Partial<LogEntry>) => void;
  clear: () => void;
}

const initial = readStorage('own.v1', { checkins: [] as CheckIn[], logs: [] as LogEntry[] });
function persist(checkins: CheckIn[], logs: LogEntry[]) { writeStorage('own.v1', { checkins, logs }); }

export const useOwnDataStore = create<OwnDataStore>((set) => ({
  ...initial,
  addCheckIn: (checkin) => set((state) => { const checkins = [...state.checkins, checkin]; persist(checkins, state.logs); return { checkins }; }),
  addLog: (log) => set((state) => { const logs = [...state.logs, log]; persist(state.checkins, logs); return { logs }; }),
  updateLog: (id, changes) => set((state) => { const logs = state.logs.map((log) => log.id === id ? { ...log, ...changes } : log); persist(state.checkins, logs); return { logs }; }),
  clear: () => { persist([], []); set({ checkins: [], logs: [] }); },
}));
