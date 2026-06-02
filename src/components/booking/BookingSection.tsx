"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useBooking } from "@/context/booking-context";
import { site, sessionTypes, type SessionType } from "@/lib/data";
import { getEveningSlotsForUi, allEveningSlotLabels } from "@/lib/booking/logic";
import { DURATION_OPTIONS, type DurationMinutes } from "@/lib/booking/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

/** Demo blackout dates (YYYY-MM-DD) — photographer off-site. */
const BLOCKED_DATES = new Set(["2026-05-20", "2026-06-14", "2026-07-04"]);

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toYMD(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function startOfToday(): Date {
  const t = new Date();
  return new Date(t.getFullYear(), t.getMonth(), t.getDate());
}

function isPastDate(d: Date): boolean {
  return d < startOfToday();
}

function isUnavailableDay(d: Date): boolean {
  if (d.getDay() === 0) return true;
  return BLOCKED_DATES.has(toYMD(d));
}

export function BookingSection() {
  const { addBooking, suggestFor, bookings } = useBooking();
  const [cursor, setCursor] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [duration, setDuration] = useState<DurationMinutes>(60);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sessionType, setSessionType] = useState<SessionType>(sessionTypes[0]);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [lastBooking, setLastBooking] = useState<{
    date: string;
    time: string;
  } | null>(null);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = useMemo(() => {
    const list: { date: Date; inMonth: boolean }[] = [];
    const lead = (firstDow + 6) % 7;
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = lead; i > 0; i--) {
      list.push({
        date: new Date(year, month - 1, prevMonthDays - i + 1),
        inMonth: false,
      });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      list.push({ date: new Date(year, month, d), inMonth: true });
    }
    while (list.length % 7 !== 0 || list.length < 42) {
      const last = list[list.length - 1].date;
      const next = new Date(last);
      next.setDate(next.getDate() + 1);
      list.push({ date: next, inMonth: false });
    }
    return list;
  }, [year, month, firstDow, daysInMonth]);

  const suggestions = useMemo(() => {
    if (!selectedDate) return [];
    return suggestFor(selectedDate, duration);
  }, [selectedDate, duration, suggestFor]);

  const slots = useMemo(() => {
    if (!selectedDate) return [];
    return getEveningSlotsForUi(selectedDate, duration, bookings);
  }, [selectedDate, duration, bookings]);

  const availableSet = useMemo(() => new Set(slots), [slots]);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      if (!selectedDate || !time) {
        setError("Choose a date and time.");
        return;
      }
      const result = addBooking({
        name,
        email,
        sessionType,
        date: selectedDate,
        time,
        durationMinutes: duration,
        notes,
      });
      if (!result.ok) {
        setError(result.reason);
        return;
      }
      const b = result.booking;
      try {
        await fetch("/api/booking-notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: b.id,
            name: b.name,
            email: b.email,
            sessionType: b.sessionType,
            date: b.date,
            time: b.time,
            durationMinutes: b.durationMinutes,
            notes: b.notes,
          }),
        });
      } catch {
        /* non-blocking — hold is still saved locally */
      }
      setLastBooking({ date: selectedDate, time });
      setConfirmOpen(true);
      setNotes("");
    },
    [
      addBooking,
      duration,
      email,
      name,
      notes,
      selectedDate,
      sessionType,
      time,
    ],
  );

  return (
    <section
      id="booking"
      className="relative scroll-mt-24 px-6 py-24 md:py-32"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/25 to-transparent" />
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-amber-300/90">
              AI booking desk
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight text-[var(--text-primary)] md:text-4xl">
              Smart scheduling for {site.businessName}
            </h2>
            <p className="mt-4 text-[var(--text-muted)]">
              Pick a night, session length, and start time between{" "}
              <strong className="text-[var(--text-primary)]">7:00 PM</strong> and{" "}
              <strong className="text-[var(--text-primary)]">1:00 AM</strong>{" "}
              (end of hold). The desk blocks overlaps and mirrors what you see
              in the{" "}
              <Link
                href="/dashboard"
                className="font-medium text-amber-200/90 underline-offset-4 hover:underline"
              >
                studio dashboard
              </Link>
              . Confirming a hold emails Mark when{" "}
              <code className="rounded bg-white/10 px-1 text-xs">
                RESEND_API_KEY
              </code>{" "}
              or{" "}
              <code className="rounded bg-white/10 px-1 text-xs">
                DISCORD_WEBHOOK_URL
              </code>{" "}
              is configured.
            </p>
          </div>
          <p className="max-w-xs text-right text-sm text-[var(--text-muted)]">
            <span className="block text-[var(--text-primary)]">
              $449 · 60 min · 30+ pics · 20× 6×4&quot; prints
            </span>
            <span className="mt-2 block text-[var(--text-primary)]">
              $699 · 90 min · 45+ pics · 35× 6×4&quot; prints
            </span>
            <span className="mt-3 block text-xs">{site.eveningHoldWindowLabel}</span>
          </p>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="glass rounded-3xl border border-[var(--border-glass)] p-6 md:p-8"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-[var(--text-primary)]">
                <CalendarDays className="h-5 w-5 text-amber-300/90" />
                <span className="font-[family-name:var(--font-syne)] text-lg font-semibold">
                  {cursor.toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  aria-label="Previous month"
                  onClick={() =>
                    setCursor(new Date(year, month - 1, 1))
                  }
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  aria-label="Next month"
                  onClick={() =>
                    setCursor(new Date(year, month + 1, 1))
                  }
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-7 gap-1 text-center text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
              {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                <span key={d} className="py-2">
                  {d}
                </span>
              ))}
            </div>

            <div className="mt-1 grid grid-cols-7 gap-1">
              {cells.map(({ date, inMonth }, i) => {
                const ymd = toYMD(date);
                const unavailable = isUnavailableDay(date) || isPastDate(date);
                const selected = selectedDate === ymd;
                return (
                  <button
                    key={`${i}-${ymd}`}
                    type="button"
                    disabled={!inMonth || unavailable}
                    onClick={() => {
                      setSelectedDate(ymd);
                      setTime(null);
                    }}
                    className={`relative aspect-square rounded-xl text-sm font-medium transition ${
                      !inMonth
                        ? "text-transparent"
                        : unavailable
                          ? "cursor-not-allowed text-white/20 line-through"
                          : selected
                            ? "bg-gradient-to-br from-amber-400/90 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20"
                            : "text-[var(--text-primary)] hover:bg-white/10"
                    }`}
                  >
                    {inMonth ? date.getDate() : ""}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex flex-wrap gap-2 text-xs text-[var(--text-muted)]">
              <Badge variant="outline">Sundays blocked</Badge>
              <Badge variant="outline">7 PM – 1 AM holds</Badge>
              <Badge variant="outline">No overlap booking</Badge>
              <Badge variant="amber">Assistant suggests slots</Badge>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.05 }}
            onSubmit={onSubmit}
            className="glass flex flex-col gap-5 rounded-3xl border border-[var(--border-glass)] p-6 md:p-8"
          >
            <div className="flex items-start gap-3 rounded-2xl border border-amber-400/20 bg-amber-500/5 p-4">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
              <div>
                <p className="text-sm font-medium text-amber-100/90">
                  Assistant
                </p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  {selectedDate
                    ? suggestions.length > 0
                      ? `Open windows on ${selectedDate} (evening window):`
                      : "No openings that night for this duration — try another date or the other package length."
                    : "Select a date to see suggested starts between 7 PM and 1 AM that avoid conflicts."}
                </p>
                {selectedDate && suggestions.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <Button
                        key={s}
                        type="button"
                        size="sm"
                        variant="luxury"
                        className="h-8 rounded-full px-3 text-xs"
                        onClick={() => setTime(s)}
                      >
                        {s}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bk-duration">Session duration</Label>
                <select
                  id="bk-duration"
                  value={duration}
                  onChange={(e) =>
                    setDuration(Number(e.target.value) as DurationMinutes)
                  }
                  className="flex h-10 w-full rounded-xl border border-[var(--border-glass)] bg-black/25 px-3 text-sm text-[var(--text-primary)]"
                >
                  {DURATION_OPTIONS.map((d) => (
                    <option key={d} value={d}>
                      {d} minutes
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bk-session">Session type</Label>
                <select
                  id="bk-session"
                  value={sessionType}
                  onChange={(e) =>
                    setSessionType(e.target.value as SessionType)
                  }
                  className="flex h-10 w-full rounded-xl border border-[var(--border-glass)] bg-black/25 px-3 text-sm text-[var(--text-primary)]"
                >
                  {sessionTypes.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time slot
              </Label>
              <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto pr-1">
                {allEveningSlotLabels().map((slot) => {
                  const disabled =
                    !selectedDate || !availableSet.has(slot);
                  const active = time === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={disabled}
                      onClick={() => setTime(slot)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        active
                          ? "border-sky-400/50 bg-sky-500/20 text-sky-100"
                          : disabled
                            ? "cursor-not-allowed border-white/5 text-white/25"
                            : "border-[var(--border-glass)] text-[var(--text-muted)] hover:border-amber-400/35 hover:text-[var(--text-primary)]"
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bk-name">Name</Label>
                <Input
                  id="bk-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bk-email">Email</Label>
                <Input
                  id="bk-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bk-notes">Notes for the shoot</Label>
              <Textarea
                id="bk-notes"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Wardrobe, meeting spot near Times Square, references…"
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="text-sm text-red-300"
                  role="alert"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              size="lg"
              variant="luxury"
              className="w-full rounded-full text-base font-semibold"
            >
              Confirm intelligent hold
            </Button>
          </motion.form>
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-md border-amber-400/20 bg-[var(--bg-elevated)]">
          <DialogHeader>
            <DialogTitle className="font-[family-name:var(--font-syne)]">
              You&apos;re on the calendar
            </DialogTitle>
            <DialogDescription>
              {lastBooking
                ? `Locked ${lastBooking.date} at ${lastBooking.time}. The hold is saved in this browser and in the studio dashboard; if the host configured email or Discord, Mark was notified too.`
                : "Session saved locally in this browser."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" asChild className="rounded-full">
              <Link href="/dashboard">View dashboard</Link>
            </Button>
            <Button
              className="rounded-full"
              onClick={() => setConfirmOpen(false)}
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
