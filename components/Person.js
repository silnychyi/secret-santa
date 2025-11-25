"use client";

import Link from "next/link";
import { useMemo, useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import AnimatedFrame from "@/components/AnimatedFrame";
import santa from "@/img/santa.svg";

const santaFloatTransition = {
  duration: 10,
  repeat: Infinity,
  repeatType: "loop",
  ease: "easeInOut",
};

const decodePayload = (encoded) => {
  if (!encoded) {
    return null;
  }

  try {
    if (typeof window !== "undefined" && window.atob) {
      const json = decodeURIComponent(window.atob(encoded));
      return JSON.parse(json);
    }

    const json = Buffer.from(encoded, "base64").toString("utf-8");
    return JSON.parse(json);
  } catch {
    return null;
  }
};

export default function Person({ encodedData }) {
  const payload = useMemo(() => decodePayload(encodedData), [encodedData]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiTimeoutRef = useRef(null);
  const confettiPieces = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, index) => {
        const hues = ["#f43f5e", "#f97316", "#facc15", "#34d399", "#818cf8"];

        return {
          id: index,
          left: `${Math.random() * 100}%`,
          delay: `${Math.random() * 0.35}s`,
          duration: `${1.8 + Math.random() * 0.8}s`,
          color: hues[index % hues.length],
          size: `${6 + Math.random() * 8}px`,
          xOffset: `${Math.random() * 100 - 50}px`,
        };
      }),
    []
  );

  const handleReveal = () => {
    if (isRevealed) {
      return;
    }

    setIsRevealed(true);
    setShowConfetti(true);

    confettiTimeoutRef.current = setTimeout(() => {
      setShowConfetti(false);
    }, 2600);
  };

  useEffect(() => {
    return () => {
      if (confettiTimeoutRef.current) {
        clearTimeout(confettiTimeoutRef.current);
      }
    };
  }, []);

  if (!payload) {
    return (
      <AnimatedFrame
        accent="emerald"
        outerClassName="font-sans p-5 flex justify-center items-center"
        contentClassName="flex justify-center"
      >
        <main className="max-w-md w-full space-y-6 text-center">
          <div className="rounded-lg border border-red-100 bg-white/90 p-6 shadow">
            <p className="text-lg font-semibold text-red-500">
              Link is missing or invalid
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Double-check that you copied the full link from the organizer and
              try again.
            </p>
          </div>
        </main>
      </AnimatedFrame>
    );
  }

  const { giver, receiver, rules, maxPrice } = payload;
  const hiddenReceiver = isRevealed ? receiver : "???";
  const hiddenBudget = isRevealed ? maxPrice || "N/A" : "???";
  const revealHint = isRevealed
    ? "Keep this link safe—only you should know who you're buying for!"
    : "Tap reveal when you're ready—no peeking!";

  return (
    <AnimatedFrame
      accent="cool"
      outerClassName="font-sans p-5 flex justify-center items-start sm:items-center"
      contentClassName="flex justify-center"
    >
      <main className="max-w-md w-full space-y-6 relative pt-[120px]">
        <motion.img
          src={santa.src}
          alt="Secret Santa gift assignment illustration"
          className="absolute top-[10px] right-4 z-0 h-[120px]"
          initial={{ rotate: -4, y: -12 }}
          animate={{ rotate: [-2, 1, -2, 1, -2], y: [-6, 2, -4, 6, -6] }}
          transition={santaFloatTransition}
        />
        <div className="relative z-10">
          <div
            className={`rounded-3xl bg-white/95 p-6 shadow space-y-4 ${
              isRevealed ? "" : "animate-reveal-pulse"
            }`}
          >
            <header>
              <p className="uppercase text-xs font-bold tracking-[0.2em] text-red-500/80 text-center">
                Secret Assignment
              </p>
              <h1 className="text-2xl sm:text-3xl font-semibold text-center text-gray-900">
                {giver}, you&apos;re gifting
              </h1>
            </header>
            <p className="text-center text-4xl font-black text-red-500">
              {hiddenReceiver}
            </p>

            {rules && (
              <div className="rounded-2xl bg-gradient-to-r from-red-50 via-white to-amber-50/80 px-4 py-3 text-sm text-gray-700">
                <p className="font-semibold text-gray-900">House Rule</p>
                <p>{rules}</p>
              </div>
            )}
            <div className="flex items-center justify-between rounded-2xl bg-red-500/10 px-4 py-3">
              <span className="text-sm text-gray-600">Maximum budget</span>
              <span className="text-xl font-bold text-red-600">
                {hiddenBudget}
              </span>
            </div>
            <p className="text-xs text-gray-400 text-center">{revealHint}</p>
            {!isRevealed && (
              <button
                type="button"
                className="reveal-button mt-2 w-full rounded-2xl bg-red-500 text-white font-semibold py-3 shadow-lg shadow-red-500/30 transition hover:bg-red-600 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                onClick={handleReveal}
              >
                Reveal my person
              </button>
            )}
          </div>
          {showConfetti && (
            <div className="confetti-container pointer-events-none">
              {confettiPieces.map((piece) => (
                <span
                  key={piece.id}
                  className="confetti-piece"
                  style={{
                    left: piece.left,
                    animationDelay: piece.delay,
                    animationDuration: piece.duration,
                    backgroundColor: piece.color,
                    width: piece.size,
                    height: `calc(${piece.size} * 2)`,
                    "--confetti-x": piece.xOffset,
                  }}
                />
              ))}
            </div>
          )}
        </div>
        <p className="text-center text-xs text-gray-500 relative z-10">
          <Link
            href="/"
            className="underline-offset-2 text-gray-400 hover:text-gray-600 hover:underline"
          >
            Create a new assignment
          </Link>
        </p>
      </main>
    </AnimatedFrame>
  );
}
