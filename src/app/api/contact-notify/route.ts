import { NextResponse } from "next/server";

/**
 * Optional server ping when a visitor uses the chat widget.
 * Set DISCORD_WEBHOOK_URL in `.env.local` to get instant messages on your phone/desktop.
 * (Discord Server → Channel → Integrations → Webhooks → New Webhook)
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const name = String(b.name ?? "").trim().slice(0, 200);
  const email = String(b.email ?? "").trim().slice(0, 200);
  const message = String(b.message ?? "").trim().slice(0, 8000);

  if (!name || !email || !message) {
    return NextResponse.json(
      { ok: false, error: "Missing name, email, or message" },
      { status: 400 },
    );
  }

  const webhook = process.env.DISCORD_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: [
            "**New inquiry — Marko AI (Mark Photography)**",
            `**${name}** <${email}>`,
            "",
            message,
          ].join("\n"),
        }),
      });
    } catch {
      return NextResponse.json(
        { ok: false, error: "Webhook failed" },
        { status: 502 },
      );
    }
  }

  return NextResponse.json({ ok: true, delivered: Boolean(webhook) });
}
