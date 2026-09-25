export type Mode = 'none' | 'demo' | 'own';
export type ISODateTime = string;
export type ISODate = string;
export type InsightSource = 'self' | 'hub' | 'gem';
export type InsightTier = 'direct' | 'personal';
export type InsightKind = 'observation' | 'pattern' | 'sleep' | 'exposure' | 'abstain' | 'sensor_issue';

export interface CheckIn { id: string; t: ISODateTime; feel: 1 | 2 | 3 | 4 | 5; energy: 1 | 2 | 3 | 4 | 5; tags: string[]; note: string | null; }
export type LogCategory = 'illness' | 'medication' | 'sleep' | 'exercise' | 'food' | 'cycle';
export type LogStatus = 'needs_confirm' | 'confirmed' | 'corrected' | 'flagged_wrong';
export type ParsedPayload = { category: LogCategory; [key: string]: unknown };
export interface LogEntry { id: string; t: ISODateTime; category: LogCategory; inputMode: 'text' | 'voice' | 'photo' | 'tap' | 'passive'; rawText: string | null; photoDiscarded: boolean; parsed: ParsedPayload; parserConfidence: number; status: LogStatus; correction?: { fixed: ParsedPayload; note: string | null; at: ISODateTime }; }

export interface InsightCard {
  id: string;
  createdAt: ISODateTime;
  expiresAt: ISODateTime;
  sources: InsightSource[];
  tier: InsightTier;
  kind: InsightKind;
  headline: string;
  body: string;
  evidence?: string[];
  dayIndex?: number;
}

export interface DatasetMeta { personaName: string; startDate: ISODate; endDate: ISODate; days: number; intervalMinutes: 15 | 30 | 60; timezone: 'Asia/Kolkata'; isSynthetic: true; generatorVersion: string; note: string; }
export interface DemoDataset {
  meta: DatasetMeta;
  profile: Record<string, unknown>;
  gem: Record<string, unknown>;
  hub: Record<string, unknown>;
  nights: unknown[];
  checkins: CheckIn[];
  logs: LogEntry[];
  sessions: unknown[];
  spikes: unknown[];
  recalibrations: unknown[];
  insights: InsightCard[];
  talkAnswers: unknown[];
}

export interface SessionState {
  mode: Mode;
  demoDay: number;
}
