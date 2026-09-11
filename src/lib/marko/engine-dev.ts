import { caseStudies, engineeringServices, projects, site } from "@/lib/data";
import {
  has,
  introActions,
  introFor,
  normalize,
  replyChip,
  word,
  type MarkoAction,
  type MarkoMemory,
  type MarkoReply,
} from "@/lib/marko/engine";

function hireForm(): MarkoAction {
  return {
    id: "contact",
    label: "Open the hire form",
    href: "/dev#contact",
    event: "open-contact",
  };
}

function engagementChoices(): MarkoAction[] {
  return [
    replyChip("sprint", "Product sprint", "I need a product sprint"),
    replyChip("full", "Full-stack build", "I need a full-stack build"),
    replyChip("ds", "Design system", "I need a design system"),
    replyChip("unsure", "I'm not sure yet", "I'm not sure which engagement"),
  ];
}

function productChoices(): MarkoAction[] {
  return [
    replyChip("site", "A marketing site", "I need a marketing site"),
    replyChip("app", "A product app", "I need a product app"),
    replyChip("dash", "A dashboard", "I need a dashboard"),
  ];
}

function timelineChoices(): MarkoAction[] {
  return [
    replyChip("soon", "In a few weeks", "I need something in a few weeks"),
    replyChip("quarter", "This quarter", "I need it this quarter"),
    replyChip("explore", "Still exploring", "I'm still exploring"),
  ];
}

function lookActions(): MarkoAction[] {
  return [
    {
      id: "projects",
      label: "Open projects",
      href: "/dev#projects",
      event: "open-projects",
    },
    {
      id: "cases",
      label: "Open case studies",
      href: "/dev#case-studies",
      event: "open-cases",
    },
    {
      id: "services",
      label: "Open engagements",
      href: "/dev#services",
      event: "open-services",
    },
  ];
}

function sprintService() {
  return engineeringServices.find((s) => s.name.toLowerCase().includes("sprint"));
}

function fullService() {
  return engineeringServices.find((s) => s.name.toLowerCase().includes("full-stack"));
}

function systemService() {
  return engineeringServices.find((s) => s.name.toLowerCase().includes("design"));
}

function priceBare(service: { price: string; unit?: string } | undefined, fallback: string): string {
  return service?.price?.replace(/^From\s+/i, "") ?? fallback;
}

function engagementLabel(engagement: MarkoMemory["engagement"]): string {
  const sprint = sprintService();
  const full = fullService();
  const system = systemService();
  if (engagement === "sprint") {
    return `a product sprint (from ${priceBare(sprint, "$2,500")}${sprint?.unit ?? "/ sprint"})`;
  }
  if (engagement === "fullstack") {
    return `a full-stack build (from ${priceBare(full, "$8,000")}${full?.unit ?? "/ engagement"})`;
  }
  if (engagement === "system") {
    return `a design system (from ${priceBare(system, "$4,500")}${system?.unit ?? "/ system"})`;
  }
  return "an engineering engagement";
}

function productLabel(product: MarkoMemory["product"]): string {
  if (product === "site") return "a marketing or studio site";
  if (product === "app") return "a product app";
  if (product === "dashboard") return "a dashboard or ops surface";
  return "the product";
}

function timelineLabel(timeline: MarkoMemory["timeline"]): string {
  if (timeline === "soon") return "in the next few weeks";
  if (timeline === "quarter") return "this quarter";
  if (timeline === "exploring") return "while you're still exploring";
  return "";
}

function supportLead(memory: MarkoMemory): string {
  if (!memory.overwhelmed) return "";
  return "You don't need a polished spec — a few honest sentences are enough. ";
}

