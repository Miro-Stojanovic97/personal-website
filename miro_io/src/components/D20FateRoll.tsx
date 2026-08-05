"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

// The shape of a possible outcome after the die lands.
// `internal` tells us whether to render Next.js Link (internal route) or a normal anchor (mailto).
type FateResult = {
  label: string;
  flavor: string;
  href: string;
  internal?: boolean;
};

// Maps a d20 roll to a themed "fate" outcome.
// This keeps all roll thresholds in one place for easier balancing later.
function getFateResult(roll: number): FateResult {
  // 1-5: low roll, retreat.
  if (roll <= 5) {
    return {
      label: "Turn back to camp",
      flavor: "The fire crackles ominously. You retreat with your dignity intact.",
      href: "/",
      internal: true,
    };
  }

  // 6-10: uncertain, but still sends a message.
  if (roll <= 10) {
    return {
      label: "Hesitate, then send anyway",
      flavor: "You pace in a tiny circle, then commit and send the message.",
      href: "mailto:stojanovic.miro97@gmail.com?subject=Quick%20hello&body=Hey%20Miro%2C%20I%20was%20hesitant%20to%20reach%20out%2C%20but%20wanted%20to%20say%20hello.",
    };
  }

  // 11-15: solid middle-high result.
  if (roll <= 15) {
    return {
      label: "Speak softly into the flame",
      flavor: "Measured words ride the smoke and find their mark.",
      href: "mailto:stojanovic.miro97@gmail.com?subject=A%20careful%20inquiry",
    };
  }

  // 16-20: best result, bold action.
  return {
    label: "Throw a flare stick into the fire",
    flavor: "Critical confidence. Your signal burns bright across the night sky.",
    href: "mailto:stojanovic.miro97@gmail.com?subject=Greetings%20from%20a%20fellow%20adventurer",
  };
}

export default function D20FateRoll() {
  // `rolling` prevents double-click spam while animation is in progress.
  const [rolling, setRolling] = useState(false);
  // Current visible die value. `null` means no roll has happened yet.
  const [roll, setRoll] = useState<number | null>(null);

  // Derive the fate object only when `roll` changes.
  // `useMemo` avoids recomputing this object on unrelated re-renders.
  const fate = useMemo(() => {
    if (roll === null) return null;
    return getFateResult(roll);
  }, [roll]);

  // Handles one complete dice roll sequence:
  // 1) start animation
  // 2) rapidly update die face for suspense
  // 3) stop on final random value
  const onRoll = () => {
    // Ignore clicks while already rolling.
    if (rolling) return;
    setRolling(true);

    // Number of visual updates before we settle on a final value.
    let ticks = 0;

    // Update every 70ms to create a quick "spinning/randomizing" effect.
    const intervalId = window.setInterval(() => {
      // Intermediate values shown during animation.
      setRoll(Math.floor(Math.random() * 20) + 1);
      ticks += 1;

      // End the animation after enough ticks.
      if (ticks >= 14) {
        window.clearInterval(intervalId);
        // Final roll value that determines fate.
        const finalRoll = Math.floor(Math.random() * 20) + 1;
        setRoll(finalRoll);
        // Re-enable the button for another attempt.
        setRolling(false);
      }
    }, 70);
  };

  return (
    // Outer card container for the mini-game module.
    <div className="w-full border border-black/20">
      <h2 className="text-center text-base font-bold">Roll the D20 and see your Fate</h2>
      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={onRoll}
          // Disables repeated input while animation runs.
          disabled={rolling}
          aria-label="Roll a twenty-sided die"
          className="group"
        >
          <div
            // Uses clipPath to fake a d20 silhouette without external assets.
            // During roll we spin; otherwise we use a gentle hover scale.
            className={`relative flex h-45 w-45 items-center justify-center bg-purple-900/70 text-3xl font-extrabold text-black shadow-md transition-transform ${rolling ? "animate-[spin_700ms_linear_infinite]" : "group-hover:scale-105"}`}
            style={{ clipPath: "polygon(50% 0%, 82% 12%, 100% 38%, 93% 70%, 68% 92%, 32% 92%, 7% 70%, 0% 38%, 18% 12%)" }}
          >
            {/* Small centered polygon to suggest a single d20 face around the number. */}
            <span
              className="absolute h-[60px] w-[60px] bg-white/30"
              style={{ clipPath: "polygon(50% 12%, 10% 90%, 90% 90%)" }}
            />

            {/* Show 20 as a default face before first roll. */}
            <span className="relative z-10">{roll ?? 20}</span>
          </div>
        </button>
      </div>

      {/* Reserve space so layout does not jump when results appear. */}
      <div className="mt-4 min-h-20 text-center">
        {/* Render result text and action only after the first completed roll. */}
        {roll !== null && fate && (
          <>
            <p className="text-sm font-bold">Roll: {roll}</p>
            <p className="mt-1 text-xs">{fate.flavor}</p>
            <div className="mt-3">
              {/* Internal routes use Next Link; mail links use normal anchor. */}
              {fate.internal ? (
                <Link href={fate.href} className="inline-block rounded-md border border-black/30 bg-white/50 px-3 py-1.5 text-xs font-semibold hover:bg-white/70">
                  {fate.label}
                </Link>
              ) : (
                <a href={fate.href} className="inline-block rounded-md border border-black/30 bg-white/50 px-3 py-1.5 text-xs font-semibold hover:bg-white/70">
                  {fate.label}
                </a>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
