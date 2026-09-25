import type { CheckIn, DemoDataset, InsightCard, LogEntry } from './types';

const DAY_MS = 86_400_000;
const IST = '+05:30';
const STREAM_LENGTH = 56 * 24;

function iso(day: number, hour: number, minute = 0): string {
  const date = new Date(Date.now() - (56 - day) * DAY_MS);
  date.setUTCHours(hour - 5, minute - 30, 0, 0);
  return `${date.toISOString().slice(0, 19)}${IST}`;
}

function wave(index: number, period: number, amplitude: number, baseline: number): number {
  return baseline + Math.sin(index / period) * amplitude;
}

function createCheckins(): CheckIn[] {
  return Array.from({ length: 80 }, (_, index) => {
    const day = Math.min(56, Math.floor(index * 56 / 80) + 1);
    const tags = index % 7 === 0 ? ['Headache'] : index % 4 === 0 ? ['Focused'] : index % 9 === 0 ? ['Tired'] : [];
    return { id: `checkin-${index + 1}`, t: iso(day, 8 + (index % 11)), feel: ([3, 4, 4, 2, 5][index % 5]) as CheckIn['feel'], energy: ([3, 4, 5, 2, 3][index % 5]) as CheckIn['energy'], tags, note: null };
  });
}

function createLogs(): LogEntry[] {
  const categories = ['sleep', 'food', 'exercise', 'illness', 'medication', 'cycle'] as const;
  return Array.from({ length: 140 }, (_, index) => {
    const day = Math.min(56, Math.floor(index * 56 / 140) + 1);
    const category = categories[index % categories.length];
    const parsed = category === 'sleep' ? { category, sleepAt: iso(day, 23), wakeAt: iso(day + 1, 7), quality: 3 } : category === 'medication' ? { category, name: index % 2 ? 'Paracetamol' : 'Crocin', dose: 500, unit: 'mg', takenAt: iso(day, 14), reason: 'as logged' } : category === 'food' ? { category, mealType: index % 3 === 0 ? 'dinner' : 'lunch', items: ['dal', 'roti'], carbHeavy: index % 3 === 0 } : category === 'exercise' ? { category, activity: index % 2 ? 'walk' : 'yoga', durationMin: 30, intensity: 'moderate', startAt: iso(day, 18) } : category === 'illness' ? { category, symptoms: index % 2 ? ['sore throat'] : ['fatigue'], severity: 3, onset: iso(day, 10), durationHours: 12 } : { category, phase: 'luteal', flow: null, dayOfCycle: (index % 28) + 1 };
    return { id: `log-${index + 1}`, t: iso(day, category === 'sleep' ? 21 : 12), category, inputMode: 'tap', rawText: category === 'medication' ? 'took paracetamol 500 after lunch' : null, photoDiscarded: false, parsed, parserConfidence: index % 17 === 0 ? .42 : .86, status: index % 19 === 0 ? 'corrected' : category === 'medication' ? 'needs_confirm' : 'confirmed' };
  });
}

