export type Mode = 'none' | 'demo' | 'own';
export type ISODateTime = string;
export type ISODate = string;
export type InsightSource = 'self' | 'hub' | 'gem';
export type InsightTier = 'direct' | 'personal';
export type InsightKind = 'observation' | 'pattern' | 'sleep' | 'exposure' | 'abstain' | 'sensor_issue';

export interface InsightCard {
  id: string;
  createdAt: ISODateTime;
  expiresAt: ISODateTime;
  sources: InsightSource[];
  tier: InsightTier;
  kind: InsightKind;
  headline: string;
  body: string;
}

export interface SessionState {
  mode: Mode;
  demoDay: number;
}
