"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { priceForSessionType, type SessionType } from "@/lib/data";
import {
  generateId,
  hasConflict,
  loadBookings,
  saveBookings,
  STORAGE_KEY,
  suggestSlots,
} from "@/lib/booking/logic";
import type {
  BookingRecord,
  DurationMinutes,
  PaymentStatus,
} from "@/lib/booking/types";

type AddBookingInput = {
  name: string;
  email: string;
  sessionType: SessionType;
  date: string;
  time: string;
  durationMinutes: DurationMinutes;
  notes: string;
};

type BookingContextValue = {
  bookings: BookingRecord[];
  addBooking: (
    input: AddBookingInput,
  ) => { ok: true; booking: BookingRecord } | { ok: false; reason: string };
  updateNotes: (id: string, notes: string) => void;
  updatePayment: (
    id: string,
    patch: { paymentStatus: PaymentStatus },
  ) => void;
  cancelBooking: (id: string) => void;
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
    (
      input: AddBookingInput,
    ): { ok: true; booking: BookingRecord } | { ok: false; reason: string } => {
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
        amountUsd: priceForSessionType(input.sessionType),
        paymentStatus: "unpaid",
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

  const updatePayment = useCallback(
    (
      id: string,
      patch: { paymentStatus: PaymentStatus },
    ) => {
      const current = loadBookings();
      const next = current.map((b) =>
        b.id === id
          ? {
              ...b,
              paymentStatus: patch.paymentStatus,
            }
          : b,
      );
      saveBookings(next);
      setBookings(next);
    },
    [],
  );

  const cancelBooking = useCallback((id: string) => {
    const current = loadBookings();
    const next = current.filter((b) => b.id !== id);
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
      updatePayment,
      cancelBooking,
      suggestFor,
      isSlotTaken,
    }),
    [
      bookings,
      addBooking,
      updateNotes,
      updatePayment,
      cancelBooking,
      suggestFor,
      isSlotTaken,
    ],
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
