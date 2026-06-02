import type { BookingRecord } from "./types";
import type { DurationMinutes } from "./types";

const STORAGE_KEY = "mark-photo-bookings-v1";

export function loadBookings(): BookingRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as BookingRecord[];
  } catch {
    return [];
  }
}

export function saveBookings(bookings: BookingRecord[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** Anchor calendar date (YYYY-MM-DD) = the "shoot night". Slots 19:00–23:30 live that day; 00:00–00:30 are early morning next calendar day but same anchor night. */
export function sessionStartMs(anchorYmd: string, hm: string): number {
  const [Y, M, d] = anchorYmd.split("-").map(Number);
  const [h, mi] = hm.split(":").map(Number);
  const base = new Date(Y, (M ?? 1) - 1, d ?? 1);
  if ((h ?? 0) >= 19) {
    base.setHours(h ?? 0, mi ?? 0, 0, 0);
    return base.getTime();
  }
  base.setDate(base.getDate() + 1);
  base.setHours(h ?? 0, mi ?? 0, 0, 0);
  return base.getTime();
}

/** End of service window: 1:00 AM on the calendar day after the anchor date. */
export function sessionEndLimitMs(anchorYmd: string): number {
  const [Y, M, d] = anchorYmd.split("-").map(Number);
  const t = new Date(Y, (M ?? 1) - 1, d ?? 1);
  t.setDate(t.getDate() + 1);
  t.setHours(1, 0, 0, 0);
  return t.getTime();
}

function eveningWindowStartMs(anchorYmd: string): number {
  return sessionStartMs(anchorYmd, "19:00");
}

export function sessionFitsWindow(
  anchorYmd: string,
  hm: string,
  durationMinutes: number,
): boolean {
  const start = sessionStartMs(anchorYmd, hm);
  const end = start + durationMinutes * 60_000;
  const winStart = eveningWindowStartMs(anchorYmd);
  const winEnd = sessionEndLimitMs(anchorYmd);
  return start >= winStart && end <= winEnd;
}

/** All discrete start labels for the overnight window (7 PM – 1 AM end). */
export function allEveningSlotLabels(): string[] {
  const out: string[] = [];
  for (let h = 19; h <= 23; h++) {
    out.push(`${pad(h)}:00`);
    out.push(`${pad(h)}:30`);
  }
  out.push("00:00", "00:30");
  return out;
}

export function hasConflict(
  bookings: BookingRecord[],
  date: string,
  startTime: string,
  durationMinutes: number,
  ignoreId?: string,
): boolean {
  if (!sessionFitsWindow(date, startTime, durationMinutes)) return true;
  const candStart = sessionStartMs(date, startTime);
  const candEnd = candStart + durationMinutes * 60_000;

  return bookings.some((b) => {
    if (ignoreId && b.id === ignoreId) return false;
    const bStart = sessionStartMs(b.date, b.time);
    const bEnd = bStart + b.durationMinutes * 60_000;
    return candStart < bEnd && candEnd > bStart;
  });
}

export function suggestSlots(
  bookings: BookingRecord[],
  date: string,
  durationMinutes: DurationMinutes,
  maxSuggestions = 6,
): string[] {
  const suggestions: string[] = [];
  for (const slot of allEveningSlotLabels()) {
    if (!sessionFitsWindow(date, slot, durationMinutes)) continue;
    if (hasConflict(bookings, date, slot, durationMinutes)) continue;
    suggestions.push(slot);
    if (suggestions.length >= maxSuggestions) break;
  }
  return suggestions;
}

/** Slots for UI grid, optionally hiding times already passed when anchor is today. */
export function getEveningSlotsForUi(
  anchorYmd: string,
  durationMinutes: number,
  bookings: BookingRecord[],
  nowMs: number = Date.now(),
): string[] {
  const todayYmd = (() => {
    const n = new Date();
    return `${n.getFullYear()}-${pad(n.getMonth() + 1)}-${pad(n.getDate())}`;
  })();

  return allEveningSlotLabels().filter((slot) => {
    if (!sessionFitsWindow(anchorYmd, slot, durationMinutes)) return false;
    if (hasConflict(bookings, anchorYmd, slot, durationMinutes)) return false;
    if (anchorYmd === todayYmd && sessionStartMs(anchorYmd, slot) < nowMs) {
      return false;
    }
    return true;
  });
}

export function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `bk_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export { STORAGE_KEY };
