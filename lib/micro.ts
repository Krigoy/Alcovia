export const EASING = {
  soft: [0.16, 1, 0.3, 1] as [number, number, number, number],
  brisk: [0.19, 1, 0.22, 1] as [number, number, number, number]
};

export const isTouchDevice = () => {
  if (typeof window === "undefined") return false;
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
};

export const isLowMotionEnv = () => {
  if (typeof window === "undefined") return false;
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  return mq.matches;
};


