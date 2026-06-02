import { NextResponse } from "next/server";
import { site } from "@/lib/data";

type Body = {
  id?: string;
  name?: string;
  email?: string;
  sessionType?: string;
  date?: string;
  time?: string;
  durationMinutes?: number;
  notes?: string;
};

/**
 * Fires when a visitor confirms an intelligent hold.
 * Set DISCORD_WEBHOOK_URL for instant pings, and optionally Resend for email.
 *
 * Resend: https://resend.com/docs/api-reference/emails/send-email
 * Env: RESEND_API_KEY, RESEND_FROM (verified sender), optional BOOKING_INBOX_EMAIL (defaults to site.email)
 */
export async function POST(request: Request) {
  let raw: Body;
  try {
    raw = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const name = String(raw.name ?? "").trim().slice(0, 200);
  const email = String(raw.email ?? "").trim().slice(0, 200);
  const sessionType = String(raw.sessionType ?? "").trim().slice(0, 200);
  const date = String(raw.date ?? "").trim().slice(0, 32);
  const time = String(raw.time ?? "").trim().slice(0, 8);
  const durationMinutes = Number(raw.durationMinutes);
  const notes = String(raw.notes ?? "").trim().slice(0, 8000);
  const id = String(raw.id ?? "").trim().slice(0, 80);

  if (!name || !email || !date || !time || !Number.isFinite(durationMinutes)) {
    return NextResponse.json(
      { ok: false, error: "Missing required booking fields" },
      { status: 400 },
    );
  }

  const inbox =
    process.env.BOOKING_INBOX_EMAIL?.trim() || site.email;
  const lines = [
    "**New intelligent hold — Mark Photography**",
    id ? `Hold id: \`${id}\`` : null,
    `**${name}** <${email}>`,
    `Session: ${sessionType || "—"}`,
    `When: **${date}** at **${time}** (${durationMinutes} min)`,
    "",
    notes ? `Notes:\n${notes}` : "_No notes_",
  ]
    .filter(Boolean)
    .join("\n");

  let discordOk = false;
  const webhook = process.env.DISCORD_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: lines }),
      });
      discordOk = res.ok;
    } catch {
      return NextResponse.json(
        { ok: false, error: "Discord webhook failed" },
        { status: 502 },
      );
    }
  }

  let emailed = false;
  const resendKey = process.env.RESEND_API_KEY;
  const resendFrom = process.env.RESEND_FROM;
  if (resendKey && resendFrom) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: resendFrom,
          to: [inbox],
          reply_to: email,
          subject: `[Hold] ${date} ${time} — ${name}`,
          text: lines.replace(/\*\*/g, ""),
          html: `<pre style="font-family:system-ui,sans-serif;white-space:pre-wrap">${escapeHtml(
            lines.replace(/\*\*/g, ""),
          )}</pre>`,
        }),
      });
      emailed = res.ok;
      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        console.error("Resend booking email failed", res.status, errText);
      }
    } catch (e) {
      console.error("Resend booking email error", e);
    }
  }

  if (!webhook && !emailed) {
    return NextResponse.json({
      ok: true,
      delivered: false,
      warning:
        "No DISCORD_WEBHOOK_URL or Resend env — configure one to receive hold alerts.",
    });
  }

  return NextResponse.json({
    ok: true,
    delivered: discordOk || emailed,
    discord: discordOk,
    email: emailed,
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
