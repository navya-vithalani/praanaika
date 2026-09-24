import type { LogCategory, ParsedPayload } from '../data/types';

const medicines = ['crocin', 'paracetamol', 'dolo', 'cetirizine', 'ibuprofen', 'combiflam', 'pantoprazole', 'vitamin d', 'iron', 'metformin', 'thyroxine'];
const symptoms: Record<string, string> = { 'sar dard': 'headache', 'sir dard': 'headache', bukhaar: 'fever', khansi: 'cough', thakaan: 'fatigue', 'gala kharab': 'sore throat', 'pet dard': 'stomach ache' };

export function parseLog(text: string, category: LogCategory): { parsed: ParsedPayload; confidence: number; needsConfirm: boolean } {
  const lower = text.toLowerCase();
  if (category === 'medication') {
    const name = medicines.find((medicine) => lower.includes(medicine)) ?? 'medicine not identified';
    const dose = lower.match(/(\d+(?:\.\d+)?)\s*(mg|ml|mcg|g|tablet|tab|pill)/);
    return { parsed: { category, name, dose: dose ? Number(dose[1]) : null, unit: dose?.[2] ?? null, takenAt: null, reason: null }, confidence: name === 'medicine not identified' ? .45 : .8, needsConfirm: true };
  }
  if (category === 'illness') {
    const found = Object.entries(symptoms).filter(([phrase]) => lower.includes(phrase)).map(([, value]) => value);
    return { parsed: { category, symptoms: found.length ? found : [lower || 'not identified'], severity: lower.includes('very') || lower.includes('bahut') ? 4 : 3, onset: null, durationHours: null }, confidence: found.length ? .8 : .5, needsConfirm: false };
  }
  if (category === 'sleep') return { parsed: { category, sleepAt: null, wakeAt: null, quality: lower.includes('poor') ? 2 : 3 }, confidence: .65, needsConfirm: false };
  if (category === 'exercise') return { parsed: { category, activity: lower || 'activity not identified', durationMin: null, intensity: null, startAt: null }, confidence: .6, needsConfirm: false };
  if (category === 'food') return { parsed: { category, mealType: lower.includes('breakfast') ? 'breakfast' : lower.includes('lunch') ? 'lunch' : lower.includes('dinner') ? 'dinner' : 'snack', items: lower ? [lower] : [], carbHeavy: null }, confidence: .55, needsConfirm: false };
  return { parsed: { category, phase: null, flow: null, dayOfCycle: null }, confidence: .5, needsConfirm: false };
}
