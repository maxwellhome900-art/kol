"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

/** Soft dual-tone glow following the pointer — desktop only via CSS media. */
export function CursorGlow() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 280, damping: 28, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 280, damping: 28, mass: 0.6 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);

  return (
    <motion.div
      className="cursor-glow pointer-events-none fixed left-0 top-0 z-[5] hidden h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 mix-blend-screen md:block"
      style={{ x: sx, y: sy }}
      aria-hidden
    >
      <div
        className="h-full w-full rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, var(--glow-code), transparent 55%), radial-gradient(circle at 70% 60%, var(--glow-photo), transparent 50%)",
        }}
      />
    </motion.div>
  );
}
