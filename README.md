# Mark Photography — Portfolio

Personal portfolio blending **software engineering** and **photography**: a **photography-first** home (`/`), a dedicated **web development** route (`/dev`), a **smart booking** flow with **studio dashboard** (`/dashboard`), pricing, gallery, and a floating **Mark Photography** chat with optional Discord notifications.

**Full architecture, booking behavior, and workflow plans:** [docs/APP.md](./docs/APP.md).

## Tech stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** (sections, gallery, booking, page transitions)
- **next-themes** (dark / light)
- **Radix UI** + CVA + `tailwind-merge` (ShadCN-style components in `src/components/ui/`)
- Optional **Discord webhook** for chat notifications (`/api/contact-notify`) and hold summaries (`/api/booking-notify`); optional **Resend** for hold email (see `.env.example`)

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build    # production build
npm run start    # serve production build
npm run lint     # ESLint
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in what you need:

| Variable               | Required | Purpose |
|------------------------|----------|---------|
| `DISCORD_WEBHOOK_URL` | No       | If set, Marko chat (`/api/contact-notify`) and intelligent-hold summaries (`/api/booking-notify`) POST to Discord. Without it, chat can still fall back to **mailto:**. |
| `RESEND_API_KEY`      | No       | If set with `RESEND_FROM`, **Confirm intelligent hold** emails the studio inbox (see `booking-notify`). |
| `RESEND_FROM`         | No       | Verified sender address in Resend (must match your domain). |
| `BOOKING_INBOX_EMAIL` | No       | Override recipient for hold emails; defaults to `site.email` in `src/lib/data.ts`. |

## Where to customize content

Single source of truth: **`src/lib/data.ts`**

- `site` — `name`, `businessName`, `email`, `social`, `schedulingUrl`, plus **`photographyHeadline`**, **`photographySubheadline`**, **`photographyHeroSessionTail`**, **`photographyHeroMarkoTail`**, **`devHeadline`**, **`devSubheadline`**
- `gallery` — Times Square–oriented images; categories **`Portraits`** | **`Street`**
- `projects` — engineering cards (stack, GitHub, demo links)
- `caseStudies` — anonymized outcomes on `/dev`
- `pricingTiers` — price menu copy and amounts
- `skills` — skill bar data
- `sessionTypes` — options in the booking assistant

Brand icons for social links live in **`src/components/icons/BrandIcons.tsx`** (minimal SVG marks).

SEO base URL: set **`metadataBase`** in **`src/app/layout.tsx`** to your production domain.

## Routes

| Route | Component shell | Notes |
|-------|-----------------|--------|
| `/` | `PhotographyPortfolio` | Hero (photo), about, gallery, **booking**, pricing, timeline, contact + **chat** |
| `/dev` | `DevPortfolio` | Hero (dev), projects, case studies, skills, contact |
| `/dashboard` | `DashboardClient` | Sessions for this browser; requires same `BookingProvider` as root layout |

## Feature map

| Feature | Location |
|---------|----------|
| Page transition (pathname key) | `src/app/template.tsx` |
| Global providers | `src/app/layout.tsx` (`ThemeProvider`, `BookingProvider`) |
| Photo / dev heroes | `src/components/sections/Hero.tsx` (`mode`) |
| Photography about | `src/components/sections/AboutPhotography.tsx` |
| Legacy dual about (unused on `/`) | `src/components/sections/About.tsx` |
| Project cards | `src/components/sections/Projects.tsx` |
| Case studies | `src/components/sections/CaseStudies.tsx` |
| Masonry gallery + lightbox | `src/components/sections/Gallery.tsx` |
| Smart booking + calendar | `src/components/booking/BookingSection.tsx` |
| Booking state + persistence | `src/context/booking-context.tsx`, `src/lib/booking/*` |
| Dashboard | `src/components/dashboard/DashboardClient.tsx` |
| Price menu | `src/components/sections/Pricing.tsx` |
| Day / night timeline | `src/components/sections/Timeline.tsx` |
| Skills + animated stats | `src/components/sections/Skills.tsx` |
| Contact (photo vs dev) | `src/components/sections/Contact.tsx` (`variant`) |
| Nav (route-aware) | `src/components/layout/Navbar.tsx` |
| Footer | `src/components/layout/SiteFooter.tsx` |
| Scroll progress | `src/components/layout/ScrollProgress.tsx` |
| Floating agent (every page) | `src/components/chat/MarkoAIChat.tsx`, `GlobalMarkoAgent.tsx` |
| Server notify routes | `src/app/api/contact-notify/route.ts`, **`src/app/api/booking-notify/route.ts`** |
| UI primitives | `src/components/ui/*` |

## Images

Remote images use **Unsplash**. Allowed host is configured in **`next.config.ts`** (`images.remotePatterns`). Add hosts there if you self-host assets or use another CDN.

## Turbopack root

If you see multiple-lockfile warnings elsewhere, **`next.config.ts`** sets `turbopack.root` to this project folder so the correct app is built.

## Deployment

1. Push the repo and connect it to **[Vercel](https://vercel.com)** (or any Node host).
2. Set **`DISCORD_WEBHOOK_URL`** and/or **Resend** (`RESEND_API_KEY`, `RESEND_FROM`, optional `BOOKING_INBOX_EMAIL`) in the host’s environment variables for pings and hold email.
3. Update **`metadataBase`** and **`site` fields** for production URLs and contacts.
4. If you move **bookings** off `localStorage`, add API + DB env vars and redeploy (see [docs/APP.md](./docs/APP.md) §6.4).

## License

Private / personal use — adjust as you prefer.
