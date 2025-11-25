"use client";
import React, { useMemo, useState } from "react";
import copy from "copy-to-clipboard";
import { motion, AnimatePresence } from "motion/react";
import santa from "@/img/santa.svg";
import AnimatedFrame from "@/components/AnimatedFrame";

const santaFloatTransition = {
  duration: 10,
  repeat: Infinity,
  repeatType: "loop",
  ease: "easeInOut",
};

const encodePayload = (payload) => {
  try {
    if (typeof window !== "undefined" && window.btoa) {
      return window.btoa(encodeURIComponent(JSON.stringify(payload)));
    }

    return Buffer.from(JSON.stringify(payload), "utf-8").toString("base64");
  } catch {
    return "";
  }
};

const shuffle = (array) => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

export default function Form() {
  const totalSteps = 3;
  const [step, setStep] = useState(0);
  const [maxPrice, setMaxPrice] = useState("");
  const [rules, setRules] = useState("");
  const [participants, setParticipants] = useState([{ name: "" }]);
  const [assignments, setAssignments] = useState([]);
  const [copiedFor, setCopiedFor] = useState("");

  const addParticipant = () => {
    setParticipants((prev) => [...prev, { name: "" }]);
  };

  const updateParticipant = (index, value) => {
    setParticipants((prev) =>
      prev.map((participant, i) =>
        i === index ? { ...participant, name: value } : participant
      )
    );
  };

  const removeParticipant = (index) => {
    setParticipants((prev) => prev.filter((_, i) => i !== index));
  };

  const cleanParticipants = useMemo(
    () => participants.map((participant) => participant.name.trim()),
    [participants]
  );

  const canAdvance = maxPrice.trim().length > 0;
  const readyToDraw =
    cleanParticipants.every((name) => name.length > 0) &&
    cleanParticipants.length >= 2;

  const generateAssignments = () => {
    const givers = cleanParticipants;

    if (givers.length < 2) {
      return [];
    }

    let receivers = shuffle(givers);
    let attempts = 0;

    while (
      receivers.some((receiver, index) => receiver === givers[index]) &&
      attempts < 20
    ) {
      receivers = shuffle(givers);
      attempts += 1;
    }

    if (receivers.some((receiver, index) => receiver === givers[index])) {
      receivers = [...givers.slice(1), givers[0]];
    }

    return givers.map((giver, index) => {
      const receiver = receivers[index];
      const encoded = encodePayload({
        giver,
        receiver,
        rules,
        maxPrice,
      });

      return {
        giver,
        receiver,
        encoded,
      };
    });
  };

  const shareUrl = (encoded) =>
    `/?data=${encodeURIComponent(encoded)}`.replace(/\s/g, "%20");

  const handleCopy = (encoded, person) => {
    const base =
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost";
    const fullLink = `${base}${shareUrl(encoded)}`;
    copy(fullLink);
    setCopiedFor(person);
    setTimeout(() => setCopiedFor(""), 2000);
  };

  const calculateProgress = () => {
    if (step === 0) {
      return 0;
    }

    return Math.max(10, ((step - 1) / (totalSteps - 1)) * 100);
  };

  const progress = calculateProgress();

  const goToNext = () => {
    if (step === 1 && canAdvance) {
      setStep(2);
      return;
    }

    if (step === 2 && readyToDraw) {
      setAssignments(generateAssignments());
      setStep(3);
    }
  };

  const goToPrevious = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const resetFlow = () => {
    setStep(1);
    setAssignments([]);
    setCopiedFor("");
  };

  const primaryCta = (() => {
    if (step === 1) {
      return {
        label: "Next",
        onClick: goToNext,
        disabled: !canAdvance,
      };
    }

    if (step === 2) {
      return {
        label: "Draw Names",
        onClick: goToNext,
        disabled: !readyToDraw,
      };
    }

    if (step === 3) {
      return {
        label: "Start Over",
        onClick: resetFlow,
        disabled: false,
      };
    }

    return null;
  })();

  return (
    <AnimatedFrame
      accent="warm"
      outerClassName="font-sans p-5 flex justify-center items-start sm:items-center"
      contentClassName="flex justify-center"
    >
      <main className="max-w-2xl w-full space-y-6 relative pt-[180px]">
        <motion.img
          src={santa.src}
          alt="Secret Santa gift exchange organizer illustration"
          className="absolute top-0 right-0 z-0 h-[200px]"
          initial={{ rotate: -4, y: -12 }}
          animate={{
            rotate: [-2, 1, -2, 1, -2],
            y: [-12, 2, -8, 6, -12],
          }}
          transition={santaFloatTransition}
        />
        <motion.div
          layout
          transition={{ type: "tween", duration: 0.3 }}
          className="bg-white/90 backdrop-blur p-6 rounded-lg shadow relative z-10 space-y-6"
        >
          <header>
            <h1 className="font-bold text-center text-red-600 text-2xl">
              Secret Santa Gift Exchange Organizer
            </h1>

            {step === 0 && (
              <p className="text-sm text-center text-gray-600 mt-2">
                Create your gift exchange in three simple steps
              </p>
            )}
          </header>

          <section className="space-y-6">
            {step > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold uppercase tracking-[0.2em] text-red-500/80">
                  <span>Info</span>
                  <span>Assignments</span>
                </div>
                <div className="h-3 w-full rounded-full bg-red-100/60 overflow-hidden shadow-inner">
                  <motion.div
                    initial={false}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "spring", stiffness: 120, damping: 18 }}
                    className="h-full bg-gradient-to-r from-red-500 via-pink-400 to-amber-300"
                  />
                </div>
              </div>
            )}

            <AnimatePresence mode="wait">
              {step === 0 && (
                <button
                  type="button"
                  className="mt-2 px-[20px] mx-auto block rounded-2xl bg-red-500 text-white font-semibold py-3 shadow-lg shadow-red-500/30 transition hover:bg-red-600 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                  onClick={() => setStep(1)}
                >
                  Begin Setup
                </button>
              )}

              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <p className="text-sm text-gray-600">
                    Set your gift exchange boundaries before inviting the group.
                  </p>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-red-500/90">
                      Max Gift Price
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={maxPrice}
                      onChange={(event) => setMaxPrice(event.target.value)}
                      placeholder="E.g. $30 or 30€"
                      className="w-full rounded-lg border border-red-100 bg-white/80 px-3 py-2 text-sm font-medium text-gray-800 placeholder-gray-400 focus:border-red-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-200 transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-red-500/90">
                      House Rule
                    </label>
                    <textarea
                      maxLength={100}
                      value={rules}
                      onChange={(event) => setRules(event.target.value)}
                      placeholder="Share any fun twist or special instructions…"
                      className="w-full rounded-lg border border-red-100 bg-white/80 px-3 py-2 text-sm font-medium text-gray-800 placeholder-gray-400 focus:border-red-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-200 transition min-h-[96px]"
                    />
                    <p className="text-right text-xs text-gray-400">
                      {rules.length}/100
                    </p>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  <div className="rounded-lg border border-red-100 bg-gradient-to-r from-red-50/80 via-white to-red-50/60 px-4 py-3 text-sm text-gray-700 shadow-sm">
                    <p className="font-semibold text-red-500 mb-1">Details</p>
                    <p>
                      Max price:{" "}
                      <span className="font-semibold">{maxPrice || "0"}</span>
                    </p>

                    {rules && (
                      <p>
                        Rule:{" "}
                        <span className="font-medium text-gray-800">
                          {rules || "None yet"}
                        </span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-gray-600">
                      Add everyone joining the gift exchange below.
                    </p>
                    <button
                      type="button"
                      onClick={addParticipant}
                      className="inline-flex items-center gap-1 rounded-full bg-red-500/90 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 transition-all duration-200"
                    >
                      <span className="text-lg leading-none">+</span>
                      Add
                    </button>
                  </div>

                  <AnimatePresence initial={false}>
                    {participants.map((participant, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 12, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{
                          type: "spring",
                          stiffness: 240,
                          damping: 22,
                        }}
                        className="relative rounded-xl border border-red-100 bg-gradient-to-r from-red-50 via-white to-red-50/60 px-4 py-3 shadow-sm"
                      >
                        <label className="block text-xs font-semibold uppercase tracking-wide text-red-500/90">
                          Participant #{index + 1}
                        </label>
                        <div className="mt-1 flex items-center gap-3">
                          <input
                            type="text"
                            value={participant.name}
                            onChange={(event) =>
                              updateParticipant(index, event.target.value)
                            }
                            placeholder="Add a festive name…"
                            className="flex-1 rounded-lg border border-red-100 bg-white/80 px-3 py-2 text-sm font-medium text-gray-800 placeholder-gray-400 focus:border-red-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-200 transition"
                          />
                          {participants.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeParticipant(index)}
                              className="text-2xl font-semibold uppercase tracking-wide text-red-400 hover:text-red-600 transition"
                            >
                              &times;
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between pt-2">
              {step > 0 && (
                <button
                  type="button"
                  onClick={goToPrevious}
                  disabled={step === 1}
                  className="rounded-full border border-transparent bg-white/80 px-4 py-2 text-sm font-semibold text-red-500 shadow disabled:cursor-not-allowed disabled:opacity-0 hover:border-red-200 hover:text-red-600 transition"
                >
                  Back
                </button>
              )}
              {primaryCta && (
                <button
                  type="button"
                  onClick={primaryCta.onClick}
                  disabled={primaryCta.disabled}
                  className="rounded-full bg-red-500/90 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {primaryCta.label}
                </button>
              )}
            </div>

            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-4 border-t border-red-100 pt-6"
              >
                <div className="rounded-lg border border-red-100 bg-gradient-to-r from-amber-50/80 via-white to-red-50/60 px-4 py-3 text-sm text-gray-700 shadow-sm">
                  <p className="font-semibold text-red-500 mb-1">Share Links</p>
                  <p>
                    Send each participant their private link. Each link includes
                    encoded gift info, so only the recipient can view it on the
                    next page.
                  </p>
                </div>

                <div className="space-y-3">
                  {assignments.map(({ giver, receiver, encoded }, index) => (
                    <div
                      key={`${giver}-${receiver}-${index}`}
                      className="rounded-xl border border-red-100 bg-white/80 p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div>
                          <p className="text-sm text-gray-500">Send to</p>
                          <p className="text-lg font-semibold text-gray-800">
                            {giver}
                          </p>
                        </div>
                        <div className="flex flex-col">
                          <button
                            type="button"
                            onClick={() => handleCopy(encoded, giver)}
                            className="inline-flex items-center justify-center rounded-full bg-red-500/90 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-red-500 transition"
                          >
                            {copiedFor === giver ? "Copied!" : "Copy Link"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </section>
        </motion.div>
      </main>
    </AnimatedFrame>
  );
}
