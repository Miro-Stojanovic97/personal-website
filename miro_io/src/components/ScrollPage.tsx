// import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Scroll_Page({ entityName, body }: { entityName: string, body: React.ReactNode }) {
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
        prefetch={true}
        aria-label="Return Home"
        >
        ^^^ Stop Investigating {entityName} ^^^
        </Link>

        <div className="absolute top-[12%] left-[10%] w-[80%] h-[80%] overflow-y-auto p-10" style={{ fontSize: 'clamp(0.1rem, 2vw, 0.9rem)' }}>
            { body }
      </div>
    </div>
    </div>
  );
}