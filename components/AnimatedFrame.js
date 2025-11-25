"use client";

import { motion } from "motion/react";

const palettes = {
  warm: {
    gradient: "from-sky-50 via-pink-50 to-amber-50",
    primary: "bg-rose-200/70",
    secondary: "bg-sky-200/60",
    tertiary: "bg-amber-200/40",
  },
  cool: {
    gradient: "from-indigo-50 via-slate-50 to-rose-50",
    primary: "bg-indigo-200/70",
    secondary: "bg-purple-200/60",
    tertiary: "bg-blue-200/40",
  },
};

const floatTransition = {
  duration: 16,
  repeat: Infinity,
  repeatType: "mirror",
  ease: "easeInOut",
};

const orbitTransition = {
  duration: 24,
  repeat: Infinity,
  ease: "linear",
};

export default function AnimatedFrame({
  children,
  outerClassName = "",
  contentClassName = "",
  accent = "warm",
}) {
  const palette = palettes[accent] ?? palettes.warm;

  return (
    <div className={`relative overflow-hidden min-h-screen ${outerClassName}`}>
      <div
        className={`absolute inset-0 bg-gradient-to-br ${palette.gradient}`}
        aria-hidden="true"
      />

      <motion.span
        aria-hidden="true"
        className={`absolute blur-3xl rounded-full w-72 h-72 -top-16 -right-10 pointer-events-none ${palette.primary}`}
        animate={{
          x: [0, 18, -12, 0],
          y: [0, -28, 10, 0],
          rotate: [0, 10, -6, 0],
        }}
        transition={floatTransition}
      />

      <motion.span
        aria-hidden="true"
        className={`absolute blur-3xl rounded-full w-64 h-64 -bottom-16 -left-10 pointer-events-none ${palette.secondary}`}
        animate={{
          x: [0, -20, 14, 0],
          y: [0, 18, -15, 0],
          rotate: [0, -12, 8, 0],
        }}
        transition={{ ...floatTransition, duration: 18 }}
      />

      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95, rotate: -2 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 0.95, bounce: 0.45 }}
        className={`relative z-10 w-full ${contentClassName}`}
      >
        {children}
      </motion.div>
    </div>
  );
}
