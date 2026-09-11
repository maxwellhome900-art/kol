export const MARKO_OPEN_EVENT = "marko:open";

export function openMarkoAI() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(MARKO_OPEN_EVENT));
  const node = document.getElementById("marko-ai");
  node?.scrollIntoView({ block: "nearest" });
}
