"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, LayoutDashboard } from "lucide-react";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import type { BookingRecord } from "@/lib/booking/types";
import { useBooking } from "@/context/booking-context";
import { site } from "@/lib/data";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

function parseYMD(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export default function DashboardClient() {
  const { bookings, updateNotes } = useBooking();
  const [cursor, setCursor] = useState(() => new Date());

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const monthBookings = useMemo(
    () =>
      bookings.filter(
        (b) =>
          parseYMD(b.date).getMonth() === month &&
          parseYMD(b.date).getFullYear() === year,
      ),
    [bookings, month, year],
  );

  const [upcoming, setUpcoming] = useState<BookingRecord[]>([]);
  const [uploads, setUploads] = useState<string[]>([]);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("studio-uploads") : null;
    if (stored) {
      try {
        setUploads(JSON.parse(stored));
      } catch {
        setUploads([]);
      }
    }
  }, []);

  const saveUploads = (items: string[]) => {
    setUploads(items);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("studio-uploads", JSON.stringify(items));
    }
  };

  const handleUploadFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const readFile = (file: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          } else {
            reject(new Error("Unable to read file"));
          }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });

    const results = await Promise.all(Array.from(files).map(readFile));
    saveUploads([...results, ...uploads].slice(0, 12));
    event.target.value = "";
  };

  const removeUpload = (index: number) => {
    saveUploads(uploads.filter((_, i) => i !== index));
  };

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

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="relative flex-1 px-6 pb-24 pt-28">
        <div className="mx-auto max-w-6xl">
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
                Data persists in this browser via local storage — perfect for
                demos. Wire to your CRM or database when you are ready.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" asChild className="rounded-full">
                <Link href="/#booking">
                  <Calendar className="h-4 w-4" />
                  New booking
                </Link>
              </Button>
              <Button variant="luxury" asChild className="rounded-full">
                <Link href="/">
                  <LayoutDashboard className="h-4 w-4" />
                  Photography home
                </Link>
              </Button>
            </div>
          </motion.div>

          <div className="mb-10 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Total holds", value: String(bookings.length) },
              {
                label: "This month",
                value: String(monthBookings.length),
              },
              {
                label: "Upcoming",
                value: String(upcoming.length),
              },
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

          <div className="grid gap-10 lg:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-xl">Calendar</CardTitle>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="rounded-full"
                    onClick={() =>
                      setCursor(new Date(year, month - 1, 1))
                    }
                  >
                    Prev
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="rounded-full"
                    onClick={() =>
                      setCursor(new Date(year, month + 1, 1))
                    }
                  >
                    Next
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-center text-sm font-medium text-[var(--text-muted)]">
                  {cursor.toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <ul className="max-h-80 space-y-3 overflow-y-auto pr-1">
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
                          {b.date} · {b.time} · {b.durationMinutes}m
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
                <CardTitle className="text-xl">Upcoming & notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {upcoming.length === 0 ? (
                  <p className="text-sm text-[var(--text-muted)]">
                    No upcoming sessions. Add one from the booking assistant.
                  </p>
                ) : (
                  upcoming.map((b) => (
                    <div
                      key={b.id}
                      className="rounded-xl border border-[var(--border-glass)] bg-white/[0.03] p-4"
                    >
                      <p className="text-sm font-semibold text-[var(--text-primary)]">
                        {b.name}{" "}
                        <span className="font-normal text-[var(--text-muted)]">
                          · {b.email}
                        </span>
                      </p>
                      <p className="mt-1 text-xs text-amber-200/90">
                        {b.date} {b.time} · {b.sessionType} · {b.durationMinutes}
                        m
                      </p>
                      <div className="mt-3 space-y-2">
                        <Label htmlFor={`note-${b.id}`}>Notes</Label>
                        <Textarea
                          id={`note-${b.id}`}
                          rows={3}
                          defaultValue={b.notes}
                          onBlur={(e) =>
                            updateNotes(b.id, e.target.value)
                          }
                        />
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <footer className="border-t border-[var(--border-glass)] px-6 py-8 text-sm text-[var(--text-muted)]">
        <div className="mx-auto max-w-6xl">
          © {new Date().getFullYear()} {site.businessName} — dashboard preview.
        </div>
      </footer>
    </div>
  );
}
