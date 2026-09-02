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
 * Optional Twilio SMS: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM, TWILIO_TO
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

  const inbox = process.env.BOOKING_INBOX_EMAIL?.trim() || site.email;
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
  const webhook = process.env.DISCORD_WEBHOOK_URL?.trim();
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

  let smsOk = false;
  const twilioSid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const twilioAuth = process.env.TWILIO_AUTH_TOKEN?.trim();
  const twilioFrom = process.env.TWILIO_FROM?.trim();
  const twilioTo = process.env.TWILIO_TO?.trim();
  if (twilioSid && twilioAuth && twilioFrom && twilioTo) {
    try {
      const body = new URLSearchParams({
        To: twilioTo,
        From: twilioFrom,
        Body: `New hold: ${name} ${email} | ${sessionType} | ${date} ${time} | ${durationMinutes} min | ${notes || "No notes"}`,
      });
      const res = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(`${twilioSid}:${twilioAuth}`).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: body.toString(),
        },
      );
      smsOk = res.ok;
      if (!smsOk) {
        const errText = await res.text().catch(() => "");
        console.error("Twilio booking SMS failed", res.status, errText);
      }
    } catch (e) {
      console.error("Twilio booking SMS error", e);
    }
  }

  let emailed = false;
  const resendKey = process.env.RESEND_API_KEY?.trim();
  const resendFrom = process.env.RESEND_FROM?.trim();
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

  if (!webhook && !emailed && !smsOk) {
    return NextResponse.json({
      ok: true,
      delivered: false,
      warning:
        "No DISCORD_WEBHOOK_URL, Resend, or Twilio configuration found — configure one to receive hold alerts.",
    });
  }

  return NextResponse.json({
    ok: true,
    delivered: discordOk || smsOk || emailed,
    discord: discordOk,
    sms: smsOk,
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
