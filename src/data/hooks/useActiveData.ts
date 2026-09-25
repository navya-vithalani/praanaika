import { useMemo } from 'react';
import { demoDataset } from '../demoDataset';
import { useSessionStore } from '../../store/sessionStore';
import { useOwnDataStore } from '../../store/ownDataStore';
import { useOwnProfileStore } from '../../store/ownProfileStore';

export function useActiveData() {
  const mode = useSessionStore((state) => state.mode);
  const demoDay = useSessionStore((state) => state.demoDay);
  const ownCheckins = useOwnDataStore((state) => state.checkins);
  const ownLogs = useOwnDataStore((state) => state.logs);
  const ownProfile = useOwnProfileStore((state) => state.profile);
  const insights = mode === 'demo' ? demoDataset.insights.filter((insight) => (insight.dayIndex ?? 56) <= demoDay).sort((a, b) => (b.dayIndex ?? 0) - (a.dayIndex ?? 0)) : [];
  return useMemo(() => ({
    mode,
    profile: mode === 'demo' ? demoDataset.profile : ownProfile,
    checkins: mode === 'demo' ? demoDataset.checkins : ownCheckins,
    logs: mode === 'demo' ? demoDataset.logs : ownLogs,
    insights,
    sessions: mode === 'demo' ? demoDataset.sessions : [],
    isSynthetic: mode === 'demo',
    demoDay,
  }), [mode, demoDay, ownCheckins, ownLogs, ownProfile, insights]);
}