function applyHireSignals(q: string, memory: MarkoMemory): MarkoMemory {
  const next: MarkoMemory = { ...memory };

  if (has(q, "overwhelm", "no spec", "don't have a spec", "dont have a spec", "never hired", "first time hiring", "don't know where", "dont know where")) {
    next.overwhelmed = true;
    next.topic = next.topic === "idle" ? "support" : next.topic;
  }

  if (has(q, "product sprint", "short sprint", "a sprint") || (word(q, "sprint") && !has(q, "full"))) {
    next.engagement = "sprint";
    next.topic = "hire";
  } else if (has(q, "full-stack", "fullstack", "full stack", "end-to-end", "end to end")) {
    next.engagement = "fullstack";
    next.topic = "hire";
  } else if (has(q, "design system", "component library", "tokens")) {
    next.engagement = "system";
    next.topic = "hire";
  }

  if (has(q, "marketing site", "studio site", "brochure", "landing")) {
    next.product = "site";
  } else if (has(q, "dashboard", "ops surface", "analytics", "admin")) {
    next.product = "dashboard";
  } else if (has(q, "product app", "web app", "saas", "application")) {
    next.product = "app";
  }

  if (has(q, "few weeks", "asap", "urgent", "right away", "soon")) {
    next.timeline = "soon";
  } else if (has(q, "this quarter", "couple months", "this year")) {
    next.timeline = "quarter";
  } else if (has(q, "exploring", "just looking", "no rush", "later")) {
    next.timeline = "exploring";
  }

  if (has(q, "hire", "build", "engagement", "retainer", "scope", "engineer")) {
    if (!has(q, "photograph", "times square", "photo session", "shoot")) {
      next.topic = "hire";
    }
  }

  return next;
}

function continueHire(memory: MarkoMemory): { reply: MarkoReply; memory: MarkoMemory } {
  const lead = supportLead(memory);
  const sprint = sprintService();
  const full = fullService();
  const system = systemService();

  if (memory.engagement === "unknown") {
    return {
      memory,
      reply: {
        text: `${lead}I'd love to help you scope work with Mark. A product sprint starts at ${sprint?.price?.replace(/^From\s+/i, "") ?? "$2,500"} for a focused week; a full-stack build starts at ${full?.price?.replace(/^From\s+/i, "") ?? "$8,000"} if you want a shippable product; a design system starts at ${system?.price?.replace(/^From\s+/i, "") ?? "$4,500"} so squads can compose without drifting. Which feels closest?`,
        actions: [...engagementChoices(), hireForm()],
      },
    };
  }

  if (memory.product === "unknown") {
    return {
      memory,
      reply: {
        text: `${lead}Great — ${engagementLabel(memory.engagement)}. What are you hoping to build? That helps Mark plan the first slice.`,
        actions: [...productChoices(), hireForm()],
      },
    };
  }

  const when = timelineLabel(memory.timeline);
  const timing = when ? ` ${when}` : "";
  return {
    memory,
    reply: {
      text: `${lead}You're set up for ${engagementLabel(memory.engagement)} aimed at ${productLabel(memory.product)}${timing}. A short note on the hire form is enough — stack, users, and what “done” looks like. I'll stay if you want help wording it or a second look at the work.`,
      actions: [
        hireForm(),
        replyChip("write", "Help me word the note", "Help me write a hire note"),
        replyChip("when", "When can we start?", "What's the timeline like?"),
        ...(!memory.overwhelmed
          ? [replyChip("overwhelm", "This still feels like a lot", "I'm a bit overwhelmed")]
          : []),
      ],
    },
  };
}

