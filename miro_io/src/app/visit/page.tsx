// import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Visit() {
  return (
<div className="relative bg-[#FBDDB5] h-screen w-screen overflow-hidden">
      <div
        className="absolute top-1/2 left-1/2"
        style={{
          width: `min(100vw, 900px)`,
          height: '100vh',
          transform: "translate(-50%, -50%)",
        }}
      >

        <Image
          src="/scroll.png"
          alt="Hand-drawn home scene with clickable sections"
          fill
          priority
          className=""
        />

        <Link
        className="absolute top-[6%] right-[10%] p-1 bg-transparent rounded-lg text-black hover:bg-black/20 transition-colors"
        href="/"
        aria-label="Return Home"
        >
        ^^^ Stop Investigating Kayak ^^^
        </Link>

        <div className="absolute top-[12%] left-[10%] w-[80%] h-[80%] overflow-y-auto p-10">
          <h1>
            Enter the Kayak and adventure to other parts of the Internet Sea,
            like the Islands of LinkedIn and GitHub (by clicking on the icon below)
          </h1><br/>

            <div className="mx-auto flex w-full max-w-[520px] flex-wrap items-center justify-center gap-6">
              <Link
                href="https://www.linkedin.com/in/mirostojanovic/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open LinkedIn"
                className="flex aspect-square w-[min(230px,46vw)] items-center justify-center rounded-2xl border-2 border-black/70 bg-[#f7ead3] p-0 shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#fff7eb]"
              >
                <Image
                  src="/linkedin.png"
                  alt="LinkedIn icon"
                  width={200}
                  height={200}
                  className="h-full w-full object-contain"
                />
              </Link>
              <Link
                href="https://github.com/Miro-Stojanovic97"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open GitHub"
                className="flex aspect-square w-[min(230px,46vw)] items-center justify-center rounded-2xl border-2 border-black/70 bg-[#f7ead3] p-0 shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#fff7eb]"
              >
                <Image
                  src="/github.png"
                  alt="GitHub icon"
                  width={200}
                  height={200}
                  className="h-full w-full object-contain"
                />
              </Link>
            </div>


      </div>
    </div>
    </div>
  );
}