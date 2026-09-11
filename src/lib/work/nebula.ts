export const nebulaRoles = ["viewer", "operator", "admin"] as const;
export type NebulaRole = (typeof nebulaRoles)[number];

export const nebulaRoleCopy: Record<
  NebulaRole,
  { label: string; blurb: string }
> = {
  viewer: {
    label: "Viewer",
    blurb: "Overview metrics only — no incident tools, no team settings.",
  },
  operator: {
    label: "Operator",
    blurb: "Traffic and incidents. Can acknowledge alerts. Cannot edit roles.",
  },
  admin: {
    label: "Admin",
    blurb: "Full surface — overview, traffic, and the team matrix.",
  },
};

export type NebulaKpi = {
  id: string;
  label: string;
  value: string;
  delta: string;
  tone: "up" | "down";
};

export const nebulaKpis: NebulaKpi[] = [
  { id: "sessions", label: "Sessions", value: "128.4k", delta: "+12%", tone: "up" },
  { id: "p95", label: "P95 load", value: "184 ms", delta: "−62%", tone: "down" },
  { id: "errors", label: "Error rate", value: "0.12%", delta: "−35%", tone: "down" },
  { id: "adoption", label: "Adoption", value: "41%", delta: "+9 pts", tone: "up" },
];

export const nebulaTrafficSeries = [42, 48, 45, 61, 58, 72, 69, 81, 77, 90, 88, 96];
export const nebulaErrorSeries = [18, 16, 21, 14, 12, 15, 11, 9, 10, 8, 7, 6];
export const nebulaAdoptionSeries = [22, 24, 28, 31, 30, 34, 36, 38, 37, 40, 39, 41];

export type NebulaRoute = {
  path: string;
  p95: string;
  share: string;
  status: "healthy" | "watch";
};

export const nebulaRoutes: NebulaRoute[] = [
  { path: "/api/stream/overview", p95: "92 ms", share: "34%", status: "healthy" },
  { path: "/api/reports/daily", p95: "148 ms", share: "22%", status: "healthy" },
  { path: "/api/ingest/events", p95: "410 ms", share: "18%", status: "watch" },
  { path: "/app/dashboard", p95: "184 ms", share: "16%", status: "healthy" },
  { path: "/api/auth/session", p95: "41 ms", share: "10%", status: "healthy" },
];

export type NebulaIncident = {
  id: string;
  title: string;
  region: string;
  severity: "low" | "medium";
  status: "open" | "acked";
};

export const nebulaIncidents: NebulaIncident[] = [
  {
    id: "INC-1842",
    title: "Ingest p95 above budget",
    region: "iad1",
    severity: "medium",
    status: "open",
  },
  {
    id: "INC-1839",
    title: "Chart cache stampede after deploy",
    region: "sfo1",
    severity: "low",
    status: "acked",
  },
  {
    id: "INC-1831",
    title: "Auth cookie miss on Safari 18",
    region: "lhr1",
    severity: "low",
    status: "acked",
  },
];

export type NebulaEvent = {
  id: string;
  source: string;
  message: string;
};

export const nebulaFeed: NebulaEvent[] = [
  { id: "e1", source: "edge", message: "Overview tile cache warmed in iad1" },
  { id: "e2", source: "ingest", message: "Batch 4,102 events committed" },
  { id: "e3", source: "auth", message: "Role token rotated for operators" },
  { id: "e4", source: "charts", message: "P95 series compacted to 12 buckets" },
  { id: "e5", source: "edge", message: "sfo1 replica caught up (+18 ms)" },
  { id: "e6", source: "ingest", message: "Backpressure released on /events" },
  { id: "e7", source: "alerts", message: "INC-1842 still above 400 ms" },
  { id: "e8", source: "charts", message: "Adoption sparkline redrawn" },
];

export type NebulaSeat = {
  name: string;
  email: string;
  role: NebulaRole;
};

export const nebulaSeats: NebulaSeat[] = [
  { name: "Priya N.", email: "priya@nebula.dev", role: "admin" },
  { name: "James O.", email: "james@nebula.dev", role: "operator" },
  { name: "Elena V.", email: "elena@nebula.dev", role: "operator" },
  { name: "Sofia A.", email: "sofia@nebula.dev", role: "viewer" },
];
