import { create } from 'zustand';
import { readStorage, writeStorage } from '../services/storage';

export interface OwnProfileDraft { name: string; age: number; city: string; consent: boolean; createdAt: string; }
interface OwnProfileStore { profile: OwnProfileDraft | null; saveProfile: (profile: OwnProfileDraft) => void; clear: () => void; }
const initial = readStorage<OwnProfileDraft | null>('ownProfile.v1', null);
export const useOwnProfileStore = create<OwnProfileStore>((set) => ({
  profile: initial,
  saveProfile: (profile) => { writeStorage('ownProfile.v1', profile); set({ profile }); },
  clear: () => { writeStorage('ownProfile.v1', null); set({ profile: null }); },
}));
