import type { SessionType } from "@/lib/data";

export type BookingId = string;

export type PaymentStatus = "unpaid" | "pending" | "paid";

export type BookingRecord = {
  id: BookingId;
  name: string;
  email: string;
  sessionType: SessionType;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes: number;
  notes: string;
  createdAt: string;
  amountUsd: number;
  paymentStatus: PaymentStatus;
};

/** Aligned with on-site packages (60 min / 90 min). */
export const DURATION_OPTIONS = [60, 90] as const;

export type DurationMinutes = (typeof DURATION_OPTIONS)[number];
