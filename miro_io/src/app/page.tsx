"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Wave from 'react-wavify';

let exploredThingsCountState = 0;

export default function Home() {
  const [exploredThingsCount, setExploredThingsCount] = useState(exploredThingsCountState);
  const imageAspect = 1954.58 / 1037.96;

  const incrementExploredThingsCount = () => {
    setExploredThingsCount((previousCount) => {
      const nextCount = previousCount + 1;
      exploredThingsCountState = nextCount;
      return nextCount;
    });
  };

  return (
    <main className="relative h-dvh w-screen overflow-hidden bg-[#facc9e] [--art-inset-x:0.85%] [--art-inset-y:1.3%] [--art-scale:1.09] sm:[--art-inset-y:2.15%] sm:[--art-scale:1.04]">
      <h1 className="absolute left-4 top-4 z-20 rounded bg-white/70 px-3 py-1 text-sm font-semibold text-black backdrop-blur-sm sm:text-base">
        Things to Explore: {exploredThingsCount} / 8
      </h1>
      <div
        className="absolute left-1/2 top-1/2 h-full w-full"
        style={{
          width: `max(100vw, calc(100vh * ${imageAspect}))`,
          height: `max(100vh, calc(100vw / ${imageAspect}))`,
          transform: "translate(-50%, -50%) translate(calc(-1 * var(--art-inset-x)), calc(-1 * var(--art-inset-y))) scale(var(--art-scale))",
          transformOrigin: "center"
        }}
      >
        <Image
          src="/home.svg"
          alt="Hand-drawn home scene with clickable sections"
          fill
          priority
          className="object-fill"
        />

        <Link
          className="absolute left-[41%] top-[6%] w-[6%] aspect-square rounded-full bg-transparent transition-colors hover:bg-black/10"
          href="/basketball"
          prefetch={true}
          aria-label="Open Basketball page-Basketball"
          onClick={incrementExploredThingsCount}
        />

        <Link
          className="absolute left-[44.2%] top-[29.5%] w-[3%] aspect-square rounded-full bg-transparent transition-colors hover:bg-black/10"
          href="/throws"
          prefetch={true}
          aria-label="Open Throws page-Throws"
          onClick={incrementExploredThingsCount}
        />

        <Link
          className="absolute left-[48.2%] top-[23%] w-[3%] aspect-square rounded-full bg-transparent transition-colors hover:bg-black/10"
          href="/chess"
          prefetch={true}
          aria-label="Open Chess page-Chess"
          onClick={incrementExploredThingsCount}
        />

        <Link
          className="absolute left-[54.2%] top-[22.5%] w-[3%] aspect-square rounded-full bg-transparent transition-colors hover:bg-black/10"
          href="/job-experience"
          prefetch={true}
          aria-label="Open Job Experience page-Job Experience"
          onClick={incrementExploredThingsCount}
        />

        <Link
          className="absolute left-[58.9%] top-[25%] w-[2.5%] aspect-square rounded-full bg-transparent transition-colors hover:bg-black/20"
          href="/work-ethic"
          prefetch={true}
          aria-label="Open Work Ethic page-Work Ethic"
          onClick={incrementExploredThingsCount}
        />

        <Link
          className="absolute left-[49.3%] top-[59%] w-[3%] aspect-square rounded-full bg-transparent transition-colors hover:bg-black/20"
          href="/welcome"
          prefetch={true}
          aria-label="Open Welcome page"
          onClick={incrementExploredThingsCount}
        />
        <Link
          className="absolute left-[45.5%] top-[63%] w-[3.5%] aspect-square rounded-full bg-transparent transition-colors hover:bg-black/10"
          href="/visit"
          prefetch={true}
          aria-label="Open Contact page"
          onClick={incrementExploredThingsCount}
        />
        <Link
          className="absolute left-[53.3%] top-[64%] w-[2.5%] aspect-square rounded-full bg-transparent transition-colors hover:bg-black/10"
          href="/email"
          prefetch={true}
          aria-label="Open Contact page"
          onClick={incrementExploredThingsCount}
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-[14%]">
          <Wave
            fill="url(#gradient)"
            paused={false}
            style={{ display: '', width: '100%', padding: '0', margin: '0' }}
            options={{
              height: 30,
              amplitude: 70,
              speed: 0.06,
              points: 1
            }}
          >
            <defs>
              <linearGradient id="gradient" gradientTransform="rotate(90)">
                <stop offset="10%" stopColor="#c5e5ff" />
                <stop offset="90%" stopColor="#4dabf7" />
              </linearGradient>
            </defs>
          </Wave>
        </div>
      </div>
    </main>
  );
}