function createStreams() {
  const gem = { start: iso(1, 0), intervalMinutes: 60 as const, length: STREAM_LENGTH, columns: { voc_out: [] as number[], voc_skin: [] as number[], voc_delta: [] as number[], nox_out: [] as number[], skin_temp_c: [] as number[], skin_rh: [] as number[], uv_index: [] as number[], noise_db: [] as number[], hr_bpm: [] as number[], hrv_ms: [] as number[], spo2_pct: [] as number[], motion: [] as number[], worn: [] as number[], attachment: [] as string[] } };
  const hub = { start: iso(1, 0), intervalMinutes: 60 as const, length: STREAM_LENGTH, columns: { temp_c: [] as number[], rh_pct: [] as number[], voc_index: [] as number[], nox_index: [] as number[], light_lux: [] as number[], pm25: [] as number[], co2_ppm: [] as number[], noise_db: [] as number[], pressure_hpa: [] as number[] } };
  for (let index = 0; index < STREAM_LENGTH; index += 1) {
    const day = Math.floor(index / 24) + 1;
    const hour = index % 24;
    const stuffy = [9, 14, 21, 27, 32, 38, 44, 51].includes(day) && hour >= 1 && hour <= 5;
    const dusty = [12, 22, 31, 42, 49, 54].includes(day) && hour >= 18 && hour <= 20;
    const cooking = hour === 8 || hour === 19;
    const construction = day >= 35 && day <= 42 && hour >= 9 && hour <= 13;
    const unworn = hour < 6 || index % 19 === 0;
    hub.columns.temp_c.push(Number(wave(index, 18, 2.2, 24.5).toFixed(1))); hub.columns.rh_pct.push(Number(wave(index, 22, 8, 58).toFixed(1))); hub.columns.voc_index.push(cooking ? 90 : 35 + (index % 7)); hub.columns.nox_index.push(18 + (index % 5)); hub.columns.light_lux.push(hour > 7 && hour < 20 ? 180 + hour * 12 : 4); hub.columns.pm25.push(dusty ? 76 : 18 + (index % 9)); hub.columns.co2_ppm.push(stuffy ? 1380 + (index % 80) : 650 + (index % 90)); hub.columns.noise_db.push(construction ? 70 : 38 + (index % 9)); hub.columns.pressure_hpa.push(Number(wave(index, 31, 4, 1008).toFixed(1)));
    gem.columns.voc_out.push(20 + (index % 8)); gem.columns.voc_skin.push(unworn ? 0 : 28 + (index % 7)); gem.columns.voc_delta.push(unworn ? 0 : cooking ? 64 : 8 + (index % 9)); gem.columns.nox_out.push(10 + (index % 5)); gem.columns.skin_temp_c.push(unworn ? 0 : Number(wave(index, 40, .3, 36.2).toFixed(2))); gem.columns.skin_rh.push(unworn ? 0 : 52 + (index % 10)); gem.columns.uv_index.push(hour > 6 && hour < 18 ? 3 : 0); gem.columns.noise_db.push(40 + (index % 12)); gem.columns.hr_bpm.push(unworn ? 0 : 70 + (index % 6)); gem.columns.hrv_ms.push(unworn ? 0 : 48 + (index % 8)); gem.columns.spo2_pct.push(unworn ? 0 : 98); gem.columns.motion.push(unworn ? 0 : index % 4); gem.columns.worn.push(unworn ? 0 : 1); gem.columns.attachment.push(unworn ? 'none' : hour >= 18 ? 'ear' : 'collar');
  }
  return { gem, hub };
}

function createInsights(): InsightCard[] {
  const cards = [
    ['co2', 9, ['hub', 'self'], 'personal', 'sleep', 'My bedroom air was stuffier overnight.', 'On nights when CO₂ rose above my usual range, my sleep notes looked lighter. They went together around those nights, not necessarily because of one another.', ['Hub CO₂ stayed above 1,300 ppm for 4 hours', 'Sleep notes from 8 stuffy nights']],
    ['dust', 22, ['hub', 'self'], 'direct', 'pattern', 'A dusty evening went together with a headache tag.', 'This happened on 4 of 6 dusty evenings, while 2 dusty evenings had no headache tag. I cannot say what caused what.', ['Hub PM2.5 above 70', '4 of 6 evenings had the tag']],
    ['voc', 32, ['gem', 'hub'], 'direct', 'exposure', 'I noticed a short VOC rise this evening.', 'The Gem and Hub readings rose together near the kitchen window. I recorded the observation so you can add what else was different.', ['Gem VOC delta at 20:00', 'Hub VOC rose within 20 minutes']],
    ['abstain', 38, ['self'], 'direct', 'abstain', 'I’m not sure yet about late dinners.', 'There are only a few late-dinner nights so far. I need more of your own check-ins before I can compare them fairly.', ['3 late-dinner entries', '2 next-morning check-ins']],
    ['sensor', 40, ['hub'], 'direct', 'sensor_issue', 'I noticed a possible Hub sensor issue.', 'The VOC reading stayed almost flat for about 6 hours. I am marking it as a sensor issue, not a change in you.', ['VOC stream flat-lined for 6 hours']],
    ['noise', 43, ['hub', 'self'], 'personal', 'My afternoons were noisier than usual.', 'A construction stretch coincided with lower afternoon check-ins. I cannot say why they went together.', ['Hub noise averaged 70 dB', '12 afternoon check-ins']],
    ['temp', 45, ['hub', 'self'], 'direct', 'pattern', 'A warmer room aligned with feeling tired.', 'On 3 warmer days, your energy check-ins were lower. This is an observation of a pattern.', ['Hub temp above 26C', '3 tired check-ins']],
    ['sleep-1', 46, ['gem', 'self'], 'personal', 'sleep', 'My sleep was shorter when I took paracetamol.', 'This happened twice. Could be the illness, not the medication itself.', ['Gem sleep tracking', '2 paracetamol logs']],
    ['noise-2', 47, ['hub'], 'direct', 'exposure', 'Noise levels spiked early morning.', 'Construction noise or traffic was recorded around 6 AM.', ['Hub noise above 65 dB']],
    ['voc-2', 48, ['gem', 'self'], 'personal', 'exposure', 'VOCs were high during my commute.', 'Your gem detected elevated VOC levels while you were outside.', ['Gem VOC out above 30']],
    ['co2-2', 49, ['hub'], 'direct', 'pattern', 'CO₂ levels are rising earlier.', 'Usually, your room gets stuffy around midnight, but recently it started at 10 PM.', ['Hub CO₂ pattern shifted']],
    ['dust-2', 50, ['hub', 'self'], 'personal', 'exposure', 'PM2.5 rose while I was cooking.', 'Your cooking log matches a spike in PM2.5 in the living area.', ['Hub PM2.5 above 50', '1 cooking log']],
    ['abstain-2', 51, ['self'], 'direct', 'abstain', 'I’m not sure about your new exercise routine.', 'You only have 2 logs of yoga. I need more data to see a pattern.', ['2 yoga logs']],
    ['sensor-2', 52, ['gem'], 'direct', 'sensor_issue', 'Gem connection was lost briefly.', 'The Gem stopped sending data for 1 hour yesterday.', ['Gem data gap']],
    ['sleep-2', 53, ['hub', 'self'], 'personal', 'sleep', 'Better sleep on cooler nights.', 'When the room was below 22C, your sleep efficiency was higher.', ['Hub temp below 22C', 'Higher sleep efficiency']],
    ['noise-3', 54, ['hub', 'self'], 'direct', 'pattern', 'Quiet mornings correspond to focused check-ins.', 'On 5 mornings with low noise, you tagged "Focused".', ['Hub noise below 40 dB', '5 focused check-ins']],
    ['voc-3', 55, ['gem'], 'personal', 'exposure', 'Skin VOC showed a slight increase.', 'I noticed a change in skin VOC yesterday. No related check-ins.', ['Gem skin VOC elevated']],
    ['temp-2', 56, ['hub'], 'direct', 'pattern', 'Humidity dropped significantly.', 'The room humidity was lower than usual yesterday.', ['Hub humidity below 40%']],
    ['co2-3', 56, ['hub', 'self'], 'personal', 'pattern', 'Stuffy air and headaches.', 'You logged a headache on a day when CO2 was high.', ['Hub CO2 above 1200', '1 headache tag']],
    ['dust-3', 56, ['hub'], 'direct', 'exposure', 'Air quality improved after rain.', 'PM2.5 dropped significantly after 4 PM yesterday.', ['Hub PM2.5 dropped']]
  ] as const;
  return cards.map(([id, day, sources, tier, kind, headline, body, evidence]) => ({ id: `insight-${id}`, dayIndex: day, createdAt: iso(day as number, 20), expiresAt: iso((day as number) + 1, 20), sources: [...(sources as unknown as string[])], tier, kind, headline, body, evidence })) as InsightCard[];
}

