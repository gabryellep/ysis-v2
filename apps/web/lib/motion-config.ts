export const ysisMotion = {
  ease: [0.2, 0.8, 0.2, 1] as const,
  duration: {
    fast: 0.18,
    base: 0.36,
    slow: 0.72
  },
  float: {
    y: [-8, 8, -8],
    rotate: [-1.5, 1.5, -1.5]
  },
  floatTransition: {
    duration: 7,
    repeat: Infinity,
    ease: "easeInOut" as const
  }
};
