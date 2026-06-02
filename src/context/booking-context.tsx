"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { SessionType } from "@/lib/data";
import {
  generateId,
  hasConflict,
  loadBookings,
  saveBookings,
  STORAGE_KEY,
  suggestSlots,
} from "@/lib/booking/logic";
import type { BookingRecord, DurationMinutes } from "@/lib/booking/types";

type BookingContextValue = {
  bookings: BookingRecord[];
  addBooking: (input: {
    name: string;
    email: string;
    sessionType: SessionType;
    date: string;
    time: string;
    durationMinutes: DurationMinutes;
    notes: string;
  }) => { ok: true; booking: BookingRecord } | { ok: false; reason: string };
  updateNotes: (id: string, notes: string) => void;
  suggestFor: (date: string, duration: DurationMinutes) => string[];
  isSlotTaken: (
    date: string,
    time: string,
    durationMinutes: DurationMinutes,
  ) => boolean;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);

  useEffect(() => {
    queueMicrotask(() => {
      setBookings(loadBookings());
    });
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setBookings(loadBookings());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addBooking = useCallback(
    (input: {
      name: string;
      email: string;
      sessionType: SessionType;
      date: string;
      time: string;
      durationMinutes: DurationMinutes;
      notes: string;
    }): { ok: true; booking: BookingRecord } | { ok: false; reason: string } => {
      const current = loadBookings();
      if (
        hasConflict(
          current,
          input.date,
          input.time,
          input.durationMinutes,
        )
      ) {
        return {
          ok: false,
          reason:
            "That time overlaps another session. Pick a suggested slot or another time.",
        };
      }
      const booking: BookingRecord = {
        id: generateId(),
        name: input.name,
        email: input.email,
        sessionType: input.sessionType,
        date: input.date,
        time: input.time,
        durationMinutes: input.durationMinutes,
        notes: input.notes,
        createdAt: new Date().toISOString(),
      };
      const next = [...current, booking];
      saveBookings(next);
      setBookings(next);
      return { ok: true, booking };
    },
    [],
  );

  const updateNotes = useCallback((id: string, notes: string) => {
    const current = loadBookings();
    const next = current.map((b) => (b.id === id ? { ...b, notes } : b));
    saveBookings(next);
    setBookings(next);
  }, []);

  const suggestFor = useCallback(
    (date: string, duration: DurationMinutes) =>
      suggestSlots(bookings, date, duration, 6),
    [bookings],
  );

  const isSlotTaken = useCallback(
    (date: string, time: string, durationMinutes: DurationMinutes) =>
      hasConflict(bookings, date, time, durationMinutes),
    [bookings],
  );

  const value = useMemo(
    () => ({
      bookings,
      addBooking,
      updateNotes,
      suggestFor,
      isSlotTaken,
    }),
    [bookings, addBooking, updateNotes, suggestFor, isSlotTaken],
  );

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) {
    throw new Error("useBooking must be used within BookingProvider");
  }
  return ctx;
}
