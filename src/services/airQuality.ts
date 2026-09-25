import { readStorage, writeStorage } from './storage';

export type AqiBand = 'Good' | 'Satisfactory' | 'Moderate' | 'Poor' | 'Very Poor' | 'Severe';
export interface LocationResult { name: string; latitude: number; longitude: number; label: string; }
export interface EnvironmentSnapshot {
  fetchedAt: string;
  location: LocationResult;
  aqi: number;
  band: AqiBand;
  pm25: number | null;
  pm10: number | null;
  temperature: number | null;
  apparentTemperature: number | null;
  humidity: number | null;
  uvIndex: number | null;
  cleanestWindow: string;
  offline: boolean;
}

const CACHE_KEY = 'airQuality.v1';
const TIMEZONE = 'Asia/Kolkata';
const SEARCH_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const AIR_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

type Band = { low: number; high: number; indexLow: number; indexHigh: number };
const PM25_BANDS: Band[] = [
  { low: 0, high: 30, indexLow: 0, indexHigh: 50 }, { low: 31, high: 60, indexLow: 51, indexHigh: 100 }, { low: 61, high: 90, indexLow: 101, indexHigh: 200 }, { low: 91, high: 120, indexLow: 201, indexHigh: 300 }, { low: 121, high: 250, indexLow: 301, indexHigh: 400 }, { low: 251, high: Number.POSITIVE_INFINITY, indexLow: 401, indexHigh: 500 },
];
const PM10_BANDS: Band[] = [
  { low: 0, high: 50, indexLow: 0, indexHigh: 50 }, { low: 51, high: 100, indexLow: 51, indexHigh: 100 }, { low: 101, high: 250, indexLow: 101, indexHigh: 200 }, { low: 251, high: 350, indexLow: 201, indexHigh: 300 }, { low: 351, high: 430, indexLow: 301, indexHigh: 400 }, { low: 431, high: Number.POSITIVE_INFINITY, indexLow: 401, indexHigh: 500 },
];

function interpolate(value: number, band: Band): number {
  if (!Number.isFinite(band.high)) return band.indexLow;
  return band.indexLow + ((value - band.low) / (band.high - band.low)) * (band.indexHigh - band.indexLow);
}

function subIndex(value: number | null, bands: Band[]): number | null {
  if (value === null || !Number.isFinite(value)) return null;
  const wholeValue = Math.floor(value);
  const band = bands.find((item) => wholeValue >= item.low && wholeValue <= item.high) ?? bands[bands.length - 1];
  return Math.round(Math.min(500, Math.max(0, interpolate(wholeValue, band))));
}

export function calculateCpcbAqi(pm25: number | null, pm10: number | null): number | null {
  const values = [subIndex(pm25, PM25_BANDS), subIndex(pm10, PM10_BANDS)].filter((value): value is number => value !== null);
  return values.length ? Math.max(...values) : null;
}

export function aqiBand(aqi: number): AqiBand {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Satisfactory';
  if (aqi <= 200) return 'Moderate';
  if (aqi <= 300) return 'Poor';
  if (aqi <= 400) return 'Very Poor';
  return 'Severe';
}

async function geocode(query: string): Promise<LocationResult> {
  const url = new URL(SEARCH_URL);
  url.search = new URLSearchParams({ name: query, count: '1', language: 'en', country_code: 'IN' }).toString();
  const response = await fetch(url);
  if (!response.ok) throw new Error('Location search failed');
  const payload = await response.json() as { results?: Array<{ name: string; latitude: number; longitude: number; admin1?: string }> };
  const result = payload.results?.[0];
  if (!result) throw new Error('Location not found');
  return { name: result.name, latitude: result.latitude, longitude: result.longitude, label: result.admin1 ? `${result.name}, ${result.admin1}` : result.name };
}

function average(values: unknown): number | null {
  if (!Array.isArray(values)) return null;
  const numbers = values.filter((value): value is number => typeof value === 'number' && Number.isFinite(value));
  return numbers.length ? numbers.reduce((sum, value) => sum + value, 0) / numbers.length : null;
}

function bestWindow(times: string[], pm25: unknown[]): string {
  const candidates = times.map((time, index) => ({ time, value: typeof pm25[index] === 'number' ? pm25[index] as number : Number.POSITIVE_INFINITY })).filter((item) => item.value < Number.POSITIVE_INFINITY && Number(item.time.slice(11, 13)) >= 5 && Number(item.time.slice(11, 13)) <= 19).sort((a, b) => a.value - b.value);
  if (!candidates.length) return 'Not available yet';
  const start = candidates[0].time.slice(11, 16);
  const hour = Number(candidates[0].time.slice(11, 13)) + 2;
  return `${start}–${String(hour).padStart(2, '0')}:00`;
}

export async function fetchEnvironment(query: string): Promise<EnvironmentSnapshot> {
  const cacheKey = `${CACHE_KEY}.${query.trim().toLowerCase()}`;
  try {
    const location = await geocode(query);
    const params = new URLSearchParams({ latitude: String(location.latitude), longitude: String(location.longitude), hourly: 'pm10,pm2_5,uv_index', past_days: '1', forecast_days: '2', timezone: TIMEZONE });
    const weatherParams = new URLSearchParams({ latitude: String(location.latitude), longitude: String(location.longitude), current: 'temperature_2m,apparent_temperature,relative_humidity_2m', timezone: TIMEZONE });
    const [airResponse, weatherResponse] = await Promise.all([fetch(`${AIR_URL}?${params}`), fetch(`${WEATHER_URL}?${weatherParams}`)]);
    if (!airResponse.ok || !weatherResponse.ok) throw new Error('Environment request failed');
    const air = await airResponse.json() as { hourly?: { time?: string[]; pm2_5?: unknown[]; pm10?: unknown[]; uv_index?: unknown[] } };
    const weather = await weatherResponse.json() as { current?: { temperature_2m?: number; apparent_temperature?: number; relative_humidity_2m?: number } };
    const times = air.hourly?.time ?? [];
    const pm25 = average(air.hourly?.pm2_5);
    const pm10 = average(air.hourly?.pm10);
    const aqi = calculateCpcbAqi(pm25, pm10) ?? 0;
    const snapshot: EnvironmentSnapshot = { fetchedAt: new Date().toISOString(), location, aqi, band: aqiBand(aqi), pm25, pm10, temperature: weather.current?.temperature_2m ?? null, apparentTemperature: weather.current?.apparent_temperature ?? null, humidity: weather.current?.relative_humidity_2m ?? null, uvIndex: average(air.hourly?.uv_index), cleanestWindow: bestWindow(times, air.hourly?.pm2_5 ?? []), offline: false };
    writeStorage(cacheKey, snapshot);
    return snapshot;
  } catch {
    const cached = readStorage<EnvironmentSnapshot | null>(cacheKey, null);
    if (cached && cached.location.label.toLowerCase().includes(query.trim().toLowerCase())) return { ...cached, offline: true };
    throw new Error('Environment data is unavailable');
  }
}
