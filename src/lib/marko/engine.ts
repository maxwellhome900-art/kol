import { formatUsd, site } from "@/lib/data";
import type { BookingRecord } from "@/lib/booking/types";
import { replyToMarkoDev } from "@/lib/marko/engine-dev";

export type MarkoSurface = "photo" | "dev" | "dashboard";

export type MarkoAction = {
  id: string;
  label: string;
  href?: string;
  event?:
    | "open-booking"
    | "open-gallery"
    | "open-dev"
    | "open-dashboard"
    | "open-projects"
    | "open-services"
    | "open-cases"
    | "open-skills"
    | "open-contact"
    | "open-reviews";
  /** If set, clicking sends this as the visitor's next message instead of leaving the chat. */
  reply?: string;
};

export type MarkoReply = {
  text: string;
  actions?: MarkoAction[];
};

export type MarkoMemory = {
  topic: "idle" | "booking" | "hire" | "gallery" | "support";
  session: "unknown" | "portrait" | "extended" | "pictures";
  who: "unknown" | "solo" | "couple" | "group";
  nervous: boolean;
  engagement: "unknown" | "sprint" | "fullstack" | "system";
  product: "unknown" | "site" | "app" | "dashboard";
  timeline: "unknown" | "soon" | "quarter" | "exploring";
  overwhelmed: boolean;
};

export function emptyMarkoMemory(): MarkoMemory {
  return {
    topic: "idle",
    session: "unknown",
    who: "unknown",
    nervous: false,
    engagement: "unknown",
    product: "unknown",
    timeline: "unknown",
    overwhelmed: false,
  };
}