export function createDemoDataset(): DemoDataset {
  const { gem, hub } = createStreams();
  return { meta: { personaName: 'Meera', startDate: iso(1, 0).slice(0, 10), endDate: iso(56, 0).slice(0, 10), days: 56, intervalMinutes: 60, timezone: 'Asia/Kolkata', isSynthetic: true, generatorVersion: 'step-3-seed-2', note: 'Synthetic demo data. Shows how the method works, not results from real people.' }, profile: { id: 'demo-meera', isDemo: true, displayName: 'Meera', avatarKey: 'avatar-01', age: 29, sex: 'female', city: 'Bengaluru', lat: 12.9716, lon: 77.5946 }, gem, hub, nights: Array.from({ length: 56 }, (_, index) => ({ date: iso(index + 1, 0).slice(0, 10), minutesAsleep: 390 + (index % 8) * 12, sleepEfficiencyPct: [78, 80, 88, 90][index % 4] })), checkins: createCheckins(), logs: createLogs(), sessions: Array.from({ length: 20 }, (_, index) => ({ id: `session-${index + 1}`, name: index % 2 ? 'Evening at home' : 'Morning commute', attachment: index % 2 ? 'collar' : 'ear', spikeIds: [`spike-${index + 1}`] })), spikes: Array.from({ length: 25 }, (_, index) => ({ id: `spike-${index + 1}`, t: iso((index % 56) + 1, 8 + (index % 12)), durationMin: 8 + (index % 15), peakVocDelta: 42 + (index % 30), tag: index % 3 ? 'Cooking' : 'Incense or smoke' })), recalibrations: Array.from({ length: 8 }, (_, index) => ({ id: `recalibration-${index + 1}`, t: iso(7 * (index + 1), 10), socket: (index % 4) + 1, confirmedByHallSensor: index !== 5 })), insights: createInsights(), talkAnswers: [{ id: 'sleep-stuffy', question: 'How did I sleep on stuffy nights?', answerText: 'My sleep efficiency was lower on the stuffy nights in this synthetic demo. That is an observation, not a cause.', abstain: false }, { id: 'unknown', question: 'Unknown question', answerText: 'I’m not sure yet, and here is what is missing.', abstain: true }] };
}

export const demoDataset = createDemoDataset();