export function replyToMarkoDev(
  question: string,
  memory: MarkoMemory,
): { reply: MarkoReply; memory: MarkoMemory } {
  const q = normalize(question);
  let next = applyHireSignals(q, memory);

  if (word(q, "thanks", "thank", "thx", "appreciate")) {
    return {
      memory: next,
      reply: {
        text: "You're so welcome. I'm here whenever you want to keep going — no rush.",
        actions: [
          replyChip("hire", "Let's scope a hire", "I want to hire Mark for a product build"),
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

  if (
    has(
      q,
      "not sure",
      "don't know",
      "dont know",
      "idk",
      "no idea",
      "lost",
      "confused",
      "what do i need",
      "where to start",
      "another question",
      "a bit lost",
    )
  ) {
    if (has(q, "which engagement", "which package") || next.topic === "hire") {
      next.topic = "hire";
      if (next.engagement === "unknown") {
        return {
          memory: next,
          reply: {
            text: `${supportLead(next)}No pressure — we can choose by feel. A sprint is the kindest first step if you want a slice. A full-stack build is for a shippable product. A design system is for teams that keep reinventing buttons. Which sounds closest, even if it's only a guess?`,
            actions: engagementChoices(),
          },
        };
      }
      return continueHire(next);
    }

    next.topic = "support";
    return {
      memory: next,
      reply: {
        text: "That's a good place to start — you don't have to decide everything at once. Most people on this page come for one of three things. Which sounds closest, even if it's only a guess?",
        actions: [
          replyChip("hire", "Hire Mark to build", "I want to hire Mark for a product build"),
          replyChip("look", "I just want to look around", "Show me the projects"),
          replyChip("stack", "Just the stack", "What stack do you ship?"),
        ],
      },
    };
  }

  if (
    word(q, "yes", "yeah", "yep", "yup", "ok", "okay", "please", "let's", "lets") ||
    q === "y" ||
    (word(q, "sure") && !has(q, "not sure"))
  ) {
    if (next.topic === "hire") {
      return {
        memory: next,
        reply: {
          text: `${supportLead(next)}Wonderful. The hire form is the next step — a few sentences about the product, timeline, and users. I'll stay with you if anything looks confusing.`,
          actions: [
            hireForm(),
            replyChip("help", "Walk me through it", "Help me write a hire note"),
          ],
        },
      };
    }
    return {
      memory: next,
      reply: {
        text: "Happy to. Were you saying yes to hiring Mark for product work, or did you want a look at the projects first?",
        actions: [
          replyChip("hire", "Hiring Mark", "I want to hire Mark for a product build"),
          replyChip("look", "Show me projects", "Show me the projects"),
        ],
      },
    };
  }

  if (word(q, "nope", "not yet", "maybe later") || q === "n" || (word(q, "no") && !has(q, "not sure"))) {
    return {
      memory: next,
      reply: {
        text: "Totally fine. We can slow down. Would you rather browse projects, read a case study, or just tell me what's on your mind?",
        actions: [
          replyChip("look", "Show me projects", "Show me the projects"),
          replyChip("talk", "I just want to talk it through", "I'm not sure what I need"),
          hireForm(),
        ],
      },
    };
  }

  if (
    has(
      q,
      "overwhelm",
      "too much",
      "never hired",
      "first time hiring",
      "no spec",
      "don't have a spec",
      "dont have a spec",
      "intimidat",
    )
  ) {
    next.overwhelmed = true;
    next.topic = next.topic === "idle" ? "hire" : next.topic;
    return {
      memory: next,
      reply: {
        text: "Thank you for saying that. A lot of people feel the same before they write Mark — especially if they don't have a spec yet. You can start with three sentences. Would a short product sprint feel easier than a full-stack build?",
        actions: [
          replyChip("short", "Yes — keep it a sprint", "I need a product sprint"),
          replyChip("long", "I think I need a full build", "I need a full-stack build"),
          replyChip("write", "Help me word the note", "Help me write a hire note"),
        ],
      },
    };
  }

  if (has(q, "help me write", "word the note", "hire note", "walk me through")) {
    next.topic = "hire";
    return {
      memory: next,
      reply: {
        text: `A useful note is three sentences: what the product is, when you need a first slice, and what “done” looks like.${next.engagement !== "unknown" ? ` You're already leaning toward ${engagementLabel(next.engagement)}.` : ""} Paste a draft here if you want me to tighten it, or email Mark directly at ${site.email}.`,
        actions: [
          hireForm(),
          replyChip("hire", "Keep scoping", "I want to hire Mark for a product build"),
        ],
      },
    };
  }

  if (has(q, "stack", "next.js", "nextjs", "typescript", "tailwind", "react", "node", "what do you ship", "tech")) {
    return {
      memory: next,
      reply: {
        text: "Mark ships TypeScript-first: Next.js (App Router), React, Tailwind, and Node — the same stack as this studio site. Design systems, booking flows, and dashboards are the usual surfaces. Want a look at projects, or shall we scope a hire?",
        actions: [
          replyChip("look", "Show me projects", "Show me the projects"),
          replyChip("hire", "Let's hire Mark", "I want to hire Mark for a product build"),
          {
            id: "skills",
            label: "Open skills",
            href: "/dev#skills",
            event: "open-skills",
          },
        ],
      },
    };
  }

  if (
    has(
      q,
      "project",
      "portfolio",
      "your work",
      "show me",
      "nebula",
      "atlas",
      "aether",
      "harbor",
      "shop",
      "ecommerce",
      "e-commerce",
      "real estate",
      "listing",
    )
  ) {
    next.topic = next.topic === "idle" ? "gallery" : next.topic;
    const titles = projects.map((p) => p.title).join(", ");
    return {
      memory: next,
      reply: {
        text: `${projects.length} surfaces live on this page: ${titles}. This photography studio site is live, plus working frontends for Aether Market, Harbor Estates, Nebula Dashboard, and Atlas Design System. Want me to take you there, or would you rather talk about hiring Mark for something of your own?`,
        actions: [
          { id: "shop", label: "Open Aether shop", href: "/work/aether" },
          {
            id: "harbor",
            label: "Open Harbor listings",
            href: "/work/harbor",
          },
          { id: "nebula", label: "Open Nebula", href: "/work/nebula" },
          { id: "atlas", label: "Open Atlas", href: "/work/atlas" },
          ...lookActions(),
          replyChip("hire", "I want my own build", "I want to hire Mark for a product build"),
        ],
      },
    };
  }

  if (has(q, "case study", "case studies", "outcome", "metric", "checkout", "booking", "api")) {
    const names = caseStudies.map((c) => `${c.title} (${c.client})`).join("; ");
    return {
      memory: next,
      reply: {
        text: `Three write-ups sit further down: ${names}. They're frontend, full-stack, and backend web work — interfaces, APIs, and the product in between. Open those, or keep scoping a hire?`,
        actions: [
          {
            id: "cases",
            label: "Open case studies",
            href: "/dev#case-studies",
            event: "open-cases",
          },
          replyChip("hire", "Let's scope a hire", "I want to hire Mark for a product build"),
        ],
      },
    };
  }

  if (has(q, "review", "testimonial", "what people say", "collaborator")) {
    return {
      memory: next,
      reply: {
        text: "Reviews sit just above contact on this page — frontend, backend, and full-stack software engineering. Want those, or the photography voices from people who met Mark in Times Square?",
        actions: [
          {
            id: "dev-reviews",
            label: "Engineering reviews",
            href: "/dev#reviews",
            event: "open-reviews",
          },
          { id: "photo-reviews", label: "Photography reviews", href: "/#reviews" },
        ],
      },
    };
  }

  if (
    has(
      q,
      "how much",
      "price",
      "cost",
      "expensive",
      "rate",
      "2500",
      "8000",
      "4500",
      "engagements",
      "packages",
      "which engagement",
    )
  ) {
    next.topic = "hire";
    const sprint = sprintService();
    const full = fullService();
    const system = systemService();
    return {
      memory: next,
      reply: {
        text: `Here's the honest split: product sprints start at ${priceBare(sprint, "$2,500")} for a focused week; full-stack builds start at ${priceBare(full, "$8,000")} if you want a shippable product; design systems start at ${priceBare(system, "$4,500")} so squads stop drifting. Which of those matches how you want to start?`,
        actions: [...engagementChoices(), { id: "services", label: "Open engagements", href: "/dev#services", event: "open-services" }],
      },
    };
  }

  if (has(q, "timeline like", "when can", "availability", "how soon", "start date")) {
    next.topic = "hire";
    return {
      memory: next,
      reply: {
        text: "Mark scopes engineering in contact — a short note with timeline is enough, and he replies with a concise plan. When do you need a first slice?",
        actions: [...timelineChoices(), hireForm()],
      },
    };
  }

  if (has(q, "few weeks", "this quarter", "still exploring") && next.topic === "hire") {
    return continueHire(next);
  }

  if (has(q, "skill", "what are you good")) {
    return {
      memory: next,
      reply: {
        text: "On this page: React, Next.js, Tailwind, Node, and UI/UX — plus Lightroom and Photoshop from the photography side. Same eye, two crafts. Want the skills strip, or shall we talk about a hire?",
        actions: [
          { id: "skills", label: "Open skills", href: "/dev#skills", event: "open-skills" },
          replyChip("hire", "Let's hire Mark", "I want to hire Mark for a product build"),
        ],
      },
    };
  }

  if (has(q, "about mark", "who is mark", "how do you work", "process")) {
    return {
      memory: next,
      reply: {
        text: "Mark treats product work the way he treats a frame: hierarchy first, then motion, nothing accidental. Daytime is TypeScript and product judgment; this page is the engineering twin of the studio. Want the about section, or to start scoping?",
        actions: [
          { id: "about", label: "Open about", href: "/dev#about" },
          replyChip("hire", "Start scoping", "I want to hire Mark for a product build"),
        ],
      },
    };
  }

  if (has(q, "contact", "email", "message", "discord", "talk to mark", "write mark")) {
    return {
      memory: next,
      reply: {
        text: `You can write Mark on the hire form on this page, email ${site.email}, or call ${site.phoneDisplay}. What kind of note is it — a product hire, or a Times Square session?`,
        actions: [
          hireForm(),
          replyChip("photo", "It's a photo session", "I want to book a Times Square session"),
        ],
      },
    };
  }

  if (has(q, "times square", "photo session", "photograph", "book a session", "booking desk", "shoot")) {
    return {
      memory: next,
      reply: {
        text: "Photography lives on the studio home page — evening holds from 7 PM to 1 AM, packages, and the same Marko asking one question at a time. Want me to send you there, or stay on engineering?",
        actions: [
          { id: "photo", label: "Open photography", href: "/#booking", event: "open-booking" },
          replyChip("stay", "Stay on engineering", "I want to hire Mark for a product build"),
        ],
      },
    };
  }

  if (has(q, "marketing site", "product app", "dashboard") || (next.topic === "hire" && has(q, "site", "app"))) {
    return continueHire(next);
  }

  if (
    has(
      q,
      "hire",
      "want to hire",
      "product build",
      "build something",
      "need a website",
      "need an app",
      "engagement",
    )
  ) {
    next.topic = "hire";
    return continueHire(next);
  }

  if (next.topic === "hire" && (next.engagement !== "unknown" || next.product !== "unknown")) {
    return continueHire(next);
  }

  if (word(q, "hello", "hi", "hey", "yo") || has(q, "who are you", "what can you", "help")) {
    return {
      memory: next,
      reply: {
        text: introFor("dev"),
        actions: introActions("dev"),
      },
    };
  }

  if (next.topic === "hire") {
    return continueHire(next);
  }

  return {
    memory: next,
    reply: {
      text: "I want to get this right rather than guess. Are you hoping to hire Mark to build something, look at the projects, or just understand the stack? You can also tell me in your own words — I'll ask a follow-up.",
      actions: [
        replyChip("hire", "Hire Mark", "I want to hire Mark for a product build"),
        replyChip("look", "Just looking", "Show me the projects"),
        replyChip("stack", "The stack", "What stack do you ship?"),
        replyChip("talk", "Something else", "I'm not sure what I need"),
      ],
    },
  };
}
