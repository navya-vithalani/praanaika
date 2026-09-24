import type { CheckIn, DemoDataset, InsightCard, LogEntry } from './types';

const DAY_MS = 86_400_000;
const IST = '+05:30';

function iso(dayIndex: number, hour: number, minute = 0): string {
  const date = new Date(Date.now() - (56 - dayIndex) * DAY_MS);
  date.setUTCHours(hour - 5, minute - 30, 0, 0);
  return `${date.toISOString().slice(0, 19)}${IST}`;
}

function checkins(): CheckIn[] {
  return Array.from({ length: 80 }, (_, index) => {
    const day = Math.min(56, Math.floor(index * 56 / 80) + 1);
    return {
      id: `checkin-${index + 1}`,
      t: iso(day, 8 + (index % 11)),
      feel: ([3, 4, 4, 2, 5][index % 5]) as CheckIn['feel'],
      energy: ([3, 4, 5, 2, 3][index % 5]) as CheckIn['energy'],
      tags: index % 7 === 0 ? ['Headache'] : index % 4 === 0 ? ['Focused'] : [],
      note: null,
    };
  });
}

function logs(): LogEntry[] {
  return Array.from({ length: 24 }, (_, index) => ({
    id: `log-${index + 1}`,
    t: iso(Math.min(56, index * 2 + 1), 21),
    category: 'sleep',
    inputMode: 'tap',
    rawText: null,
    photoDiscarded: false,
    parsed: { category: 'sleep', sleepAt: iso(Math.min(56, index * 2 + 1), 23), wakeAt: iso(Math.min(56, index * 2 + 2), 7), quality: 3 },
    parserConfidence: 1,
    status: 'confirmed',
  }));
}

function insights(): InsightCard[] {
  return [
    { id: 'insight-co2', dayIndex: 14, createdAt: iso(14, 8), expiresAt: iso(14, 23), sources: ['hub', 'self'], tier: 'personal', kind: 'sleep', headline: 'My bedroom air was stuffier overnight.', body: 'On nights when CO₂ rose above my usual range, my sleep notes looked lighter. They went together around those nights, not necessarily because of one another.', evidence: ['Hub CO₂ peaked above my reference range', 'Sleep notes from 3 similar nights'] },
    { id: 'insight-voc', dayIndex: 32, createdAt: iso(32, 18), expiresAt: iso(33, 18), sources: ['gem', 'hub'], tier: 'direct', kind: 'exposure', headline: 'I noticed a short VOC rise this evening.', body: 'The Gem and Hub readings rose together near the kitchen window. I recorded the observation so you can add what else was different.', evidence: ['Gem VOC delta at 20:10', 'Hub VOC rise 20 minutes later'] },
    { id: 'insight-checkin', dayIndex: 45, createdAt: iso(45, 14), expiresAt: iso(46, 14), sources: ['self'], tier: 'direct', kind: 'observation', headline: 'My afternoons have felt more focused lately.', body: 'Your recent check-ins were brighter between lunch and late afternoon than earlier in the demo.', evidence: ['18 afternoon check-ins', 'Focused tag appeared 5 times'] },
    { id: 'insight-dust', dayIndex: 22, createdAt: iso(22, 20), expiresAt: iso(22, 23), sources: ['hub', 'self'], tier: 'direct', kind: 'pattern', headline: 'A dusty evening went together with a headache tag.', body: 'This happened on 4 of 6 dusty evenings, while 2 dusty evenings had no headache tag. I cannot say what caused what.', evidence: ['Hub PM2.5 above 70', '4 of 6 evenings had the tag'] },
    { id: 'insight-abstain', dayIndex: 38, createdAt: iso(38, 10), expiresAt: iso(38, 23), sources: ['self'], tier: 'direct', kind: 'abstain', headline: 'I’m not sure yet about late dinners.', body: 'There are only a few late-dinner nights so far. I need more of your own check-ins before I can compare them fairly.', evidence: ['3 late-dinner entries', '2 next-morning check-ins'] },
    { id: 'insight-sensor', dayIndex: 40, createdAt: iso(40, 16), expiresAt: iso(40, 23), sources: ['hub'], tier: 'direct', kind: 'sensor_issue', headline: 'I noticed a possible Hub sensor issue.', body: 'The VOC reading stayed almost flat for about 6 hours. I am marking it as a sensor issue, not a change in you.', evidence: ['VOC stream flat-lined for 6 hours'] },
  ];
}

export function createDemoDataset(): DemoDataset {
  const demoCheckins = checkins();
  return {
    meta: { personaName: 'Meera', startDate: iso(1, 0).slice(0, 10), endDate: iso(56, 0).slice(0, 10), days: 56, intervalMinutes: 60, timezone: 'Asia/Kolkata', isSynthetic: true, generatorVersion: 'step-3-seed-1', note: 'Synthetic demo data. Shows how the method works, not results from real people.' },
    profile: { id: 'demo-meera', isDemo: true, displayName: 'Meera', avatarKey: 'avatar-01', age: 29, sex: 'female', heightCm: null, weightKg: null, ethnicity: null, sensitivities: [], city: 'Bengaluru', pincode: null, lat: 12.9716, lon: 77.5946, wearers: [{ id: 'meera', name: 'Meera', kind: 'person', avatarKey: 'avatar-01' }], gem: null, hub: null, consents: { airExposure: true, bodySignals: false, healthLogs: false, voiceMemos: false, photoFood: false, pioneerResearch: false, acknowledged18Plus: true, acceptedPolicyVersion: '0.1-demo', timestamp: null }, pioneer: false, createdAt: iso(1, 8) },
    gem: { start: iso(1, 0), intervalMinutes: 60, length: 1344, columns: { voc_out: [], voc_skin: [], voc_delta: [], nox_out: [], skin_temp_c: [], skin_rh: [], uv_index: [], noise_db: [], hr_bpm: [], hrv_ms: [], spo2_pct: [], motion: [], worn: [], attachment: [] } },
    hub: { start: iso(1, 0), intervalMinutes: 60, length: 1344, columns: { temp_c: [], rh_pct: [], voc_index: [], nox_index: [], light_lux: [], pm25: [], co2_ppm: [], noise_db: [], pressure_hpa: [] } },
    nights: [], checkins: demoCheckins, logs: logs(), sessions: [], spikes: [], recalibrations: [], insights: insights(), talkAnswers: [],
  };
}

export const demoDataset = createDemoDataset();
