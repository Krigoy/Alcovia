"use client";

import { useEffect, useState } from "react";

export type MotionPref = "reduce" | "no-preference";

export function useMotionPref(): MotionPref {
  const [pref, setPref] = useState<MotionPref>("no-preference");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      setPref(mq.matches ? "reduce" : "no-preference");
    };

    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return pref;
}