export function normalize(q: string): string {
  return q.toLowerCase().replace(/[’']/g, "'").trim();
}

export function has(q: string, ...needles: string[]): boolean {
  return needles.some((n) => q.includes(n));
}

export function word(q: string, ...needles: string[]): boolean {
  return needles.some((n) => new RegExp(`\\b${n}\\b`, "i").test(q));
}

export function replyChip(id: string, label: string, reply: string): MarkoAction {
  return { id, label, reply };
}

function bookingDesk(): MarkoAction {
  return {
    id: "book",
    label: "Open the booking desk",
    href: "/#booking",
    event: "open-booking",
  };
}

function sessionChoices(): MarkoAction[] {
  return [
    replyChip("p350", "Portrait · $350", "I'd like the $350 portrait session"),
    replyChip("p450", "Extended · $450", "I'd like the $450 extended session"),
    replyChip("pics", "Pictures from $10", "I only need pictures"),
    replyChip("unsure", "I'm not sure yet", "I'm not sure which package"),
  ];
}

function whoChoices(): MarkoAction[] {
  return [
    replyChip("solo", "Just me", "It's just for me"),
    replyChip("couple", "A couple", "It's for a couple"),
    replyChip("group", "A small group", "It's a small group"),
  ];
}

export function introFor(surface: MarkoSurface): string {
  if (surface === "dev") {
    return `Hi — I'm ${site.agentName}, Mark's engineering guide. I'll ask a few simple questions so we get this right. Are you here to hire Mark for a product, look at the work, or just get a sense of the stack?`;
  }
  if (surface === "dashboard") {
    return `Hi — I'm ${site.agentName}. I can walk through holds with you, explain a row, or get you back to the booking desk. What do you need?`;
  }
  return `Hi — I'm ${site.agentName}, Mark's studio guide. I'll ask a few simple questions so we get this right. Are you here for a Times Square session, a look at the work, or to hire Mark as an engineer?`;
}

export function introActions(surface: MarkoSurface): MarkoAction[] {
  if (surface === "dashboard") {
    return [
      replyChip("holds", "Summarize my holds", "Summarize my holds"),
      { id: "book", label: "New booking", href: "/#booking", event: "open-booking" },
      replyChip("help", "I'm a bit lost", "I'm a bit lost"),
    ];
  }
  if (surface === "dev") {
    return [
      replyChip("hire", "Hire Mark to build", "I want to hire Mark for a product build"),
      replyChip("look", "Show me the work", "Show me the projects"),
      replyChip("stack", "What's the stack?", "What stack do you ship?"),
      replyChip("unsure", "I'm not sure yet", "I'm not sure what I need"),
    ];
  }
  return [
    replyChip("book", "Book a session", "I want to book a session"),
    replyChip("look", "Show me the work", "Show me the gallery"),
    replyChip("hire", "Hire Mark to build", "I want to hire Mark as a software engineer"),
    replyChip("unsure", "I'm not sure yet", "I'm not sure what I need"),
  ];
}

export function quickPromptsFor(surface: MarkoSurface): string[] {
  if (surface === "dev") {
    return [
      "I want to hire Mark",
      "I'm not sure where to start",
      "What stack do you ship?",
    ];
  }
  if (surface === "dashboard") {
    return ["Summarize my holds", "Who still needs to pay?", "I'm a bit lost"];
  }
  return [
    "I want to book a session",
    "I'm nervous about photos",
    "I'm not sure what I need",
  ];
}

function applySignals(q: string, memory: MarkoMemory): MarkoMemory {
  const next: MarkoMemory = { ...memory };

  if (has(q, "nervous", "anxious", "shy", "awkward", "not photogenic", "hate photos", "first time", "camera shy", "insecure")) {
    next.nervous = true;
    next.topic = next.topic === "idle" ? "support" : next.topic;
  }

  if (has(q, "350", "portrait", "45 min", "45-minute")) {
    next.session = "portrait";
    next.topic = "booking";
  } else if (has(q, "450", "extended", "60 min", "longer", "more time")) {
    next.session = "extended";
    next.topic = "booking";
  } else if (has(q, "picture", "only pictures", "just photos", "from $10", "$10")) {
    next.session = "pictures";
    next.topic = "booking";
  }

  if (has(q, "couple", "partner", "boyfriend", "girlfriend", "husband", "wife", "anniversary", "us two")) {
    next.who = "couple";
  } else if (has(q, "family", "friends", "group", "together", "kids", "children")) {
    next.who = "group";
  } else if (has(q, "just me", "just for me", "solo", "myself", "only me", "on my own")) {
    next.who = "solo";
  }

  if (has(q, "book", "session", "shoot", "reserve", "schedule", "hold", "times square", "photograph me")) {
    next.topic = "booking";
  }
  if (has(q, "hire", "engineer", "website", "web dev", "app", "product", "sprint", "stack")) {
    if (!has(q, "photograph", "session", "shoot", "times square")) {
      next.topic = "hire";
    }
  }
  if (has(q, "gallery", "portfolio", "your photos", "your work", "street", "show me")) {
    if (!has(q, "book", "hire", "session")) next.topic = "gallery";
  }

  return next;
}

function sessionLabel(session: MarkoMemory["session"]): string {
  if (session === "portrait") {
    return `the ${formatUsd(350)} portrait session (45 minutes, 15+ edited images)`;
  }
  if (session === "extended") {
    return `the ${formatUsd(450)} extended session (60 minutes, 25+ images — Mark's most-booked)`;
  }
  if (session === "pictures") {
    return `picture-only work, from ${formatUsd(10)}`;
  }
  return "a Times Square evening";
}

function whoLabel(who: MarkoMemory["who"]): string {
  if (who === "couple") return "the two of you";
  if (who === "group") return "your group";
  if (who === "solo") return "you";
  return "you";
}

function supportLead(memory: MarkoMemory): string {
  if (!memory.nervous) return "";
  return "Plenty of people feel camera-shy at first — Mark directs gently and never rushes you. ";
}

function continueBooking(memory: MarkoMemory): { reply: MarkoReply; memory: MarkoMemory } {
  const lead = supportLead(memory);

  if (memory.session === "unknown") {
    return {
      memory,
      reply: {
        text: `${lead}I'd love to help you lock an evening in Times Square. Sessions run 7:00 PM – 1:00 AM (Sundays are closed). Which feels closest to what you want?`,
        actions: [...sessionChoices(), bookingDesk()],
      },
    };
  }

  if (memory.who === "unknown") {
    return {
      memory,
      reply: {
        text: `${lead}Great — ${sessionLabel(memory.session)}. Who is this evening for? That helps Mark plan the energy of the shoot.`,
        actions: [...whoChoices(), bookingDesk()],
      },
    };
  }

  return {
    memory,
    reply: {
      text: `${lead}You're set up for ${sessionLabel(memory.session)} with ${whoLabel(memory.who)}. Pick any open evening on the booking desk — I'll be here if you want a second opinion on time or notes to leave for Mark.`,
      actions: [
        bookingDesk(),
        replyChip("wear", "What should I wear?", "What should I wear?"),
        replyChip("nervous", "I'm still a bit nervous", "I'm nervous about photos"),
      ],
    },
  };
}

export function replyToMarko(
  question: string,
  surface: MarkoSurface,
  bookings: BookingRecord[],
  memory: MarkoMemory,
): { reply: MarkoReply; memory: MarkoMemory } {
  if (surface === "dev") {
    return replyToMarkoDev(question, memory);
  }

  const q = normalize(question);
  let next = applySignals(q, memory);

  if (word(q, "thanks", "thank", "thx", "appreciate")) {
    return {
      memory: next,
      reply: {
        text: "You're so welcome. I'm here whenever you want to keep going — no rush.",
        actions: [
          replyChip("book", "Let's book", "I want to book a session"),
          replyChip("else", "Something else", "I have another question"),
        ],
      },
    };
  }

  if (word(q, "bye", "goodbye", "later", "that's all", "thats all", "done")) {
    return {
      memory: next,
      reply: {
        text: "Take care. If you come back later, just say hi — I'll pick up with a simple question.",
        actions: [replyChip("hi", "Actually, one more thing", "I have another question")],
      },
    };
  }

  if (has(q, "not sure", "don't know", "dont know", "idk", "no idea", "lost", "confused", "what do i need", "where to start", "another question", "a bit lost")) {
    if (has(q, "which package", "which session") || next.topic === "booking") {
      next.topic = "booking";
      if (next.session === "unknown") {
        return {
          memory: next,
          reply: {
            text: `${supportLead(next)}No pressure — we can choose by feel. Portrait ($350) is a focused 45 minutes if you want it simple. Extended ($450) gives more looks if you like wandering the lights. Picture-only starts at $10 if you already know the frames. Which sounds kindest for you?`,
            actions: sessionChoices(),
          },
        };
      }
      return continueBooking(next);
    }

    if (next.topic === "hire") {
      return {
        memory: next,
        reply: {
          text: "That's okay — you don't need a spec yet. Most people start with a short product sprint, a full-stack build, or a design system. Which is the closest guess?",
          actions: [
            replyChip("sprint", "A short sprint", "I need a product sprint"),
            replyChip("full", "A full-stack build", "I need a full-stack build"),
            replyChip("ds", "A design system", "I need a design system"),
            { id: "contact", label: "I'd rather just write Mark", href: "/dev#contact" },
          ],
        },
      };
    }

    if (surface === "dashboard") {
      return {
        memory: next,
        reply: {
          text: "Happy to slow down. I can summarize the holds saved in this browser, walk you to a new booking, or just sit with a question. What would feel useful?",
          actions: [
            replyChip("holds", "Summarize my holds", "Summarize my holds"),
            { id: "book", label: "New booking", href: "/#booking", event: "open-booking" },
            replyChip("how", "How does booking work?", "How do I book an evening hold?"),
          ],
        },
      };
    }

    next.topic = "support";
    return {
      memory: next,
      reply: {
        text: "That's a good place to start — you don't have to decide everything at once. Most people come for one of three things. Which sounds closest, even if it's only a guess?",
        actions: [
          replyChip("book", "Photos in Times Square", "I want to book a session"),
          replyChip("hire", "A website or product", "I want to hire Mark"),
          replyChip("look", "I just want to look around", "Show me the gallery"),
        ],
      },
    };
  }

  if (word(q, "yes", "yeah", "yep", "yup", "ok", "okay", "please", "let's", "lets") || q === "y" || (word(q, "sure") && !has(q, "not sure"))) {
    if (next.topic === "booking") {
      return {
        memory: next,
        reply: {
          text: `${supportLead(next)}Wonderful. The booking desk is the next step — choose a night, a start time between 7 PM and 1 AM, and confirm. I'll stay with you if anything looks confusing.`,
          actions: [
            bookingDesk(),
            replyChip("help", "Walk me through it", "Walk me through booking"),
          ],
        },
      };
    }
    if (next.topic === "hire") {
      return {
        memory: next,
        reply: {
          text: "Glad that resonates. A short note about your stack, timeline, and users is enough — Mark replies with a concise plan. Want the contact form, or a look at the engineering page first?",
          actions: [
            { id: "contact", label: "Open hire form", href: "/dev#contact" },
            { id: "dev", label: "Software Engineer page", href: "/dev", event: "open-dev" },
          ],
        },
      };
    }
    return {
      memory: next,
      reply: {
        text: "Happy to. Were you saying yes to a Times Square session, or to hiring Mark for product work?",
        actions: [
          replyChip("book", "A photo session", "I want to book a session"),
          replyChip("hire", "Hiring Mark", "I want to hire Mark"),
        ],
      },
    };
  }

  if (word(q, "nope", "not yet", "maybe later") || q === "n" || (word(q, "no") && !has(q, "not sure"))) {
    return {
      memory: next,
      reply: {
        text: "Totally fine. We can slow down. Would you rather browse the gallery, read a few voices from people who met Mark, or just tell me what's on your mind?",
        actions: [
          replyChip("look", "Show me the gallery", "Show me the gallery"),
          replyChip("talk", "I just want to talk it through", "I'm not sure what I need"),
          bookingDesk(),
        ],
      },
    };
  }

  if (has(q, "nervous", "anxious", "shy", "awkward", "not photogenic", "hate having", "first time", "camera shy", "insecure", "still a bit nervous")) {
    next.nervous = true;
    next.topic = next.topic === "idle" ? "booking" : next.topic;
    return {
      memory: next,
      reply: {
        text: "Thank you for saying that. A lot of people feel the same before they meet Mark — especially under Times Square lights. He guides posing, keeps the pace kind, and you can stop anytime. Would a shorter portrait evening feel easier than a full extended shoot?",
        actions: [
          replyChip("short", "Yes — keep it shorter", "I'd like the $350 portrait session"),
          replyChip("long", "I think I want more time", "I'd like the $450 extended session"),
          replyChip("wear", "What should I wear?", "What should I wear?"),
        ],
      },
    };
  }

  if (has(q, "wear", "outfit", "wardrobe", "clothes", "dress", "what to bring")) {
    return {
      memory: next,
      reply: {
        text: "Wear whatever makes you feel like yourself — solid colors and a second layer photograph beautifully against neon. Avoid tiny busy logos if you can. Leave a note on the hold if you want Mark to watch for a specific look; he'll meet you with a plan, not a critique.",
        actions: [
          ...(!next.session || next.session === "unknown" ? sessionChoices() : [bookingDesk()]),
          replyChip("book", "Okay, let's book", "I want to book a session"),
        ],
      },
    };
  }

  if (has(q, "kid", "child", "children", "daughter", "son")) {
    next.who = "group";
    next.topic = "booking";
    return {
      memory: next,
      reply: {
        text: "Mark is especially careful with children — short, playful frames and a calmer pace. Evenings can run late (7 PM – 1 AM), so earlier slots are usually kinder. Want me to help you pick a package for the family?",
        actions: [...sessionChoices(), bookingDesk()],
      },
    };
  }

  if (
    has(q, "summarize", "holds", "upcoming", "unpaid", "need to pay") &&
    (surface === "dashboard" || has(q, "dashboard", "summarize", "unpaid"))
  ) {
    const unpaid = bookings.filter((b) => b.paymentStatus !== "paid");
    const paid = bookings.filter((b) => b.paymentStatus === "paid");
    const outstanding = unpaid.reduce((sum, b) => sum + (b.amountUsd ?? 0), 0);
    if (bookings.length === 0) {
      return {
        memory: next,
        reply: {
          text: "No holds in this browser yet — that's okay. Would you like me to walk you to the booking desk to place the first evening?",
          actions: [
            bookingDesk(),
            replyChip("how", "How does booking work?", "How do I book an evening hold?"),
          ],
        },
      };
    }
    return {
      memory: next,
      reply: {
        text: `You have ${bookings.length} hold${bookings.length === 1 ? "" : "s"} here. ${paid.length} marked paid, ${unpaid.length} still open (${formatUsd(outstanding)} outstanding). Want help with a specific night, or shall I leave you on the dashboard?`,
        actions: [
          { id: "dash", label: "Stay on the dashboard", href: "/dashboard", event: "open-dashboard" },
          bookingDesk(),
        ],
      },
    };
  }

  if (has(q, "350", "portrait session", "45 min") && !has(q, "book", "want", "like")) {
    next.session = "portrait";
    next.topic = "booking";
    return continueBooking(next);
  }

  if (has(q, "450", "extended") && !has(q, "book", "want", "like")) {
    next.session = "extended";
    next.topic = "booking";
    return continueBooking(next);
  }

  if (has(q, "picture-only", "picture only", "from $10", "just photos", "only pictures", "only need pictures")) {
    next.session = "pictures";
    next.topic = "booking";
    return continueBooking(next);
  }

  if (has(q, "which package", "not sure which", "difference", "compare", "packages", "how much", "price", "cost", "expensive")) {
    next.topic = "booking";
    return {
      memory: next,
      reply: {
        text: `Here's the honest split: portraits are ${formatUsd(350)} for a focused 45 minutes; extended is ${formatUsd(450)} if you want more looks and a larger edit; picture-only starts at ${formatUsd(10)} if you already know the frames. Which of those matches how you want the evening to feel?`,
        actions: sessionChoices(),
      },
    };
  }

  if (has(q, "walk me through booking", "how do i book", "how does booking", "evening hold", "availability", "calendar", "slot")) {
    next.topic = "booking";
    return {
      memory: next,
      reply: {
        text: "It's three calm steps: pick a night (not Sunday), choose 60 or 90 minutes on the desk, then a start time between 7:00 PM and 1:00 AM. Confirm — overlaps are blocked automatically. I can help you choose a package first if that's the missing piece.",
        actions: [...sessionChoices(), bookingDesk()],
      },
    };
  }

  if (has(q, "book", "want a session", "photograph", "shoot", "times square session", "reserve", "schedule")) {
    next.topic = "booking";
    return continueBooking(next);
  }

  if (next.topic === "booking" && (next.session !== "unknown" || next.who !== "unknown" || has(q, "just for me", "couple", "group", "portrait", "extended"))) {
    return continueBooking(next);
  }

  if (has(q, "gallery", "photos", "portfolio", "your work", "street", "show me the")) {
    next.topic = "gallery";
    return {
      memory: next,
      reply: {
        text: "The home page shows a short Times Square edit. The full gallery is every unique portrait and street frame — you can filter and open any image full screen. Want those, or would you rather talk about booking a night of your own?",
        actions: [
          { id: "gallery", label: "Open the preview", href: "/#gallery", event: "open-gallery" },
          { id: "gallery-all", label: "See all photos", href: "/gallery" },
          replyChip("book", "I want my own session", "I want to book a session"),
        ],
      },
    };
  }

  if (has(q, "review", "testimonial", "what people say", "what clients")) {
    const engineering = has(q, "engineering", "collaborator", "hire");
    return {
      memory: next,
      reply: {
        text: engineering
          ? "Engineering reviews sit just above contact on the software engineer page — frontend, backend, and full-stack web work. Would you like those, or the photography voices from people who met Mark in Times Square?"
          : "Photography reviews sit just above contact on the home page — travelers who met Mark around Times Square. Want those, or the engineering collaborators?",
        actions: [
          { id: "photo-reviews", label: "Photography reviews", href: "/#reviews" },
          { id: "dev-reviews", label: "Engineering reviews", href: "/dev#reviews" },
        ],
      },
    };
  }

  if (has(q, "hire", "web", "engineer", "next.js", "stack", "software", "engagement", "sprint", "product build", "website")) {
    next.topic = "hire";
    return {
      memory: next,
      reply: {
        text: "Mark ships TypeScript-first product work with the same care he brings to a frame: Next.js, design systems, booking flows. Engagements usually start as a product sprint, a full-stack build, or a design system. What's closest to what you need?",
        actions: [
          replyChip("sprint", "A short sprint", "I need a product sprint"),
          replyChip("full", "A full-stack build", "I need a full-stack build"),
          replyChip("ds", "A design system", "I need a design system"),
          { id: "dev", label: "Open the engineering page", href: "/dev", event: "open-dev" },
        ],
      },
    };
  }

  if (has(q, "sprint", "full-stack", "design system")) {
    next.topic = "hire";
    return {
      memory: next,
      reply: {
        text: "That's enough for a strong first note. Tell Mark your timeline and constraints on the hire form — or keep asking me if you want help wording it. What would you like to do next?",
        actions: [
          { id: "contact", label: "Open the hire form", href: "/dev#contact" },
          { id: "dev", label: "Read the engineering page", href: "/dev", event: "open-dev" },
          replyChip("help-write", "Help me word the note", "Help me write a hire note"),
        ],
      },
    };
  }

  if (has(q, "help me write", "word the note", "hire note")) {
    next.topic = "hire";
    return {
      memory: next,
      reply: {
        text: `A useful note is three sentences: what the product is, when you need it, and what “done” looks like. Paste a draft here if you want me to tighten it, or email Mark directly at ${site.email}.`,
        actions: [
          { id: "contact", label: "Open the hire form", href: "/dev#contact" },
          replyChip("photo", "Switch to a photo session", "I want to book a session"),
        ],
      },
    };
  }

  if (has(q, "dashboard", "notes")) {
    return {
      memory: next,
      reply: {
        text: "The studio dashboard is the quiet operations twin of the booking desk — calendar, notes, paid versus open holds. Need a rundown of what's saved in this browser, or just the link?",
        actions: [
          replyChip("sum", "Rundown please", "Summarize my holds"),
          { id: "dash", label: "Open dashboard", href: "/dashboard", event: "open-dashboard" },
        ],
      },
    };
  }

  if (has(q, "contact", "email", "message", "discord", "talk to mark")) {
    return {
      memory: next,
      reply: {
        text: `You can write Mark here, use the contact form, email ${site.email}, or call ${site.phoneDisplay}. What kind of note is it — a shoot question, or a product hire?`,
        actions: [
          { id: "contact", label: "Photography contact", href: "/#contact" },
          { id: "devhire", label: "Engineering hire form", href: "/dev#contact" },
        ],
      },
    };
  }

  if (word(q, "hello", "hi", "hey", "yo") || has(q, "who are you", "what can you", "help")) {
    return {
      memory: next,
      reply: {
        text: introFor(surface),
        actions: introActions(surface),
      },
    };
  }

  if (next.topic === "booking") {
    return continueBooking(next);
  }

  return {
    memory: next,
    reply: {
      text: `I want to get this right rather than guess. Are you hoping to book a Times Square evening, hire Mark to build something, or just look around? You can also tell me in your own words — I'll ask a follow-up.`,
      actions: [
        replyChip("book", "Book a session", "I want to book a session"),
        replyChip("hire", "Hire Mark", "I want to hire Mark"),
        replyChip("look", "Just looking", "Show me the gallery"),
        replyChip("talk", "Something else", "I'm not sure what I need"),
      ],
    },
  };
}
