"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Calendar,
  Check,
  LayoutDashboard,
  Search,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { BookingRecord, PaymentStatus } from "@/lib/booking/types";
import { useBooking } from "@/context/booking-context";
import { formatUsd, site } from "@/lib/data";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { openMarkoAI } from "@/lib/marko/open";

function parseYMD(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toYMD(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function paymentBadge(status: PaymentStatus) {
  if (status === "paid") return { label: "Paid", className: "bg-emerald-500/20 text-emerald-100 border-emerald-400/30" };
  if (status === "pending") return { label: "Pending", className: "bg-sky-500/20 text-sky-100 border-sky-400/30" };
  return { label: "Unpaid", className: "bg-amber-500/20 text-amber-100 border-amber-400/30" };
}

export default function DashboardClient() {
  const { bookings, updateNotes, updatePayment, cancelBooking } = useBooking();
  const [cursor, setCursor] = useState(() => new Date());
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unpaid" | "upcoming">("all");

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthBookings = useMemo(
    () =>
      bookings.filter(
        (b) =>
          parseYMD(b.date).getMonth() === month &&
          parseYMD(b.date).getFullYear() === year,
      ),
    [bookings, month, year],
  );

  const bookedDays = useMemo(() => {
    const set = new Set<string>();
    for (const b of monthBookings) set.add(b.date);
    return set;
  }, [monthBookings]);

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
      const last = list[list.length - 1]?.date ?? new Date(year, month, 1);
      const next = new Date(last);
      next.setDate(next.getDate() + 1);
      list.push({ date: next, inMonth: false });
    }
    return list;
  }, [year, month, firstDow, daysInMonth]);

  const [upcoming, setUpcoming] = useState<BookingRecord[]>([]);

  useEffect(() => {
    queueMicrotask(() => {
      const now = Date.now();
      setUpcoming(
        [...bookings]
          .filter((b) => {
            const t = new Date(`${b.date}T${b.time}:00`).getTime();
            return !Number.isNaN(t) && t >= now - 24 * 60 * 60 * 1000;
          })
          .sort((a, b) =>
            `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`),
          ),
      );
    });
  }, [bookings]);

  const revenuePaid = bookings
    .filter((b) => b.paymentStatus === "paid")
    .reduce((sum, b) => sum + (b.amountUsd ?? 0), 0);
  const outstanding = bookings
    .filter((b) => b.paymentStatus !== "paid")
    .reduce((sum, b) => sum + (b.amountUsd ?? 0), 0);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...bookings]
      .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))
      .filter((b) => {
        if (filter === "unpaid" && b.paymentStatus === "paid") return false;
        if (filter === "upcoming" && !upcoming.some((u) => u.id === b.id)) return false;
        if (!q) return true;
        return (
          b.name.toLowerCase().includes(q) ||
          b.email.toLowerCase().includes(q) ||
          b.sessionType.toLowerCase().includes(q)
        );
      });
  }, [bookings, filter, query, upcoming]);

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="relative flex-1 px-6 pb-24 pt-28">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,_rgba(251,191,36,0.12),transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
          >
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-amber-300/90">
                Studio dashboard
              </p>
              <h1 className="mt-2 font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight text-[var(--text-primary)] md:text-4xl">
                Sessions & notes
              </h1>
              <p className="mt-3 max-w-xl text-[var(--text-muted)]">
                Same glass language as the public studio. Holds live in this
                browser — mark holds paid here or ask{" "}
                <button
                  type="button"
                  onClick={() => openMarkoAI()}
                  className="font-medium text-amber-200/90 underline-offset-4 hover:underline"
                >
                  {site.agentName}
                </button>{" "}
                for a rundown.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" asChild className="rounded-full">
                <Link href="/#booking">
                  <Calendar className="h-4 w-4" />
                  New booking
                </Link>
              </Button>
              <Button variant="dev" asChild className="rounded-full">
                <Link href="/dev">Software Engineer</Link>
              </Button>
              <Button variant="luxury" asChild className="rounded-full">
                <Link href="/">
                  <LayoutDashboard className="h-4 w-4" />
                  Photography home
                </Link>
              </Button>
            </div>
          </motion.div>

          <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total holds", value: String(bookings.length) },
              { label: "This month", value: String(monthBookings.length) },
              { label: "Collected", value: formatUsd(revenuePaid) },
              { label: "Outstanding", value: formatUsd(outstanding) },
            ].map((s) => (
              <Card
                key={s.label}
                className="border-amber-400/15 bg-gradient-to-br from-amber-500/10 to-transparent"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-[var(--text-muted)]">
                    {s.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-[family-name:var(--font-syne)] text-3xl font-bold text-[var(--text-primary)]">
                    {s.value}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mb-10 grid gap-4 sm:grid-cols-3">
            <Card className="border-sky-400/20 bg-sky-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-sky-100/80">
                  Portrait sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-[family-name:var(--font-syne)] text-2xl font-bold text-[var(--text-primary)]">
                  {bookings.filter((b) => b.sessionType.includes("$350")).length}
                </p>
              </CardContent>
            </Card>
            <Card className="border-amber-400/20 bg-amber-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-amber-100/80">
                  Extended sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-[family-name:var(--font-syne)] text-2xl font-bold text-[var(--text-primary)]">
                  {bookings.filter((b) => b.sessionType.includes("$450")).length}
                </p>
              </CardContent>
            </Card>
            <Card className="border-emerald-400/20 bg-emerald-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-emerald-100/80">
                  Unpaid holds
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-[family-name:var(--font-syne)] text-2xl font-bold text-[var(--text-primary)]">
                  {bookings.filter((b) => b.paymentStatus !== "paid").length}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-10 lg:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-xl">Month calendar</CardTitle>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="rounded-full"
                    onClick={() => setCursor(new Date(year, month - 1, 1))}
                  >
                    Prev
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="rounded-full"
                    onClick={() => setCursor(new Date(year, month + 1, 1))}
                  >
                    Next
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-center text-sm font-medium text-[var(--text-muted)]">
                  {cursor.toLocaleString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
                  {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                    <span key={d} className="py-1">
                      {d}
                    </span>
                  ))}
                </div>
                <div className="mt-1 grid grid-cols-7 gap-1">
                  {cells.map(({ date, inMonth }, i) => {
                    const ymd = toYMD(date);
                    const booked = bookedDays.has(ymd);
                    return (
                      <div
                        key={`${i}-${ymd}`}
                        className={`relative aspect-square rounded-xl text-xs font-medium ${
                          !inMonth
                            ? "text-transparent"
                            : booked
                              ? "bg-gradient-to-br from-amber-400/90 to-orange-500 text-slate-950"
                              : "text-[var(--text-muted)]"
                        }`}
                      >
                        <span className="flex h-full items-center justify-center">
                          {inMonth ? date.getDate() : ""}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <ul className="mt-6 max-h-48 space-y-2 overflow-y-auto pr-1">
                  {monthBookings.length === 0 ? (
                    <li className="text-sm text-[var(--text-muted)]">
                      No sessions this month.
                    </li>
                  ) : (
                    monthBookings.map((b) => (
                      <li
                        key={b.id}
                        className="rounded-xl border border-[var(--border-glass)] bg-white/[0.03] p-3 text-sm"
                      >
                        <p className="font-medium text-[var(--text-primary)]">
                          {b.date} · {b.time} · {formatUsd(b.amountUsd)}
                        </p>
                        <p className="text-[var(--text-muted)]">
                          {b.name} — {b.sessionType}
                        </p>
                      </li>
                    ))
                  )}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Roster & collections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search name, email, package…"
                    className="pl-9"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {(["all", "unpaid", "upcoming"] as const).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFilter(key)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${
                        filter === key
                          ? "border-amber-400/40 bg-amber-500/15 text-amber-50"
                          : "border-[var(--border-glass)] text-[var(--text-muted)]"
                      }`}
                    >
                      {key}
                    </button>
                  ))}
                </div>
                {visible.length === 0 ? (
                  <p className="text-sm text-[var(--text-muted)]">
                    No matching holds. Add one from the booking desk.
                  </p>
                ) : (
                  visible.map((b) => {
                    const badge = paymentBadge(b.paymentStatus);
                    return (
                      <div
                        key={b.id}
                        className="rounded-xl border border-[var(--border-glass)] bg-white/[0.03] p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-[var(--text-primary)]">
                              {b.name}{" "}
                              <a
                                href={`mailto:${b.email}`}
                                className="font-normal text-[var(--text-muted)] underline-offset-4 hover:underline"
                              >
                                · {b.email}
                              </a>
                            </p>
                            <p className="mt-1 text-xs text-amber-200/90">
                              {b.date} {b.time} · {b.sessionType} · {b.durationMinutes}m ·{" "}
                              {formatUsd(b.amountUsd)}
                            </p>
                          </div>
                          <Badge className={badge.className}>{badge.label}</Badge>
                        </div>
                        <div className="mt-3 space-y-2">
                          <Label htmlFor={`note-${b.id}`}>Notes</Label>
                          <Textarea
                            id={`note-${b.id}`}
                            rows={3}
                            defaultValue={b.notes}
                            onBlur={(e) => updateNotes(b.id, e.target.value)}
                          />
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {b.paymentStatus !== "paid" ? (
                            <Button
                              type="button"
                              size="sm"
                              variant="luxury"
                              className="rounded-full"
                              onClick={() =>
                                updatePayment(b.id, { paymentStatus: "paid" })
                              }
                            >
                              <Check className="h-4 w-4" />
                              Mark as paid
                            </Button>
                          ) : null}
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="rounded-full text-red-300 hover:text-red-200"
                            onClick={() => {
                              if (window.confirm(`Release hold for ${b.name}?`)) {
                                cancelBooking(b.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                            Release
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <footer className="border-t border-[var(--border-glass)] px-6 py-8 text-sm text-[var(--text-muted)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p>
            © 2026 {site.businessName} — studio operations.
          </p>
          <Link href="/dev" className="text-[var(--text-primary)] underline-offset-4 hover:underline">
            Software Engineer page
          </Link>
        </div>
      </footer>
    </div>
  );
}
